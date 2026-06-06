# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **WeChat Mini Program** (微信小程序) using **WeChat Cloud Development** (微信云开发 / Tencent CloudBase). It demonstrates the four core cloud capabilities: Database, File Storage, Cloud Functions, and Cloud Hosting (CloudBase Run), plus AI integration via Agent-UI.

- **AppID**: `wx5b88d7ed73cfc759`
- **Base library**: 2.20.1
- **Cloud function SDK**: `wx-server-sdk` ~2.4.0

## Hard Constraints — WeChat Mini Program (微信小程序)

**CRITICAL: ALL code changes, file modifications, and architectural decisions MUST follow WeChat Mini Program development rules. This section defines the non-negotiable boundaries of this project.**

### Framework & Markup

- **No HTML/CSS** — Frontend uses **WXML** (WeChat Markup Language) for markup and **WXSS** (WeChat Style Sheets) for styling. Never write HTML tags (`div`, `span`, `input`, `button`, `a`, `p`, etc.) or standard CSS properties that don't exist in WXSS.
- **No DOM APIs** — `document`, `window`, `localStorage`, `navigator`, and all browser-native APIs do not exist in the mini program runtime. Never use them.
- **WXML tags only** — Use `<view>`, `<text>`, `<image>`, `<button>`, `<input>`, `<scroll-view>`, `<swiper>`, `<block>`, `<template>`, etc.
- **rpx unit** — Use `rpx` (responsive pixel) as the primary CSS unit for layout. `750rpx` = screen width.
- **Data binding** — Data flows from JS `data` object to WXML via `{{}}` interpolation. Use `this.setData()` to update UI — never mutate `this.data` directly after `onLoad`.

### Architecture

- **Frontend → Cloud communication MUST go through `wx.cloud.callFunction()`**. Never make direct database calls (`wx.cloud.database()`) or direct HTTP requests from the frontend unless there is an explicit, justified reason.
- **Cloud functions use `wx-server-sdk`** (Node.js runtime). All backend logic lives in `cloudfunctions/` and is deployed to the cloud.
- **Environment ID** (`env`) in `PRTSBoost/app.js` `globalData` determines the target cloud environment. If missing, the app must show an error prompt.

### File Structure & Registration

- All mini program frontend source lives in `PRTSBoost/` (configured in `project.config.json` `miniprogramRoot`).
- All cloud function source lives in `cloudfunctions/` (configured in `project.config.json` `cloudfunctionRoot`).
- **Every new page MUST be registered in `app.json` under `pages`** — otherwise the page won't load.
- **Every new component MUST be registered in the parent page's `.json` `usingComponents` field**.
- Each page/component consists of **4 files** that share the same name: `.js` (logic), `.wxml` (markup), `.wxss` (style), `.json` (config).
- In page `.json` files, `navigationBarTitleText`, `usingComponents`, `enablePullDownRefresh`, etc. are standard WeChat config keys. Never include unknown keys.
- Global style goes in `app.wxss`; global config in `app.json`; global logic in `app.js`.

### API Surface

- Only WeChat-native APIs are available: `wx.*` (e.g., `wx.cloud.callFunction`, `wx.navigateTo`, `wx.showToast`, `wx.request`, `wx.getStorageSync`, etc.).
- Common banned APIs: `fetch`, `XMLHttpRequest`, `localStorage`, `sessionStorage`, `navigator.geolocation` — use `wx.request`, `wx.setStorageSync`, `wx.getLocation` instead.
- Cloud database queries use `db.collection().where().get()` / `.add()` / `.update()` / `.remove()` inside cloud functions, not from the frontend.
- For image/file upload, use `wx.cloud.uploadFile()`, not raw HTTP multipart.

### Style Convention

- **WXSS only**, not CSS. Most CSS properties are supported, but some (like `vh`, `vw`, `rem` in some contexts) behave differently. Prefer `rpx`.
- Do not use tag selectors targeting HTML tags (e.g., `div {}`, `span {}`). Use class selectors.
- `@import` is supported. Complex CSS features like `calc()`, `var()`, flexbox, and grid are typically supported on base library 2.20.1.

### When You Generate Code

