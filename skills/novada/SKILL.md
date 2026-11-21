---
name: novada
description: Live web data through the Novada MCP server: search the web, read pages that block bots, run cited multi-source research, pull structured records from 14 platforms (Amazon, Google, LinkedIn, TikTok, YouTube, Walmart and more), crawl a site section, map a site's URLs. Use when a task needs current web data, a page the built-in fetch cannot read, or platform records.
---

# Novada

Novada tools come from the `novada` MCP server. Under OpenCode's default Code Mode they are called as `tools.novada.<tool>(...)`.

## Sign in first

If the server shows "needs authentication", run `/mcps`, select `novada`, and sign in with a Novada account in the browser. Check the account and balance any time with `novada_setup` or `novada_account`.

## Pick a tool

| Need | Tool |
| --- | --- |
| Find pages by query | `novada_search` |
| Read one URL, or up to 10 in parallel, including pages that block bots | `novada_extract` |
| Answer a complex question with passages from several sources | `novada_research` |
| Structured records from a platform | `novada_scrape_<platform>`: amazon, google, bing, duckduckgo, yandex, youtube, instagram, facebook, tiktok, x, walmart, linkedin, github, perplexity. Generic fallback: `novada_scrape` |
| Content from up to 20 related pages on one site | `novada_crawl` |
| List the URLs on a site before fetching | `novada_map` |
| Check whether a page changed | `novada_monitor` |
| Route your own HTTP client through a chosen IP type, country or session | `novada_proxy` |
| Not sure which tool fits | `novada_discover` |

## Rules

- Prefer the built-in fetch for simple public pages. Use `novada_extract` when a page is blocked, needs JavaScript, or you need several URLs at once.
- Platform scrapers, search and research calls are billed to the user's Novada account. Say what you are about to run when it could fan out into many records, and start with a small limit.
- `novada_research` returns numbered source passages, not a finished answer. Write the answer from them and cite the sources.
- Never create proxy sub-accounts, buy or renew static IPs, or change account settings unless the user asked for exactly that. Those tools use a two-step approval token.
