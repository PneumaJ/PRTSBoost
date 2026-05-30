// 购物车工具 — 操作 getApp().globalData 的纯函数

let _nextId = 1;
function generateId() {
  return 'cart_' + (_nextId++) + '_' + Date.now();
}

/**
 * 递归收集某节点下所有叶子节点的 ID 和价格信息
 */
function collectLeaves(node) {
  if (node.isLeaf) {
    var leaf = { id: node.id, price: node.price || 0, name: node.name, isLeaf: true };
    if (node.isPerUnit) {
      leaf.isPerUnit = true;
      leaf.unitPrice = node.unitPrice;
    }
    return [leaf];
  }
  let leaves = [];
  for (const child of node.children || []) {
    leaves = leaves.concat(collectLeaves(child));
  }
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

    const cartItem = {
      ...node,
      cartId: generateId(),
      addedAt: Date.now(),
      variantKey: variantKey || 'default',
      quantity: node.isPerUnit ? 1 : 0
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
    for (const leaf of leaves) {
      // 避免重复
      const exists = app.globalData.cartItems.find(item => item.id === leaf.id);
      if (!exists) {
        app.globalData.cartItems.push({
          ...leaf,
          cartId: generateId(),
          addedAt: Date.now(),
          variantKey: 'default',
          quantity: leaf.isPerUnit ? 1 : 0
        });
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
   */
  getGroupedItems: function (app, treeRoots) {
    const cart = app.globalData.cartItems;
    const grouped = [];

    // 套餐组
    const packageItems = cart.filter(item => item.type === 'package');
    if (packageItems.length > 0) {
      grouped.push({ groupName: '套餐', items: packageItems });
    }

    // 品类全包组（从总览页添加的）
    const catPkgItems = cart.filter(item => item.type === 'category_package');
    if (catPkgItems.length > 0) {
      grouped.push({ groupName: '品类全包', items: catPkgItems });
    }

    // 叶子节点 — 已全选且有全包价的父级折叠为单条，其余按大类分组
    const leafItems = cart.filter(item => item.isLeaf);
    if (leafItems.length > 0 && treeRoots) {
      const cartLeafIds = new Set(leafItems.map(l => l.id));

      // 收集有价格的父节点（深层优先，与 getCartTotal 一致）
      const pricedGroups = [];
      this._collectPricedGroups(treeRoots, pricedGroups, 0);
      pricedGroups.sort((a, b) => b.depth - a.depth);

      // 被全选父级覆盖的叶子
      const coveredLeafIds = new Set();
      const collapsedItems = [];

      for (const pg of pricedGroups) {
        const pgLeafIds = collectLeafIds(pg.node);
        if (pgLeafIds.length > 0 && pgLeafIds.every(id => cartLeafIds.has(id) || coveredLeafIds.has(id))) {
          // 该父节点下所有叶子已全选 → 折叠
          for (const id of pgLeafIds) {
            coveredLeafIds.add(id);
          }
          collapsedItems.push({
            name: pg.node.name + '（全包）',
            price: pg.node.price,
            _category: this._findTopCategory(pg.node, treeRoots)
          });
        }
      }

      // 构建 ID→大类 映射
      const idToCategory = {};
      for (const cat of treeRoots) {
        const leaves = collectLeaves(cat);
        for (const leaf of leaves) {
          idToCategory[leaf.id] = cat.name;
        }
      }

      // 按大类合并：折叠项 + 剩余叶子
      const catMap = {};
      for (const ci of collapsedItems) {
        const catName = ci._category || '其他';
        if (!catMap[catName]) catMap[catName] = { groupName: catName, items: [] };
        catMap[catName].items.push(ci);
      }

      const remainingLeaves = leafItems.filter(l => !coveredLeafIds.has(l.id));
      for (const item of remainingLeaves) {
        const catName = idToCategory[item.id] || '其他';
        if (!catMap[catName]) catMap[catName] = { groupName: catName, items: [] };
        catMap[catName].items.push(item);
      }

      // 按 treeRoots 顺序输出（保持大类顺序一致）
      const catOrder = treeRoots.map(c => c.name);
      for (const catName of catOrder) {
        if (catMap[catName]) grouped.push(catMap[catName]);
      }
      for (const key of Object.keys(catMap)) {
        if (catOrder.indexOf(key) < 0) grouped.push(catMap[key]);
      }
    } else if (leafItems.length > 0) {
      grouped.push({ groupName: '已选项目', items: leafItems });
    }

    return grouped;
  },

  /**
   * 辅助：查找节点所属的顶级大类名称
   */
  _findTopCategory: function (node, treeRoots) {
    const nodeLeaves = collectLeaves(node);
    if (nodeLeaves.length === 0) return '其他';
    const firstId = nodeLeaves[0].id;
    for (const cat of treeRoots) {
      const catLeaves = collectLeaves(cat);
      if (catLeaves.some(l => l.id === firstId)) return cat.name;
    }
    return '其他';
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
