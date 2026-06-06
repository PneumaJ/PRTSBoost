// 购物车工具 — 操作 getApp().globalData 的纯函数

const loader = require('../data/loader');

let _nextId = 1;
function generateId() {
  return 'cart_' + (_nextId++) + '_' + Date.now();
}

var _leafCache = {};

/**
 * 递归收集某节点下所有叶子节点的 ID 和价格信息（带缓存）
 */
function collectLeaves(node) {
  if (_leafCache[node.id]) return _leafCache[node.id];
  if (node.isLeaf) {
    var leaf = { id: node.id, price: node.price || 0, name: node.name, isLeaf: true };
    if (node.isPerUnit) {
      leaf.isPerUnit = true;
      leaf.unitPrice = node.unitPrice;
    }
    _leafCache[node.id] = [leaf];
    return [leaf];
  }
  let leaves = [];
  for (const child of node.children || []) {
    leaves = leaves.concat(collectLeaves(child));
  }
  _leafCache[node.id] = leaves;
  return leaves;
}

/**
 * 收集某节点下所有叶子 ID（去重数组）
 */
function collectLeafIds(node) {
  return collectLeaves(node).map(l => l.id);
}

module.exports = {

  /**
   * 加入购物车
   * @param {Object} app - getApp() 返回值
   * @param {Object} node - 要加入的节点（叶子或套餐）
   * @param {string} variantKey - 套餐变体 key（可选）
   */
  addItem: function (app, node, variantKey) {
    const cart = app.globalData.cartItems;

    // 托管互斥逻辑
    if (node.type === 'entrust') {
      for (var i = cart.length - 1; i >= 0; i--) {
        if (cart[i].type === 'entrust') {
          cart.splice(i, 1);
        }
      }
    }

    // 套餐互斥逻辑
    if (node.type === 'package') {
      const isPkg5 = node.id === 'pkg_5' || node.name.indexOf('一条龙') >= 0;

      if (isPkg5) {
        // 套餐五与套餐 1-4 全部互斥：选择套餐五时清除所有其他套餐
        for (let i = cart.length - 1; i >= 0; i--) {
          if (cart[i].type === 'package') {
            cart.splice(i, 1);
          }
        }
        app.globalData.selectedPackageIds = [node.id];
      } else {
        // 套餐 1-4：只与套餐五互斥，1-4 之间可多选
        for (let i = cart.length - 1; i >= 0; i--) {
          const item = cart[i];
          if (item.type === 'package' && (item.id === 'pkg_5' || item.name.indexOf('一条龙') >= 0)) {
            cart.splice(i, 1);
          }
        }
        // 将当前套餐 ID 加入已选列表
        if (app.globalData.selectedPackageIds.indexOf(node.id) < 0) {
          app.globalData.selectedPackageIds.push(node.id);
        }
      }
    }

    // 避免重复添加同一叶子
    if (node.isLeaf) {
      const exists = cart.find(item => item.id === node.id);
      if (exists) return;
    }

    // 避免重复添加同一套餐
    if (node.type === 'package') {
      const exists = cart.find(item => item.id === node.id && item.type === 'package');
      if (exists) return;
    }

    // 避免重复添加同一托管
    if (node.type === 'entrust') {
      const exists = cart.find(item => item.id === node.id && item.type === 'entrust');
      if (exists) return;
    }

    // 避免重复添加同一品类全包
    if (node.type === 'category_package') {
      const exists = cart.find(item => item.id === node.id && item.type === 'category_package');
      if (exists) return;
    }

    // 探索类互斥：选择某探索层级的叶子时，自动取消其他两个层级的所有叶子
    if (node.isLeaf) {
      var topCat = loader.getTopCategoryId(node.id);
      var mutexGroup = loader.exploreMutexGroup;
      if (topCat && mutexGroup.indexOf(topCat) >= 0) {
        for (var i = cart.length - 1; i >= 0; i--) {
          var itemTopCat = loader.getTopCategoryId(cart[i].id);
          if (itemTopCat && itemTopCat !== topCat && mutexGroup.indexOf(itemTopCat) >= 0) {
            cart.splice(i, 1);
          }
        }
      }
    }

    const cartItem = {
      ...node,
      cartId: generateId(),
      addedAt: Date.now(),
      variantKey: variantKey || 'default',
      quantity: node.isPerUnit ? (node.pickerMax || 1) : 0
    };

    cart.push(cartItem);
  },

  /**
   * 从购物车移除单项
   * @param {Object} app
   * @param {string} cartId — 首选匹配方式
   * @param {string} fallbackId — 如果 cartId 匹配失败，用 id 兜底
   */
  removeItem: function (app, cartId, fallbackId) {
    const cart = app.globalData.cartItems;
    var idx = cart.findIndex(item => item.cartId === cartId);
    // 兜底：如果 cartId 未匹配到，尝试用 fallbackId 匹配
    if (idx < 0 && fallbackId) {
      idx = cart.findIndex(item => item.id === fallbackId);
    }
    if (idx >= 0) {
      const removed = cart[idx];
      cart.splice(idx, 1);
      if (removed.type === 'package') {
        const pkgIdx = app.globalData.selectedPackageIds.indexOf(removed.id);
        if (pkgIdx >= 0) {
          app.globalData.selectedPackageIds.splice(pkgIdx, 1);
        }
      }
    }
  },

  /**
   * 批量加入叶子节点列表
   */
  addLeaves: function (app, leaves) {
    var addedExploreCat = null;
    var mutexGroup = loader.exploreMutexGroup;

    for (const leaf of leaves) {
      // 避免重复
      const exists = app.globalData.cartItems.find(item => item.id === leaf.id);
      if (!exists) {
        app.globalData.cartItems.push({
          ...leaf,
          cartId: generateId(),
          addedAt: Date.now(),
          variantKey: 'default',
          quantity: leaf.isPerUnit ? (leaf.pickerMax || 1) : 0
        });
      }
      if (!addedExploreCat) {
        var tc = loader.getTopCategoryId(leaf.id);
        if (tc && mutexGroup.indexOf(tc) >= 0) addedExploreCat = tc;
      }
    }

    // 探索类互斥：批量添加后移除其他探索层级的所有叶子
    if (addedExploreCat) {
      var cart = app.globalData.cartItems;
      for (var i = cart.length - 1; i >= 0; i--) {
        var itemTopCat = loader.getTopCategoryId(cart[i].id);
        if (itemTopCat && itemTopCat !== addedExploreCat && mutexGroup.indexOf(itemTopCat) >= 0) {
          cart.splice(i, 1);
        }
      }
    }
  },

  /**
   * 批量移除叶子节点列表
   */
  removeLeaves: function (app, leafIds) {
    const cart = app.globalData.cartItems;
    for (let i = cart.length - 1; i >= 0; i--) {
      if (leafIds.includes(cart[i].id) && cart[i].type !== 'package') {
        cart.splice(i, 1);
      }
    }
  },

  /**
   * 获取购物车所有项
   */
  getCartItems: function (app) {
    return app.globalData.cartItems;
  },

  /**
   * 获取购物车数量
   */
  getCartCount: function (app) {
    return app.globalData.cartItems.length;
  },

  /**
   * 获取购物车分类数量（套餐数 / 单项数）
   */
  getCartCounts: function (app) {
    var cart = app.globalData.cartItems;
    var pkgCount = 0;
    var itemCount = 0;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].type === 'package') pkgCount++;
      else itemCount++;
    }
    return { pkgCount: pkgCount, itemCount: itemCount };
  },

  /**
   * 计算购物车总价
   * 若父节点（category/subcategory/process_group）下所有叶子均被选中，使用全包优惠价
   * 优先级: 最深层级优先，已全选的叶子不会在父级重复计算
   * @param {Object} app
   * @param {Array} treeRoots — 完整树数据，用于检测全包价
   */
  getCartTotal: function (app, treeRoots) {
    const cart = app.globalData.cartItems;
    let total = 0;

    // 收集购物车中的叶子节点 ID 集合
    const cartLeafIds = new Set();
    for (const item of cart) {
      if (item.isLeaf) {
        cartLeafIds.add(item.id);
      }
      if (item.type === 'package' && item.variantKey === 'variant' && item.variant) {
        total += item.variant.price;
      } else if (item.type === 'package' && item.variantKey === 'default') {
        total += item.price || 0;
      } else if (item.type === 'category_package') {
        total += item.price || 0;
      } else if (item.type === 'entrust') {
        total += item.price || 0;
      }
    }

    if (treeRoots) {
      // 收集所有有价格的父节点（category/subcategory/process_group），按深度降序排列
      const pricedGroups = [];
      this._collectPricedGroups(treeRoots, pricedGroups, 0);

      // 按深度降序：先处理最深层的全包价
      pricedGroups.sort((a, b) => b.depth - a.depth);

      for (const pg of pricedGroups) {
        const pgLeafIds = collectLeafIds(pg.node);
        if (pgLeafIds.length > 0 && pgLeafIds.every(id => cartLeafIds.has(id))) {
          // 该节点全选 → 使用全包价，移除其叶子
          for (const id of pgLeafIds) {
            cartLeafIds.delete(id);
          }
          if (pg.node.price) {
            total += pg.node.price;
          }
        }
      }

      // 剩余未被任何全包价覆盖的叶子按单独价格计算
      for (const item of cart) {
        if (item.isLeaf && cartLeafIds.has(item.id)) {
          if (item.isPerUnit) {
            total += (item.unitPrice || 0) * (item.quantity || 1);
          } else {
            total += item.price || 0;
          }
        }
      }
    } else {
      // 无树数据时，直接累加
      for (const item of cart) {
        if (item.isLeaf) {
          if (item.isPerUnit) {
            total += (item.unitPrice || 0) * (item.quantity || 1);
          } else {
            total += item.price || 0;
          }
        } else if (item.type === 'category_package') {
          total += item.price || 0;
        } else if (item.type === 'entrust') {
          total += item.price || 0;
        }
      }
    }

    return total;
  },

  /**
   * 辅助：收集所有有价格的非叶子节点（category / subcategory / process_group）
   * 排除包含按关计价（isPerUnit）叶子的节点，因为变量计价不适用于固定全包价
   */
  _collectPricedGroups: function (nodes, result, depth) {
    for (const node of nodes) {
      if (!node.isLeaf && node.price != null && node.children && node.children.length > 0) {
        if (!this._hasPerUnitLeaf(node)) {
          result.push({ node: node, depth: depth });
        }
      }
      if (node.children) {
        this._collectPricedGroups(node.children, result, depth + 1);
      }
    }
  },

  /**
   * 辅助：检查节点树下是否包含按关计价叶子
   */
  _hasPerUnitLeaf: function (node) {
    if (node.isLeaf) return node.isPerUnit === true;
    if (node.children) {
      for (const child of node.children) {
        if (this._hasPerUnitLeaf(child)) return true;
      }
    }
    return false;
  },

  /**
   * 按大类分组购物车项目
   * 已全选的父节点（有全包价）会被折叠为单条汇总项，不再列出所有子节点
   * process_group 类型的全包价会归入父级 subcategory，只展示前两级
   */
  getGroupedItems: function (app, treeRoots) {
    var cart = app.globalData.cartItems;
    var grouped = [];

    // 1. 套餐组
    var packageItems = cart.filter(function (item) { return item.type === 'package'; });
    if (packageItems.length > 0) {
      grouped.push({ groupName: '套餐', items: packageItems });
    }

    // 2. 单项 — 叶子节点及汇总（按大类分组）
    var leafItems = cart.filter(function (item) { return item.isLeaf; });
    if (leafItems.length > 0 && treeRoots) {
      var cartLeafIds = new Set();
      for (var i = 0; i < leafItems.length; i++) { cartLeafIds.add(leafItems[i].id); }

      // 收集有价格的父节点（深层优先，与 getCartTotal 一致）
      var pricedGroups = [];
      this._collectPricedGroups(treeRoots, pricedGroups, 0);
      pricedGroups.sort(function (a, b) { return b.depth - a.depth; });

      // 构建 process_group → 父级 subcategory 映射
      var pgToSub = {};
      for (var ci = 0; ci < treeRoots.length; ci++) {
        var cat = treeRoots[ci];
        var catChildren = cat.children || [];
        for (var si = 0; si < catChildren.length; si++) {
          var sub = catChildren[si];
          if (sub.type === 'subcategory') {
            var subChildren = sub.children || [];
            for (var pi = 0; pi < subChildren.length; pi++) {
              pgToSub[subChildren[pi].id] = { catName: cat.name, subName: sub.name };
            }
          }
        }
      }

      // 被全选父级覆盖的叶子
      var coveredLeafIds = new Set();
      var collapsedItems = [];
      // 按子类汇总的 process_group 全包价（key: catName||subName）
      var subCollapsedMap = {};

      for (var pgi = 0; pgi < pricedGroups.length; pgi++) {
        var pg = pricedGroups[pgi];
        var pgLeafIds = collectLeafIds(pg.node);
        if (pgLeafIds.length > 0 && pgLeafIds.every(function (id) { return cartLeafIds.has(id) || coveredLeafIds.has(id); })) {
          for (var li = 0; li < pgLeafIds.length; li++) {
            coveredLeafIds.add(pgLeafIds[li]);
          }

          var parentSub = pgToSub[pg.node.id];
          if (parentSub) {
            // process_group → 归入父级 subcategory，不单独显示
            var skey = parentSub.catName + '||' + parentSub.subName;
            if (!subCollapsedMap[skey]) {
              subCollapsedMap[skey] = { catName: parentSub.catName, subName: parentSub.subName, totalPrice: 0 };
            }
            subCollapsedMap[skey].totalPrice += pg.node.price || 0;
          } else {
            // 非 process_group 的全包价父节点 → 正常折叠
            // 若该节点是 category，清除其下已被折叠的 subCollapsedMap 条目，避免重复显示
            var topCatName = this._findTopCategory(pg.node, treeRoots);
            for (var sk in subCollapsedMap) {
              if (subCollapsedMap[sk].catName === topCatName) {
                delete subCollapsedMap[sk];
              }
            }
            collapsedItems.push({
              name: pg.node.name + '（全包）',
              price: pg.node.price,
              _category: topCatName
            });
          }
        }
      }

      // 构建 leafId → { catName, subName } 映射
      var idToSubInfo = {};
      for (var ci2 = 0; ci2 < treeRoots.length; ci2++) {
        var cat2 = treeRoots[ci2];
        (function walkSubs(children, subName) {
          for (var wi = 0; wi < (children || []).length; wi++) {
            var child = children[wi];
            if (child.type === 'subcategory') {
              walkSubs(child.children || [], child.name);
            } else if (child.isLeaf) {
              idToSubInfo[child.id] = { catName: cat2.name, subName: subName || null };
            } else if (child.children) {
              walkSubs(child.children, subName);
            }
          }
        })(cat2.children || []);
      }

      // 剩余叶子
      var remainingLeaves = leafItems.filter(function (l) { return !coveredLeafIds.has(l.id); });

      // 分离：有 subName 的叶子按子类汇总，无 subName 的叶子独立显示（如"序章"直接挂在大类下）
      var subSumMap = {};
      var directLeafItems = [];
      for (var ri = 0; ri < remainingLeaves.length; ri++) {
        var item = remainingLeaves[ri];
        var info = idToSubInfo[item.id] || { catName: '其他', subName: null };
        if (info.subName) {
          var sumKey = info.catName + '|' + info.subName;
          if (!subSumMap[sumKey]) {
            subSumMap[sumKey] = { catName: info.catName, subName: info.subName, total: 0 };
          }
          if (item.isPerUnit) {
            subSumMap[sumKey].total += (item.unitPrice || 0) * (item.quantity || 1);
          } else {
            subSumMap[sumKey].total += item.price || 0;
          }
        } else {
          // 直接挂在大类下的叶子 → 独立显示，不汇总
          var dPrice = item.isPerUnit ? (item.unitPrice || 0) * (item.quantity || 1) : (item.price || 0);
          directLeafItems.push({
            name: item.name,
            price: dPrice,
            _category: info.catName,
            cartId: item.cartId,
            isLeaf: true,
            isPerUnit: item.isPerUnit,
            quantity: item.quantity
          });
        }
      }

      // 将 process_group 全包价汇入对应子类，与剩余叶子合并为一条
      for (var sk2 in subCollapsedMap) {
        var sc = subCollapsedMap[sk2];
        var mergeKey = sc.catName + '|' + sc.subName;
        if (!subSumMap[mergeKey]) {
          subSumMap[mergeKey] = { catName: sc.catName, subName: sc.subName, total: 0 };
        }
        subSumMap[mergeKey].total += sc.totalPrice;
      }

      // 按大类合并：折叠项 + 直接叶子 + 子类价格汇总
      var catMap = {};
      for (var cli = 0; cli < collapsedItems.length; cli++) {
        var cn = collapsedItems[cli]._category || '其他';
        if (!catMap[cn]) catMap[cn] = { groupName: cn, items: [] };
        catMap[cn].items.push(collapsedItems[cli]);
      }
      for (var dli = 0; dli < directLeafItems.length; dli++) {
        var dl = directLeafItems[dli];
        var dlCat = dl._category;
        delete dl._category;
        if (!catMap[dlCat]) catMap[dlCat] = { groupName: dlCat, items: [] };
        catMap[dlCat].items.push(dl);
      }
      var sumIdx = 0;
      for (var sk3 in subSumMap) {
        var ss = subSumMap[sk3];
        if (!catMap[ss.catName]) catMap[ss.catName] = { groupName: ss.catName, items: [] };
        catMap[ss.catName].items.push({
          name: ss.subName,
          price: ss.total,
          _summary: true,
          _key: 'sum_' + (sumIdx++)
        });
      }

      // 按 treeRoots 顺序输出
      var catOrder = treeRoots.map(function (c) { return c.name; });
      for (var oi = 0; oi < catOrder.length; oi++) {
        if (catMap[catOrder[oi]]) grouped.push(catMap[catOrder[oi]]);
      }
      for (var sk4 in catMap) {
        if (catOrder.indexOf(sk4) < 0) grouped.push(catMap[sk4]);
      }
    } else if (leafItems.length > 0) {
      grouped.push({ groupName: '已选项目', items: leafItems });
    }

    // 3. 品类全包组（从总览页添加的）
    var catPkgItems = cart.filter(function (item) { return item.type === 'category_package'; });
    if (catPkgItems.length > 0) {
      grouped.push({ groupName: '品类全包', items: catPkgItems });
    }

    // 4. 托管组
    var entrustItems = cart.filter(function (item) { return item.type === 'entrust'; });
    if (entrustItems.length > 0) {
      grouped.push({ groupName: '托管', items: entrustItems });
    }

    return grouped;
  },

  /**
   * 辅助：查找节点所属的顶级大类名称（首次调用构建 leafId→categoryName 缓存）
   */
  _findTopCategory: function (node, treeRoots) {
    if (!this._leafToCategory) {
      this._leafToCategory = {};
      for (var i = 0; i < treeRoots.length; i++) {
        var catLeaves = collectLeaves(treeRoots[i]);
        for (var j = 0; j < catLeaves.length; j++) {
          this._leafToCategory[catLeaves[j].id] = treeRoots[i].name;
        }
      }
    }
    var nodeLeaves = collectLeaves(node);
    if (nodeLeaves.length === 0) return '其他';
    return this._leafToCategory[nodeLeaves[0].id] || '其他';
  },

  /**
   * 更新按关计价项目的数量
   */
  updateQuantity: function (app, cartId, delta) {
    const cart = app.globalData.cartItems;
    const item = cart.find(i => i.cartId === cartId);
    if (!item || !item.isPerUnit) return;
    item.quantity = Math.max(1, (item.quantity || 1) + delta);
  },

  /**
   * 收集节点下所有叶子（公开方法）
   */
  collectLeaves: collectLeaves,

  /**
   * 收集节点下所有叶子 ID（公开方法）
   */
  collectLeafIds: collectLeafIds,

  /**
   * 清空购物车
   */
  clearCart: function (app) {
    app.globalData.cartItems = [];
    app.globalData.selectedPackageIds = [];
  }
};
