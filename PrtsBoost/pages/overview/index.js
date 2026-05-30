// 总览页 — 全包优惠
const overviewData = require('../../data/overview');
const treeData = require('../../data/items');
const cart = require('../../utils/cart');

Page({
  data: {
    categoryPkgList: [],
    cartCategoryPkgIds: [],
    cartCount: 0,
    cartItems: [],
    treeRoots: treeData,
    showCart: false,
    showImagePreview: false
  },

  onLoad: function () {
    const categoryPkgList = overviewData
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

    this.setData({
      cartCount: cart.getCartCount(app),
      cartItems: cartItems.slice(),
      cartCategoryPkgIds: cartCategoryPkgIds,
      categoryPkgList: categoryPkgList
    });
  },

  onAddCategoryPkg: function (e) {
    var index = e.currentTarget.dataset.index;
    var item = this.data.categoryPkgList[index];
    if (!item) return;

    var app = getApp();
    var cartItems = app.globalData.cartItems;
    var targetId = item._uid;

    var existingIdx = -1;
    for (var i = 0; i < cartItems.length; i++) {
      if (cartItems[i].id === targetId && cartItems[i].type === 'category_package') {
        existingIdx = i;
        break;
      }
    }

    if (existingIdx >= 0) {
      cartItems.splice(existingIdx, 1);
    } else {
      cartItems.push({
        id: targetId,
        name: item.name,
        price: item.price,
        type: 'category_package',
        category: item.category,
        isLeaf: false,
        content: '',
        requirement: '',
        children: [],
        cartId: 'cart_' + targetId + '_' + Date.now(),
        addedAt: Date.now(),
        variantKey: 'default',
        quantity: 0
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
