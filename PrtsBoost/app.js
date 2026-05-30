// 终末地代肝选购助手
App({
  globalData: {
    // 购物车: [{ id, name, price, type, cartId, addedAt, ... }]
    cartItems: [],
    // 当前选中的套餐 ID 列表（套餐 1-4 可多选，套餐 5 与 1-4 互斥）
    selectedPackageIds: []
  },

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: '',
        traceUser: true
      });
    }
  }
});
