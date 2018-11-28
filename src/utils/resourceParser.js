const parseCoursewareDetail = ({
  category,
  id,
  label,
  organization,
  summary,
  tags,
  thumbnails,
  title,
}) => ({
  category: category.slice(1),
  id,
  label,
  organization,
  summary,
  tags,
  thumbnails,
  title,
});

const parseMaterialDetail = ({
  category,
  coursewares,
  file,
  format,
  id,
  level,
  models,
  tags,
  thumbnails,
  title,
  type,
}) => ({
  category: category.slice(1),
  coursewares,
  file,
  format,
  id,
  level,
  models,
  tags,
  thumbnails,
  title,
  type,
});

export { parseCoursewareDetail, parseMaterialDetail };
