# 对话上下文 — PRTSBoost 代肝选购助手（功能完善阶段）

## 📋 问题背景

### 项目信息
- **产品名称**：PRTSBoost（终末地代肝选购助手）
- **项目类型**：微信小程序（原生框架 WXML + WXSS + JS）
- **项目路径**：`D:\Pneuma\Workspace\PRTSBoost`
- **AppID**：`wx5b88d7ed73cfc759`
- **基础库**：2.20.1
- **技术栈**：微信小程序原生框架 + Cloud Development（云开发）
- **状态管理**：`getApp().globalData`（`cartItems`、`selectedPackageIds`）
- **数据源**：JavaScript 纯对象模块 + loader 统一加载（`PRTSBoost/data/*.js`）
- **数据格式**：`module.exports = [...]` 声明式纯对象（无工厂函数），可直接编辑
- **会话日期**：2026-06-06

### 目录结构（外层文件夹可任意重命名）
```
D:\Pneuma\Workspace\PRTSBoost\       ← 工作区根目录（含 project.config.json）
├── project.config.json                 ← miniprogramRoot: "PRTSBoost/"（相对路径）
├── PRTSBoost/                        ← 小程序源码根目录
│   ├── app.js                          # 全局状态
│   ├── app.json                        # 路由、TabBar、窗口配置
│   ├── app.wxss                        # 全局样式
│   ├── pages/
│   │   ├── packages/                   # 套餐页
│   │   ├── items/                      # 单项页
│   │   ├── overview/                   # 总览页
│   │   └── entrust/                    # 托管页
│   ├── components/
│   │   ├── tree-node/                  # 树节点行
│   │   ├── cart-popup/                 # 购物车弹窗
│   │   └── image-preview/              # 图片预览
│   ├── utils/
│   │   ├── cart.js                     # 购物车逻辑
│   │   └── canvas-renderer.js          # Canvas 图片生成
│   └── data/                           # 数据模块
│       ├── loader.js                   # 统一加载器（O(1) nodeMap）
│       ├── packages.js                 # 5 个主推套餐
│       ├── items.js                    # 12 大类树形数据
│       ├── overview.js                 # 14 条品类全包
│       └── entrust.js                  # 3 档托管套餐
└── cloudfunctions/                     # 云函数
```

> **注意**：外层 `PRTSBoost/` 文件夹为 WeChat DevTools 的 `miniprogramRoot`，可任意重命名。`project.config.json` 中所有路径均为相对路径，重命名后只需同步更新 `miniprogramRoot` 和 `srcMiniprogramRoot` 即可。

### 当前状态
项目处于 v1.0.3，核心架构已稳定。最新更新：新增"1.3新增"品类（9 项）+ 版本标签、托管独立页面（三档互斥对比卡片 `entrust.js`）、进阶探索类 ID 规范化、Items 页 4 Tab（新增在最右）、TabBar 4 标签（套餐 | 单项 | 总览 | 托管）。

### 四页面结构
| 页面 | 路径 | 功能 |
|------|------|------|
| 套餐 | `PRTSBoost/pages/packages/` | 5 个主推优惠套餐（含变体切换、互斥逻辑） |
| 单项 | `PRTSBoost/pages/items/` | 12 大类三层树形 + 4 子模块 Tab（任务/探索/基建/新增） |
| 总览 | `PRTSBoost/pages/overview/` | 品类全包优惠列表（仅全包优惠，套餐已移出） |
| 托管 | `PRTSBoost/pages/entrust/` | 三档互斥托管套餐（日托/体托/精托）对比卡片 |

### TabBar 顺序
套餐 | 单项 | 总览 | 托管

### 三组件
| 组件 | 路径 | 功能 |
|------|------|------|
| tree-node | `PRTSBoost/components/tree-node/` | 树节点行（展开/折叠/勾选/半选态/备注弹窗/按关数量） |
| cart-popup | `PRTSBoost/components/cart-popup/` | 购物车弹窗（分组/删除/数量调节/一键清空/生成图片） |
| image-preview | `PRTSBoost/components/image-preview/` | 图片预览（Canvas 2D + 滚动 + 长按保存） |

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
- **背景**：将外层源码文件夹从 `miniprogram/` 重命名为 `PRTSBoost/`，需同步更新所有写死 `miniprogram/` 路径的文件
- **影响范围**：6 个文件，共计约 50 处引用
- **修复**：
  - `project.config.json`：`miniprogramRoot` 和 `srcMiniprogramRoot` 从 `"miniprogram/"` → `"PRTSBoost/"`
  - `.claude/settings.local.json`：Bash 权限路径和 Node require 路径更新
  - `CLAUDE.md`：全部文档路径引用更新（7 处）
  - `PRD.md`：全部文档路径引用更新（10 处）
  - `对话上下文-PRTSBoost-功能完善阶段.md`：全部路径引用更新（约 30 处）
  - `PRTSBoost/components/cloudTipModal/index.wxml`：注释路径更新
### 8. 目录重命名未实际执行（启动失败）
- **表现**：WeChat DevTools 无法启动项目，找不到源码文件
- **根源**：上一轮只修改了配置文件中的路径引用（`project.config.json`、文档等），但**文件系统上的 `miniprogram/` 目录从未被重命名为 `PRTSBoost/`**。配置指向 `PRTSBoost/` 而磁盘上目录仍是 `miniprogram/`，DevTools 找不到源码
- **修复**：`mv miniprogram PRTSBoost` 实际执行重命名
- **教训**：文档记录≠已执行，配置修改后必须验证文件系统状态一致性

