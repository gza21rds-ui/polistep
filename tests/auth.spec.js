import { test, expect } from '@playwright/test';

test.describe('Auth Flow (Mocked Supabase)', () => {
  test('Successful admin registration bypassing email rate limit', async ({ page }) => {
    // 1. 新規登録(SignUp)のモック
    // Supabaseの /auth/v1/signup へのリクエストを横取りし、成功したことにして偽のセッションを返す
    await page.route('**/auth/v1/signup?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'mock-user-1234',
            email: 'test@example.com',
            role: 'authenticated',
            aud: 'authenticated',
            app_metadata: { provider: 'email' },
            user_metadata: {},
            created_at: new Date().toISOString(),
          },
          session: {
            access_token: 'mock-jwt-token',
            token_type: 'bearer',
            expires_in: 3600,
            refresh_token: 'mock-refresh-token',
            user: { id: 'mock-user-1234' }
          }
        })
      });
    });

    // 2. データベース操作のモック
    // usersテーブルへの登録(POST)や取得(GET)をモック化
    await page.route('**/rest/v1/users?*', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([{}])
        });
      } else if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ role: 'admin', display_name: 'テスト太郎', team_id: 'mock-user-1234' }])
        });
      } else {
        await route.continue();
      }
    });
    
    // Slack通知APIのモック（テスト中に実際に通知が飛ばないようにする）
    await page.route('**/api/notify-slack', async (route) => {
       await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    });

    // アプリの認証画面へアクセス
    await page.goto('/auth');
    await page.getByRole('button', { name: '新規登録' }).click();
    await page.getByRole('button', { name: '管理者として登録' }).click();
    
    // フォームへの入力
    await page.getByPlaceholder('メールアドレス').fill('test@example.com');
    await page.getByPlaceholder('パスワード (6文字以上)').fill('password123');
    await page.getByPlaceholder('表示名（例: 田中）').fill('テスト太郎');
    
    // 送信
    await page.getByRole('button', { name: '登録して始める' }).click();
    
    // 成功してダッシュボードにリダイレクトされることを確認（これが通ればモック成功）
    await expect(page).toHaveURL(/\/admin/);
    
    // ダッシュボードで名前が取得できているか簡単なチェック
    await expect(page.locator('body')).toContainText('テスト太郎');
  });
});
