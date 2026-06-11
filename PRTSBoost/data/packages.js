// 终末地代肝 — 主推套餐数据
// 编辑此文件即可增删改套餐，重新部署后生效
module.exports = [
  {
    id: 'pkg_1',
    name: '套餐一：四号谷地开荒套餐',
    content: '四号谷地主线 + 重要支线（不含角色任务）+ 拉线开矿 + 基建',
    requirement: '地区发展等级至少10级，三个据点都至少3级',
    price: 500,
    variant: null
  },
  {
    id: 'pkg_2',
    name: '套餐二：武陵开荒套餐',
    content: '武陵主线 + 重要支线 + 拉线开矿 + 基建',
    requirement: '地区建设达到8级，据点2级',
    price: 520,
    variant: null
  },
  {
    id: 'pkg_3',
    name: '套餐三：四号谷地毕业套餐',
    content: '四谷地所有任务（不含活动任务）+ 电线滑索 + 基建',
    requirement: '地区发展等级12级，三个据点都4级，全收集（至尊档标准，可换挡调价）',
    price: 950,
    variant: {
      name: '不含全收集',
      price: 690
    }
  },
  {
    id: 'pkg_4',
    name: '套餐四：武陵毕业套餐',
    content: '武陵地区所有任务（不含活动任务）+ 电线滑索 + 基建',
    requirement: '地区建设达到18级，据点当前版本满级，全收集（至尊档标准，可换挡调价）',
    price: 1150,
    variant: {
      name: '不含全收集',
      price: 820
    }
  },
  {
    id: 'pkg_5',
    name: '套餐五：省心一条龙套餐',
    content: '包括以上两套餐（四号谷地 + 武陵）所有内容',
    requirement: '',
    price: 2100,
    variant: null
  }
];
