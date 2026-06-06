// 终末地代肝 — 任务/探索/基建 树形数据
// 编辑此文件即可增删改数据，重新部署后生效
module.exports = [
  {
    id: 'cat_main',
    name: '主线任务',
    price: 468,
    content: '',
    children: [
      { id: 'leaf_prologue', name: '序章', price: 15 },
      {
        id: 'sub_ch1',
        name: '第一章',
        price: null,
        content: '',
        children: [
          {
            id: 'pg_ch1_1',
            name: '进程一',
            price: 55,
            content: '',
            children: [
              { id: 'leaf_ch1_1_1', name: '基地解围', price: 5 },
              { id: 'leaf_ch1_1_2', name: '谷地重启', price: 5 },
              { id: 'leaf_ch1_1_3', name: '重整旗鼓', price: 10 },
              { id: 'leaf_ch1_1_4', name: '西行入谷', price: 5 },
              { id: 'leaf_ch1_1_5', name: '庇护之所', price: 5 },
              { id: 'leaf_ch1_1_6', name: '建立据点', price: 5 },
              { id: 'leaf_ch1_1_7', name: '踏破雾火', price: 5 },
              { id: 'leaf_ch1_1_8', name: '要塞决战', price: 10 },
              { id: 'leaf_ch1_1_9', name: '开拓前路', price: 5 }
            ]
          },
          {
            id: 'pg_ch1_2',
            name: '进程二',
            price: 10,
            content: '',
            children: [
              { id: 'leaf_ch1_2_1', name: '修缮进展', price: 10 }
            ]
          },
          {
            id: 'pg_ch1_3',
            name: '进程三',
            price: 80,
            content: '',
            children: [
              { id: 'leaf_ch1_3_1', name: '再度启程', price: 5 },
              { id: 'leaf_ch1_3_2', name: '穿越研究园', price: 5 },
              { id: 'leaf_ch1_3_3', name: '推开园门', price: 5 },
              { id: 'leaf_ch1_3_4', name: '园区穿行', price: 5 },
              { id: 'leaf_ch1_3_5', name: '诡楼寻踪', price: 15 },
              { id: 'leaf_ch1_3_6', name: '山道下行', price: 5 },
              { id: 'leaf_ch1_3_7', name: '矿脉断章', price: 15 },
              { id: 'leaf_ch1_3_8', name: '踏足矿脉', price: 10 },
              { id: 'leaf_ch1_3_9', name: '世代摇篮', price: 15 }
            ]
          },
          {
            id: 'pg_ch1_4',
            name: '进程四',
            price: 75,
            content: '',
            children: [
              { id: 'leaf_ch1_4_1', name: '初入终局', price: 5 },
              { id: 'leaf_ch1_4_2', name: '酝酿反击', price: 5 },
              { id: 'leaf_ch1_4_3', name: '烙铁灼痕', price: 10 },
              { id: 'leaf_ch1_4_4', name: '前线奔袭', price: 10 },
              { id: 'leaf_ch1_4_5', name: '未熄火种', price: 20 },
              { id: 'leaf_ch1_4_6', name: '余波暂平', price: 5 },
              { id: 'leaf_ch1_4_7', name: '神秘信号', price: 10 },
              { id: 'leaf_ch1_4_8', name: '四方会议', price: 10 }
            ]
          }
        ]
      },
      {
        id: 'sub_ch2',
        name: '第二章',
        price: null,
        content: '',
        children: [
          {
            id: 'pg_ch2_1',
            name: '进程一',
            price: 60,
            content: '',
            children: [
              { id: 'leaf_ch2_1_1', name: '初探武陵', price: 20 },
              { id: 'leaf_ch2_1_2', name: '初入清波寨', price: 10 },
              { id: 'leaf_ch2_1_3', name: '前往武陵城', price: 10 },
              { id: 'leaf_ch2_1_4', name: '惊鸿一瞥', price: 20 }
            ]
          },
          {
            id: 'pg_ch2_2',
            name: '进程二',
            price: 55,
            content: '',
            children: [
              { id: 'leaf_ch2_2_1', name: '东风就绪', price: 10 },
              { id: 'leaf_ch2_2_2', name: '穆如清风', price: 20 },
              { id: 'leaf_ch2_2_3', name: '潮涌汹汹', price: 20 },
              { id: 'leaf_ch2_2_4', name: '无患之患', price: 5 }
            ]
          },
          {
            id: 'pg_ch2_3',
            name: '进程三',
            price: 50,
            content: '',
            children: [
              { id: 'leaf_ch2_3_1', name: '意外来袭', price: 5 },
              { id: 'leaf_ch2_3_2', name: '深入迷途', price: 5 },
              { id: 'leaf_ch2_3_3', name: '分道扬镳', price: 15 },
              { id: 'leaf_ch2_3_4', name: '凤平水不平', price: 5 },
              { id: 'leaf_ch2_3_5', name: '又是一波起', price: 5 },
              { id: 'leaf_ch2_3_6', name: '逐波向水中', price: 5 },
              { id: 'leaf_ch2_3_7', name: '水清顽石现', price: 10 }
            ]
          },
          {
            id: 'pg_ch2_4',
            name: '进程四',
            price: 55,
            content: '',
            children: [
              { id: 'leaf_ch2_4_1', name: '水火不容', price: 5 },
              { id: 'leaf_ch2_4_2', name: '致命邀约', price: 5 },
              { id: 'leaf_ch2_4_3', name: '片缕幻影', price: 5 },
              { id: 'leaf_ch2_4_4', name: '静候光临', price: 5 },
              { id: 'leaf_ch2_4_5', name: '自由意志', price: 5 },
              { id: 'leaf_ch2_4_6', name: '浪白风初起', price: 5 },
              { id: 'leaf_ch2_4_7', name: '阵外潮起声犹震', price: 25 }
            ]
          },
          {
            id: 'pg_ch2_5',
            name: '进程五六',
            price: 40,
            content: '庄个人剧情',
            children: [
              { id: 'leaf_ch2_5_1', name: '当时携手处', price: 5 },
              { id: 'leaf_ch2_5_2', name: '墙崩因隙', price: 10 },
              { id: 'leaf_ch2_5_3', name: '大器晚成', price: 5 },
              { id: 'leaf_ch2_5_4', name: '志同道合', price: 20 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cat_activity',
    name: '常驻活动',
    price: null,
    content: '',
    children: [
      {
        id: 'sub_shixiang',
        name: '蚀像寻遗',
        price: 100,
        content: '任务刻度宝箱做满拿满',
        children: [
          { id: 'leaf_shixiang_1', name: '1-3区域', price: 45 },
          { id: 'leaf_shixiang_2', name: '4区域', price: 15 },
          { id: 'leaf_shixiang_3', name: '5-6区域', price: 40 },
          { id: 'leaf_shixiang_4', name: '低练度加价', price: 10 }
        ]
      },
      {
        id: 'sub_mijing',
        name: '密境行者',
        price: 55,
        content: '',
        children: [
          { id: 'leaf_mijing_1', name: '第一阶段', isPerUnit: true, unitPrice: 3, pickerMin: 1, pickerMax: 9 },
          { id: 'leaf_mijing_2', name: '第二阶段', isPerUnit: true, unitPrice: 5, pickerMin: 1, pickerMax: 6 }
        ]
      }
    ]
  },
  {
    id: 'cat_side_important',
    name: '支线任务（重要任务）',
    price: 228,
    content: '',
    children: [
      {
        id: 'sub_side_red',
        name: '前置任务（红色）',
        price: null,
        content: '',
        children: [
          { id: 'leaf_side_001', name: '驰援采石场系列', price: 20, requirement: '开图任务，含修复大兴起重机、深层管理区救援' },
          { id: 'leaf_side_002', name: '无色印记系列', price: 10, requirement: '2天' },
          { id: 'leaf_side_003', name: '帮人帮到底', price: 3 },
          { id: 'leaf_side_004', name: '希望与代价', price: 3 },
          { id: 'leaf_side_005', name: '再访基地系列', price: 8, requirement: '含重振士气、流言蜚语、使命虽小、再访问基地终' },
          { id: 'leaf_side_006', name: '稼精不易', price: 3 },
          { id: 'leaf_side_007', name: '环带来客', price: 10, requirement: '2天' },
          { id: 'leaf_side_008', name: '紧急求助', price: 3 },
          { id: 'leaf_side_009', name: '晚安大树系列', price: 10, requirement: '2天' },
          { id: 'leaf_side_010', name: '商路难走系列', price: 10, requirement: '含生意难做、好人难寻，2天' },
          { id: 'leaf_side_011', name: '机器人之梦', price: 3 },
          { id: 'leaf_side_012', name: '内部敌人', price: 10, requirement: '2天' },
          { id: 'leaf_side_013', name: '科学兴农', price: 3 },
          { id: 'leaf_side_014', name: '驮兽与我', price: 8 },
          { id: 'leaf_side_015', name: '虫语系列', price: 20 },
          { id: 'leaf_side_016', name: '泉中客系列', price: 10 },
          { id: 'leaf_side_017', name: '夺宝奇兵系列', price: 10 },
          { id: 'leaf_side_018', name: '重逢故人', price: 8 },
          { id: 'leaf_side_019', name: '同袍系列', price: 15, requirement: '3天' },
          { id: 'leaf_side_020', name: '重要的街角', price: 15, requirement: '3天' },
          { id: 'leaf_side_021', name: '老人与潮', price: 10, requirement: '2天' },
          { id: 'leaf_side_022', name: '再引春来系列', price: 20, requirement: '开图' },
          { id: 'leaf_side_022', name: '藏剑于谷', price: 20 }
        ]
      }
    ]
  },
  {
    id: 'cat_side_minor',
    name: '次要任务',
    price: 128,
    content: '',
    children: [
      {
        id: 'sub_side_minor',
        name: '全部次要任务',
        price: null,
        content: '',
        children: [
          { id: 'leaf_minor_001', name: '风雨欲来系列', price: 15 },
          { id: 'leaf_minor_003', name: '机械救星系列', price: 15, requirement: '含三脚架之家' },
          { id: 'leaf_minor_004', name: '职责所在', price: 3 },
          { id: 'leaf_minor_005', name: '尘封旧档', price: 3 },
          { id: 'leaf_minor_006', name: '爆破救援', price: 3, requirement: '需要爆炸物' },
          { id: 'leaf_minor_007', name: '照常升起', price: 3 },
          { id: 'leaf_minor_008', name: '幻觉', price: 3 },
          { id: 'leaf_minor_009', name: '高空救援', price: 3 },
          { id: 'leaf_minor_010', name: '维修总动员', price: 8 },
          { id: 'leaf_minor_011', name: '漏网之虫', price: 3 },
          { id: 'leaf_minor_012', name: '古董无人机', price: 3 },
          { id: 'leaf_minor_013', name: '消失的爱人', price: 3 },
          { id: 'leaf_minor_014', name: '追逐的脚步', price: 8 },
          { id: 'leaf_minor_015', name: '钟鸣三到', price: 3, requirement: '需要1000息壤' },
          { id: 'leaf_minor_016', name: '出师三剑', price: 3 },
          { id: 'leaf_minor_017', name: '检修无小事', price: 3 },
          { id: 'leaf_minor_018', name: '水中诡事', price: 8 },
          { id: 'leaf_minor_019', name: '安桩不易', price: 3 },
          { id: 'leaf_minor_020', name: '池中宝', price: 15, requirement: '需抽水' },
          { id: 'leaf_minor_021', name: '侵蚀中的呼救', price: 3 },
          { id: 'leaf_minor_022', name: '粉丝见面会', price: 5 },
          { id: 'leaf_minor_023', name: '致后来人', price: 3 },
          { id: 'leaf_minor_024', name: '分忧解难', price: 15, requirement: '需抽水' },
          { id: 'leaf_minor_024', name: '古崖论剑', price: 5 }
        ]
      }
    ]
  },
  {
    id: 'cat_story',
    name: '角色故事',
    price: 118,
    content: '',
    children: [
      {
        id: 'sub_story',
        name: '全部角色故事',
        price: null,
        content: '',
        children: [
          { id: 'leaf_story_1', name: '离群之狼', price: 20 },
          { id: 'leaf_story_2', name: '爱呐喊和原型机', price: 20 },
          { id: 'leaf_story_3', name: '追忆之痕', price: 25, requirement: '比较长' },
          { id: 'leaf_story_4', name: '信使的信', price: 20 },
          { id: 'leaf_story_5', name: '红骑士', price: 20 },
          { id: 'leaf_story_5', name: '以拳问心', price: 20 }
        ]
      }
    ]
  },
  {
    id: 'cat_explore_basic',
    name: '基础探索类',
    price: null,
    content: '探索内容包括宝箱、醚质、采录桩、大情报、机器人、赛跑等；1.3版本目前是12个大情报',
    children: [
      {
        id: 'sub_exp_basic_sg',
        name: '四号谷地',
        price: 178,
        content: '',
        children: [
          { id: 'leaf_exp_bs_1', name: '谷地通道', price: 10 },
          { id: 'leaf_exp_bs_2', name: '枢纽区', price: 60 },
          { id: 'leaf_exp_bs_3', name: '采石场', price: 20 },
          { id: 'leaf_exp_bs_4', name: '源石研究园', price: 30 },
          { id: 'leaf_exp_bs_5', name: '矿脉源区', price: 40 },
          { id: 'leaf_exp_bs_6', name: '供能高地', price: 25 }
        ]
      },
      {
        id: 'sub_exp_basic_wl',
        name: '武陵',
        price: 268,
        content: '',
        children: [
          { id: 'leaf_exp_bw_1', name: '武陵城', price: 90 },
          { id: 'leaf_exp_bw_2', name: '景玉谷', price: 35 },
          { id: 'leaf_exp_bw_3', name: '清波寨', price: 35 },
          { id: 'leaf_exp_bw_4', name: '首墩', price: 40 },
          { id: 'leaf_exp_bw_5', name: '武陵城新区域', price: 10 },
          { id: 'leaf_exp_bw_6', name: '试验园区', price: 30 },
          { id: 'leaf_exp_bw_7', name: '藏剑谷', price: 30 }
        ]
      }
    ]
  },
  {
    id: 'cat_explore_advanced',
    name: '进阶探索类',
    price: null,
    content: '基础档增加调查点收集，数量非常多，不建议收集',
    children: [
      {
        id: 'sub_exp_adv_sg',
        name: '四号谷地',
        price: 218,
        content: '',
        children: [
          { id: 'leaf_exp_as_1', name: '谷地通道', price: 10 },
          { id: 'leaf_exp_as_2', name: '枢纽区', price: 60 },
          { id: 'leaf_exp_as_3', name: '采石场', price: 20 },
          { id: 'leaf_exp_as_4', name: '源石研究园', price: 30 },
          { id: 'leaf_exp_as_5', name: '矿脉源区', price: 40 },
          { id: 'leaf_exp_as_6', name: '供能高地', price: 25 }
        ]
      },
      {
        id: 'sub_exp_adv_wl',
        name: '武陵',
        price: 318,
        content: '',
        children: [
          { id: 'leaf_exp_aw_1', name: '武陵城', price: 90 },
          { id: 'leaf_exp_aw_2', name: '景玉谷', price: 35 },
          { id: 'leaf_exp_aw_3', name: '清波寨', price: 35 },
          { id: 'leaf_exp_aw_4', name: '首墩', price: 40 },
          { id: 'leaf_exp_aw_5', name: '武陵城新区域', price: 10 },
          { id: 'leaf_exp_aw_6', name: '试验园区', price: 30 },
          { id: 'leaf_exp_aw_7', name: '藏剑谷', price: 30 }
        ]
      }
    ]
  },
  {
    id: 'cat_explore_premium',
    name: '至尊全包探索类',
    price: null,
    content: '最全面的地图全收集，前档基础上再加小档案的收集，不建议收集',
    children: [
      {
        id: 'sub_exp_prem_sg',
        name: '四号谷地',
        price: 258,
        content: '',
        children: [
          { id: 'leaf_exp_ps_1', name: '谷地通道', price: 20 },
          { id: 'leaf_exp_ps_2', name: '枢纽区', price: 80 },
          { id: 'leaf_exp_ps_3', name: '采石场', price: 30 },
          { id: 'leaf_exp_ps_4', name: '源石研究园', price: 45 },
          { id: 'leaf_exp_ps_5', name: '矿脉源区', price: 55 },
          { id: 'leaf_exp_ps_6', name: '供能高地', price: 40 }
        ]
      },
      {
        id: 'sub_exp_prem_wl',
        name: '武陵',
        price: 358,
        content: '',
        children: [
          { id: 'leaf_exp_pw_1', name: '武陵城', price: 130 },
          { id: 'leaf_exp_pw_2', name: '景玉谷', price: 45 },
          { id: 'leaf_exp_pw_3', name: '清波寨', price: 45 },
          { id: 'leaf_exp_pw_4', name: '首墩', price: 50 },
          { id: 'leaf_exp_pw_5', name: '武陵城新区域', price: 15 },
          { id: 'leaf_exp_pw_6', name: '试验园区', price: 40 },
          { id: 'leaf_exp_pw_7', name: '藏剑谷', price: 40 }
        ]
      }
    ]
  },
  {
    id: 'cat_infra_wire',
    name: '基建拉电线',
    price: null,
    content: '',
    children: [
      {
        id: 'sub_wire_sg',
        name: '四号谷地',
        price: 58,
        content: '',
        children: [
          { id: 'leaf_wire_sg_1', name: '谷地通道', price: 5 },
          { id: 'leaf_wire_sg_2', name: '枢纽区', price: 15 },
          { id: 'leaf_wire_sg_3', name: '阿伯莉采石场', price: 8, requirement: '需要完成驰援采石场系列任务' },
          { id: 'leaf_wire_sg_4', name: '源石研究园', price: 10 },
          { id: 'leaf_wire_sg_5', name: '矿脉源区', price: 20 },
          { id: 'leaf_wire_sg_6', name: '供能高地', price: 10 }
        ]
      },
      {
        id: 'sub_wire_wl',
        name: '武陵',
        price: 68,
        content: '',
        children: [
          { id: 'leaf_wire_wl_1', name: '武陵城', price: 24 },
          { id: 'leaf_wire_wl_2', name: '景玉谷', price: 10 },
          { id: 'leaf_wire_wl_3', name: '清波寨', price: 10 },
          { id: 'leaf_wire_wl_4', name: '首墩', price: 8 },
          { id: 'leaf_wire_wl_5', name: '试验园区', price: 10 },
          { id: 'leaf_wire_wl_6', name: '藏剑谷', price: 12 }
        ]
      }
    ]
  },
  {
    id: 'cat_infra_zipline',
    name: '地区拉滑索',
    price: null,
    content: '',
    children: [
      {
        id: 'sub_zipline_sg',
        name: '四号谷地',
        price: 78,
        content: '',
        children: [
          { id: 'leaf_zipline_sg_1', name: '谷地通道', price: 8 },
          { id: 'leaf_zipline_sg_2', name: '枢纽区', price: 20 },
          { id: 'leaf_zipline_sg_3', name: '阿伯莉采石场', price: 8 },
          { id: 'leaf_zipline_sg_4', name: '源石研究园', price: 15 },
          { id: 'leaf_zipline_sg_5', name: '矿脉源区', price: 25 },
          { id: 'leaf_zipline_sg_6', name: '供能高地', price: 15 }
        ]
      },
      {
        id: 'sub_zipline_wl',
        name: '武陵',
        price: 108,
        content: '',
        children: [
          { id: 'leaf_zipline_wl_1', name: '武陵城', price: 35 },
          { id: 'leaf_zipline_wl_2', name: '景玉谷', price: 15 },
          { id: 'leaf_zipline_wl_3', name: '清波寨', price: 15 },
          { id: 'leaf_zipline_wl_4', name: '首墩', price: 15 },
          { id: 'leaf_zipline_wl_5', name: '试验园区', price: 15 },
          { id: 'leaf_zipline_wl_6', name: '藏剑谷', price: 20 }
        ]
      }
    ]
  },
  {
    id: 'cat_new',
    name: '1.3新增',
    price: null,
    content: '当前游戏版本1.3',
    children: [
      { id: 'leaf_new13_1', name: '藏剑谷（开图）', price: 20 },
      { id: 'leaf_new13_2', name: '弥弗故事', price: 20 },
      { id: 'leaf_new13_3', name: '藏剑谷电线', price: 12 },
      { id: 'leaf_new13_4', name: '滑索', price: 20 },
      { id: 'leaf_new13_5', name: '毕业基建', price: 20 },
      { id: 'leaf_new13_6', name: '藏剑谷探索全收集基础档', price: 30, content: '宝箱醚质大情报等' },
      { id: 'leaf_new13_7', name: '探索全收集进阶档', price: 35, content: '多个调查点' },
      { id: 'leaf_new13_8', name: '探索全收集至尊档', price: 40, content: '还多个小档案' },
      { id: 'leaf_new13_9', name: '古崖论剑', price: 3 }
    ]
  }
];
