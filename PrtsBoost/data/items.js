// 终末地代肝 — 任务/探索/基建 树形数据
// 三层结构: 大类(category) > 子类(subcategory) > 叶子(leaf)
// 无冗余中间层：若子类下无有意义的进程组划分，叶子直接挂在子类下

function node(id, name, type, price, content, requirement, children) {
  return {
    id, name,
    content: content || '',
    requirement: requirement || '',
    price: price || null,
    type: type,
    children: children || [],
    isLeaf: type === 'leaf'
  };
}

function cat(id, name, price, content, children) {
  return node(id, name, 'category', price, content, '', children);
}

function sub(id, name, price, content, children) {
  return node(id, name, 'subcategory', price, content, '', children);
}

function leaf(id, name, price, requirement) {
  return node(id, name, 'leaf', price, '', requirement);
}

function pg(id, name, price, children) {
  return node(id, name, 'process_group', price, '', '', children);
}

function perUnitLeaf(id, name, unitPrice, requirement) {
  var n = node(id, name, 'leaf', null, '', requirement);
  n.isPerUnit = true;
  n.unitPrice = unitPrice;
  return n;
}

module.exports = [

  // ==================== 主线任务 ====================
  cat('cat_main', '主线任务', 428, '', [
    // 序章 — 无子分类，直接叶子
    leaf('leaf_prologue', '序章', 15),
    // 第一章 — 有进程组划分
    sub('sub_ch1', '第一章', null, '', [
      pg('pg_ch1_1', '进程一', 55, [
        leaf('leaf_ch1_1_1', '基地解围', 5),
        leaf('leaf_ch1_1_2', '谷地重启', 5),
        leaf('leaf_ch1_1_3', '重整旗鼓', 10),
        leaf('leaf_ch1_1_4', '西行入谷', 5),
        leaf('leaf_ch1_1_5', '庇护之所', 5),
        leaf('leaf_ch1_1_6', '建立据点', 5),
        leaf('leaf_ch1_1_7', '踏破雾火', 5),
        leaf('leaf_ch1_1_8', '要塞决战', 10),
        leaf('leaf_ch1_1_9', '开拓前路', 5)
      ]),
      pg('pg_ch1_2', '进程二', 10, [
        leaf('leaf_ch1_2_1', '修缮进展', 10)
      ]),
      pg('pg_ch1_3', '进程三', 80, [
        leaf('leaf_ch1_3_1', '再度启程', 5),
        leaf('leaf_ch1_3_2', '穿越研究园', 5),
        leaf('leaf_ch1_3_3', '推开园门', 5),
        leaf('leaf_ch1_3_4', '园区穿行', 5),
        leaf('leaf_ch1_3_5', '诡楼寻踪', 15),
        leaf('leaf_ch1_3_6', '山道下行', 5),
        leaf('leaf_ch1_3_7', '矿脉断章', 15),
        leaf('leaf_ch1_3_8', '踏足矿脉', 10),
        leaf('leaf_ch1_3_9', '世代摇篮', 15)
      ]),
      pg('pg_ch1_4', '进程四', 75, [
        leaf('leaf_ch1_4_1', '初入终局', 5),
        leaf('leaf_ch1_4_2', '酝酿反击', 5),
        leaf('leaf_ch1_4_3', '烙铁灼痕', 10),
        leaf('leaf_ch1_4_4', '前线奔袭', 10),
        leaf('leaf_ch1_4_5', '未熄火种', 20),
        leaf('leaf_ch1_4_6', '余波暂平', 5),
        leaf('leaf_ch1_4_7', '神秘信号', 10),
        leaf('leaf_ch1_4_8', '四方会议', 10)
      ])
    ]),
    // 第二章 — 有进程组划分
    sub('sub_ch2', '第二章', null, '', [
      pg('pg_ch2_1', '进程一', 60, [
        leaf('leaf_ch2_1_1', '初探武陵', 20),
        leaf('leaf_ch2_1_2', '初入清波寨', 10),
        leaf('leaf_ch2_1_3', '前往武陵城', 10),
        leaf('leaf_ch2_1_4', '惊鸿一瞥', 20)
      ]),
      pg('pg_ch2_2', '进程二', 55, [
        leaf('leaf_ch2_2_1', '东风就绪', 10),
        leaf('leaf_ch2_2_2', '穆如清风', 20),
        leaf('leaf_ch2_2_3', '潮涌汹汹', 20),
        leaf('leaf_ch2_2_4', '无患之患', 5)
      ]),
      pg('pg_ch2_3', '进程三', 40, [
        leaf('leaf_ch2_3_1', '推到打完阮一', 20),
        leaf('leaf_ch2_3_2', '汤汤个人', 20)
      ]),
      pg('pg_ch2_4', '进程四', 25, [
        leaf('leaf_ch2_4_1', '打完BOSS', 25)
      ]),
      pg('pg_ch2_5', '进程五六', 20, [
        leaf('leaf_ch2_5_1', '庄个人剧情', 20)
      ])
    ])
  ]),

  // ==================== 常驻活动 ====================
  cat('cat_activity', '常驻活动', null, '', [
    sub('sub_shixiang', '蚀像寻遗', 100, '任务刻度宝箱做满拿满', [
      leaf('leaf_shixiang_1', '1-3区域', 45),
      leaf('leaf_shixiang_2', '4区域', 15),
      leaf('leaf_shixiang_3', '5-6区域', 40),
      leaf('leaf_shixiang_4', '低练度加价', 10)
    ]),
    sub('sub_mijing', '密境行者', 55, '', [
      perUnitLeaf('leaf_mijing_1', '第一阶段', 3),
      perUnitLeaf('leaf_mijing_2', '二阶段', 5)
    ])
  ]),

  // ==================== 支线任务（重要任务） ====================
  cat('cat_side_important', '支线任务（重要任务）', 208, '', [
    sub('sub_side_red', '前置任务（红色）', null, '', [
      leaf('leaf_side_001', '驰援采石场系列', 20, '开图任务，含修复大兴起重机、深层管理区救援'),
      leaf('leaf_side_002', '无色印记系列', 10, '2天'),
      leaf('leaf_side_003', '帮人帮到底', 3),
      leaf('leaf_side_004', '希望与代价', 3),
      leaf('leaf_side_005', '再访基地系列', 8, '含重振士气、流言蜚语、使命虽小、再访问基地终'),
      leaf('leaf_side_006', '稼精不易', 3),
      leaf('leaf_side_007', '环带来客', 10, '2天'),
      leaf('leaf_side_008', '紧急求助', 3),
      leaf('leaf_side_009', '晚安大树系列', 10, '2天'),
      leaf('leaf_side_010', '商路难走系列', 10, '含生意难做、好人难寻，2天'),
      leaf('leaf_side_011', '机器人之梦', 3),
      leaf('leaf_side_012', '内部敌人', 10, '2天'),
      leaf('leaf_side_013', '科学兴农', 3),
      leaf('leaf_side_014', '驮兽与我', 8),
      leaf('leaf_side_015', '虫语系列', 20),
      leaf('leaf_side_016', '泉中客系列', 10),
      leaf('leaf_side_017', '夺宝奇兵系列', 10),
      leaf('leaf_side_018', '重逢故人', 8),
      leaf('leaf_side_019', '同袍系列', 15, '3天'),
      leaf('leaf_side_020', '重要的街角', 15, '3天'),
      leaf('leaf_side_021', '老人与潮', 10, '2天'),
      leaf('leaf_side_022', '再引春来系列', 20, '开图')
    ])
  ]),

  // ==================== 次要任务 ====================
  cat('cat_side_minor', '次要任务', 123, '', [
    sub('sub_side_minor', '全部次要任务', null, '', [
      leaf('leaf_minor_001', '风雨欲来系列', 15),
      leaf('leaf_minor_003', '机械救星系列', 15, '含三脚架之家'),
      leaf('leaf_minor_004', '职责所在', 3),
      leaf('leaf_minor_005', '尘封旧档', 3),
      leaf('leaf_minor_006', '爆破救援', 3, '需要爆炸物'),
      leaf('leaf_minor_007', '照常升起', 3),
      leaf('leaf_minor_008', '幻觉', 3),
      leaf('leaf_minor_009', '高空救援', 3),
      leaf('leaf_minor_010', '维修总动员', 8),
      leaf('leaf_minor_011', '漏网之虫', 3),
      leaf('leaf_minor_012', '古董无人机', 3),
      leaf('leaf_minor_013', '消失的爱人', 3),
      leaf('leaf_minor_014', '追逐的脚步', 8),
      leaf('leaf_minor_015', '钟鸣三到', 3, '需要1000息壤'),
      leaf('leaf_minor_016', '出师三剑', 3),
      leaf('leaf_minor_017', '检修无小事', 3),
      leaf('leaf_minor_018', '水中诡事', 8),
      leaf('leaf_minor_019', '安桩不易', 3),
      leaf('leaf_minor_020', '池中宝', 15, '需抽水'),
      leaf('leaf_minor_021', '侵蚀中的呼救', 3),
      leaf('leaf_minor_022', '粉丝见面会', 5),
      leaf('leaf_minor_023', '致后来人', 3),
      leaf('leaf_minor_024', '分忧解难', 15, '需抽水')
    ])
  ]),

  // ==================== 角色故事 ====================
  cat('cat_story', '角色故事', 98, '', [
    sub('sub_story', '全部角色故事', null, '', [
      leaf('leaf_story_1', '离群之狼', 20),
      leaf('leaf_story_2', '爱呐喊和原型机', 20),
      leaf('leaf_story_3', '追忆之痕', 25, '比较长'),
      leaf('leaf_story_4', '信使的信', 20),
      leaf('leaf_story_5', '红骑士', 20)
    ])
  ]),

  // ==================== 功能任务 ====================
  cat('cat_functional', '功能任务', null, '遇到的顺手清', []),

  // ==================== 基础探索类 ====================
  cat('cat_explore_basic', '基础探索类', null, '探索内容包括宝箱、醚质、采录桩、大情报、机器人等；1.2版本目前是11个大情报', [
    sub('sub_exp_basic_sg', '四号谷地', 178, '', [
      leaf('leaf_exp_bs_1', '谷地通道', 10),
      leaf('leaf_exp_bs_2', '枢纽区', 60),
      leaf('leaf_exp_bs_3', '采石场', 20),
      leaf('leaf_exp_bs_4', '源石研究园', 30),
      leaf('leaf_exp_bs_5', '矿脉源区', 40),
      leaf('leaf_exp_bs_6', '供能高地', 25)
    ]),
    sub('sub_exp_basic_wl', '武陵', 228, '', [
      leaf('leaf_exp_bw_1', '武陵城', 90),
      leaf('leaf_exp_bw_2', '景玉谷', 35),
      leaf('leaf_exp_bw_3', '清波寨', 35),
      leaf('leaf_exp_bw_4', '首墩', 40),
      leaf('leaf_exp_bw_5', '武陵城新区域', 10),
      leaf('leaf_exp_bw_6', '试验园区', 30)
    ])
  ]),

  // ==================== 至尊全包探索类 ====================
  cat('cat_explore_premium', '至尊全包探索类', null, '最全面的地图全收集。探索内容含宝箱、醚质、采录桩、调查点、大情报、小档案、机器人等。地图上能收集的都收集到，1.2版本全档案是391个。未完成的支线也会顺手清一下（但不保证都清完）', [
    sub('sub_exp_prem_sg', '四号谷地', 258, '', [
      leaf('leaf_exp_ps_1', '谷地通道', 20),
      leaf('leaf_exp_ps_2', '枢纽区', 80),
      leaf('leaf_exp_ps_3', '采石场', 30),
      leaf('leaf_exp_ps_4', '源石研究园', 45),
      leaf('leaf_exp_ps_5', '矿脉源区', 55),
      leaf('leaf_exp_ps_6', '供能高地', 40)
    ]),
    sub('sub_exp_prem_wl', '武陵', 318, '', [
      leaf('leaf_exp_pw_1', '武陵城', 130),
      leaf('leaf_exp_pw_2', '景玉谷', 45),
      leaf('leaf_exp_pw_3', '清波寨', 45),
      leaf('leaf_exp_pw_4', '首墩', 50),
      leaf('leaf_exp_pw_5', '武陵城新区域', 15),
      leaf('leaf_exp_pw_6', '试验园区', 40)
    ])
  ]),

  // ==================== 1.2下半新增 ====================
  cat('cat_new_1_2', '1.2下半新增', null, '', [
    sub('sub_new', '新增项目', null, '', [
      leaf('leaf_new_1', '再引春来系列', 20, '开图'),
      leaf('leaf_new_2', '试验园区探索', 40),
      leaf('leaf_new_3', '试验园区探索（不包调查点小档案）', 30),
      leaf('leaf_new_4', '电线', 10),
      leaf('leaf_new_5', '滑索', 15),
      leaf('leaf_new_6', '基建（1.2上半已毕业）', 5, '具体根据账号进度来定'),
      leaf('leaf_new_7', '分忧解难', 15, '需抽水')
    ])
  ]),

  // ==================== 基建拉电线 ====================
  cat('cat_infra_wire', '基建拉电线', null, '', [
    sub('sub_wire_sg', '四号谷地', 58, '', [
      leaf('leaf_wire_sg_1', '谷地通道', 5),
      leaf('leaf_wire_sg_2', '枢纽区', 15),
      leaf('leaf_wire_sg_3', '阿伯莉采石场', 8, '需要完成驰援采石场系列任务'),
      leaf('leaf_wire_sg_4', '源石研究园', 10),
      leaf('leaf_wire_sg_5', '矿脉源区', 20),
      leaf('leaf_wire_sg_6', '供能高地', 10)
    ]),
    sub('sub_wire_wl', '武陵', 58, '', [
      leaf('leaf_wire_wl_1', '武陵城', 24),
      leaf('leaf_wire_wl_2', '景玉谷', 10),
      leaf('leaf_wire_wl_3', '清波寨', 10),
      leaf('leaf_wire_wl_4', '首墩', 8),
      leaf('leaf_wire_wl_5', '试验园区', 10)
    ])
  ]),

  // ==================== 地区拉滑索 ====================
  cat('cat_infra_zipline', '地区拉滑索', null, '', [
    sub('sub_zipline_sg', '四号谷地', 78, '', [
      leaf('leaf_zipline_sg_1', '谷地通道', 8),
      leaf('leaf_zipline_sg_2', '枢纽区', 20),
      leaf('leaf_zipline_sg_3', '阿伯莉采石场', 8),
      leaf('leaf_zipline_sg_4', '源石研究园', 15),
      leaf('leaf_zipline_sg_5', '矿脉源区', 25),
      leaf('leaf_zipline_sg_6', '供能高地', 15)
    ]),
    sub('sub_zipline_wl', '武陵', 88, '', [
      leaf('leaf_zipline_wl_1', '武陵城', 35),
      leaf('leaf_zipline_wl_2', '景玉谷', 15),
      leaf('leaf_zipline_wl_3', '清波寨', 15),
      leaf('leaf_zipline_wl_4', '首墩', 15),
      leaf('leaf_zipline_wl_5', '试验园区', 15)
    ])
  ])
];
