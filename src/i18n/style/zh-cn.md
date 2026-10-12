# Simplified Chinese style (docs)

- Simplified Chinese (zh-CN). Neutral, direct tone; address the reader as「你」only when needed, or omit the subject — like the app.
- Full-width punctuation in Chinese text: ，。：；？！（）「」. Half-width inside code, URLs and Latin-only phrases.
- No spaces between Chinese characters. One space between Chinese and Latin words or numbers: 「打开 Slack 连接」「5 分钟」.
- UI labels exactly as the app shows them: the glossary's `app` map wins. Labels in **bold** as in English.
- Keep in English: product, provider and app names, node ids, keyboard keys, code, anything in backticks.
- Translate meaning; reorder sentences freely.
- Terms follow the app: 工作流, 节点, 触发器, 项目 (item, not 数据项), 教程 (recipe), 凭据, 智能体, 知识库, 画布, 表达式.
- Interface strings (`src/i18n/ui/zh-cn.ts`): flat keys, plurals as `_one` / `_other`; never assemble one sentence from several keys. Sidebar labels live in `src/i18n/nav-labels.ts`.