### 9. Git 环境缺漏
- **表现**：`ssh -T git@github.com` 报 `Host key verification failed`，无法推送
- **根源**：`~/.ssh/known_hosts` 文件不存在，SSH 无法验证 GitHub 主机密钥
- **修复**：`ssh-keyscan github.com >> ~/.ssh/known_hosts`
- **后续**：`git init` + 创建 `.gitignore` + `git remote add origin git@github.com:PneumaJ/PRTSBoost.git` + 初始提交 + 推送 83 个文件

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
- 产品名称统一为"PRTSBoost"

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
| `PRTSBoost/utils/cart.js` | 购物车全部逻辑（增删改查、全包价、分组折叠、互斥、数量调节、**子类汇总合并**） |
| `PRTSBoost/utils/canvas-renderer.js` | Canvas 2D 图片生成（calcHeight + render） |
| `PRTSBoost/data/loader.js` | **统一数据加载器** — require 四个数据文件 + buildTree + O(1) nodeMap |
| `PRTSBoost/data/items.js` | **纯对象声明** — 12 大类树形数据（`module.exports = [...]`，可直接编辑） |
| `PRTSBoost/data/packages.js` | **纯对象声明** — 5 个主推套餐（含变体 variant） |
| `PRTSBoost/data/overview.js` | **纯对象声明** — 14 条品类全包数据 |
| `PRTSBoost/data/entrust.js` | **纯对象声明** — 3 档托管套餐（日托/体托/精托，含特性对比） |
| `PRTSBoost/pages/entrust/` | 托管页（三档卡片对比 + 互斥选择） |
| `PRTSBoost/components/tree-node/` | 树节点组件（observer + refreshStamp + **统一 info modal**） |
| `PRTSBoost/components/cart-popup/` | 购物车弹窗 |
| `PRTSBoost/components/image-preview/` | 图片预览 |
| `PRTSBoost/app.js` | 全局状态初始化 |

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

### 6. JSON 文件作为数据模块（2026-06-06 新增）
- **表现**：items.js / packages.js / overview.js 迁移为 .json 文件后，所有页面渲染空白
- **根因**：WeChat 小程序 `require()` 不支持 `.json` 文件作为数据模块加载，仅支持 `.js` 的 `module.exports`
- **修复**：保持 `.js` 后缀，使用 `module.exports = [...]` 纯对象声明（无工厂函数），loader.js 统一 `require` 并构建树结构

### 7. 购物车项 baseline 对齐（2026-06-06 新增，已废弃）
- **表现**：`.cp-item`/`.cp-item-info`/`.cp-item-right` 设为 `align-items: baseline` + 文字 `line-height: 1`，名称和价格未对齐
- **根因**：`baseline` 对齐的是文字基线，中文字体在不同字重下基线位置存在微小偏差，视觉上不对齐

### 8. 购物车项 center + line-height:1 对齐（2026-06-06 新增，已废弃）
- **表现**：所有 flex 容器改为 `align-items: center` + 文字保持 `line-height: 1`，红色小字(24rpx)与名称(28rpx)仍未对齐
- **根因**：`line-height: 1` 使各文字盒子高度=字号，不同字号盒子高度不同（名称28rpx、红色小字24rpx），flex `center` 居中盒子而非文字，视觉偏差 2rpx
- **修复**：统一 `line-height: 28rpx`（最大字号），所有文字盒子等高，`center` 对齐生效

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
3. `_findTopCategory` 归入正确顶级大类（首次调用构建 leafId→categoryName 缓存）
4. **剩余叶子按子类汇总**：分组累加价格，折叠为 `{ name: 子类名, price: 汇总价, _summary: true }` 单条，不展示第三级叶子

### 组件通信模式
- `refreshStamp: Date.now()` — 时间戳变化强制 tree-node 全部重算
- `checkedIds` — 仅含 `isLeaf` 的 cart 项 ID
- `expandedIds` — 页面级管理，初始 `[]`（全部折叠）

### 文件夹命名约定
- 外层源码文件夹名与 `project.config.json` 中 `miniprogramRoot` 值保持一致
- 将文件夹从 `miniprogram/` 重命名为 `PRTSBoost/` 后，需同步更新以下文件中的硬编码路径：
  - `project.config.json` — `miniprogramRoot`、`srcMiniprogramRoot`
  - `.claude/settings.local.json` — Bash 权限路径、Node require 路径
  - `CLAUDE.md`、`PRD.md`、`对话上下文*.md` — 文档中的路径引用
- `miniprogramRoot` 是 WeChat DevTools 配置键名，始终保留不修改
- 微信官方文档 URL（`developers.weixin.qq.com/miniprogram/...`）保持不变

