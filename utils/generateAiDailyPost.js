const fs = require('fs')
const path = require('path')

const TARGET_DIR = path.join(
  __dirname,
  '..',
  'docs',
  '03.\u6280\u672f',
  '05.ai\u5927\u6a21\u578b'
)
const FEED_SOURCES = [
  {
    name: 'Bing News 国内 AI',
    url: 'https://www.bing.com/news/search?q=%28AI%20OR%20%E5%A4%A7%E6%A8%A1%E5%9E%8B%20OR%20LLM%20OR%20%E7%94%9F%E6%88%90%E5%BC%8FAI%29%20%28site%3A36kr.com%20OR%20site%3Aifanr.com%20OR%20site%3Apingwest.com%20OR%20site%3Ageekpark.net%20OR%20site%3Ajiqizhixin.com%29&format=rss&mkt=zh-CN',
  },
  {
    name: 'Bing News 国内模型厂商',
    url: 'https://www.bing.com/news/search?q=%28%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE%20OR%20%E6%96%87%E5%BF%83%E4%B8%80%E8%A8%80%20OR%20DeepSeek%20OR%20Kimi%20OR%20%E8%B1%86%E5%8C%85%20OR%20%E6%B7%B7%E5%85%83%20OR%20%E6%99%BA%E8%B0%B1%29&format=rss&mkt=zh-CN',
  },
  {
    name: 'Google News 国内 AI',
    url: 'https://news.google.com/rss/search?q=%28AI%20OR%20%E5%A4%A7%E6%A8%A1%E5%9E%8B%20OR%20%E7%94%9F%E6%88%90%E5%BC%8FAI%29%20%28site%3A36kr.com%20OR%20site%3Aifanr.com%20OR%20site%3Apingwest.com%20OR%20site%3Ageekpark.net%20OR%20site%3Ajiqizhixin.com%29&hl=zh-CN&gl=CN&ceid=CN%3Azh-Hans',
  },
  {
    name: 'Google News 国内模型厂商',
    url: 'https://news.google.com/rss/search?q=%28%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE%20OR%20%E6%96%87%E5%BF%83%E4%B8%80%E8%A8%80%20OR%20DeepSeek%20OR%20Kimi%20OR%20%E8%B1%86%E5%8C%85%20OR%20%E6%B7%B7%E5%85%83%20OR%20%E6%99%BA%E8%B0%B1%29&hl=zh-CN&gl=CN&ceid=CN%3Azh-Hans',
  },
  {
    name: '36氪搜索',
    url: 'https://www.bing.com/search?q=site%3A36kr.com+%28AI+OR+%E5%A4%A7%E6%A8%A1%E5%9E%8B+OR+DeepSeek+OR+Kimi%29&format=rss&mkt=zh-CN',
  },
]
const FETCH_TIMEOUT_MS = Number(process.env.AI_DAILY_FETCH_TIMEOUT_MS || 20000)
const DEFAULT_AUTHOR = {
  name: 'zc',
  link: 'https://github.com/1120507206/',
}

async function main() {
  ensureTargetDir()

  const { items, feedName, feedUrl } = await fetchFeedItems()

  if (!items.length) {
    console.log('No feed items found.')
    return
  }

  const existingUrls = new Set(readExistingUrls(TARGET_DIR))
  const selected = items.find(item => !existingUrls.has(item.link))

  if (!selected) {
    console.log('No new AI article found.')
    return
  }

  const nextIndex = getNextIndex(TARGET_DIR)
  const title = sanitizeTitle(selected.title)
  const fileName = `${padIndex(nextIndex)}.${truncateFileName(title)}.md`
  const filePath = path.join(TARGET_DIR, fileName)

  fs.writeFileSync(filePath, buildMarkdown(selected, { feedName, feedUrl }))
  console.log(`Created ${filePath}`)
}

function ensureTargetDir() {
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true })
  }
}

