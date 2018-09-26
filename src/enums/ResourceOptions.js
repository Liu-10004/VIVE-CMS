const models = [
  {
    value: '3D 模型',
    label: '3D 模型',
    children: [
      {
        value: '人物',
        label: '人物',
        children: [
          {
            value: '古代人物',
            label: '古代人物',
          },
          {
            value: '现代人物',
            label: '现代人物',
          },
          {
            value: '动漫人物',
            label: '动漫人物',
          },
          {
            value: '神话人物',
            label: '神话人物',
          },
          {
            value: '机器人',
            label: '机器人',
          },
          {
            value: '外星人',
            label: '外星人',
          },
          {
            value: '人体结构',
            label: '人体结构',
          },
          {
            value: '其它',
            label: '其它',
          },
        ],
      },
      {
        value: '动物',
        label: '动物',
        children: [
          {
            value: '昆虫',
            label: '昆虫',
          },
          {
            value: '飞行动物',
            label: '飞行动物',
          },
          {
            value: '爬行动物',
            label: '爬行动物',
          },
          {
            value: '水生动物',
            label: '水生动物',
          },
          {
            value: '哺乳动物',
            label: '哺乳动物',
          },
          {
            value: '恐龙',
            label: '恐龙',
          },
          {
            value: '其它',
            label: '其它',
          },
        ],
      },
      {
        value: '植物',
        label: '植物',
        children: [
          {
            value: '树木',
            label: '树木',
          },
          {
            value: '花草',
            label: '花草',
          },
          {
            value: '其它',
            label: '其它',
          },
        ],
      },
      {
        value: '建筑',
        label: '建筑',
        children: [
          {
            value: '古代建筑',
            label: '古代建筑',
          },
          {
            value: '现代建筑',
            label: '现代建筑',
          },
          {
            value: '科幻建筑',
            label: '科幻建筑',
          },
          {
            value: '其它',
            label: '其它',
          },
        ],
      },
      {
        value: '家具',
        label: '家具',
        children: [
          {
            value: '沙发',
            label: '沙发',
          },
          {
            value: '床',
            label: '床',
          },
          {
            value: '桌椅',
            label: '桌椅',
          },
          {
            value: '柜子',
            label: '柜子',
          },
          {
            value: '厨具',
            label: '厨具',
          },
          {
            value: '器皿',
            label: '器皿',
          },
          {
            value: '灯具',
            label: '灯具',
          },
          {
            value: '其它',
            label: '其它',
          },
        ],
      },
      {
        value: '机械',
        label: '机械',
        children: [
          {
            value: '工业机械',
            label: '工业机械',
          },
          {
            value: '医疗机械',
            label: '医疗机械',
          },
          {
            value: '机械工具',
            label: '机械工具',
          },
          {
            value: '其它',
            label: '其它',
          },
        ],
      },
      {
        value: '艺术品',
        label: '艺术品',
        children: [
          {
            value: '文房四宝',
            label: '文房四宝',
          },
          {
            value: '乐器',
            label: '乐器',
          },
          {
            value: '雕像',
            label: '雕像',
          },
          {
            value: '瓷器',
            label: '瓷器',
          },
          {
            value: '工艺品',
            label: '工艺品',
          },
          {
            value: '其它',
            label: '其它',
          },
        ],
      },
      {
        value: '交通工具',
        label: '交通工具',
        children: [
          {
            value: '汽车',
            label: '汽车',
          },
          {
            value: '火车',
            label: '火车',
          },
          {
            value: '飞机',
            label: '飞机',
          },
          {
            value: '船只',
            label: '船只',
          },
          {
            value: '其它',
            label: '其它',
          },
        ],
      },
      {
        value: '电子电器',
        label: '电子电器',
        children: [
          {
            value: '家用电器',
            label: '家用电器',
          },
          {
            value: '通讯设备',
            label: '通讯设备',
          },
          {
            value: '电脑设备',
            label: '电脑设备',
          },
          {
            value: '数码设备',
            label: '数码设备',
          },
          {
            value: '其它',
            label: '其它',
          },
        ],
      },
      {
        value: '军事',
        label: '军事',
        children: [
          {
            value: '枪械',
            label: '枪械',
          },
          {
            value: '火炮',
            label: '火炮',
          },
          {
            value: '导弹',
            label: '导弹',
          },
          {
            value: '战机',
            label: '战机',
          },
          {
            value: '坦克',
            label: '坦克',
          },
          {
            value: '舰艇',
            label: '舰艇',
          },
          {
            value: '其它',
            label: '其它',
          },
        ],
      },
      {
        value: '航天',
        label: '航天',
        children: [
          {
            value: '航天飞机',
            label: '航天飞机',
          },
          {
            value: '运载火箭',
            label: '运载火箭',
          },
          {
            value: '卫星',
            label: '卫星',
          },
          {
            value: '飞船',
            label: '飞船',
          },
          {
            value: '空间站',
            label: '空间站',
          },
          {
            value: '其它',
            label: '其它',
          },
        ],
      },
      {
        value: '自然宇宙',
        label: '自然宇宙',
        children: [
          {
            value: '岩石',
            label: '岩石',
          },
          {
            value: '冰',
            label: '冰',
          },
          {
            value: '山川',
            label: '山川',
          },
          {
            value: '天体',
            label: '天体',
          },
          {
            value: '其它',
            label: '其它',
          },
        ],
      },
    ],
  },
  {
    value: '3D 场景',
    label: '3D 场景',
    children: [
      {
        value: '自然场景',
        label: '自然场景',
      },
      {
        value: '古代场景',
        label: '古代场景',
      },
      {
        value: '现代场景',
        label: '现代场景',
      },
      {
        value: '科幻场景',
        label: '科幻场景',
      },
      {
        value: '其它',
        label: '其它',
      },
    ],
  },
];

