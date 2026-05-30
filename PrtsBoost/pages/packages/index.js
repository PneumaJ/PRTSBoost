// 套餐页 — 主推优惠套餐展示
const packageData = require('../../data/packages');
const treeData = require('../../data/items');
const cart = require('../../utils/cart');

Page({
  data: {
    packages: packageData,
    cartCount: 0,
    cartItems: [],
    showCart: false,
    showImagePreview: false,
    pkgSelected: {},
    treeRoots: treeData,
    // 变体选择: { 'pkg_3': 'default'|'variant', 'pkg_4': 'default'|'variant' }
    variants: {}
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

  // 从 globalData 同步状态，直接以购物车数据为唯一真相源
  syncFromGlobal: function () {
    const app = getApp();
    const cartItems = cart.getCartItems(app);
    // 从购物车中提取当前选中的套餐，构建 pkgSelected 查找映射
    const pkgSelected = {};
    for (var i = 0; i < cartItems.length; i++) {
      if (cartItems[i].type === 'package') {
        pkgSelected[cartItems[i].id] = true;
      }
    }
    this.setData({
      cartCount: cart.getCartCount(app),
      cartItems: cartItems.slice(),
      pkgSelected: pkgSelected
    });
  },

  // 加入/切换套餐 — 直接以购物车状态判断而非 selectedPackageIds
  onAddPackage: function (e) {
    const pkgId = e.currentTarget.dataset.pkgId;
    const pkg = packageData.find(p => p.id === pkgId);
    if (!pkg) return;

    const app = getApp();
    const variantKey = this.data.variants[pkgId] || 'default';

    // 直接检查购物车中是否已有该套餐
    const existingItem = app.globalData.cartItems.find(
      item => item.id === pkgId && item.type === 'package'
    );

    if (existingItem) {
      // 已选中 → 移除（cartId + fallbackId 双重保险）
      cart.removeItem(app, existingItem.cartId, pkgId);
    } else {
      // 未选中 → 添加
      cart.addItem(app, pkg, variantKey);
    }

    this.syncFromGlobal();
  },

  // 切换变体
  onVariantChange: function (e) {
    const pkgId = e.currentTarget.dataset.pkgId;
    const variantKey = e.currentTarget.dataset.variantKey;
    const app = getApp();

    // 更新变体UI状态
    const variants = { ...this.data.variants };
    variants[pkgId] = variantKey;
    this.setData({ variants: variants });

    // 如果当前选中该套餐，重新添加以更新购物车中的变体
    const existingItem = app.globalData.cartItems.find(
      item => item.id === pkgId && item.type === 'package'
    );
    if (existingItem) {
      cart.removeItem(app, existingItem.cartId, pkgId);
      const pkg = packageData.find(p => p.id === pkgId);
      if (pkg) {
        cart.addItem(app, pkg, variantKey);
      }
    }

    this.syncFromGlobal();
  },

  // 购物车按钮
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
