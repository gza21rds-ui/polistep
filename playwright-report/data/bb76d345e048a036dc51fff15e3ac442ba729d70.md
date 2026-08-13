# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Auth Flow (Mocked Supabase) >> Successful admin registration bypassing email rate limit
- Location: tests/auth.spec.js:4:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/admin/
Received string:  "http://localhost:5173/auth"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × locator resolved to <html lang="en">…</html>
       - unexpected value "http://localhost:5173/auth"

```

```yaml
- img "PoliStep ボランティア"
- img "Logo"
- text: PoliStep チームの力が、 地域を変える。 ドブ板選挙の完全可視化ツール
- link "ホームへ戻る":
  - /url: /
- heading "Create Account" [level=2]
- paragraph: アカウントを作成してチームに参加しましょう。
- button "ログイン"
- button "新規登録"
- button "管理者として登録"
- button "スタッフとして登録"
- text: email rate limit exceeded
- textbox "メールアドレス": test@example.com
- textbox "パスワード (6文字以上)": password123
- 'textbox "表示名（例: 田中）"': テスト太郎
- button "登録して始める"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Auth Flow (Mocked Supabase)', () => {
  4  |   test('Successful admin registration bypassing email rate limit', async ({ page }) => {
  5  |     // 1. 新規登録(SignUp)のモック
  6  |     // Supabaseの /auth/v1/signup へのリクエストを横取りし、成功したことにして偽のセッションを返す
  7  |     await page.route('**/auth/v1/signup?*', async (route) => {
  8  |       await route.fulfill({
  9  |         status: 200,
  10 |         contentType: 'application/json',
  11 |         body: JSON.stringify({
  12 |           user: {
  13 |             id: 'mock-user-1234',
  14 |             email: 'test@example.com',
  15 |             role: 'authenticated',
  16 |             aud: 'authenticated',
  17 |             app_metadata: { provider: 'email' },
  18 |             user_metadata: {},
  19 |             created_at: new Date().toISOString(),
  20 |           },
  21 |           session: {
  22 |             access_token: 'mock-jwt-token',
  23 |             token_type: 'bearer',
  24 |             expires_in: 3600,
  25 |             refresh_token: 'mock-refresh-token',
  26 |             user: { id: 'mock-user-1234' }
  27 |           }
  28 |         })
  29 |       });
  30 |     });
  31 | 
  32 |     // 2. データベース操作のモック
  33 |     // usersテーブルへの登録(POST)や取得(GET)をモック化
  34 |     await page.route('**/rest/v1/users?*', async (route) => {
  35 |       if (route.request().method() === 'POST') {
  36 |         await route.fulfill({
  37 |           status: 201,
  38 |           contentType: 'application/json',
  39 |           body: JSON.stringify([{}])
  40 |         });
  41 |       } else if (route.request().method() === 'GET') {
  42 |         await route.fulfill({
  43 |           status: 200,
  44 |           contentType: 'application/json',
  45 |           body: JSON.stringify([{ role: 'admin', display_name: 'テスト太郎', team_id: 'mock-user-1234' }])
  46 |         });
  47 |       } else {
  48 |         await route.continue();
  49 |       }
  50 |     });
  51 |     
  52 |     // Slack通知APIのモック（テスト中に実際に通知が飛ばないようにする）
  53 |     await page.route('**/api/notify-slack', async (route) => {
  54 |        await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
  55 |     });
  56 | 
  57 |     // アプリの認証画面へアクセス
  58 |     await page.goto('/auth');
  59 |     await page.getByRole('button', { name: '新規登録' }).click();
  60 |     await page.getByRole('button', { name: '管理者として登録' }).click();
  61 |     
  62 |     // フォームへの入力
  63 |     await page.getByPlaceholder('メールアドレス').fill('test@example.com');
  64 |     await page.getByPlaceholder('パスワード (6文字以上)').fill('password123');
  65 |     await page.getByPlaceholder('表示名（例: 田中）').fill('テスト太郎');
  66 |     
  67 |     // 送信
  68 |     await page.getByRole('button', { name: '登録して始める' }).click();
  69 |     
  70 |     // 成功してダッシュボードにリダイレクトされることを確認（これが通ればモック成功）
> 71 |     await expect(page).toHaveURL(/\/admin/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  72 |     
  73 |     // ダッシュボードで名前が取得できているか簡単なチェック
  74 |     await expect(page.locator('body')).toContainText('テスト太郎');
  75 |   });
  76 | });
  77 | 
```