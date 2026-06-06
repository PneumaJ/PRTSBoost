// image-preview 组件 — 全屏图片预览 + Canvas 绘制
const canvasRenderer = require('../../utils/canvas-renderer');
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
    },
    versionLabel: {
      type: String,
      value: ''
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

          // 计算画布尺寸（getGroupedItems 只算一次，calcHeight + render 共用）
          const dpr = wx.getSystemInfoSync().pixelRatio;
          const width = 375;
          const app = getApp();
          const groupedItems = cart.getGroupedItems(app, treeRoots);
          const height = canvasRenderer.calcHeight(groupedItems);

          canvas.width = width * dpr;
          canvas.height = height * dpr;
          ctx.scale(dpr, dpr);

          this.setData({
            canvasWidth: width,
            canvasHeight: height
          });

          // 加载右下角 Logo
          const prtsImg = canvas.createImage();
          prtsImg.src = '/images/prts.jpg';
          prtsImg.onload = () => {
            canvasRenderer.render(ctx, width, height, groupedItems, cartItems, treeRoots, prtsImg, this.data.versionLabel);
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
          };
          prtsImg.onerror = () => {
            // Logo 加载失败，继续渲染（不含 Logo）
            canvasRenderer.render(ctx, width, height, groupedItems, cartItems, treeRoots, undefined, this.data.versionLabel);
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
          };
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
