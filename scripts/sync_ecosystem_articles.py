#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Syncs latest PoliSide SEO/AEO articles into PoliStep (src/data/ecosystemArticles.json,
public/llms.txt, and public/sitemap.xml) using PoliStep-specific unique 1-line digests
(polistep_note) to avoid duplicate content penalties.
Runs automatically in GitHub Actions even when the local Mac is closed.
"""

import json
import os
import re
import urllib.request
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FEED_PATH = os.path.join(BASE_DIR, "src", "data", "ecosystemArticles.json")
LLMS_PATH = os.path.join(BASE_DIR, "public", "llms.txt")
SITEMAP_PATH = os.path.join(BASE_DIR, "public", "sitemap.xml")

SOURCES = [
    "https://raw.githubusercontent.com/gza21rds-ui/poliside-net/main/insight/data/articles.json",
    "https://poliside.net/insight/data/articles.json",
]


def format_jp_date(date_str):
    try:
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        return f"{dt.year}年{dt.month}月{dt.day}日"
    except Exception:
        return date_str[:10]


def fetch_articles():
    for url in SOURCES:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "PoliStep-Ecosystem-Sync/1.0"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                if isinstance(data, list) and len(data) > 0:
                    return data
        except Exception as e:
            print(f"[WARN] Failed to fetch from {url}: {e}")
    return None


def main():
    articles = fetch_articles()
    if not articles:
        print("[ERROR] Could not fetch articles.json from any source.")
        return

    # 1. Build PoliStep top-page feed (up to 6 latest articles with unique polistep_note)
    feed_items = []
    for art in articles[:6]:
        slug = art["slug"]
        category = art.get("category", "選挙")
        pub_at = art.get("published_at", "")
        digest = art.get(
            "polistep_note",
            f"【{category}ノウハウ】日々の地域活動・目標逆算計画や公職選挙法を踏まえた実践ステップを解説。"
        )
        feed_items.append({
            "slug": slug,
            "title": art["title"],
            "category": category,
            "published_at": pub_at[:10],
            "date_jp": format_jp_date(pub_at),
            "url": f"https://poliside.net/insight/posts/{slug}.html",
            "primary_product": art.get("primary_product", "PoliSide"),
            "digest": digest,
        })

    os.makedirs(os.path.dirname(FEED_PATH), exist_ok=True)
    with open(FEED_PATH, "w", encoding="utf-8") as f:
        json.dump(feed_items, f, ensure_ascii=False, indent=2)

    # 2. Update public/llms.txt if new articles exist
    if os.path.exists(LLMS_PATH):
        with open(LLMS_PATH, "r", encoding="utf-8") as f:
            llms_content = f.read()

        marker = "<!-- ARTICLES_START -->"
        if marker in llms_content:
            for art in reversed(articles):
                url = f"https://poliside.net/insight/posts/{art['slug']}.html"
                if url not in llms_content:
                    line = f"- [{art['title']}]({url}): {art['lead']}"
                    llms_content = llms_content.replace(marker, f"{marker}\n{line}")

            with open(LLMS_PATH, "w", encoding="utf-8") as f:
                f.write(llms_content)

    # 3. Update public/sitemap.xml <lastmod> to latest article date
    if os.path.exists(SITEMAP_PATH) and feed_items:
        latest_date = feed_items[0]["published_at"]
        with open(SITEMAP_PATH, "r", encoding="utf-8") as f:
            sxml = f.read()
        sxml = re.sub(
            r"(<loc>https://polistep\.jp/</loc>\s*<lastmod>)[0-9\-]+(</lastmod>)",
            rf"\g<1>{latest_date}\g<2>",
            sxml,
        )
        with open(SITEMAP_PATH, "w", encoding="utf-8") as f:
            f.write(sxml)

    print(f"[SUCCESS] Synced {len(feed_items)} articles to PoliStep.")


if __name__ == "__main__":
    main()
