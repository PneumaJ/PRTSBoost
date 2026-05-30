# 对话上下文 — PrtsBoost 代肝选购助手（功能完善阶段）

## 📋 问题背景

### 项目信息
- **产品名称**：PrtsBoost（终末地代肝选购助手）
- **项目类型**：微信小程序（原生框架 WXML + WXSS + JS）
- **项目路径**：`D:\Pneuma\Workspace\PrtsBoost`
- **AppID**：`wx5b88d7ed73cfc759`
- **基础库**：2.20.1
- **技术栈**：微信小程序原生框架 + Cloud Development（云开发）
- **状态管理**：`getApp().globalData`（`cartItems`、`selectedPackageIds`）
- **数据源**：JavaScript 模块（`PrtsBoost/data/*.js`）
- **会话日期**：2026-05-30

### 目录结构（外层文件夹可任意重命名）
```
D:\Pneuma\Workspace\PrtsBoost\       ← 工作区根目录（含 project.config.json）
├── project.config.json                 ← miniprogramRoot: "PrtsBoost/"（相对路径）
├── PrtsBoost/                        ← 小程序源码根目录
│   ├── app.js                          # 全局状态
│   ├── app.json                        # 路由、TabBar、窗口配置
│   ├── app.wxss                        # 全局样式
│   ├── pages/
│   │   ├── packages/                   # 套餐页
│   │   ├── items/                      # 单项页
│   │   └── overview/                   # 总览页
│   ├── components/
│   │   ├── tree-node/                  # 树节点行
│   │   ├── cart-popup/                 # 购物车弹窗
│   │   └── image-preview/              # 图片预览
│   ├── utils/
│   │   ├── cart.js                     # 购物车逻辑
│   │   └── canvas-renderer.js          # Canvas 图片生成
│   └── data/                           # 数据模块
│       ├── packages.js                 # 5 个主推套餐
│       ├── items.js                    # 11 大类树形数据
│       └── overview.js                 # 14 条品类全包
└── cloudfunctions/                     # 云函数
```

> **注意**：外层 `PrtsBoost/` 文件夹为 WeChat DevTools 的 `miniprogramRoot`，可任意重命名。`project.config.json` 中所有路径均为相对路径，重命名后只需同步更新 `miniprogramRoot` 和 `srcMiniprogramRoot` 即可。

### 当前状态
项目处于 v1.0.2，核心架构已稳定。滚动性能、布局、数据一致性等所有已知问题已全部修复。最新更新：外层源码文件夹重命名为 `PrtsBoost/`、产品名称统一为"PrtsBoost"、Canvas 总计标注左对齐 + 价格居中、PRD 全文同步。

### 三页面结构
| 页面 | 路径 | 功能 |
|------|------|------|
| 套餐 | `PrtsBoost/pages/packages/` | 5 个主推优惠套餐（含变体切换、互斥逻辑） |
| 单项 | `PrtsBoost/pages/items/` | 11 大类三层树形 + 3 子模块 Tab（任务/探索/基建） |
| 总览 | `PrtsBoost/pages/overview/` | 品类全包优惠列表（仅全包优惠，套餐已移出） |

### 三组件
| 组件 | 路径 | 功能 |
|------|------|------|
| tree-node | `PrtsBoost/components/tree-node/` | 树节点行（展开/折叠/勾选/半选态/备注弹窗/按关数量） |
| cart-popup | `PrtsBoost/components/cart-popup/` | 购物车弹窗（分组/删除/数量调节/一键清空/生成图片） |
| image-preview | `PrtsBoost/components/image-preview/` | 图片预览（Canvas 2D + 滚动 + 长按保存） |

---

## 🔴 核心问题（本轮全部已解决）

