// image-preview 组件 — 全屏图片预览 + Canvas 绘制
const canvasRenderer = require('../../utils/canvas-renderer');

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

  data: {
    imagePath: '',
    loading: false,
    canvasWidth: 375,
    canvasHeight: 600
  },

  observers: {
    'show': function (val) {
      if (val) {
        this.generateImage();
      }
    }
  },

  methods: {
    generateImage: function () {
      const cartItems = this.data.cartItems;
      const treeRoots = this.data.treeRoots;
      if (cartItems.length === 0) return;

      this.setData({ loading: true });

      const query = this.createSelectorQuery();
      query.select('#summary-canvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res || !res[0] || !res[0].node) {
            console.error('Canvas node not found');
            this.setData({ loading: false });
            return;
          }

          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');

          // 计算画布尺寸
          const dpr = wx.getSystemInfoSync().pixelRatio;
          const width = 375;
          const height = canvasRenderer.calcHeight(cartItems, treeRoots);

          canvas.width = width * dpr;
          canvas.height = height * dpr;
          ctx.scale(dpr, dpr);

          this.setData({
            canvasWidth: width,
            canvasHeight: height
          });

          // 绘制
          canvasRenderer.render(ctx, width, height, cartItems, treeRoots);

          // 导出图片
          wx.canvasToTempFilePath({
            canvas: canvas,
            success: (res) => {
              this.setData({
                imagePath: res.tempFilePath,
                loading: false
              });
            },
            fail: (err) => {
              console.error('Canvas export failed:', err);
              this.setData({ loading: false });
              wx.showToast({ title: '图片生成失败，请重试', icon: 'none' });
            }
          });
        });
    },

    onClose: function () {
      this.triggerEvent('close');
    },

    onContainerTap: function () {
      // 阻止冒泡（点击图片区域不关闭）
    }
  }
});
