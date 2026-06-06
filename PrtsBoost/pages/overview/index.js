// 总览页 — 全包优惠
const loader = require('../../data/loader');
const cart = require('../../utils/cart');

Page({
  data: {
    categoryPkgList: [],
    cartCategoryPkgIds: [],
    cartCount: 0,
    cartItems: [],
    treeRoots: loader.treeRoots,
    versionLabel: (loader.getNode('cat_new') || {}).content || '',
    regionConflict: false,
    showCart: false,
    showImagePreview: false
  },

  onLoad: function () {
    const categoryPkgList = loader.overview
      .filter(function (item) { return item.type === 'category_package'; })
      .map(function (item, index) {
        item._idx = index;
        item._uid = 'catpkg_' + index;
        return item;
      });
    this.setData({ categoryPkgList: categoryPkgList });
  },

  onShow: function () {
    this.syncFromGlobal();
  },

  onHide: function () {
    this.setData({ showCart: false, showImagePreview: false });
  },

  syncFromGlobal: function () {
    var app = getApp();
    var cartItems = cart.getCartItems(app);

    var cartCategoryPkgIds = [];
    for (var i = 0; i < cartItems.length; i++) {
      if (cartItems[i].type === 'category_package') {
        cartCategoryPkgIds.push(cartItems[i].id);
      }
    }

    var categoryPkgList = this.data.categoryPkgList;
    for (var j = 0; j < categoryPkgList.length; j++) {
      categoryPkgList[j].isSelected = cartCategoryPkgIds.indexOf(categoryPkgList[j]._uid) >= 0;
    }

    // 检测同区域探索档位冲突
    var regionCats = {};
    for (var k = 0; k < categoryPkgList.length; k++) {
      var pkg = categoryPkgList[k];
      if (pkg.isSelected && pkg.region) {
        if (!regionCats[pkg.region]) regionCats[pkg.region] = [];
        if (regionCats[pkg.region].indexOf(pkg.category) < 0) {
          regionCats[pkg.region].push(pkg.category);
        }
      }
    }
    var regionConflict = false;
    var conflictRegions = {};
    for (var r in regionCats) {
      if (regionCats[r].length > 1) { regionConflict = true; conflictRegions[r] = true; }
    }

    // 标记冲突项，供 WXML 内联警告
    for (var k2 = 0; k2 < categoryPkgList.length; k2++) {
      categoryPkgList[k2]._conflict = categoryPkgList[k2].isSelected && conflictRegions[categoryPkgList[k2].region];
    }

    this.setData({
      cartCount: cart.getCartCount(app),
      cartItems: cartItems.slice(),
      cartCategoryPkgIds: cartCategoryPkgIds,
      categoryPkgList: categoryPkgList,
      regionConflict: regionConflict
    });
  },

  onAddCategoryPkg: function (e) {
    var index = e.currentTarget.dataset.index;
    var item = this.data.categoryPkgList[index];
    if (!item) return;

    var app = getApp();
    var targetId = item._uid;

    var existingItem = null;
    var cartItems = cart.getCartItems(app);
    for (var i = 0; i < cartItems.length; i++) {
      if (cartItems[i].id === targetId && cartItems[i].type === 'category_package') {
        existingItem = cartItems[i];
        break;
      }
    }

    if (existingItem) {
      cart.removeItem(app, existingItem.cartId, targetId);
    } else {
      cart.addItem(app, {
        id: targetId,
        name: item.name,
        price: item.price,
        type: 'category_package',
        category: item.category
      });
    }

    this.syncFromGlobal();
  },

  onCartBtnTap: function () {
    this.setData({ showCart: true });
  },

  onCartClose: function () {
    this.setData({ showCart: false });
    this.syncFromGlobal();
  },

  onCartChanged: function () {
    this.syncFromGlobal();
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
