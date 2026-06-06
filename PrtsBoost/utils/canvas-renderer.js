// Canvas 渲染器 — 将购物车数据绘制为汇总图片
const cart = require('./cart');

/**
 * 计算画布所需高度
 */
function calcHeight(groupedItems) {
  let totalItems = 0;
  let groupCount = groupedItems.length;

  for (const g of groupedItems) {
    totalItems += g.items.length;
  }

  // 顶部: 标题40 + 日期24 + 版本21 + 分隔线20 + padding 60 = ~165
  // 分组标题: 每个30px
  // 项目行: 每行24px
  // 底部: 分隔线20 + 总计40 + 提示24 + padding 40 = ~124
  const height = 165 + groupCount * 30 + totalItems * 30 + 124 + 40;
  return Math.max(height, 400);
}

/**
 * Canvas 2D 绘制汇总图
 */
function render(ctx, width, height, groupedItems, cartItems, treeRoots, prtsImg, versionLabel) {
  const total = cart.getCartTotal(getApp(), treeRoots);

  // 背景
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  let y = 40;

  // 标题
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PRTSBoost — 选购清单', width / 2, y);
  y += 30;

  // 日期（精确到秒）
  const now = new Date();
  const pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  const dateStr = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日 ' +
    pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
  ctx.fillStyle = '#999999';
  ctx.font = '14px sans-serif';
  ctx.fillText(dateStr, width / 2, y);
  y += 24;

  // 版本标签
  if (versionLabel) {
    ctx.fillStyle = 'rgba(153, 153, 153, 0.5)';
    ctx.font = '11px sans-serif';
    ctx.fillText(versionLabel, width / 2, y);
    y += 21;
  }

  // 分隔线
  y += 10;
  ctx.strokeStyle = '#EEEEEE';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(24, y);
  ctx.lineTo(width - 24, y);
  ctx.stroke();
  y += 20;

  // 分组和项目
  ctx.textAlign = 'left';
  for (const group of groupedItems) {
    // 分组标题
    ctx.fillStyle = '#999999';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('【' + group.groupName + '】', 24, y);
    y += 28;

    // 项目列表
    for (const item of group.items) {
      let itemName = item.name;
      let itemPrice = '';

      if (item.variantKey === 'variant' && item.variant) {
        itemName += '（' + item.variant.name + '）';
        itemPrice = item.variant.price + 'r';
      } else if (item.isPerUnit) {
        itemName += ' ×' + (item.quantity || 1);
        itemPrice = ((item.unitPrice || 0) * (item.quantity || 1)) + 'r';
      } else {
        itemPrice = (item.price || 0) + 'r';
      }

      // 名称（左侧，可能需要截断）
      ctx.fillStyle = '#333333';
      ctx.font = '14px sans-serif';
      const maxNameWidth = width - 100;
      let displayName = itemName;
      let nameWidth = ctx.measureText(itemName).width;
      if (nameWidth > maxNameWidth) {
        // 截断 + 省略号
        while (ctx.measureText(displayName + '...').width > maxNameWidth && displayName.length > 0) {
          displayName = displayName.slice(0, -1);
        }
        displayName += '...';
      }
      ctx.fillText(displayName, 24, y);

      // 价格（右侧）
      ctx.fillStyle = '#E54545';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(itemPrice, width - 24, y);
      ctx.textAlign = 'left';

      y += 26;
    }

    y += 4;
  }

  // 分隔线
  y += 10;
  ctx.strokeStyle = '#EEEEEE';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(24, y);
  ctx.lineTo(width - 24, y);
  ctx.stroke();
  y += 20;

  // 底部总价区域背景图 — 与画布等宽，底部对齐，低透明度衬底
  if (prtsImg) {
    var bgImgH = (prtsImg.height / prtsImg.width) * width;
    var bgImgY = height - bgImgH;
    ctx.globalAlpha = 0.10;
    ctx.drawImage(prtsImg, 0, bgImgY, width, bgImgH);
    ctx.globalAlpha = 1;
  }

  // 总价 — 标签左对齐，价格居中
  ctx.fillStyle = '#999999';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('总计', 24, y);
  y += 22;

  ctx.fillStyle = '#E54545';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(total + 'r', width / 2, y);
  y += 34;

  // 底部提示
  ctx.fillStyle = '#999999';
  ctx.font = '12px sans-serif';
  ctx.fillText('请截图保存此图片', width / 2, y);
}

module.exports = {
  calcHeight: calcHeight,
  render: render
};
