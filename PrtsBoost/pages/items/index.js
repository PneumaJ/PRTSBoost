// 单项页 — 三层树状结构 + 展开折叠 + 勾选 + 模块Tab
const treeData = require('../../data/items');
const cart = require('../../utils/cart');

// 大类 → 模块映射
const CAT_MODULE = {
  'cat_main': 'task',
  'cat_activity': 'task',
  'cat_side_important': 'task',
  'cat_side_minor': 'task',
  'cat_story': 'task',
  'cat_functional': 'task',
  'cat_explore_basic': 'explore',
  'cat_explore_premium': 'explore',
  'cat_new_1_2': 'explore',
  'cat_infra_wire': 'infra',
  'cat_infra_zipline': 'infra'
};

const TAB_LABELS = {
  task: '任务',
  explore: '探索',
  infra: '基建'
};

Page({
  data: {
    treeRoots: treeData,
    currentTab: 'task',
    tabRoots: [],
    tabLabels: TAB_LABELS,
    flatList: [],
    checkedIds: [],
    expandedIds: [],
    refreshStamp: 0,
    cartCount: 0,
    cartItems: [],
    showCart: false,
    showImagePreview: false
  },

  onLoad: function () {
    this._applyTabFilter();
    this.refreshAll();
  },

  onShow: function () {
    this.refreshAll();
  },

  onHide: function () {
    this.setData({ showCart: false, showImagePreview: false });
  },

  // 根据 currentTab 过滤树根
  _applyTabFilter: function () {
    const tab = this.data.currentTab;
    const filtered = treeData.filter(function (cat) {
      return CAT_MODULE[cat.id] === tab;
    });
    this.setData({ tabRoots: filtered });
  },

  // 切换模块Tab
  onTabChange: function (e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.currentTab) return;
    this.setData({
      currentTab: tab,
      expandedIds: []
    });
    this._applyTabFilter();
    this.refreshAll();
  },

  // 从 globalData 读取最新状态并一次性更新全部 UI
  refreshAll: function () {
    const app = getApp();
    const cartItems = cart.getCartItems(app);
    const checkedIds = cartItems.filter(function (item) { return item.isLeaf; }).map(function (item) { return item.id; });
    const flatList = this._computeFlatList(this.data.expandedIds);

    this.setData({
      refreshStamp: Date.now(),
      cartCount: cart.getCartCount(app),
      cartItems: cartItems.slice(),
      checkedIds: checkedIds,
      flatList: flatList
    });
  },

  // 计算扁平化可见节点列表（基于当前 tabRoots）
  _computeFlatList: function (expandedIds) {
    var result = [];
    var roots = this.data.tabRoots;
    if (!roots || roots.length === 0) return result;
    function flatten(nodes, depth) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        result.push({ node: node, depth: depth });
        if (node.children && node.children.length > 0 && expandedIds.indexOf(node.id) >= 0) {
          flatten(node.children, depth + 1);
        }
      }
    }
    flatten(roots, 0);
    return result;
  },

  // 切换展开/折叠
  onToggleExpand: function (e) {
    var nodeId = e.detail.nodeId;
    var expandedIds = this.data.expandedIds.slice();
    var idx = expandedIds.indexOf(nodeId);

    if (idx >= 0) {
      expandedIds.splice(idx, 1);
    } else {
      expandedIds.push(nodeId);
    }

    this.setData({ expandedIds: expandedIds });
    this._updateFlatList();
  },

  _updateFlatList: function () {
    var flatList = this._computeFlatList(this.data.expandedIds);
    this.setData({ flatList: flatList });
  },

  // 切换叶子节点勾选
  onToggleCheck: function (e) {
    var nodeId = e.detail.nodeId;
    var qty = e.detail.quantity || 1;
    var node = this._findNode(treeData, nodeId);
    if (!node || !node.isLeaf) return;

    var app = getApp();
    var cartItems = cart.getCartItems(app);
    var existingItem = cartItems.find(function (item) { return item.id === nodeId && item.isLeaf; });

    if (existingItem) {
      cart.removeItem(app, existingItem.cartId);
    } else {
      cart.addItem(app, node);
      // 按关计价项目使用当前本地数量
      if (node.isPerUnit) {
        var allItems = app.globalData.cartItems;
        for (var k = allItems.length - 1; k >= 0; k--) {
          if (allItems[k].id === nodeId && allItems[k].isPerUnit) {
            allItems[k].quantity = qty;
            break;
          }
        }
      }
    }

    this.refreshAll();
  },

  // 全选/全不选某节点下所有叶子
  onToggleCheckAll: function (e) {
    var nodeId = e.detail.nodeId;
    var node = this._findNode(treeData, nodeId);
    if (!node || node.isLeaf) return;

    var leafIds = cart.collectLeafIds(node);
    var checkedIdsSet = {};
    for (var i = 0; i < this.data.checkedIds.length; i++) {
      checkedIdsSet[this.data.checkedIds[i]] = true;
    }
    var allChecked = leafIds.every(function (id) { return checkedIdsSet[id]; });
    var app = getApp();

    if (allChecked) {
      cart.removeLeaves(app, leafIds);
    } else {
      var leaves = cart.collectLeaves(node);
      cart.addLeaves(app, leaves);
    }

    this.refreshAll();
  },

  _findNode: function (nodes, id) {
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.id === id) return node;
      if (node.children && node.children.length > 0) {
        var found = this._findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  },

  // 按关计价数量变更
  onQuantityChange: function (e) {
    var nodeId = e.detail.nodeId;
    var quantity = e.detail.quantity;
    var app = getApp();
    var cartItems = app.globalData.cartItems;
    for (var i = 0; i < cartItems.length; i++) {
      if (cartItems[i].id === nodeId && cartItems[i].isLeaf && cartItems[i].isPerUnit) {
        cartItems[i].quantity = quantity;
        break;
      }
    }
    this.refreshAll();
  },

  onCartBtnTap: function () {
    this.setData({ showCart: true });
  },

  onCartClose: function () {
    this.setData({ showCart: false });
    this.refreshAll();
  },

  onCartChanged: function () {
    this.refreshAll();
  },

  onGenerateImage: function () {
    this.setData({
      showCart: false,
      showImagePreview: true
    });
  },

  onImagePreviewClose: function () {
    this.setData({ showImagePreview: false });
  }
});
