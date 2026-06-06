// 数据加载器 — 从 JS 配置文件构建树结构并导出
// 所有数据仅加载一次（模块缓存），后续访问零开销
//
// 数据源文件：
//   items.js      — 11 大类树形数据（纯对象声明，无工厂函数）
//   packages.js   — 5 个主推套餐
//   overview.js   — 14 条品类全包

var itemsData = require('./items.js');
var packagesData = require('./packages.js');
var overviewData = require('./overview.js');
var entrustData = require('./entrust.js');

// O(1) ID→Node 平铺映射
var nodeMap = {};

function buildTree(nodes, depth) {
  return nodes.map(function (node) {
    var hasChildren = node.children && node.children.length > 0;
    var type;
    if (hasChildren) {
      if (depth === 0) type = 'category';
      else if (depth === 1) type = 'subcategory';
      else type = 'process_group';
    } else {
      type = 'leaf';
    }

    var result = {
      id: node.id,
      name: node.name,
      type: type,
      price: node.price != null ? node.price : null,
      content: node.content || '',
      requirement: node.requirement || '',
      isLeaf: type === 'leaf',
      children: hasChildren ? buildTree(node.children, depth + 1) : []
    };

    if (node.isPerUnit) {
      result.isPerUnit = true;
      result.unitPrice = node.unitPrice;
      if (node.pickerMin != null) result.pickerMin = node.pickerMin;
      if (node.pickerMax != null) result.pickerMax = node.pickerMax;
    }

    nodeMap[result.id] = result;
    return result;
  });
}

var treeRoots = buildTree(itemsData, 0);

// packages 添加 type 字段
var packages = packagesData.map(function (p) {
  p.type = 'package';
  return p;
});

// overview 添加 type 字段
var overview = overviewData.map(function (item) {
  item.type = 'category_package';
  return item;
});

// entrust tiers — inject type and build feature lookup set
var entrustTiers = entrustData.tiers.map(function (t) {
  var featSet = {};
  for (var i = 0; i < t.features.length; i++) {
    featSet[t.features[i]] = true;
  }
  t._hasFeature = featSet;
  return t;
});

module.exports = {
  treeRoots: treeRoots,
  packages: packages,
  overview: overview,
  entrustTiers: entrustTiers,
  entrustAllFeatures: entrustData.allFeatures,
  entrustNotes: entrustData.notes,
  nodeMap: nodeMap,

  getNode: function (id) {
    return nodeMap[id] || null;
  }
};