### 数据架构：纯对象声明 + Loader 统一加载（2026-06-06 新增）
- **迁移背景**：原数据文件使用工厂函数（`cat()`/`sub()`/`leaf()`/`perUnitLeaf()`）构建树结构，难以直接编辑
- **目标**：将数据文件变为"可修改的配置文件"，非技术人员也能增删改数据，同时保持零性能损失
- **方案**：`items.js`/`packages.js`/`overview.js`/`entrust.js` 均改为 `module.exports = [...]` 纯对象声明（无工厂函数包装）
- **Loader 层**：新建 `PRTSBoost/data/loader.js`（~80 行）统一加载四个数据文件，编译期完成 `buildTree()` 和 O(1) `nodeMap` 构建，同时为 entrust tiers 注入 `_hasFeature`
- **导出**：`treeRoots`、`packages`、`overview`、`entrustTiers`、`entrustAllFeatures`、`entrustNotes`、`nodeMap`、`getNode(id)`
- **消费方变更**：所有页面从 `require('../../data/items')` 改为 `require('../../data/loader')`，数据访问从 `treeData` 改为 `loader.treeRoots`，ID 查找从递归 `_findNode()` 改为 O(1) `loader.getNode(id)`
- **entrustTiers**：`loader.js` 在构建时为每个 tier 注入 `_hasFeature` 查找集合（`{ '日活': true, ... }`），供 WXML 模板判断 ✓/—
- **失败方案（已废弃）**：JSON 文件 `module.exports` — WeChat 小程序 `require()` 不支持 `.json` 文件作为数据模块加载，所有页面渲染空白
- **性能保证**：`nodeMap` 在模块加载时一次性构建（`require` 缓存），后续访问 O(1)；`buildTree()` 仅在初始化执行一次
- **编辑体验**：`items.js` 为纯嵌套对象数组，直接添加/修改 `{ id, name, price, children }` 节点即可，无需调用工厂函数

---

## 📝 关键代码变更

### `PRTSBoost/utils/cart.js`
- `collectLeaves`：`isLeaf: true`（修复致命 bug）+ 模块级 `_leafCache` 缓存
- `getGroupedItems`：全选父节点折叠逻辑 + **前两级价格汇总**（剩余叶子按子类分组累加价格，`_summary: true`）
- **子类汇总合并修复**：`subCollapsedMap`（process_group 全包价）汇入 `subSumMap`（直接叶子汇总），避免同一子类出现两条记录
- `_findTopCategory`：查找节点所属顶级大类 + **leafId→categoryName 缓存**（首次构建，后续 O(1)）
- `getCartTotal`：全包价多层级计算
- `_collectPricedGroups` / `_hasPerUnitLeaf`：辅助检测
- `addItem`：套餐互斥（5 互斥 1-4）+ **pickerMax 默认数量**
- `removeItem`：cartId + fallbackId 双重匹配
- `updateQuantity`：按关计价 +/−
- `clearCart`：清空购物车及 selectedPackageIds
- `addLeaves`：**pickerMax 默认数量**
- `addItem`：**托管互斥**（选择托管时移除购物车中其他 `entrust` 类型项）
- `getCartTotal`：**托管价格计入**（`entrust` 类型直接加 `item.price`）
- `getGroupedItems`：**托管分组**（`entrust` 类型归入"托管"组）

### `PRTSBoost/data/loader.js`（新建 ~70 行—2026-06-06）
- `require` 三个纯对象数据文件（items.js / packages.js / overview.js）
- `buildTree(nodes, depth)` 递归构建树结构，按深度分配 `type`（category/subcategory/process_group/leaf）
- 构建期间同步填充 O(1) `nodeMap` 平铺 ID→Node 映射
- packages/overview 添加 `type` 字段（`'package'` / `'category_package'`）
- 导出：`treeRoots`、`packages`、`overview`、`nodeMap`、`getNode(id)`
- 替代了原先分散在 items/packages/overview 页面中的 `_buildNodeMap()` 和 `_findNode()` 方法

### `PRTSBoost/components/tree-node/`
- **JS**：`observers` 块 + 函数参数 → `_applyState(node, checkedIds, expandedIds)`
- **JS**：`showCheckbox = node.isLeaf || node.price != null || node.isPerUnit`
- **JS**：`onInfoTap` → **统一信息弹窗**（显示备注 + 说明）
- **JS**：**picker 模式** — `usePicker`/`pickerOptions`/`pickerValue`，`onQtyPick` 处理选择变更
- **WXML**：内联 `<text>` 元素（无 scroll-view），baseline 对齐
- **WXML**：**统一 `.tn-note-inline`** — `requirement`（带括号）和 `content`（不带括号）均使用黄色省略号样式 + `catchtap="onInfoTap"`
- **WXML**：**统一 `.tn-info-overlay/modal`** — 弹窗 body 分两个 section：备注（`node.requirement`）+ 说明（`node.content`），各有标签
- **WXML**：按关计价数量控件（`−` `数量` `+`）+ **picker 下拉选择框**（"关"字在外）
- **WXSS**：`.tn-info { align-items: baseline }`；`.tn-note-inline { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #E5A100 }`
- **WXSS**：`.tn-info-overlay/modal` 毛玻璃弹窗 + `.tn-info-modal-section/label` 分区样式
- **WXSS**：**`.tn-row` 背景 `rgba(255,255,255,0.85)` 半透明**