async function fetchFeedItems() {
  const errors = []

  for (const source of FEED_SOURCES) {
    try {
      const xml = await fetchFeed(source.url)
      const items = parseFeed(xml)

      if (items.length) {
        console.log(`Using feed source: ${source.name}`)
        return {
          items,
          feedName: source.name,
          feedUrl: source.url,
        }
      }

      errors.push(`${source.name}: feed is empty`)
    } catch (error) {
      errors.push(`${source.name}: ${error.message}`)
    }
  }

  throw new Error(
    `All feed sources failed.\n${errors.map(item => `- ${item}`).join('\n')}`
  )
}

async function fetchFeed(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'zcblog-ai-daily-bot/1.0',
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`)
    }

    return response.text()
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`request timeout after ${FETCH_TIMEOUT_MS}ms`)
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}

function parseFeed(xml) {
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || []

  return itemMatches
    .map(raw => {
      const title = decodeHtml(getTagValue(raw, 'title'))
      const link = decodeHtml(getTagValue(raw, 'link'))
      const pubDate = decodeHtml(getTagValue(raw, 'pubDate'))
      const description = stripHtml(decodeHtml(getTagValue(raw, 'description')))
      const source = decodeHtml(getTagValue(raw, 'source')) || 'Google News'

      return {
        title: cleanupGoogleNewsTitle(title),
        link,
        pubDate,
        description,
        source,
      }
    })
    .filter(item => item.title && item.link)
}

function getTagValue(input, tagName) {
  const match = input.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`))
  return match ? match[1].trim() : ''
}

