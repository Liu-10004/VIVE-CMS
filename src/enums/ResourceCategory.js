const categories = [
  {
    id: '1',
    name: 'courseware',
    text: '课件',
  },
  {
    id: '2',
    name: 'material',
    children: [
      {
        id: '1',
        name: 'model',
        text: '模型/场景',
      },
      {
        id: '2',
        name: 'pano',
        text: 'VR 全景',
      },
    ],
  },
];

/**
 * 收集资源类型筛选器需要的 categories
 *
 * @return {Array} 返回有效的资源类型数组, 每个子资源带有表示所属类型的 parent
 */
const collectCategories = () => {
  const collectedCategories = [];

  const collector = (categories, parent) => {
    categories.forEach(category => {
      if (category.children) {
        collector(category.children, category);
      } else {
        // NOTE: 没有 parent 类型的子资源，parent 指向自己
        collectedCategories.push({ ...category, parent: parent ? parent.name : category.name });
      }
    });
  };

  collector(categories);

  return collectedCategories;
};

const collectedCategories = collectCategories();

export { categories, collectedCategories };