### `PRTSBoost/components/cart-popup/`
- **WXML**：`enhanced scroll-view` + 清空按钮 + 分组列表 + 数量调节
- **WXML**：**汇总项隐藏删除按钮和数量控件**（`!item._summary`）
- **WXML**：**cp-footer 添加 prts.jpg 背景图**（absolute 定位，opacity 0.08）
- **JS**：`onClearAll` → `wx.showModal` 确认
- **JS**：`observers: { 'cartItems': _deferredRefresh, 'show': _deferredRefresh }` — **防抖合并**
- **WXSS**：精简 padding + **`.cp-panel/.cp-item/.cp-footer` 背景 `rgba(255,255,255,0.92)` 半透明**
- **WXSS**：**购物车项对齐方案**（最终）：`.cp-item`/`.cp-item-info`/`.cp-item-right` 全部 `align-items: center`，`.cp-item-name`/`.cp-item-variant`/`.cp-item-summary-tag`/`.cp-item-price` 统一 `line-height: 28rpx`（不同字号盒子等高，视觉居中一致）

### `PRTSBoost/components/image-preview/`
- **WXML**：固定右上角 ✕ + `scroll-view` 包围图片
- **WXSS**：移除 `justify-content: center`，`flex column` + `flex: 1; height: 0`
- **JS**：Canvas 2D → `wx.canvasToTempFilePath` → `<image>`
- **JS**：`generateImage` 异步加载 prts.jpg（`canvas.createImage()`），加载失败则跳过 Logo
- **JS**：**`getGroupedItems` 统一计算一次**，传入 `calcHeight` + `render` 共用

### `PRTSBoost/utils/canvas-renderer.js`
- 标题：`"PRTSBoost — 选购清单"`
- 总计：标签左对齐（13px, x=24）+ 价格居中（粗体 26px, x=width/2），分行，间距 22px
- `calcHeight`：**改为接收 `groupedItems` 参数**，避免重复计算
- 长名称自动截断 + 省略号
- **prts.jpg 底部衬底**：分隔线以下区域绘制背景图，`width` 等宽，底部对齐，`globalAlpha = 0.10`

### `PRTSBoost/pages/items/`
- **JS**：`require('../../data/loader')` 替代 `require('../../data/items')`
- **JS**：`loader.treeRoots` 替代 `treeData`，`loader.getNode(id)` 替代 `_findNode()`（O(1)）
- **JS**：移除 `_buildNodeMap()` 和 `_findNode()` 方法（逻辑已移至 loader.js）
- **JS**：`CAT_MODULE` 映射（10 大类 → 任务/探索/基建），移除 `cat_functional`
- **JS**：`_applyTabFilter()` → `tabRoots`
- **JS**：`expandedIds = []`（默认全部折叠）
- **JS**：`onHide` 关闭弹窗
- **JS**：**`_computeFlatList` expandedIds + currentTab 缓存**
- **JS**：**`onToggleExpand` 合并 setData**（expandedIds + flatList 一次渲染）
- **WXML**：3 Tab 标签 + `refreshStamp` 传递
- **WXSS**：Tab 栏样式 + `height: 0` scroll-view + **`.tab-bar` 背景半透明**

### `PRTSBoost/pages/packages/`
- **JS**：`onAddPackage` 使用 `cart.addItem`（含互斥）
- **JS**：`onVariantChange` → remove + re-add
- **JS**：`onHide` 关闭弹窗
- **WXSS**：**`.pkg-card` 背景 `rgba(255,255,255,0.85)` 半透明**

### `PRTSBoost/pages/overview/`
- **JS**：仅保留全包优惠（移除套餐 Tab）
- **JS**：`_uid` 唯一 ID 匹配 + 预计算 `isSelected`
- **JS**：`onHide` 关闭弹窗
- **WXML**：单列表（无 Tab 栏）
- **WXSS**：`height: 0` scroll-view + **`.ov-row` 背景 `rgba(255,255,255,0.85)` 半透明**

### `PRTSBoost/pages/entrust/`（2026-06-06 新建）
- **JS**：`onSelectEntrust` 互斥选择（点击已选=取消，点击未选=替换）
- **JS**：`syncFromGlobal` 从购物车同步 `selectedEntrustId`
- **WXML**：三张对比卡片（名称 + 单价 + 8 项特性 2 列网格 ✓/—）+ 备注区域
- **WXSS**：选中卡片红色边框 + 淡红背景，已包含特性红色 ✓，未包含灰色 —

### `PRTSBoost/data/entrust.js`（2026-06-06 新建）
- **纯对象声明**：`module.exports = { allFeatures, tiers, notes }`
- **3 个 tier**：`entrust_day`(48r)、`entrust_standard`(68r)、`entrust_premium`(128r)
- **allFeatures**：8 项完整特性列表供模板遍历
- **`_hasFeature`**：loader.js 构建时注入，O(1) 查找

### `PRTSBoost/pages/items/` 版本标签 + 新增 Tab
- **JS**：`versionLabel` 取自 `loader.getNode('cat_new').content`
- **WXML**：`page-title-row` 内 `<text class="page-version">` 显示版本（小字灰色半透明）
- **WXML**：版本标签传给 `image-preview` 组件
- **WXML**：4 Tab 顺序：任务 | 探索 | 基建 | 新增（新增在最右）

### `PRTSBoost/utils/canvas-renderer.js` 版本标签
- `render()` 签名新增 `versionLabel` 参数
- 日期格式精确到秒（`HH:mm:ss`）
- 日期下一行绘制版本标签（11px, rgba(153,153,153,0.5)）
- `calcHeight`：版本行高度 +21px

