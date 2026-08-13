-- PoliStep専用 データベース構築SQL
-- このSQLをSupabaseダッシュボードの「SQL Editor」で実行してください。

-- 1. users テーブル
-- ユーザー（候補者）の権限や情報を管理するテーブル
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('admin')),
  display_name TEXT,
  team_id UUID, -- 管理者(admin)のidと同じUUIDを入れてチームを識別する
  election_date DATE,
  target_actions INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. pins テーブル
-- 地図上に打たれたピンの情報を管理するテーブル
CREATE TABLE IF NOT EXISTS public.pins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL, -- どの候補者の地図のピンか
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  type TEXT NOT NULL, -- 例: 'visited', 'absent', 'support'
  memo TEXT,
  created_by UUID REFERENCES public.users(id), -- NULLの場合は匿名スタッフ
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. RLS (Row Level Security) の設定
-- セキュリティのため、各テーブルのアクセス権限を設定します。

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pins ENABLE ROW LEVEL SECURITY;

-- usersテーブルの無限ループを防ぐための関数
CREATE OR REPLACE FUNCTION get_auth_user_team_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT team_id FROM users WHERE id = auth.uid();
$$;

-- usersテーブルのアクセス権限
CREATE POLICY "Users can read own team users" ON public.users
  FOR SELECT USING (auth.uid() = id OR team_id = get_auth_user_team_id());

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- pinsテーブルのアクセス権限（匿名アクセスを許可）
-- team_idを知っていれば誰でもピンを読み取れる（公開マップ）
CREATE POLICY "Anyone can read pins by team_id" ON public.pins
  FOR SELECT USING (true);

-- team_idを知っていれば誰でもピンを追加できる（スタッフ登録不要）
CREATE POLICY "Anyone can insert pins" ON public.pins
  FOR INSERT WITH CHECK (true);

-- ピンの削除は認証ユーザー（管理者）のみ、または直近の取り消し操作用
CREATE POLICY "Anyone can delete pins" ON public.pins
  FOR DELETE USING (true);

-- ピンの更新は認証ユーザーのみ
CREATE POLICY "Authenticated users can update pins" ON public.pins
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Realtimeの有効化 (地図での即時反映のため)
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pins;