### 1. 滚动性能 Bug
- **表现**：滚动到页面末端时卡顿，滚动条比例错误
- **根源**：页面级滚动 + `scroll-view` 双重滚动上下文冲突；`flex: 1` 未配合 `height: 0` 导致视口高度计算错误
- **修复**：
  - `app.wxss`：`page { height: 100%; overflow: hidden; }`
  - 三个页面 `.json`：添加 `"disableScroll": true`
  - 三个页面 `.wxss`：`.page-container` 改为 `height: 100%`；scroll-view 添加 `height: 0`
  - 所有 `scroll-view`：`enhanced="{{true}}" show-scrollbar="{{false}}" bounces="{{false}}"`

### 2. 总览页名称冲突 Bug
- **表现**：多个 `name: '全包'` 项（主线任务/全包、支线任务/全包等），购物车匹配混乱
- **修复**：`onLoad` 中分配唯一 `_uid`（`'catpkg_' + index`），匹配逻辑改用 `_uid` 替代 `name`
- **后续优化**：前 4 条数据合并为 `category: '任务'` + `name: '主线任务 全包'` 等，彻底消除重名

### 3. 图片预览布局 Bug
- **表现**：长图顶部被裁剪无法查看
- **根源**：`justify-content: center` + `overflow-y: auto` 导致溢出时顶部不可达
- **修复**：重写为 `flex column` + `scroll-view`（`flex: 1; height: 0`），图片宽度 92%，右上角固定关闭按钮

### 4. 图片预览 Tab 切换残留 Bug
- **表现**：在页面 A 生成图片后切换到页面 B，图片预览未关闭，导致购物车操作卡死
- **修复**：三个页面均添加 `onHide` → `setData({ showCart: false, showImagePreview: false })`

### 5. Canvas 总计与价格重叠
- **表现**："总计"标注与价格数值重叠
- **最终方案**："总计"标签左对齐（13px, x=24），价格数值居中（粗体 26px, x=width/2），分行，间距 22px

### 6. 汇总图过长（叶子节点过多）
- **表现**：单项选择多时汇总图列出所有叶子，图片过长
- **修复**：重写 `cart.js` `getGroupedItems`，已全选父节点（有全包价）折叠为单条 `{ name: '父节点名（全包）', price: 全包价 }`
- **新增**：`_findTopCategory` 辅助函数归入正确顶级大类

### 7. 外层源码文件夹重命名及硬编码路径清理
- **背景**：将外层源码文件夹从 `miniprogram/` 重命名为 `PrtsBoost/`，需同步更新所有写死 `miniprogram/` 路径的文件
- **影响范围**：6 个文件，共计约 50 处引用
- **修复**：
  - `project.config.json`：`miniprogramRoot` 和 `srcMiniprogramRoot` 从 `"miniprogram/"` → `"PrtsBoost/"`
  - `.claude/settings.local.json`：Bash 权限路径和 Node require 路径更新
  - `CLAUDE.md`：全部文档路径引用更新（7 处）
  - `PRD.md`：全部文档路径引用更新（10 处）
  - `对话上下文-PrtsBoost-功能完善阶段.md`：全部路径引用更新（约 30 处）
  - `PrtsBoost/components/cloudTipModal/index.wxml`：注释路径更新
- **保留不动的引用**：
  - `miniprogramRoot` / `compileType: "miniprogram"` — WeChat 配置键名，非路径
  - `getMiniProgramCode` — API 方法名
  - `developers.weixin.qq.com/miniprogram/...` — 微信官方文档 URL

---

## 🎯 实现目标

### 主要目标
- 构建可浏览、勾选、定价游戏代肝服务的微信小程序
- 实时计算总价并导出汇总图片
- 三页面：套餐（一键全包）+ 单项（灵活搭配）+ 总览（全局视角）

### 核心功能要求
- 购物车全局状态共享，跨页面双向同步
- **套餐互斥**：套餐 1-4 可多选，套餐 5 与 1-4 互斥
- **全包优惠价**：父节点下所有叶子全选时使用优惠价（深度优先算法）
- **按关计价**：`isPerUnit` 叶子显示 `单价 × 数量`，其父节点不适用全包价
- 所有节点默认折叠；备注小字内联显示、底端对齐、过长短省略号、点击弹窗
- 无价格的非叶子节点不显示勾选框
- 产品名称统一为"PrtsBoost"

