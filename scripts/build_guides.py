#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PoliStep Static Pre-rendered SEO/AEO Guide Generator
Generates crawlable static HTML pages under public/guides/ (copied verbatim by Vite into dist/guides/),
exports src/data/polistepGuides.json for the React LP showcase,
and syncs public/sitemap.xml & public/llms.txt.
"""

import html as html_lib
import json
import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GUIDES_DIR = os.path.join(BASE_DIR, "public", "guides")
GUIDES_JSON_PATH = os.path.join(BASE_DIR, "src", "data", "polistepGuides.json")
SITEMAP_PATH = os.path.join(BASE_DIR, "public", "sitemap.xml")
LLMS_PATH = os.path.join(BASE_DIR, "public", "llms.txt")
GA_ID = "G-6WMVBF786R"

GUIDES = [
    {
        "slug": "door-to-door-activity-map-dx",
        "category": "地域活動マッピング",
        "title": "紙の住宅地図は卒業！スマホ地図で重複訪問ゼロを実現する地域活動マッピング実践ガイド",
        "description": "政治活動の地域回り・ポスティング・2連ポスター交渉で紙の住宅地図を使う非効率を解消。スマホ地図アプリ「PoliStep」で留守・対話・ポスター許可をリアルタイム管理する実践手順を解説します。",
        "tldr": "紙の住宅地図と蛍光ペンでの記録は「スタッフ間の重複訪問」「対話メモの紛失」「雨天・夜間の記入ストレス」の原因になります。スマホ地図上で現在地からワンタップ記録できるPoliStepへ切り替えることで、誰がどこを回ったかがチーム全員に即時同期され、同じ労力で活動密度を1.5〜2倍へ高められます。",
        "published_at": "2026-11-28",
        "read_minutes": 5,
        "keywords": ["政治活動 地図 アプリ", "地域回り 記録 DX", "住宅地図 代替 アプリ", "重複訪問 防止", "PoliStep"],
        "sections": [
            {
                "heading": "1. 紙の住宅地図・Googleマイマップ運用が限界を迎える3つの瞬間",
                "paragraphs": [
                    "新人候補者や地方議員が日々の政治活動（地域でのご挨拶回り・討議資料のポスティング・2連ポスター掲示のお願い等）を始めると、多くの方が最初は紙の住宅地図やGoogleマイマップで記録をつけようとします。",
                    "しかし活動開始から2〜3週間で、必ず次の3つの壁にぶつかります。"
                ],
                "bullets": [
                    "複数人で動くと「昨日別のスタッフが回った家」へ重複訪問してしまう",
                    "「不在だった家」と「対話して地域課題を聴いた家」の区別が紙面でぐちゃぐちゃになる",
                    "帰ってからエクセルやノートに転記する作業が負担になり、記録自体が3日で止まる"
                ]
            },
            {
                "heading": "2. スマホ地図ワンタップ記録の標準運用ルール",
                "paragraphs": [
                    "継続の秘訣は「現場で3秒以内に記録が終わること」です。PoliStepでは歩きながら片手で操作できるよう、現在地GPSに連動して活動種別（対話・留守・ポスター・街頭・ビラ配り等）をワンタップでピン留めできます。"
                ],
                "table": {
                    "headers": ["記録ステータス", "現場での入力タイミング", "次のアクションへの活かし方"],
                    "rows": [
                        ["対話（メモ・写真）", "住民の方と会話した直後にキーワードを1行入力", "市民相談のフォローや議会質問・政策の一次情報に活用"],
                        ["留守（不在）", "応答がなかった瞬間にワンタップ", "曜日や時間帯（平日夜・土日昼）を変えて再訪エリアを可視化"],
                        ["ポスター許可・貼付", "2連ポスター等の掲示許可をもらったその場で記録", "劣化・剥がれチェックや任期後の撤去漏れを完全防止"]
                    ]
                }
            },
            {
                "heading": "3. マンション・集合住宅や雨天時の記録テクニック",
                "paragraphs": [
                    "都市部の地方選挙では、一軒家だけでなくマンション・アパート単位での記録管理が欠かせません。PoliStepの集合住宅メモ機能を使えば、建物ごとに「対話数・留守数・部屋別の対話メモ」を1ピンに集約でき、地図がピンだらけで見にくくなる問題も防げます。"
                ]
            }
        ],
        "faqs": [
            {
                "q": "政治活動での地域訪問と、公職選挙法で禁止される「戸別訪問」の違いは何ですか？",
                "a": "公職選挙法で禁止されているのは選挙運動期間中および告示前の「投票依頼を目的とした戸別訪問」です。平時の政治活動として地域課題のヒアリングや後援会活動・討議資料配布等を行う際も、事前運動とみなされないよう言動や配布物のルールを必ず事前に管轄の選挙管理委員会へご確認ください。"
            },
            {
                "q": "高齢のボランティアスタッフでもスマホで記録できますか？",
                "a": "はい。アプリインストールや会員登録は不要で、LINEで届いたURLを開くだけで大きなボタンからワンタップ記録できます。"
            }
        ]
    },
    {
        "slug": "daily-activity-goal-reverse-calculation",
        "category": "目標逆算・モチベーション管理",
        "title": "選挙日から逆算する1日の訪問・駅頭ノルマ設計法｜モチベーションが続く数値可視化のコツ",
        "description": "「今のペースで本当に間に合うのか？」という政治活動特有の不安を解消。目標日から1日あたりの必要活動件数を自動逆算し、進捗グラフで継続力を高める実践メソッドを解説します。",
        "tldr": "無所属新人が政治活動で心が折れる最大の原因は「あとどれだけやればいいか見えないこと」です。目標日と目標活動総数（例：挨拶・配布・駅頭回数）を先に決め、残日数から「今日のノルマ」へ自動分解することで、毎日の達成感が積み上がり、迷わず行動量を維持できます。",
        "published_at": "2026-11-28",
        "read_minutes": 5,
        "keywords": ["地方選挙 目標 逆算", "政治活動 ノルマ 計算", "選挙 活動量 可視化", "モチベーション 維持 選挙", "PoliStep"],
        "sections": [
            {
                "heading": "1. 「頑張っているつもり」が当落ラインに届かない理由",
                "paragraphs": [
                    "会社員や子育てと両立しながら選挙準備を進める若手候補者にとって、時間は最大の制約条件です。「できるときに駅に立つ」「週末に気分でチラシを配る」という感覚頼みの活動では、告示直前になって初めて圧倒的な行動量不足に気づくケースが後を絶ちません。",
                    "最初にやるべきは、感情ではなく数字で「残り何日で、あと何件動けばよいか」を可視化することです。"
                ],
                "table": {
                    "headers": ["準備期間", "目標アクション例（対話・配布・駅頭等）", "1日あたりの換算目安", "PoliStepでの管理ポイント"],
                    "rows": [
                        ["6ヶ月前（180日）", "地域対話・配布ポイント 3,600件", "1日 20件（週末集中なら平日10・土日45）", "達成率バーで週単位の遅れを即検知"],
                        ["3ヶ月前（90日）", "地域対話・配布ポイント 2,700件", "1日 30件＋駅頭週4回", "未到達エリアをマップ上で色分け確認"],
                        ["1ヶ月前（30日）", "重点エリア再訪・最終確認 1,200件", "1日 40件＋スタッフ同時稼働", "チーム合算の達成スピードを毎日共有"]
                    ]
                }
            },
            {
                "heading": "2. 孤独なドブ板を「ゲーム化」する3つの設計ルール",
                "paragraphs": [
                    "行動科学の観点でも、大きなゴールより「今日クリアできる小さな数字」が見える方が継続率は劇的に高まります。"
                ],
                "bullets": [
                    "「当選する」ではなく「今日あと15ピン打つ」に目標を分解する",
                    "地図が自分の活動ピンで埋まっていく「陣取り感」を毎日見返す",
                    "活動できなかった日があっても翌日の必要件数を自動再計算させ、罪悪感を引きずらない"
                ]
            },
            {
                "heading": "3. 数値が溜まったら「戦略の壁打ち」へつなげる",
                "paragraphs": [
                    "PoliStepで活動実績とエリア別の反応が蓄積されてくると、「どの地域で子育て政策の反応が良いか」「どの時間帯が対話率が高いか」が見えてきます。数字をもとに広報戦略や公式HP（PoliSide）の打ち出しを微調整することで、1時間あたりの成果がさらに伸びていきます。"
                ]
            }
        ],
        "faqs": [
            {
                "q": "途中で目標件数や目標日を変更しても大丈夫ですか？",
                "a": "はい。PoliStepの管理画面からいつでも目標日・目標件数を変更でき、残日数に応じた1日あたりの推奨ノルマが即座に再計算されます。"
            },
            {
                "q": "スタッフと合算した目標進捗も見られますか？",
                "a": "はい。候補者本人とボランティアスタッフ全員の活動ピンが1つのダッシュボードにリアルタイム集計されるため、チーム全体の達成率を一目で把握できます。"
            }
        ]
    },
    {
        "slug": "sns-daily-report-activity-workflow",
        "category": "SNS発信・日報自動化",
        "title": "毎日の駅頭・地域回りを30秒でSNS日報画像にする発信ルーティン｜発信ネタ切れをゼロにする仕組み",
        "description": "「政治活動は毎日しているのにSNS更新が続かない」悩みを解決。PoliStepの活動ログからワンタップで縦型日報画像を生成し、X・Instagram・公式LINEへ即発信する時短ルーティンを紹介します。",
        "tldr": "SNS発信が続かない最大の原因は「活動後にゼロから文章と画像を作る負担」です。日々の駅頭・地域回りをPoliStepに記録しておけば、活動終了時にワンタップで実績サマリー付きの日報画像が完成します。あとは現場で聞いた住民の声を3行添えるだけで、毎日30秒で信頼感のある発信が継続できます。",
        "published_at": "2026-11-28",
        "read_minutes": 4,
        "keywords": ["政治家 SNS 日報", "選挙 活動報告 画像 作成", "駅頭 SNS 投稿 ネタ", "地方議員 インスタ 継続", "PoliStep"],
        "sections": [
            {
                "heading": "1. 「自撮り＋おはようございます」だけの投稿から脱却する",
                "paragraphs": [
                    "SNSで多くの候補者が陥るのが、毎回同じ駅前の自撮り写真に「今朝も〇〇駅で挨拶しました！」と書くだけの単調な投稿です。有権者や支援者が本当に知りたいのは「どれだけ地道に動き、地域でどんな声を聞いたか」という具体性です。",
                    "活動の件数・累計グラフ・エリアの積み上げを視覚化した日報画像を添えるだけで、「この人は本当に毎日地域を歩いている」という圧倒的な信頼感が生まれます。"
                ]
            },
            {
                "heading": "2. 活動終了から30秒で完結するSNS日報ルーティン",
                "paragraphs": [
                    "帰宅後や寝る前にSNSを書こうとすると100%後回しになります。駅頭や地域回りが終わった直後の30秒で以下を回すのが鉄則です。"
                ],
                "bullets": [
                    "Step 1：PoliStepで「SNSシェア画像生成」を開き、本日の活動実績入りレポート画像を保存",
                    "Step 2：現場で記録した対話メモから「今日印象に残った地域の声」を1つピックアップ",
                    "Step 3：X・Instagramストーリーズ・ボランティアLINEグループへ同時投稿（所要時間30秒）"
                ]
            },
            {
                "heading": "3. ボランティアLINEグループへの共有が「次の応援」を生む",
                "paragraphs": [
                    "日報画像は有権者向けのSNSだけでなく、支援者・ボランティアのLINEグループへ共有することで絶大な効果を発揮します。「今日チームで合計42件回れました！」と可視化された成果が届くことで、参加できなかったメンバーの士気も高まり、週末の参加率が上がります。"
                ]
            }
        ],
        "faqs": [
            {
                "q": "日報画像に個人宅の正確な住所や個人情報が出たりしませんか？",
                "a": "いいえ。SNS日報画像には活動件数や種別サマリー等の統計情報のみが出力され、個別の対話メモや詳細な位置情報が公開されることはありません。"
            },
            {
                "q": "背景写真を自分の駅頭写真などに変えることはできますか？",
                "a": "はい。PoliStepのSNSシェア画像生成機能では、撮影した現場写真を背景にアップロードして実績オーバーレイを重ねることができます。"
            }
        ]
    },
    {
        "slug": "volunteer-team-activity-log-sharing",
        "category": "チーム共有・対話ログ管理",
        "title": "アプリ登録不要でボランティアと活動マップをリアルタイム共有する方法｜少人数陣営の対話ログ管理",
        "description": "3〜5人の少人数陣営やスポット参加のボランティアと、会員登録・アプリインストール不要で活動マップと対話ログを安全に共有する運用手順を解説します。",
        "tldr": "ボランティアに「アプリを入れてアカウントを作って」と頼むと半数が離脱します。PoliStepなら管理者が発行する専用URLをLINEで送るだけで、スタッフはスマホブラウザから即座にマップ参加可能。活動種別ごとの進捗も検索可能な対話ログも一元管理できます。",
        "published_at": "2026-11-28",
        "read_minutes": 5,
        "keywords": ["選挙 ボランティア 地図 共有", "少人数 陣営 ツール", "政治活動 対話ログ 管理", "アプリ不要 共有マップ", "PoliStep"],
        "sections": [
            {
                "heading": "1. ボランティア導入で絶対にやってはいけないNG行動",
                "paragraphs": [
                    "せっかく手伝ってくれる友人・知人ボランティアに対して、初回から「専用アプリをダウンロードして、メールアドレスで登録して、マニュアルを読んで」とハードルを上げると、現場での入力は絶対に定着しません。",
                    "必要なのは「LINEのリンクをタップしたら3秒で地図が開き、押すボタンが直感的に分かる」設計です。"
                ]
            },
            {
                "heading": "2. 管理者とスタッフの役割分担テンプレート",
                "paragraphs": [
                    "少人数陣営で最も効率よく回るPoliStepの役割分担は以下の通りです。"
                ],
                "table": {
                    "headers": ["役割", "使う画面", "主な担当タスク"],
                    "rows": [
                        ["候補者・陣営責任者", "管理者ダッシュボード (/admin)", "目標日・目標件数の設定、専用共有URLの発行、対話ログ検索とフォロー対応"],
                        ["ボランティアスタッフ", "専用共有マップ (/m/チームID)", "ログイン不要で現在地ピン留め（留守・対話・配布・ポスター）、簡易メモ記録"],
                        ["告示日ポスター貼付担当", "姉妹アプリ PoliDash", "公営ポスター掲示板の住所一括登録・AIルート最適化・当日の貼付完了同期"]
                    ]
                }
            },
            {
                "heading": "3. 対話ログを「政策・議会質問」と「選挙後の信頼」へ変える",
                "paragraphs": [
                    "現場で入力された「通学路のカーブミラーが壊れている」「保育園の延長保育が足りない」といった対話ログは、管理者画面からキーワード検索でいつでも振り返れます。日々の活動記録がそのまま地域のデータベースになり、政策立案や当選後の議会質問の強力な武器になります。"
                ]
            }
        ],
        "faqs": [
            {
                "q": "ボランティアは何人まで無料でマップ共有できますか？",
                "a": "人数制限はありません。2027年統一地方選挙応援キャンペーン中は、何人のスタッフと共有しても完全無料でご利用いただけます。"
            },
            {
                "q": "共有URLを誤って外部に送ってしまった場合、セキュリティは大丈夫ですか？",
                "a": "専用URLは知っている人がアクセスできる仕組みのため、信頼できる陣営スタッフのみへ共有してください。個人情報（氏名・電話番号等）をメモ欄に書く際は運用ルールを定めて管理することをおすすめします。"
            }
        ]
    }
]


def build_utm(url, slug, content):
    sep = "&" if "?" in url else "?"
    return f"{url}{sep}utm_source=polistep&utm_medium=guide&utm_campaign={slug}&utm_content={content}"


def render_guide_html(guide, all_guides):
    slug = guide["slug"]
    title = guide["title"]
    desc = guide["description"]
    cat = guide["category"]
    tldr = guide["tldr"]
    pub = guide["published_at"]
    mins = guide["read_minutes"]
    keywords = ", ".join(guide["keywords"])
    page_url = f"https://polistep.jp/guides/{slug}.html"
    signup_mid = f"/auth?mode=register&utm_source=polistep&utm_medium=guide&utm_campaign={slug}&utm_content=guide_mid_signup"
    signup_bottom = f"/auth?mode=register&utm_source=polistep&utm_medium=guide&utm_campaign={slug}&utm_content=guide_bottom_signup"
    polidash_url = build_utm("https://polidash.jp/", slug, "guide_bottom_polidash")
    poliside_url = build_utm("https://poliside.net/", slug, "guide_bottom_poliside")

    sections_html = []
    for idx, sec in enumerate(guide["sections"]):
        p_html = "".join(f"<p>{html_lib.escape(p)}</p>" for p in sec["paragraphs"])
        b_html = ""
        if sec.get("bullets"):
            items = "".join(f"<li>{html_lib.escape(b)}</li>" for b in sec["bullets"])
            b_html = f'<ul class="guide-list">{items}</ul>'
        t_html = ""
        if sec.get("table"):
            ths = "".join(f"<th>{html_lib.escape(h)}</th>" for h in sec["table"]["headers"])
            trs = "".join(
                "<tr>" + "".join(f"<td>{html_lib.escape(c)}</td>" for c in row) + "</tr>"
                for row in sec["table"]["rows"]
            )
            t_html = f'<div class="table-wrap"><table><thead><tr>{ths}</tr></thead><tbody>{trs}</tbody></table></div>'

        mid_cta = ""
        if idx == 0:
            mid_cta = f"""
            <aside class="mid-cta">
              <div>
                <div class="mid-cta__badge">2027年統一地方選挙応援キャンペーン：完全0円</div>
                <div class="mid-cta__title">スマホ地図で地域活動・目標逆算・SNS日報を一元化「PoliStep」</div>
                <p class="mid-cta__desc">スタッフは登録不要。LINEで専用URLを送るだけでチーム全員の活動がリアルタイムに可視化されます。</p>
              </div>
              <a href="{signup_mid}" data-cta-location="guide_mid_signup" class="btn-primary">無料でアカウント作成 →</a>
            </aside>"""

        sections_html.append(f"""
        <section class="guide-section">
          <h2>{html_lib.escape(sec['heading'])}</h2>
          {p_html}
          {b_html}
          {t_html}
          {mid_cta}
        </section>""")

    faq_items_html = []
    faq_json_items = []
    for f in guide["faqs"]:
        faq_items_html.append(f"""
        <div class="faq-card">
          <h3><span class="faq-q">Q</span><span>{html_lib.escape(f['q'])}</span></h3>
          <p>{html_lib.escape(f['a'])}</p>
        </div>""")
        faq_json_items.append({
            "@type": "Question",
            "name": f["q"],
            "acceptedAnswer": {"@type": "Answer", "text": f["a"]}
        })

    related_cards = []
    for r in all_guides:
        if r["slug"] == slug:
            continue
        related_cards.append(f"""
        <a href="{r['slug']}.html" class="related-card" data-cta-location="guide_related_card">
          <span class="badge">{html_lib.escape(r['category'])}</span>
          <div class="related-card__title">{html_lib.escape(r['title'])}</div>
          <span class="related-card__more">ガイドを読む →</span>
        </a>""")

    article_ld = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": desc,
        "datePublished": f"{pub}T09:00:00+09:00",
        "dateModified": f"{pub}T09:00:00+09:00",
        "author": {"@type": "Organization", "name": "PoliStep運営事務局", "url": "https://polistep.jp/"},
        "publisher": {
            "@type": "Organization",
            "name": "PoliStep",
            "url": "https://polistep.jp/",
            "logo": {"@type": "ImageObject", "url": "https://polistep.jp/polistep_ogp_banner.jpg"}
        },
        "mainEntityOfPage": {"@type": "WebPage", "@id": page_url}
    }
    faq_ld = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faq_json_items}
    bc_ld = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "TOP", "item": "https://polistep.jp/"},
            {"@type": "ListItem", "position": 2, "name": "政治活動DX実践ガイド", "item": "https://polistep.jp/guides/"},
            {"@type": "ListItem", "position": 3, "name": title, "item": page_url}
        ]
    }

    return f"""<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico?v=3" />
  <title>{html_lib.escape(title)} | PoliStep</title>
  <meta name="description" content="{html_lib.escape(desc)}" />
  <meta name="keywords" content="{html_lib.escape(keywords)}" />
  <link rel="canonical" href="{page_url}" />

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id={GA_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', '{GA_ID}');
  </script>

  <meta property="og:title" content="{html_lib.escape(title)} | PoliStep" />
  <meta property="og:description" content="{html_lib.escape(desc)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="{page_url}" />
  <meta property="og:image" content="https://polistep.jp/polistep_ogp_banner.jpg" />
  <meta property="og:site_name" content="PoliStep" />
  <meta property="og:locale" content="ja_JP" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{html_lib.escape(title)}" />
  <meta name="twitter:description" content="{html_lib.escape(desc)}" />
  <meta name="twitter:image" content="https://polistep.jp/polistep_ogp_banner.jpg" />

  <style>
    :root {{ --primary: #2563EB; --primary-dark: #1D4ED8; --bg: #F8FAFC; --text: #0F172A; --muted: #475569; --border: #E2E8F0; }}
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Noto Sans JP", sans-serif; background: #fff; color: var(--text); line-height: 1.8; }}
    a {{ color: var(--primary); }}
    .header {{ position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.92); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); }}
    .header__inner {{ max-width: 960px; margin: 0 auto; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }}
    .logo {{ display: inline-flex; align-items: center; gap: 8px; text-decoration: none; color: var(--text); font-weight: 900; font-size: 1.2rem; }}
    .logo img {{ width: 28px; height: 28px; border-radius: 50%; }}
    .nav {{ display: flex; align-items: center; gap: 14px; font-size: 0.9rem; font-weight: 700; }}
    .nav a {{ text-decoration: none; color: var(--muted); }}
    .btn-primary {{ display: inline-flex; align-items: center; justify-content: center; gap: 6px; background: var(--primary); color: #fff !important; text-decoration: none; font-weight: 800; padding: 10px 20px; border-radius: 999px; font-size: 0.9rem; white-space: nowrap; transition: background 0.15s; }}
    .btn-primary:hover {{ background: var(--primary-dark); }}
    .main {{ max-width: 780px; margin: 0 auto; padding: 36px 20px 80px; }}
    .breadcrumb {{ font-size: 0.8rem; color: var(--muted); margin-bottom: 20px; display: flex; flex-wrap: wrap; gap: 8px; }}
    .breadcrumb a {{ text-decoration: none; color: var(--muted); }}
    .badge {{ display: inline-block; background: #DBEAFE; color: #1D4ED8; font-size: 0.75rem; font-weight: 800; padding: 3px 10px; border-radius: 999px; }}
    .meta {{ display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 14px; font-size: 0.85rem; color: var(--muted); }}
    h1 {{ font-size: clamp(1.5rem, 3.5vw, 2.05rem); line-height: 1.4; margin: 0 0 24px; font-weight: 900; }}
    .tldr {{ background: #EFF6FF; border-left: 4px solid var(--primary); border-radius: 0 14px 14px 0; padding: 20px 24px; margin-bottom: 36px; }}
    .tldr__label {{ font-size: 0.78rem; font-weight: 900; color: var(--primary-dark); margin-bottom: 6px; letter-spacing: 0.04em; }}
    .tldr p {{ margin: 0; font-size: 0.96rem; font-weight: 600; color: var(--text); }}
    .guide-section {{ margin-bottom: 42px; }}
    .guide-section h2 {{ font-size: 1.38rem; font-weight: 900; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid var(--primary); }}
    .guide-section p {{ margin: 0 0 18px; color: #334155; }}
    .guide-list {{ background: var(--bg); border: 1px solid var(--border); border-radius: 14px; padding: 18px 22px 18px 36px; margin: 16px 0 20px; }}
    .guide-list li {{ margin-bottom: 8px; color: #1E293B; font-weight: 600; }}
    .table-wrap {{ overflow-x: auto; border: 1px solid var(--border); border-radius: 14px; margin: 20px 0; }}
    table {{ width: 100%; border-collapse: collapse; font-size: 0.9rem; }}
    th, td {{ padding: 12px 14px; border-bottom: 1px solid var(--border); text-align: left; vertical-align: top; }}
    th {{ background: #F1F5F9; font-weight: 800; color: var(--text); }}
    tr:last-child td {{ border-bottom: none; }}
    .mid-cta {{ margin: 32px 0; padding: 22px 24px; border-radius: 18px; background: linear-gradient(135deg, #EFF6FF, #F0F9FF); border: 1.5px solid #93C5FD; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; }}
    .mid-cta__badge {{ font-size: 0.75rem; font-weight: 800; color: var(--primary-dark); margin-bottom: 4px; }}
    .mid-cta__title {{ font-size: 1.05rem; font-weight: 900; color: var(--text); margin-bottom: 4px; }}
    .mid-cta__desc {{ margin: 0; font-size: 0.86rem; color: var(--muted); }}
    .faq-section {{ margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--border); }}
    .faq-section h2 {{ font-size: 1.35rem; font-weight: 900; margin: 0 0 20px; }}
    .faq-card {{ background: var(--bg); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; margin-bottom: 14px; }}
    .faq-card h3 {{ margin: 0 0 8px; font-size: 1rem; font-weight: 800; display: flex; gap: 10px; align-items: flex-start; }}
    .faq-q {{ background: var(--primary); color: #fff; font-size: 0.78rem; padding: 2px 8px; border-radius: 6px; flex-shrink: 0; }}
    .faq-card p {{ margin: 0; padding-left: 34px; font-size: 0.94rem; color: var(--muted); }}
    .legal-note {{ margin-top: 32px; padding: 16px 20px; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; font-size: 0.82rem; color: var(--muted); }}
    .bottom-cta {{ margin-top: 44px; padding: 36px 24px; border-radius: 22px; background: #0F172A; color: #fff; text-align: center; }}
    .bottom-cta h2 {{ margin: 0 0 10px; font-size: 1.45rem; font-weight: 900; color: #fff; border: none; }}
    .bottom-cta p {{ margin: 0 0 22px; color: #CBD5E1; font-size: 0.94rem; }}
    .bottom-cta__actions {{ display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }}
    .btn-ghost {{ display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.1); color: #fff !important; text-decoration: none; font-weight: 700; padding: 10px 18px; border-radius: 999px; font-size: 0.88rem; }}
    .related {{ margin-top: 52px; }}
    .related h2 {{ font-size: 1.25rem; font-weight: 900; margin: 0 0 16px; }}
    .related-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }}
    .related-card {{ display: block; background: var(--bg); border: 1px solid var(--border); border-radius: 14px; padding: 16px; text-decoration: none; color: var(--text); transition: border-color 0.15s; }}
    .related-card:hover {{ border-color: var(--primary); }}
    .related-card__title {{ font-size: 0.94rem; font-weight: 800; line-height: 1.45; margin: 8px 0; }}
    .related-card__more {{ font-size: 0.8rem; font-weight: 800; color: var(--primary); }}
    .footer {{ background: #0F172A; color: #94A3B8; padding: 36px 20px; font-size: 0.85rem; }}
    .footer__inner {{ max-width: 960px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; }}
    .footer a {{ color: #CBD5E1; text-decoration: none; margin-right: 16px; }}
  </style>

  <script type="application/ld+json">{json.dumps(article_ld, ensure_ascii=False)}</script>
  <script type="application/ld+json">{json.dumps(faq_ld, ensure_ascii=False)}</script>
  <script type="application/ld+json">{json.dumps(bc_ld, ensure_ascii=False)}</script>
</head>
<body>
  <header class="header">
    <div class="header__inner">
      <a href="/" class="logo"><img src="/polistep_logo_new.jpg" alt="PoliStep" />PoliStep</a>
      <nav class="nav">
        <a href="/guides/">実践ガイド一覧</a>
        <a href="{signup_mid}" data-cta-location="guide_header_signup" class="btn-primary">無料で始める</a>
      </nav>
    </div>
  </header>

  <main class="main">
    <nav class="breadcrumb" aria-label="パンくずリスト">
      <a href="/">TOP</a><span>/</span>
      <a href="/guides/">政治活動DX実践ガイド</a><span>/</span>
      <span>{html_lib.escape(cat)}</span>
    </nav>

    <div class="meta">
      <span class="badge">{html_lib.escape(cat)}</span>
      <time datetime="{pub}">公開：{pub}</time>
      <span>読了目安：約{mins}分</span>
    </div>
    <h1>{html_lib.escape(title)}</h1>

    <div class="tldr">
      <div class="tldr__label">この記事の結論・要点（30秒要約）</div>
      <p>{html_lib.escape(tldr)}</p>
    </div>

    {''.join(sections_html)}

    <section class="faq-section">
      <h2>よくある質問（FAQ）</h2>
      {''.join(faq_items_html)}
    </section>

    <div class="legal-note">
      <strong>法令遵守に関するご注意：</strong>本ガイドは平時の政治活動（地域対話・後援会活動・情報発信）の業務効率化を目的とした解説です。告示前の事前運動や戸別訪問等の禁止事項については、必ず事前に管轄の選挙管理委員会へご確認ください。
    </div>

    <section class="bottom-cta">
      <h2>孤独なドブ板は、可視化で終わる。</h2>
      <p>2027年統一地方選挙応援キャンペーンにつき、マップ共有・目標逆算・SNS日報生成まで全機能を完全0円で開放中です。</p>
      <div class="bottom-cta__actions">
        <a href="{signup_bottom}" data-cta-location="guide_bottom_signup" class="btn-primary">PoliStepを無料で始める →</a>
        <a href="{polidash_url}" data-cta-location="guide_bottom_polidash" target="_blank" rel="noopener noreferrer" class="btn-ghost">選挙ポスター管理なら PoliDash ↗</a>
        <a href="{poliside_url}" data-cta-location="guide_bottom_poliside" target="_blank" rel="noopener noreferrer" class="btn-ghost">HP作成・伴走相談なら PoliSide ↗</a>
      </div>
    </section>

    <section class="related">
      <h2>あわせて読みたい PoliStep 実践ガイド</h2>
      <div class="related-grid">{''.join(related_cards)}</div>
    </section>
  </main>

  <footer class="footer">
    <div class="footer__inner">
      <div>
        <a href="/">PoliStep TOP</a>
        <a href="/guides/">実践ガイド</a>
        <a href="{polidash_url}" target="_blank" rel="noopener noreferrer">PoliDash</a>
        <a href="{poliside_url}" target="_blank" rel="noopener noreferrer">PoliSide</a>
        <a href="/terms">利用規約</a>
        <a href="/privacy">プライバシーポリシー</a>
      </div>
      <div>&copy; 2026 PoliStep. All rights reserved.</div>
    </div>
  </footer>

  <script>
    document.addEventListener('click', function(e) {{
      var link = e.target.closest('a');
      if (!link || typeof gtag !== 'function') return;
      var href = link.getAttribute('href') || '';
      var loc = link.dataset.ctaLocation || 'guide_body';
      if (href.indexOf('/auth') !== -1) {{
        gtag('event', 'cta_signup_click', {{ event_category: 'CTA', cta_location: loc, page_path: location.pathname }});
      }} else if (href.indexOf('poliside.net') !== -1 || href.indexOf('polidash.jp') !== -1) {{
        gtag('event', 'ecosystem_outbound_click', {{
          event_category: 'ecosystem',
          target_product: href.indexOf('polidash.jp') !== -1 ? 'polidash' : 'poliside',
          cta_location: loc,
          page_path: location.pathname,
          link_url: href
        }});
      }}
    }});
  </script>
</body>
</html>
"""


def render_index_html(all_guides):
    cards = []
    for g in all_guides:
        cards.append(f"""
        <a href="{g['slug']}.html" class="card" data-cta-location="guides_index_card">
          <div class="card__meta">
            <span class="badge">{html_lib.escape(g['category'])}</span>
            <span>約{g['read_minutes']}分</span>
          </div>
          <h2>{html_lib.escape(g['title'])}</h2>
          <p>{html_lib.escape(g['description'])}</p>
          <span class="card__more">ガイドを読む →</span>
        </a>""")

    bc_ld = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "TOP", "item": "https://polistep.jp/"},
            {"@type": "ListItem", "position": 2, "name": "政治活動DX実践ガイド", "item": "https://polistep.jp/guides/"}
        ]
    }
    poliside_insight = build_utm("https://poliside.net/insight/", "guides_index", "guides_index_poliside")

    return f"""<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico?v=3" />
  <title>政治活動DX実践ガイド一覧 | PoliStep - 地域訪問・目標逆算・SNS日報アプリ</title>
  <meta name="description" content="紙の住宅地図からの脱却、選挙日からの1日ノルマ逆算、30秒SNS日報ルーティン、アプリ不要のボランティアマップ共有まで、日々の政治活動を可視化する実践ガイド集。" />
  <link rel="canonical" href="https://polistep.jp/guides/" />
  <script async src="https://www.googletagmanager.com/gtag/js?id={GA_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', '{GA_ID}');
  </script>
  <meta property="og:title" content="政治活動DX実践ガイド一覧 | PoliStep" />
  <meta property="og:description" content="日々の政治活動をスマホ地図とグラフで可視化する実践ノウハウ集。" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://polistep.jp/guides/" />
  <meta property="og:image" content="https://polistep.jp/polistep_ogp_banner.jpg" />
  <style>
    :root {{ --primary: #2563EB; --primary-dark: #1D4ED8; --bg: #F8FAFC; --text: #0F172A; --muted: #475569; --border: #E2E8F0; }}
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Noto Sans JP", sans-serif; background: var(--bg); color: var(--text); line-height: 1.75; }}
    .header {{ background: #fff; border-bottom: 1px solid var(--border); }}
    .header__inner {{ max-width: 980px; margin: 0 auto; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; }}
    .logo {{ display: inline-flex; align-items: center; gap: 8px; text-decoration: none; color: var(--text); font-weight: 900; font-size: 1.2rem; }}
    .logo img {{ width: 28px; height: 28px; border-radius: 50%; }}
    .btn-primary {{ display: inline-flex; align-items: center; gap: 6px; background: var(--primary); color: #fff; text-decoration: none; font-weight: 800; padding: 10px 20px; border-radius: 999px; font-size: 0.9rem; }}
    .main {{ max-width: 980px; margin: 0 auto; padding: 40px 20px 80px; }}
    .breadcrumb {{ font-size: 0.82rem; color: var(--muted); margin-bottom: 16px; }}
    .breadcrumb a {{ color: var(--muted); text-decoration: none; }}
    .badge {{ display: inline-block; background: #DBEAFE; color: #1D4ED8; font-size: 0.74rem; font-weight: 800; padding: 3px 10px; border-radius: 999px; }}
    h1 {{ font-size: clamp(1.6rem, 3.6vw, 2.2rem); font-weight: 900; margin: 10px 0 12px; }}
    .lead {{ color: var(--muted); max-width: 720px; margin: 0 0 32px; }}
    .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 48px; }}
    .card {{ display: flex; flex-direction: column; justify-content: space-between; background: #fff; border: 1px solid var(--border); border-radius: 18px; padding: 24px; text-decoration: none; color: var(--text); transition: border-color 0.15s, transform 0.15s; }}
    .card:hover {{ border-color: var(--primary); transform: translateY(-2px); }}
    .card__meta {{ display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--muted); margin-bottom: 12px; }}
    .card h2 {{ font-size: 1.08rem; font-weight: 900; line-height: 1.45; margin: 0 0 10px; }}
    .card p {{ font-size: 0.88rem; color: var(--muted); margin: 0 0 16px; }}
    .card__more {{ font-size: 0.84rem; font-weight: 800; color: var(--primary); }}
    .cta {{ background: #0F172A; color: #fff; border-radius: 22px; padding: 36px 24px; text-align: center; }}
    .cta h2 {{ margin: 0 0 10px; font-size: 1.45rem; font-weight: 900; }}
    .cta p {{ color: #CBD5E1; margin: 0 0 22px; font-size: 0.94rem; }}
    .cta__actions {{ display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }}
    .btn-ghost {{ display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.1); color: #fff; text-decoration: none; font-weight: 700; padding: 10px 18px; border-radius: 999px; font-size: 0.88rem; }}
  </style>
  <script type="application/ld+json">{json.dumps(bc_ld, ensure_ascii=False)}</script>
</head>
<body>
  <header class="header">
    <div class="header__inner">
      <a href="/" class="logo"><img src="/polistep_logo_new.jpg" alt="PoliStep" />PoliStep</a>
      <a href="/auth?mode=register&utm_source=polistep&utm_medium=guide&utm_campaign=guides_index&utm_content=header_signup" class="btn-primary">無料で始める</a>
    </div>
  </header>
  <main class="main">
    <nav class="breadcrumb"><a href="/">TOP</a> / 政治活動DX実践ガイド</nav>
    <span class="badge">PoliStep Official Guides</span>
    <h1>政治活動DX実践ガイド</h1>
    <p class="lead">日々の地域回り・対話記録・駅頭・目標逆算・SNS日報まで。少人数陣営や無所属新人でも「続けられる・成果が見える」政治活動DXの実務ノウハウをまとめました。</p>
    <div class="grid">{''.join(cards)}</div>
    <section class="cta">
      <h2>今すぐ無料で活動マップを作成</h2>
      <p>2027年統一地方選挙応援キャンペーン中。すべての機能を完全0円でお試しいただけます。</p>
      <div class="cta__actions">
        <a href="/auth?mode=register&utm_source=polistep&utm_medium=guide&utm_campaign=guides_index&utm_content=bottom_signup" class="btn-primary">無料でアカウント作成 →</a>
        <a href="{poliside_insight}" target="_blank" rel="noopener noreferrer" class="btn-ghost">選挙準備の総合ノウハウ（PoliSide） ↗</a>
      </div>
    </section>
  </main>
</body>
</html>
"""


def update_sitemap_and_llms():
    # 1. Update public/sitemap.xml
    guide_urls_xml = [
        """  <url>
    <loc>https://polistep.jp/guides/</loc>
    <lastmod>2026-11-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>"""
    ]
    for g in GUIDES:
        guide_urls_xml.append(f"""  <url>
    <loc>https://polistep.jp/guides/{g['slug']}.html</loc>
    <lastmod>{g['published_at']}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>""")

    sitemap_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://polistep.jp/</loc>
    <lastmod>2026-11-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
{chr(10).join(guide_urls_xml)}
  <url>
    <loc>https://polistep.jp/terms</loc>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://polistep.jp/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://polistep.jp/legal</loc>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
"""
    with open(SITEMAP_PATH, "w", encoding="utf-8") as f:
        f.write(sitemap_xml)

    # 2. Update public/llms.txt with PoliStep official guides block
    if os.path.exists(LLMS_PATH):
        with open(LLMS_PATH, "r", encoding="utf-8") as f:
            llms = f.read()
        guide_lines = "\n".join(
            f"- [{g['title']}](https://polistep.jp/guides/{g['slug']}.html): {g['description']}"
            for g in GUIDES
        )
        block = f"""<!-- POLISTEP_GUIDES_START -->
## PoliStep 公式 政治活動DX実践ガイド（独自ナレッジ）
- [政治活動DX実践ガイド一覧](https://polistep.jp/guides/): 地域活動マッピング・目標逆算・SNS日報・チーム共有の専門ガイド集
{guide_lines}
<!-- POLISTEP_GUIDES_END -->"""
        if "<!-- POLISTEP_GUIDES_START -->" in llms:
            llms = re.sub(
                r"<!-- POLISTEP_GUIDES_START -->.*?<!-- POLISTEP_GUIDES_END -->",
                block,
                llms,
                flags=re.DOTALL,
            )
        elif "## 主要リンク" in llms:
            llms = llms.replace("## 主要リンク", block + "\n\n## 主要リンク", 1)
        if "/guides/" not in llms.split("## 主要リンク")[-1]:
            llms = llms.replace(
                "- [ホーム（サービス概要・料金）](https://polistep.jp/)",
                "- [ホーム（サービス概要・料金）](https://polistep.jp/)\n- [政治活動DX実践ガイド](https://polistep.jp/guides/)",
            )
        with open(LLMS_PATH, "w", encoding="utf-8") as f:
            f.write(llms)


def main():
    os.makedirs(GUIDES_DIR, exist_ok=True)
    for g in GUIDES:
        out_path = os.path.join(GUIDES_DIR, f"{g['slug']}.html")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(render_guide_html(g, GUIDES))

    with open(os.path.join(GUIDES_DIR, "index.html"), "w", encoding="utf-8") as f:
        f.write(render_index_html(GUIDES))

    summary_json = [
        {
            "slug": g["slug"],
            "category": g["category"],
            "title": g["title"],
            "description": g["description"],
            "published_at": g["published_at"],
            "read_minutes": g["read_minutes"],
            "url": f"/guides/{g['slug']}.html",
        }
        for g in GUIDES
    ]
    os.makedirs(os.path.dirname(GUIDES_JSON_PATH), exist_ok=True)
    with open(GUIDES_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(summary_json, f, ensure_ascii=False, indent=2)

    update_sitemap_and_llms()
    print(f"[SUCCESS] Generated {len(GUIDES)} static guides + index, sitemap.xml, llms.txt, and polistepGuides.json.")


if __name__ == "__main__":
    main()