### `PRTSBoost/data/overview.js`
- 前 4 条合并：`category: '任务'`，`name: '主线任务 全包'` 等
- 共 14 条品类全包

### `PRTSBoost/data/items.js`
- **格式变更**：工厂函数 `cat()/sub()/leaf()` → 纯对象数组 `module.exports = [...]`
- **品类数量**：12 大类（+`cat_explore_advanced` 进阶探索、+`cat_new` 1.3新增，−`cat_functional` 功能任务）
- **CAT_MODULE** 映射：task(5) | explore(3) | infra(2) | new_content(1)，共 11 条映射（含 `cat_explore_advanced`）
- **密境行者**："二阶段" → "第二阶段"；`leaf_mijing_1` `pickerMax: 9`；`leaf_mijing_2` `pickerMax: 6`
- **主线任务**：全包价 428 → 468
- **第二章进程三**：price 40 → 50，任务从 2 项扩展为 7 项
- **第二章进程四**：price 25 → 55，任务从 1 项扩展为 7 项
- **第二章进程五六**：price 20 → 40，添加 `content: '庄个人剧情'`，任务从 1 项扩展为 4 项
- **支线任务（重要任务）**：全包价 208 → 228
- **藏剑谷节点新增**：
  - 基础探索-武陵 `leaf_exp_bw_7` 30r
  - 至尊探索-武陵 `leaf_exp_pw_7` 40r
  - 基建拉电线-武陵 `leaf_wire_wl_6` 12r
  - 地区拉滑索-武陵 `leaf_zipline_wl_6` 20r

### `PRTSBoost/data/overview.js`
- 格式变更：`module.exports = [...]` 纯对象数组
- **基建拉电线武陵全包**：58 → 68

### `PRTSBoost/pages/packages/`
- **JS**：`require('../../data/loader')` 替代 `require('../../data/packages')`
- **JS**：`loader.packages` 替代 `packageData`，`loader.treeRoots` 替代 `treeData`

### `PRTSBoost/pages/overview/`
- **JS**：`require('../../data/loader')` 替代 `require('../../data/overview')`
- **JS**：`loader.overview` 替代 `overviewData`，`loader.treeRoots` 替代 `treeData`

### `PRTSBoost/app.*`
- **app.wxss**：`page { height: 100%; overflow: hidden; }` + CSS 变量 + 悬浮购物车按钮（`bottom: 50rpx`）+ `.bg-image` 全屏固定背景样式（opacity 0.12, z-index 0, pointer-events: none）
- **app.json**：导航栏标题 `"PRTSBoost"`，TabBar 套餐/单项/总览
- **app.js**：全局 cartItems/selectedPackageIds 初始化

### 三页面美化（2026-06-04）
- **title.jpg**：`page-header` 内新增 `page-title-row` flex 容器，44rpx 高度图片置于标题左侧
- **bg.jpg**：每个页面在 `page-container` 顶部添加固定全屏背景 `<image>`，`.page-container` 背景改为 `transparent`
- **图片清理**：删除 `PRTSBoost/images/` 下 25 个未引用图片，保留 7 个代码引用的图标

### 配置文件（文件夹重命名）
- **project.config.json**：`miniprogramRoot: "PRTSBoost/"`、`srcMiniprogramRoot: "PRTSBoost/"`
- **.claude/settings.local.json**：Bash 权限路径 `Workspace\\PRTSBoost`、Node require 路径 `./PRTSBoost/data/items`

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
- [x] 产品名称统一"PRTSBoost"
- [x] 总览数据合并（任务大类统一）
- [x] 购物车底部留白缩减
- [x] 外层文件夹可重命名验证
- [x] PRD 全文同步更新
- [x] 对话上下文文档（本文档）
- [x] 外层源码文件夹重命名 + 硬编码路径清理（miniprogram/ → PRTSBoost/，6 个文件约 50 处引用）
- [x] 目录重命名缺漏修复（文件系统实际执行 `mv miniprogram PRTSBoost`）
- [x] SSH known_hosts 修复（`ssh-keyscan github.com`）
- [x] Git 仓库初始化 + GitHub 推送（83 文件，仓库 `PneumaJ/PRTSBoost`）

### 已完成（2026-06-04 新增）

**美化**
- [x] 清理 25 个未引用图片资源（保留 7 个代码引用的图片）
- [x] title.jpg 页面标题左侧图标（三个页面 page-header，44rpx 高度，flex 居中）
- [x] bg.jpg 全局背景图（fixed 全屏覆盖，opacity 0.12，pointer-events: none）
- [x] prts.jpg Canvas 汇总图底部衬底（分隔线以下区域，与画布等宽，opacity 0.10）
- [x] prts.jpg 购物车弹窗底部衬底（cp-footer absolute 定位，opacity 0.08）
- [x] 所有卡片/节点行白色背景半透明化（rgba(255,255,255,0.85)，透出 bg.jpg）