---

## 🔧 技术约束

### 必须遵守（微信小程序硬约束）
- 不能使用 HTML tag（`div`/`span`/`input` 等）或 DOM API
- 使用 WXML / WXSS / rpx 单位
- 新页面必须注册到 `app.json` `pages` 数组
- 组件必须注册到消费页面的 `.json` `usingComponents`
- 前端→云通信必须通过 `wx.cloud.callFunction()`
- 全局状态通过 `getApp().globalData` 管理
- `this.setData()` 更新 UI，禁止直接修改 `this.data`

### 关键文件
| 文件 | 核心内容 |
|------|---------|
| `PrtsBoost/utils/cart.js` | 购物车全部逻辑（增删改查、全包价、分组折叠、互斥、数量调节） |
| `PrtsBoost/utils/canvas-renderer.js` | Canvas 2D 图片生成（calcHeight + render） |
| `PrtsBoost/data/items.js` | 11 大类树形数据（工厂函数 cat/sub/leaf/perUnitLeaf） |
| `PrtsBoost/data/packages.js` | 5 个主推套餐（含变体 variant） |
| `PrtsBoost/data/overview.js` | 14 条品类全包数据 |
| `PrtsBoost/components/tree-node/` | 树节点组件（observer + refreshStamp 强制刷新） |
| `PrtsBoost/components/cart-popup/` | 购物车弹窗 |
| `PrtsBoost/components/image-preview/` | 图片预览 |
| `PrtsBoost/app.js` | 全局状态初始化 |

---

## 🚫 已尝试的失败方案

### 1. Observer 单属性字符串 `'checkedIds': 'updateState'`
- **失败原因**：`this.properties` 在 observer 触发时可能尚未更新
- **修复**：改用 `observers` 块，通过函数参数接收最新值

### 2. `collectLeaves` 缺少 `isLeaf: true`（致命 Bug，影响全局）
- **表现**：父节点全选后所有子节点不可取消、购物车数量+但无内容/价格
- **根因**：`checkedIds` 过滤 `item.isLeaf`，`getCartTotal`/`getGroupedItems` 同样依赖此字段
- **修复**：一行代码 `var leaf = { ..., isLeaf: true };`

### 3. 购物车数组直接传递（不 `.slice()`）
- **表现**：购物车变更后弹窗不刷新
- **根因**：WeChat observer 按引用比较，`push/splice` 不触发
- **修复**：所有页面传递 `cartItems.slice()`

### 4. 总览页按 `name` 匹配购物车项
- **表现**：多个项共享 `name: '全包'`，匹配到错误项
- **修复**：使用唯一 `_uid`（`'catpkg_' + index`）

### 5. 图片预览 `justify-content: center` + `overflow-y: auto`
- **表现**：内容溢出时顶部被裁切，无法滚动查看
- **修复**：改用 `scroll-view` + `flex: 1; height: 0`

---

## ✅ 当前方案/最终方案

### 状态管理架构
```
app.globalData.cartItems[]           ← 唯一真相源
         ↓
  cart.js 纯函数操作                  ← addItem / removeItem / addLeaves / removeLeaves / updateQuantity / clearCart
         ↓
  各页面 onShow / syncFromGlobal     ← 拉取最新状态
         ↓
  页面 setData 传递 .slice()         ← 新引用触发组件 observer
         ↓
  子组件 observer 函数参数接收        ← 可靠的最新值
```

### 全包价计算（`getCartTotal`）
1. `_collectPricedGroups` 收集所有有价格的非叶子节点（深度降序）
2. 跳过含 `isPerUnit` 叶子的节点
3. 从最深层级检测：父节点下所有叶子均在购物车 → 使用全包优惠价
4. 已全选叶子从计费集合移除，避免重复

