// cart-popup 组件 — 购物车底部弹窗
const cart = require('../../utils/cart');

Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    cartItems: {
      type: Array,
      value: []
    },
    treeRoots: {
      type: Array,
      value: []
    }
  },

  observers: {
    'cartItems': function () {
      this.refresh();
    },
    'show': function (val) {
      if (val) {
        this.refresh();
      }
    }
  },

  data: {
    groupedItems: [],
    total: 0
  },

  methods: {
    refresh: function () {
      const app = getApp();
      const grouped = cart.getGroupedItems(app, this.data.treeRoots);
      const total = cart.getCartTotal(app, this.data.treeRoots);
      this.setData({
        groupedItems: grouped,
        total: total
      });
    },

    // 关闭弹窗
    onClose: function () {
      this.triggerEvent('close');
    },

    // 阻止点击弹窗内容时冒泡到遮罩
    onContentTap: function () {
      // no-op, prevent mask close
    },

    // 删除项目
    onRemove: function (e) {
      const cartId = e.currentTarget.dataset.cartId;
      cart.removeItem(getApp(), cartId);
      this.triggerEvent('cart-changed');
      this.refresh();
    },

    // 调整数量（按关计价项目）
    onQuantityChange: function (e) {
      const cartId = e.currentTarget.dataset.cartId;
      const delta = parseInt(e.currentTarget.dataset.delta) || 0;
      cart.updateQuantity(getApp(), cartId, delta);
      this.triggerEvent('cart-changed');
      this.refresh();
    },

    // 一键清空购物车
    onClearAll: function () {
      var self = this;
      wx.showModal({
        title: '清空购物车',
        content: '确定要移除购物车中所有项目吗？',
        success: function (res) {
          if (res.confirm) {
            cart.clearCart(getApp());
            self.triggerEvent('cart-changed');
            self.refresh();
          }
        }
      });
    },

    // 生成汇总图片
    onGenerate: function () {
      if (this.data.total === 0) return;
      this.triggerEvent('generate');
    }
  }
});