**性能优化（7 项）**
- [x] 高优 — `onToggleExpand` 合并双重 `setData`（expandedIds + flatList 一次渲染）
- [x] 高优 — cart-popup 双重 refresh 防抖（setTimeout(0) 合并同一帧）
- [x] 高优 — `_findNode` 改为 O(1) ID→Node Map（`_buildNodeMap` 预建平铺映射）
- [x] 高优 — `_findTopCategory` 预建 leafId→categoryName 缓存（首次构建，后续 O(1)）
- [x] 中优 — `collectLeaves` 模块级缓存 `_leafCache`（首次计算后命中）
- [x] 中优 — Items 页 `flatList` 缓存（expandedIds + currentTab 组合 key）
- [x] 中优 — canvas-renderer 消除重复 `getGroupedItems`（calcHeight 改收 groupedItems 参数）

**密境行者交互优化**
- [x] "二阶段" → "第二阶段" 名称修正
- [x] 输入框 → 下拉选择框（picker mode="selector"，范围 1-9）
- [x] "关"字移到下拉框外部
- [x] 默认数量改为 9（`addItem`/`addLeaves` 检测 `pickerMax`）

**购物车前两级展示**
- [x] 剩余叶子按子类汇总价格，折叠为 `{ name: 子类名, price: 汇总价 }` 单条
- [x] 汇总项隐藏删除按钮和数量控件，显示"（汇总）"标记
- [x] 直接挂在分类下的叶子独立显示（无子类则价格在第一级展示）

### 已完成（2026-06-06 新增）

**数据架构迁移**
- [x] items.js / packages.js / overview.js 工厂函数 → 纯对象声明（`module.exports = [...]`）
- [x] 新建 `loader.js` 统一数据加载（buildTree + O(1) nodeMap + getNode）
- [x] 所有页面迁移至 loader（items / packages / overview）
- [x] items 页移除 `_buildNodeMap()` 和 `_findNode()` 方法
- [x] JSON 文件方案尝试 + 废弃（WeChat `require()` 不支持 `.json`）

**购物车展示修复**
- [x] 主线任务大类只展示第二级子类（序章、第一章等），不展示第三级 process_group
- [x] `getGroupedItems` 子类汇总合并修复（process_group 全包价汇入 subSumMap，消除重复条目）
- [x] category 完全折叠时清除 subCollapsedMap，避免同时显示"主线任务（全包）428"和"第一章 220"

**tree-node 备注/内容统一化**
- [x] `requirement` 和 `content` 统一使用 `.tn-note-inline` 黄色省略号样式
- [x] `requirement` 带括号 `（...）`，`content` 不带括号
- [x] 统一 `onInfoTap` 弹出层（替代 `onReqTap`）
- [x] 弹出层重命名 `tn-req-*` → `tn-info-*`
- [x] 弹窗 body 展示两个 section：备注（`node.requirement`）+ 说明（`node.content`），各有黄色标签
- [x] `.tn-content` 样式移除，统一为 `.tn-note-inline`

**数据配置更新**
- [x] 删除 `cat_functional`（功能任务）品类及 CAT_MODULE 映射
- [x] 密境行者第二阶段 `pickerMax` 9 → 6（第一阶段保持 9）
- [x] 主线任务全包价 428 → 468
- [x] 第二章进程三/四/五六任务项扩展及价格调整
- [x] 支线任务（重要任务）全包价 208 → 228
- [x] 藏剑谷节点：基础探索-武陵(30r) + 至尊探索-武陵(40r) + 基建拉电线-武陵(12r) + 地区拉滑索-武陵(20r)
- [x] 总览：基建拉电线武陵全包 58 → 68

**UI 调整**
- [x] 悬浮购物车按钮位置 `bottom: 50rpx`（累计下移 70rpx）

### 已完成（2026-06-06 后续新增）

**新增"1.3新增"品类与版本标签**
- [x] `cat_new` 大类（9 个平铺叶子节点）：藏剑谷开图、弥弗故事、藏剑谷电线、滑索、毕业基建、藏剑谷全收集基础档/进阶档/至尊档、古崖论剑
- [x] `cat_new.content`（"当前游戏版本1.3"）作为版本标签显示在三个页面标题右侧（小字半透明，底端下沉对齐）
- [x] 版本标签传入 `image-preview` 组件，汇总生成截图的日期下一行展示，日期精确到秒
- [x] 购物车弹窗不显示版本标签
- [x] Items 页 4 个模块 Tab：任务 | 探索 | 基建 | 新增（新增在最右）

**托管功能（独立页面）**
- [x] 创建 `data/entrust.js`（原名 `tuoguan.js`）— 3 档托管套餐数据，类型 `entrust`
  - 日托 48r/月：日活、帝江号、信用点
  - 体托 68r/月：日托 + 理智
  - 精托 128r/月：全部 8 项（日活、帝江号、信用点、理智、周常、送货、据点交易+倒卖、拍照）
  - 备注：限时活动单独算价；好友助力10r/月；收菜15r/月；稀有材料有滑索15r/趟无滑索30r/趟
- [x] 创建独立页面 `pages/entrust/`（4 文件：js/json/wxml/wxss），与套餐/单项/总览同级
- [x] 三档对比卡片布局：每张卡片显示名称、价格、全部 8 项特性（✓红色=包含，—灰色=不包含），2 列网格
- [x] 选中卡片红色边框高亮 + "已选"标签，点击已选卡片取消选择
- [x] `cart.js` 托管互斥逻辑：`addItem` 添加托管项时移除其他托管项，`getCartTotal` 计入托管价格，`getGroupedItems` 归入"托管"分组
- [x] `app.json`：注册 `pages/entrust/index`，TabBar 新增第 4 个标签"托管"（placeholder 图标 `entrust.png`/`entrust-active.png`）