### 汇总折叠（`getGroupedItems`）
1. 与 `getCartTotal` 共用 `_collectPricedGroups` 深度优先检测
2. 全选父节点替换为 `{ name: '父节点名（全包）', price: 全包价 }`
3. `_findTopCategory` 归入正确顶级大类
4. 剩余未折叠叶子按大类正常分组

### 组件通信模式
- `refreshStamp: Date.now()` — 时间戳变化强制 tree-node 全部重算
- `checkedIds` — 仅含 `isLeaf` 的 cart 项 ID
- `expandedIds` — 页面级管理，初始 `[]`（全部折叠）

### 文件夹命名约定
- 外层源码文件夹名与 `project.config.json` 中 `miniprogramRoot` 值保持一致
- 将文件夹从 `miniprogram/` 重命名为 `PrtsBoost/` 后，需同步更新以下文件中的硬编码路径：
  - `project.config.json` — `miniprogramRoot`、`srcMiniprogramRoot`
  - `.claude/settings.local.json` — Bash 权限路径、Node require 路径
  - `CLAUDE.md`、`PRD.md`、`对话上下文*.md` — 文档中的路径引用
- `miniprogramRoot` 是 WeChat DevTools 配置键名，始终保留不修改
- 微信官方文档 URL（`developers.weixin.qq.com/miniprogram/...`）保持不变

---

## 📝 关键代码变更

### `PrtsBoost/utils/cart.js`
- `collectLeaves`：`isLeaf: true`（修复致命 bug）
- `getGroupedItems`：全选父节点折叠逻辑
- `_findTopCategory`：查找节点所属顶级大类（新增）
- `getCartTotal`：全包价多层级计算
- `_collectPricedGroups` / `_hasPerUnitLeaf`：辅助检测
- `addItem`：套餐互斥（5 互斥 1-4）
- `removeItem`：cartId + fallbackId 双重匹配
- `updateQuantity`：按关计价 +/−
- `clearCart`：清空购物车及 selectedPackageIds

### `PrtsBoost/components/tree-node/`
- **JS**：`observers` 块 + 函数参数 → `_applyState(node, checkedIds, expandedIds)`
- **JS**：`showCheckbox = node.isLeaf || node.price != null || node.isPerUnit`
- **JS**：`onReqTap` → 自定义毛玻璃 modal
- **WXML**：内联 `<text>` 元素（无 scroll-view），baseline 对齐
- **WXML**：备注 `text-overflow: ellipsis` + 点击弹窗
- **WXML**：按关计价数量控件（`−` `数量` `+`）
- **WXSS**：`.tn-info { align-items: baseline }`；`.tn-req-inline { overflow: hidden; text-overflow: ellipsis; white-space: nowrap }`
- **WXSS**：`.tn-req-overlay/modal` 毛玻璃弹窗

### `PrtsBoost/components/cart-popup/`
- **WXML**：`enhanced scroll-view` + 清空按钮 + 分组列表 + 数量调节
- **JS**：`onClearAll` → `wx.showModal` 确认
- **JS**：`observers: { 'cartItems': refresh, 'show': refresh }`
- **WXSS**：精简 padding

### `PrtsBoost/components/image-preview/`
- **WXML**：固定右上角 ✕ + `scroll-view` 包围图片
- **WXSS**：移除 `justify-content: center`，`flex column` + `flex: 1; height: 0`
- **JS**：Canvas 2D → `wx.canvasToTempFilePath` → `<image>`

### `PrtsBoost/utils/canvas-renderer.js`
- 标题：`"PrtsBoost — 选购清单"`
- 总计：标签左对齐（13px, x=24）+ 价格居中（粗体 26px, x=width/2），分行，间距 22px
- `calcHeight`：groupCount + totalItems 动态计算
- 长名称自动截断 + 省略号

