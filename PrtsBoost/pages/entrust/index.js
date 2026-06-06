// 托管页 — 三档互斥托管套餐
const loader = require('../../data/loader');
const cart = require('../../utils/cart');

Page({
  data: {
    entrustTiers: loader.entrustTiers,
    entrustAllFeatures: loader.entrustAllFeatures,
    entrustNotes: loader.entrustNotes,
    selectedEntrustId: '',
    cartCount: 0,
    cartItems: [],
    treeRoots: loader.treeRoots,
    versionLabel: (loader.getNode('cat_new') || {}).content || '',
    showCart: false,
    showImagePreview: false
  },

  onLoad: function () {
    this.syncFromGlobal();
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

    var entrustItem = null;
    for (var i = 0; i < cartItems.length; i++) {
      if (cartItems[i].type === 'entrust') {
        entrustItem = cartItems[i];
        break;
      }
    }

    this.setData({
      cartCount: cart.getCartCount(app),
      cartItems: cartItems.slice(),
      selectedEntrustId: entrustItem ? entrustItem.id : ''
    });
  },

  onSelectEntrust: function (e) {
    var tierId = e.currentTarget.dataset.tierId;
    var app = getApp();
    var cartItems = cart.getCartItems(app);

    var existing = null;
    for (var i = 0; i < cartItems.length; i++) {
      if (cartItems[i].type === 'entrust' && cartItems[i].id === tierId) {
        existing = cartItems[i];
        break;
      }
    }

    if (existing) {
      cart.removeItem(app, existing.cartId);
    } else {
      var tier = null;
      for (var j = 0; j < loader.entrustTiers.length; j++) {
        if (loader.entrustTiers[j].id === tierId) {
          tier = loader.entrustTiers[j];
          break;
        }
      }
      if (tier) {
        cart.addItem(app, tier);
      }
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