**进阶探索类 ID 规范化**
- [x] "进阶探索类"原与"基础探索类"共用 `cat_explore_basic` ID及其所有子节点ID，产生碰撞
- [x] 重命名为独立 ID：`cat_explore_advanced`、子类 `sub_exp_adv_sg`/`sub_exp_adv_wl`、叶子 `leaf_exp_as_N`/`leaf_exp_aw_N`
- [x] `items/index.js` CAT_MODULE 添加 `'cat_explore_advanced': 'explore'` 映射

**探索类互斥（2026-06-06 新增）**
- [x] `loader.js` 新增 `nodeTopCategory` 映射（nodeId→topCategoryId）+ `getTopCategoryId()` + `EXPLORE_MUTEX_GROUP` 导出
- [x] `cart.js` `addItem`/`addLeaves` 探索类互斥逻辑：选择基础/进阶/至尊任一层级叶子时，自动移除其他两个层级的所有叶子
- [x] `overview.js` 探索条目添加 `region` 字段（四号谷地/武陵）
- [x] 总览页同区域冲突检测：同一 region 下多选不同类别的探索全包时，显示红色警告"同一区域选择了多个探索档位，价格将重复计算"

**数据配置更新**
- [x] `items.js` 从 11 大类扩展为 12 大类（+`cat_new` +`cat_explore_advanced`，−`cat_functional`）

### 已完成（代码审查与修复 — 2026-06-06）

**P0 — 重复 ID 导致数据静默丢失**
- [x] `leaf_side_022`（藏剑于谷）与 `leaf_side_022`（再引春来系列）重复 → 前者改为 `leaf_side_023`
- [x] `leaf_minor_024`（古崖论剑）与 `leaf_minor_024`（分忧解难）重复 → 前者改为 `leaf_minor_025`
- [x] `leaf_story_5`（以拳问心）与 `leaf_story_5`（红骑士）重复 → 前者改为 `leaf_story_6`
- [x] `cat_explore_basic`（进阶探索类）与基础探索类 ID 碰撞 → 重命名为 `cat_explore_advanced`（子节点同步唯一化）

**P1 — 购物车操作绕过 cart.js 工具函数**
- [x] Overview 页 `onAddCategoryPkg` 直接 splice/push `globalData.cartItems` → 改用 `cart.addItem`/`cart.removeItem`
- [x] Items 页 `onQuantityChange` 直接赋值 `cartItems[i].quantity` → 改用 `cart.updateQuantity` 计算 delta
- [x] `cart.addItem` 缺少 `category_package` 类型去重检查 → 添加去重逻辑

**P2 — 代码重复与隐藏依赖**
- [x] `tree-node/index.js` 重复实现 `_collectLeafIds` → 移除，统一使用 `cart.collectLeafIds`
- [x] `canvas-renderer.js` 内部调用 `getApp()` 获取总价 → `render()` 改为接收 `total` 参数
- [x] `image-preview/index.js` 一次性计算 `total` 和 `groupedItems`，传入 `calcHeight` + `render` 共用

**P3 — 死代码与性能**
- [x] `items/index.js` 移除无效 `cat_new_1_2` CAT_MODULE 映射（对应节点不存在）
- [x] 删除 `components/cloudTipModal/`（4 个文件，未被引用）
- [x] 删除 `envList.js`（未被引用）
- [x] `app.wxss` 移除未使用的 `.card`、`.price-tag`、`.price-tag-small` CSS 类
- [x] `cart-popup/index.wxml` `wx:key="*this"` → `wx:key="cartId"`（高效 key 提升列表 diff）

### 待处理
| 优先级 | 内容 |
|--------|------|
| 中 | 全包优惠对比提示（"单买总和 vs 全包价，节省 XXr"） |
| 中 | 一键全选某大类快捷操作 |
| 低 | 购物车角标细化（套餐数/单项数分别统计） |

---

## 💡 使用方法

### 开发环境
1. 微信开发者工具打开 `D:\Pneuma\Workspace\PRTSBoost`
2. 在 `PRTSBoost/app.js` 中配置 `env`（云开发环境 ID）
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
3. **Canvas 中文字体**：`ctx.font` 使用 `sans-serif`，部分设备可能回退

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
- **文档记录 ≠ 已执行**：修改配置文件后必须验证文件系统状态与配置一致（如 `ls` 验证目录存在），否则出现"配置指向新名、磁盘仍是旧名"的静默不匹配
- **Git 环境**：`~/.ssh/known_hosts` 缺失会导致 `Host key verification failed`，用 `ssh-keyscan github.com` 一键修复
- **GitHub 仓库**：`PneumaJ/PRTSBoost`，SSH 推送（`git@github.com:PneumaJ/PRTSBoost.git`），代理 `127.0.0.1:7897`

### 关键修复（一行代码）
```js
// cart.js collectLeaves — 修复全局购物车 bug
var leaf = { id: node.id, price: node.price || 0, name: node.name, isLeaf: true };
```

