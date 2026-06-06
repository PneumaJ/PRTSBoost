// 托管套餐 — 3 档互斥选择，每档包含不同特性
var ALL_FEATURES = ['日活', '帝江号', '信用点', '理智', '周常', '送货', '据点交易+倒卖', '拍照'];

module.exports = {
  allFeatures: ALL_FEATURES,
  tiers: [
    {
      id: 'entrust_day',
      name: '日托',
      price: 48,
      period: '月',
      features: ['日活', '帝江号', '信用点'],
      type: 'entrust'
    },
    {
      id: 'entrust_standard',
      name: '体托',
      price: 68,
      period: '月',
      features: ['日活', '帝江号', '信用点', '理智'],
      type: 'entrust'
    },
    {
      id: 'entrust_premium',
      name: '精托',
      price: 128,
      period: '月',
      features: ALL_FEATURES,
      type: 'entrust'
    }
  ],
  notes: '限时活动单独算价，具体价格可根据老板实际需求调整。好友助力10r/月; 收菜15r/月; 稀有材料有滑索15r/趟,无滑索30r/趟'
};