const coursewares = [
  {
    value: '义务教育',
    label: '义务教育',
    children: [
      {
        value: '科学',
        label: '科学',
        children: [
          {
            value: '物质科学',
            label: '物质科学',
          },
          {
            value: '生命科学',
            label: '生命科学',
          },
          {
            value: '地球宇宙',
            label: '地球宇宙',
          },
          {
            value: '技术工程',
            label: '技术工程',
          },
        ],
      },
      {
        value: '德育',
        label: '德育',
        children: [
          {
            value: '理想信念',
            label: '理想信念',
          },
          {
            value: '社会主义核心价值观',
            label: '社会主义核心价值观',
          },
          {
            value: '中华优秀传统文化',
            label: '中华优秀传统文化',
          },
          {
            value: '生态文明',
            label: '生态文明',
          },
          {
            value: '心理健康',
            label: '心理健康',
          },
        ],
      },
      {
        value: '安全',
        label: '安全',
        children: [
          {
            value: '社会安全',
            label: '社会安全',
          },
          {
            value: '公共安全',
            label: '公共安全',
          },
          {
            value: '意外伤害',
            label: '意外伤害',
          },
          {
            value: '网络信息安全',
            label: '网络信息安全',
          },
          {
            value: '自然灾害',
            label: '自然灾害',
          },
          {
            value: '其他事故',
            label: '其他事故',
          },
        ],
      },
      {
        value: '心理',
        label: '心理',
        children: [
          {
            value: '自我认知',
            label: '自我认知',
          },
          {
            value: '学会学习',
            label: '学会学习',
          },
          {
            value: '人际交往',
            label: '人际交往',
          },
          {
            value: '情绪调试',
            label: '情绪调试',
          },
          {
            value: '升学择业',
            label: '升学择业',
          },
          {
            value: '生活和社会适应',
            label: '生活和社会适应',
          },
        ],
      },
    ],
  },
  {
    value: '高等教育',
    label: '高等教育',
    children: [
      {
        value: '工学',
        label: '工学',
      },
      {
        value: '医学',
        label: '医学',
      },
      {
        value: '文学',
        label: '文学',
      },
      {
        value: '理学',
        label: '理学',
      },
      {
        value: '农学',
        label: '农学',
      },
      {
        value: '法学',
        label: '法学',
      },
      {
        value: '哲学',
        label: '哲学',
      },
      {
        value: '艺术学',
        label: '艺术学',
      },
      {
        value: '历史学',
        label: '历史学',
      },
      {
        value: '教育学',
        label: '教育学',
      },
      {
        value: '管理学',
        label: '管理学',
      },
      {
        value: '经济学',
        label: '经济学',
      },
      {
        value: '军事学',
        label: '军事学',
      },
    ],
  },
];

export { coursewares, models };