### `PrtsBoost/pages/items/`
- **JS**：`CAT_MODULE` 映射（11 大类 → 任务/探索/基建）
- **JS**：`_applyTabFilter()` → `tabRoots`
- **JS**：`expandedIds = []`（默认全部折叠）
- **JS**：`onHide` 关闭弹窗
- **WXML**：3 Tab 标签 + `refreshStamp` 传递
- **WXSS**：Tab 栏样式 + `height: 0` scroll-view

### `PrtsBoost/pages/packages/`
- **JS**：`onAddPackage` 使用 `cart.addItem`（含互斥）
- **JS**：`onVariantChange` → remove + re-add
- **JS**：`onHide` 关闭弹窗

### `PrtsBoost/pages/overview/`
- **JS**：仅保留全包优惠（移除套餐 Tab）
- **JS**：`_uid` 唯一 ID 匹配 + 预计算 `isSelected`
- **JS**：`onHide` 关闭弹窗
- **WXML**：单列表（无 Tab 栏）
- **WXSS**：`height: 0` scroll-view

### `PrtsBoost/data/overview.js`
- 前 4 条合并：`category: '任务'`，`name: '主线任务 全包'` 等
- 共 14 条品类全包

### `PrtsBoost/app.*`
- **app.wxss**：`page { height: 100%; overflow: hidden; }` + CSS 变量 + 悬浮购物车按钮
- **app.json**：导航栏标题 `"PrtsBoost"`，TabBar 套餐/单项/总览
- **app.js**：全局 cartItems/selectedPackageIds 初始化

### 配置文件（文件夹重命名）
- **project.config.json**：`miniprogramRoot: "PrtsBoost/"`、`srcMiniprogramRoot: "PrtsBoost/"`
- **.claude/settings.local.json**：Bash 权限路径 `Workspace\\PrtsBoost`、Node require 路径 `./PrtsBoost/data/items`

---

## 🎯 当前进度

### 已完成（24 项）
- [x] 三页面基础框架 + TabBar
- [x] 树形组件（展开/折叠/勾选/半选态/备注弹窗/按关数量）
- [x] 购物车弹窗（分组/删除/数量调节/一键清空/总价）
- [x] Canvas 2D 图片生成 + 全屏预览 + 滚动
- [x] 全包优惠价多层级计算（深度优先）
- [x] 套餐互斥逻辑（1-4 多选，5 互斥 1-4）
- [x] 变体切换（套餐 3/4 默认/不含全收集）
- [x] 单项页 3 模块 Tab（任务/探索/基建）
- [x] 总览页全包优惠列表（唯一 ID 匹配）
- [x] 按关计价数量调节
- [x] 备注内联显示 + 毛玻璃弹窗
- [x] 跨页面购物车状态同步
- [x] 滚动性能优化（enhanced + disableScroll + height:0）
- [x] 图片预览滚动 + 固定关闭按钮
- [x] Tab 切换自动关闭弹窗（onHide）
- [x] Canvas 总计（标签左对齐 + 价格居中）
- [x] 汇总折叠（全选父节点省略子节点）
- [x] 产品名称统一"PrtsBoost"
- [x] 总览数据合并（任务大类统一）
- [x] 购物车底部留白缩减
- [x] 外层文件夹可重命名验证
- [x] PRD 全文同步更新
- [x] 对话上下文文档（本文档）
- [x] 外层源码文件夹重命名 + 硬编码路径清理（miniprogram/ → PrtsBoost/，6 个文件约 50 处引用）

### 待处理
| 优先级 | 内容 |
|--------|------|
| 高 | 探索类互斥 UI 提示（基础 vs 至尊同区域二选一） |
| 中 | 全包优惠对比提示（"单买总和 vs 全包价，节省 XXr"） |
| 中 | 一键全选某大类快捷操作 |
| 低 | 购物车角标细化（套餐数/单项数分别统计） |
| 低 | 功能任务品类补充或移除 |

---

## 💡 使用方法

