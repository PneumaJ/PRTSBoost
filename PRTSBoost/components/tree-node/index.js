// tree-node 组件 — 渲染单个树节点行
const cart = require('../../utils/cart');

Component({
  properties: {
    node: {
      type: Object,
      value: null
    },
    depth: {
      type: Number,
      value: 0
    },
    checkedIds: {
      type: Array,
      value: []
    },
    expandedIds: {
      type: Array,
      value: []
    },
    refreshStamp: {
      type: Number,
      value: 0
    }
  },

  observers: {
    'node, checkedIds, expandedIds, refreshStamp': function (node, checkedIds, expandedIds) {
      this._applyState(node, checkedIds || [], expandedIds || []);
    }
  },

  data: {
    hasChildren: false,
    checkState: 'unchecked',
    isExpanded: false,
    indent: 0,
    showCheckbox: true,
    showInfoModal: false,
    localQuantity: 1,
    usePicker: false,
    pickerOptions: [],
    pickerValue: 0
  },

  lifetimes: {
    attached: function () {
      this._applyState(
        this.properties.node,
        this.properties.checkedIds || [],
        this.properties.expandedIds || []
      );
    }
  },

  methods: {
    _applyState: function (node, checkedIds, expandedIds) {
      if (!node) return;

      var hasChildren = node.children && node.children.length > 0;

      var checkState = 'unchecked';
      if (node.isLeaf) {
        checkState = checkedIds.indexOf(node.id) >= 0 ? 'checked' : 'unchecked';
      } else if (hasChildren) {
        var leafIds = cart.collectLeafIds(node);
        if (leafIds.length > 0) {
          var checkedCount = 0;
          for (var i = 0; i < leafIds.length; i++) {
            if (checkedIds.indexOf(leafIds[i]) >= 0) checkedCount++;
          }
          if (checkedCount === 0) {
            checkState = 'unchecked';
          } else if (checkedCount === leafIds.length) {
            checkState = 'checked';
          } else {
            checkState = 'partial';
          }
        }
      }

      var isExpanded = expandedIds.indexOf(node.id) >= 0;
      var showCheckbox = node.isLeaf || node.price != null || node.isPerUnit;

      var localQuantity = this.data.localQuantity || 1;
      if (node.isPerUnit) {
        var app = getApp();
        var cartItems = app.globalData.cartItems;
        for (var j = 0; j < cartItems.length; j++) {
          if (cartItems[j].id === node.id && cartItems[j].isLeaf) {
            localQuantity = cartItems[j].quantity || 1;
            break;
          }
        }
      }

      var usePicker = node.pickerMin != null && node.pickerMax != null;
      var pickerOptions = this.data.pickerOptions;
      var pickerValue = this.data.pickerValue;
      if (usePicker) {
        pickerOptions = [];
        for (var p = node.pickerMin; p <= node.pickerMax; p++) {
          pickerOptions.push(String(p));
        }
        pickerValue = Math.max(0, localQuantity - node.pickerMin);
      }

      this.setData({
        hasChildren: hasChildren,
        checkState: checkState,
        isExpanded: isExpanded,
        indent: this.properties.depth * 36,
        showCheckbox: showCheckbox,
        localQuantity: localQuantity,
        usePicker: usePicker,
        pickerOptions: pickerOptions,
        pickerValue: pickerValue
      });
    },

    onCheckTap: function () {
      var node = this.properties.node;
      if (!node.isLeaf && this.data.hasChildren) {
        this.triggerEvent('toggle-check-all', { nodeId: node.id });
      } else if (node.isLeaf) {
        this.triggerEvent('toggle-check', { nodeId: node.id, quantity: this.data.localQuantity });
      }
    },

    onRowTap: function () {
      var node = this.properties.node;
      if (node.isLeaf) {
        this.triggerEvent('toggle-check', { nodeId: node.id, quantity: this.data.localQuantity });
      } else if (this.data.hasChildren) {
        this.triggerEvent('toggle-expand', { nodeId: node.id });
      }
    },

    onInfoTap: function () {
      this.setData({ showInfoModal: true });
    },

    onInfoModalClose: function () {
      this.setData({ showInfoModal: false });
    },

    onQtyMinus: function () {
      var qty = Math.max(1, this.data.localQuantity - 1);
      this.setData({ localQuantity: qty });
      this.triggerEvent('quantity-change', {
        nodeId: this.properties.node.id,
        quantity: qty
      });
    },

    onQtyPlus: function () {
      var qty = this.data.localQuantity + 1;
      this.setData({ localQuantity: qty });
      this.triggerEvent('quantity-change', {
        nodeId: this.properties.node.id,
        quantity: qty
      });
    },

    onQtyPick: function (e) {
      var node = this.properties.node;
      var val = parseInt(e.detail.value, 10) + (node.pickerMin || 1);
      this.setData({ localQuantity: val, pickerValue: e.detail.value });
      this.triggerEvent('quantity-change', {
        nodeId: node.id,
        quantity: val
      });
    },

    onQtyInput: function (e) {
      var val = parseInt(e.detail.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      this.setData({ localQuantity: val });
      this.triggerEvent('quantity-change', {
        nodeId: this.properties.node.id,
        quantity: val
      });
    },

    onArrowTap: function () {
      var node = this.properties.node;
      if (!node.isLeaf && this.data.hasChildren) {
        this.triggerEvent('toggle-expand', { nodeId: node.id });
      }
    }
  }
});