function stripHtml(text) {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function decodeHtml(text) {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

function cleanupGoogleNewsTitle(title) {
  return title.replace(/\s*-\s*[^-]+$/, '').trim()
}

function readExistingUrls(dir) {
  return fs
    .readdirSync(dir)
    .filter(name => name.endsWith('.md'))
    .flatMap(name => {
      const content = fs.readFileSync(path.join(dir, name), 'utf8')
      const match = content.match(/^sourceLink:\s*"(.+)"$/m)
      return match ? [match[1].trim()] : []
    })
}

function getNextIndex(dir) {
  const indexes = fs.readdirSync(dir).map(name => {
    const match = name.match(/^(\d+)\./)
    return match ? Number(match[1]) : 0
  })

  return Math.max(0, ...indexes) + 1
}

function padIndex(index) {
  return String(index).padStart(2, '0')
}

function sanitizeTitle(title) {
  return title.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim()
}

function truncateFileName(title) {
  return title.slice(0, 48)
}

function buildMarkdown(article, meta) {
  const createdAt = formatDate(new Date())
  const permalink = `/pages/ai-${Date.now().toString(36)}/`
  const description =
    article.description || '\u672c\u6761 RSS \u6682\u672a\u63d0\u4f9b\u6458\u8981\uff0c\u5efa\u8bae\u76f4\u63a5\u9605\u8bfb\u539f\u6587\u3002'
  const originalTitle = article.title.replace(/\n/g, ' ').trim()
  const safeTitle = toChineseTitle(article, createdAt)

  return `---
title: ${yamlString(safeTitle)}
date: ${createdAt}
permalink: ${permalink}
categories:
  - \u6280\u672f
  - ai\u5927\u6a21\u578b
tags:
  - AI
  - AI\u8d44\u8baf
author:
  name: ${yamlString(DEFAULT_AUTHOR.name)}
  link: ${yamlString(DEFAULT_AUTHOR.link)}
sourceLink: ${yamlString(article.link)}
sourceName: ${yamlString(article.source)}
feedName: ${yamlString(meta.feedName)}
feedUrl: ${yamlString(meta.feedUrl)}
article: true
---

## \u4eca\u65e5 AI \u8d44\u8baf

### \u6807\u9898

${safeTitle}

### \u539f\u59cb\u6807\u9898

${originalTitle}

### \u6765\u6e90

- \u6765\u6e90\uff1a${article.source}
- \u53d1\u5e03\u65f6\u95f4\uff1a${article.pubDate || '\u672a\u77e5'}
- \u539f\u6587\u94fe\u63a5\uff1a[\u70b9\u51fb\u67e5\u770b\u539f\u6587](${article.link})
- RSS \u6e90\uff1a${meta.feedName}

### \u6458\u8981

${description}

### \u4e3a\u4ec0\u4e48\u503c\u5f97\u5173\u6ce8

1. \u8fd9\u662f\u4e00\u7bc7\u6700\u8fd1 24 \u5c0f\u65f6\u5185\u6293\u53d6\u5230\u7684 AI \u76f8\u5173\u6587\u7ae0\uff0c\u9002\u5408\u7528\u6765\u8ddf\u8e2a\u884c\u4e1a\u52a8\u6001\u3002
2. \u672c\u6587\u5185\u5bb9\u57fa\u4e8e\u516c\u5f00 RSS \u6807\u9898\u548c\u6458\u8981\u81ea\u52a8\u6574\u7406\uff0c\u9002\u5408\u4f5c\u4e3a\u7ebf\u7d22\u5165\u53e3\u3002
3. \u5982\u679c\u4f60\u89c9\u5f97\u4e3b\u9898\u6709\u4ef7\u503c\uff0c\u53ef\u4ee5\u7ee7\u7eed\u8865\u5145\u4f60\u7684\u89e3\u8bfb\u3001\u5e94\u7528\u573a\u666f\u6216\u5ef6\u4f38\u9605\u8bfb\u3002
`
}

function toChineseTitle(article, createdAt) {
  const rawTitle = article.title.replace(/\n/g, ' ').trim()

  if (containsChinese(rawTitle)) {
    return cleanupChineseTitle(rawTitle)
  }

  const source = normalizeSourceName(article.source)
  const keywords = inferChineseKeywords(rawTitle)
  const dateText = createdAt.slice(0, 10)

  if (keywords.length) {
    return `【AI资讯】${source}${keywords.join('、')}动态速览（${dateText}）`
  }

  return `【AI资讯】${source}发布最新大模型动态（${dateText}）`
}

function containsChinese(text) {
  return /[\u4e00-\u9fff]/.test(text)
}

function cleanupChineseTitle(title) {
  return title
    .replace(/\s+/g, ' ')
    .replace(/^\[.*?\]\s*/, '')
    .trim()
}

function normalizeSourceName(source) {
  const value = String(source || 'AI媒体')

  if (containsChinese(value)) {
    return value
  }

  const mappings = [
    ['36Kr', '36氪'],
    ['ifanr', '爱范儿'],
    ['PingWest', '品玩'],
    ['GeekPark', '极客公园'],
    ['Jiqizhixin', '机器之心'],
    ['OpenAI', 'OpenAI'],
    ['Google News', '国内AI媒体'],
    ['Bing News', '国内AI媒体'],
  ]

  for (const [from, to] of mappings) {
    if (value.toLowerCase().includes(from.toLowerCase())) {
      return to
    }
  }

  return value
}

function inferChineseKeywords(title) {
  const lower = title.toLowerCase()
  const mappings = [
    ['gpt', 'GPT'],
    ['openai', 'OpenAI'],
    ['deepseek', 'DeepSeek'],
    ['kimi', 'Kimi'],
    ['qwen', '通义千问'],
    ['ernie', '文心'],
    ['doubao', '豆包'],
    ['hunyuan', '混元'],
    ['zhipu', '智谱'],
    ['agent', '智能体'],
    ['video', '视频生成'],
    ['image', '图像生成'],
    ['reasoning', '推理模型'],
    ['coding', '代码生成'],
    ['llm', '大语言模型'],
    ['model', '模型'],
  ]

  return mappings
    .filter(([from]) => lower.includes(from))
    .map(([, to]) => to)
    .filter((value, index, arr) => arr.indexOf(value) === index)
    .slice(0, 3)
}

function yamlString(value) {
  return JSON.stringify(String(value))
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = padNumber(date.getMonth() + 1)
  const day = padNumber(date.getDate())
  const hours = padNumber(date.getHours())
  const minutes = padNumber(date.getMinutes())
  const seconds = padNumber(date.getSeconds())
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function padNumber(value) {
  return String(value).padStart(2, '0')
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