### 开发环境
1. 微信开发者工具打开 `D:\Pneuma\Workspace\PrtsBoost`
2. 在 `PrtsBoost/app.js` 中配置 `env`（云开发环境 ID）
3. 部署云函数：右键 `cloudfunctions/quickstartFunctions/` → 上传并部署-云端安装依赖

### 日常开发注意事项
| 规则 | 说明 |
|------|------|
| **数组传组件** | 始终使用 `.slice()` 创建新引用 |
| **scroll-view 高度** | 始终 `flex: 1; height: 0` 模式 |
| **页面滚动** | 每个页面 `.json` 需 `"disableScroll": true` |
| **新增页面/组件** | 必须在 `app.json` / 页面 `.json` 注册 |
| **修改数据** | 同步更新 `data/*.js` 和对应 MD 参考文件 |
| **购物车操作** | 始终通过 `cart.js` 工具函数，不直接操作 `globalData` |
| **tree-node 刷新** | 设置 `refreshStamp: Date.now()` |
| **外层文件夹** | 可任意重命名，不影响项目 |

---

## 🐛 已知问题

1. **探索类互斥无提示**：同一区域"基础探索"和"至尊探索"二选一，无 UI 提醒
2. **1.2 下半新增品类**：部分项目与主数据重复（"再引春来系列"也在支线任务中）
3. **功能任务品类**：无实际可选项，作为占位展示
4. **Canvas 中文字体**：`ctx.font` 使用 `sans-serif`，部分设备可能回退

---

## 🚀 下一步计划

1. **探索类互斥 UI 提示**：同区域二选一醒目提醒
2. **全包优惠对比**：显示节省金额
3. **一键全选大类**：快捷操作按钮
4. **购物车角标细化**：分类统计

---

## 📝 备注

### 关键经验
- WeChat observer 优先用 `observers` 块 + 函数参数，避免 `this.properties` 时序问题
- `height: 0` + `flex: 1` 是 scroll-view 万能修复模式
- `.slice()` 是解决数组引用 observer 不触发的最简方案
- `isLeaf: true` 遗漏一行导致全局性 bug — 所有下游逻辑均依赖此字段
- 文件夹重命名后需同步更新 `project.config.json`（`miniprogramRoot` + `srcMiniprogramRoot`）和所有文档中的硬编码路径，URL 和配置键名保持不变

### 关键修复（一行代码）
```js
// cart.js collectLeaves — 修复全局购物车 bug
var leaf = { id: node.id, price: node.price || 0, name: node.name, isLeaf: true };
```

### 参考文件
- PRD：`D:\Pneuma\Workspace\PrtsBoost\PRD.md`
- 原始数据：`终末地代肝_主推套餐.md` / `终末地代肝_任务探索基建.md` / `终末地代肝_价格总览.md`

---

## 📋 变更日志

| 日期 | 变更 |
|------|------|
| 2026-05-30 | 滚动修复（enhanced + disableScroll + height:0） |
| 2026-05-30 | 总览页名称冲突修复（_uid 唯一 ID） |
| 2026-05-30 | 图片预览重写（scroll-view + 固定关闭按钮） |
| 2026-05-30 | onHide 生命周期清理弹窗 |
| 2026-05-30 | 购物车留白缩减 |
| 2026-05-30 | 汇总折叠逻辑（getGroupedItems 重写 + _findTopCategory） |
| 2026-05-30 | 总览数据合并（category→"任务"，name 包含原名） |
| 2026-05-30 | 产品名称"PrtsBoost"统一（页面/导航栏/Canvas/PRD/app.json） |
| 2026-05-30 | Canvas 总计标签左对齐 + 价格居中（分行，22px 间距） |
| 2026-05-30 | 外层文件夹重命名为 PrtsBoost + 硬编码路径清理（project.config.json / CLAUDE.md / PRD.md / settings.local.json 等 6 个文件） |
| 2026-05-30 | 外层文件夹重命名验证（相对路径，可任意改名） |