- Always generate the correct 4-file pattern for pages/components (`.js` / `.json` / `.wxml` / `.wxss`).
- Always register pages in `app.json`.
- Always register components in the consuming page/component `.json`.
- Never use browser APIs, HTML tags, or standard CSS that falls outside the WeChat mini program environment.
- If unsure whether a WXSS property or JS API is supported, reference the **WeChat Open Docs** (微信开放文档) or flag it.

## Repository Layout

```
project.config.json          # WeChat DevTools project config (miniprogramRoot, cloudfunctionRoot, settings)
PRTSBoost/                 # Mini program frontend
  app.js                     # App entry — wx.cloud.init() happens here; configure env in globalData
  app.json                   # Page registration, window config, tab bar
  app.wxss                   # Global styles
  pages/
    index/index              # Home page — feature list (Cloud Hosting, Functions, DB, Storage, AI)
    example/index            # Demo/detail page — exercises each cloud capability by type parameter
  components/
    cloudTipModal/           # Reusable error/tip modal (used when cloud env is missing or functions not deployed)
  envList.js                 # Environment list stub (currently empty)
cloudfunctions/
  quickstartFunctions/       # Single cloud function with type-based dispatch (see below)
    index.js                 # Main handler
    config.json              # API permissions (e.g., openapi.wxacode.get)
    package.json             # Dependencies (wx-server-sdk)
uploadCloudFunction.sh       # CLI helper for deploying cloud functions
```

## Cloud Function: `quickstartFunctions`

A single dispatcher cloud function. The frontend calls it via `wx.cloud.callFunction({ name: "quickstartFunctions", data: { type: "<operation>" } })`.

Operations dispatched by `event.type`:

| Type | Action |
|---|---|
| `getOpenId` | Returns WeChat OpenId, AppId, UnionId via `cloud.getWXContext()` |
| `getMiniProgramCode` | Generates QR code via `cloud.openapi.wxacode.get`, uploads to cloud storage, returns fileID |
| `createCollection` | Creates `sales` collection in DB, seeds it with sample data (region/city/sales) |
| `selectRecord` | Returns all records from the `sales` collection |
| `updateRecord` | Iterates `event.data` array and updates each record's `sales` field by `_id` |
| `insertRecord` | Inserts a new document into `sales` with `region`, `city`, `sales` |
| `deleteRecord` | Removes a document from `sales` by `_id` |

## Key Architectural Patterns

### Frontend → Cloud Communication
All backend operations go through `wx.cloud.callFunction()`, never direct DB/API calls. The `env` value in `PRTSBoost/app.js` `globalData.env` determines which cloud environment receives the calls. If `env` is empty, the app shows an error modal when users tap features.

### Navigation & Routing
- Pages are registered in `PRTSBoost/app.json` under `pages`
- Navigation uses `wx.navigateTo()` with URL query parameters (e.g., `?envId=...&type=getOpenId`)
- The `example/index` page reads `options.type` in `onLoad` to determine which feature demo to render (each `type` maps to a `wx:if` block in the WXML)

### Component Pattern
Components follow the standard WeChat component structure (`.js` / `.json` / `.wxml` / `.wxss`). The `cloudTipModal` uses `properties` for parent-to-child data flow and `observers` to sync props to internal state. Components must be registered in the page's `.json` `usingComponents` field.

### Error Handling
The frontend catches two common cloud function errors and maps them to user-facing tips:
- `"Environment not found"` → Prompt to check `env` config in `app.js`
- `"FunctionName parameter could not be found"` → Prompt to deploy the cloud function

## Development Workflow

1. Open the project root in **WeChat DevTools** (微信开发者工具)
2. Set `env` in `PRTSBoost/app.js` to the target cloud environment ID (available from the Cloud Development console in DevTools)
3. To deploy cloud functions: right-click `cloudfunctions/quickstartFunctions/` → **上传并部署-云端安装依赖** (Upload and Deploy — Install Dependencies in Cloud)
4. The CLI alternative for deploying cloud functions uses the script at `uploadCloudFunction.sh`

## Configuration Notes

- `project.config.json` `miniprogramRoot` is set to `"PRTSBoost/"` — all mini program source is under this directory
- `cloudfunctionRoot` is set to `"cloudfunctions/"`
- ES6+ transpilation, PostCSS, and minification are enabled in the project settings
- The sitemap (`PRTSBoost/sitemap.json`) allows all pages to be indexed
- Tab size in editor settings: 2 spaces