### 参考文件
- PRD：`D:\Pneuma\Workspace\PRTSBoost\PRD.md`
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
| 2026-05-30 | 产品名称"PRTSBoost"统一（页面/导航栏/Canvas/PRD/app.json） |
| 2026-05-30 | Canvas 总计标签左对齐 + 价格居中（分行，22px 间距） |
| 2026-05-30 | 外层文件夹重命名为 PRTSBoost + 硬编码路径清理（project.config.json / CLAUDE.md / PRD.md / settings.local.json 等 6 个文件） |
| 2026-05-30 | 外层文件夹重命名验证（相对路径，可任意改名） |
| 2026-05-30 | 目录重命名缺漏修复：文件系统实际执行 `mv miniprogram PRTSBoost`（配置已改但磁盘未改导致启动失败） |
| 2026-05-30 | SSH known_hosts 修复 + Git 仓库初始化 + 初始提交 + 推送 GitHub（`PneumaJ/PRTSBoost`，83 文件） |
| 2026-06-04 | 美化: 清理 25 个未引用图片 + title.jpg/bg.jpg/prts.jpg 三图应用 + 所有卡片半透明 |
| 2026-06-04 | 性能: 7 项优化（高优 4 + 中优 3）— setData 合并、防抖、O(1) 查表、缓存 |
| 2026-06-04 | 密境行者: "二阶段"→"第二阶段" + 输入框→下拉选择框(1-9) + 默认值 9 |
| 2026-06-04 | 购物车: 前两级价格汇总（第三级叶子折叠）+ prts.jpg 底部衬底 |
| 2026-06-06 | 数据架构迁移: 工厂函数→纯对象声明 + loader.js 统一加载（JSON 方案尝试后废弃） |
| 2026-06-06 | 购物车修复: 主线任务只展示第二级子类 + subCollapsedMap/subSumMap 合并去重 |
| 2026-06-06 | tree-node 统一化: requirement + content 黄色省略号 + info modal（tn-req → tn-info） |
| 2026-06-06 | 删除功能任务品类 + CAT_MODULE 清理 |
| 2026-06-06 | 密境行者第二阶段 pickerMax: 9 → 6 |
| 2026-06-06 | 主线任务全包价 428→468 + 第二章任务项扩展 + 支线重要 208→228 |
| 2026-06-06 | 藏剑谷节点新增（基础探索/至尊探索/基建拉电线/地区拉滑索—武陵，各 30/40/12/20r） |
| 2026-06-06 | 总览: 基建拉电线武陵全包 58 → 68 |
| 2026-06-06 | 悬浮购物车按钮 bottom: 120→106→100→50rpx（累计下移 70rpx） |
| 2026-06-06 | 新增 `cat_new`（1.3新增）品类—9 个平铺叶子节点 |
| 2026-06-06 | 版本标签：`cat_new.content` 显示于标题右侧 + 汇总图日期下（日期精确到秒） |
| 2026-06-06 | Items 页 4 Tab：任务 | 探索 | 基建 | 新增（新增在最右） |
| 2026-06-06 | 新建 `data/entrust.js`（3 档托管套餐：日托48r/体托68r/精托128r） |
| 2026-06-06 | 新建 `pages/entrust/` 独立托管页（三档对比卡片 + 互斥选择） |
| 2026-06-06 | `cart.js` 支持 `entrust` 类型（互斥逻辑 + 价计算 + 分组显示） |
| 2026-06-06 | TabBar 新增第 4 标签"托管"（套餐 | 单项 | 总览 | 托管） |
| 2026-06-06 | 进阶探索类 ID 重命名：`cat_explore_basic`→`cat_explore_advanced`（消除与基础探索类碰撞） |
| 2026-06-06 | `data/tuoguan.js` 重命名为 `data/entrust.js`（ID 和 type 同步更新） |
| 2026-06-06 | P0 修复: 3 个重复叶子 ID（`leaf_side_023`/`leaf_minor_025`/`leaf_story_6`）+ 进阶探索类 ID 规范化 |
| 2026-06-06 | P1 修复: Overview/Items 页绕过 cart.js 工具函数 → 统一使用 cart.addItem/removeItem/updateQuantity |
| 2026-06-06 | P2 修复: tree-node 移除重复 `_collectLeafIds` + canvas-renderer 消除 getApp() 隐藏依赖 |
| 2026-06-06 | P3 清理: 删除 cloudTipModal(4文件) + envList.js + 无效 CAT_MODULE 映射 + 未使用 CSS 类 |
| 2026-06-06 | 性能: cart-popup `wx:key="*this"` → `wx:key="cartId"`（高效列表 diff） |
| 2026-06-06 | 探索类互斥: 单项页三档自动互斥（cart.js addItem/addLeaves）+ 总览页同区域冲突红色警告 |
| 2026-06-06 | 总览页冲突警告移至冲突项下方内联展示 + 购物车 category_package 显示 category - name |
| 2026-06-06 | 托管 TabBar 图标替换（盾牌+勾选，灰色常态/红色选中态，Pillow 生成） |
| 2026-06-06 | 购物车组顺序重排：套餐 → 单项 → 品类全包 → 托管（与页面布局一致） |
| 2026-06-06 | 购物车项对齐修复（三轮迭代）：baseline → center+line-height:1 → **center+统一line-height:28rpx**（不同字号盒子等高，视觉居中一致） |

