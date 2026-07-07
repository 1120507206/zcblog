import { type, compareDate } from './index'

/**
 * 过滤非文章页
 * @param {Array} posts 所有文章数据
 */
export function filterPosts (posts) {
  posts = posts.filter(item => {
    const { frontmatter: { pageComponent, article, home } } = item
    return !(pageComponent || article === false || home === true) // 存在页面组件、article字段为false，以及首页
  })
  return posts
}

/**
 * 按置顶和时间排序
 * @param {Array} posts 过滤非文章页之后的文章数据
 */
export function sortPosts (posts) {
  posts.sort((prev, next) => {
    const prevSticky = prev.frontmatter.sticky
    const nextSticky = next.frontmatter.sticky
    if (prevSticky && nextSticky) {
      return prevSticky == nextSticky ? compareDate(prev, next) : (prevSticky - nextSticky)
    } else if (prevSticky && !nextSticky) {
      return -1
    } else if (!prevSticky && nextSticky) {
      return 1
    }
    return compareDate(prev, next)
  })
  return posts
}

/**
 * 按时间排序
 * @param {Array} posts 过滤非文章页之后的文章数据
 */
export function sortPostsByDate (posts) {
  posts.sort((prev, next) => {
    return compareDate(prev, next)
  })
  return posts
}

/**
 * 按分类和标签分组
 * @param {Array} posts 按时间排序之后的文章数据
 */
export function groupPosts (posts) {
  const categoriesObj = {}
  const tagsObj = {}

  for (let i = 0, postsL = posts.length; i < postsL; i++) {
    const { frontmatter: { categories, tags } } = posts[i]
    if (type(categories) === 'array') {
      categories.forEach(item => {
        if (item) { // 分类值是有效的
          if (!categoriesObj[item]) {
            categoriesObj[item] = []
          }
          categoriesObj[item].push(posts[i])
        }
      })
    }
    if (type(tags) === 'array') {
      tags.forEach(item => {
        if (item) { // 标签值是有效的
          if (!tagsObj[item]) {
            tagsObj[item] = []
          }
          tagsObj[item].push(posts[i])
        }
      })
    }
  }
  return {
    categories: categoriesObj,
    tags: tagsObj
  }
}

/**
 * 获取所有分类和标签
 * @param {Object} groupPosts 按分类和标签分组之后的文章数据
 */
export function categoriesAndTags (groupPosts) {
  const categoriesArr = []
  const tagsArr = []

  for (let key in groupPosts.categories) {
    categoriesArr.push({
      key,
      length: groupPosts.categories[key].length
    })
  }

  for (let key in groupPosts.tags) {
    tagsArr.push({
      key,
      length: groupPosts.tags[key].length
    })
  }
  return {
    categories: categoriesArr,
    tags: tagsArr
  }
}

/**
 * 按标签筛选文章
 * @param {Array} posts 文章数据
 * @param {Array} tags 标签列表
 */
export function filterPostsByTags (posts, tags = []) {
  if (!Array.isArray(posts) || !tags.length) {
    return posts || []
  }

  return posts.filter(post => {
    const postTags = post.frontmatter && post.frontmatter.tags
    return Array.isArray(postTags) && postTags.some(tag => tags.includes(tag))
  })
}

/**
 * 排除指定标签的文章
 * @param {Array} posts 文章数据
 * @param {Array} tags 标签列表
 */
export function excludePostsByTags (posts, tags = []) {
  if (!Array.isArray(posts) || !tags.length) {
    return posts || []
  }

  return posts.filter(post => {
    const postTags = post.frontmatter && post.frontmatter.tags
    return !(Array.isArray(postTags) && postTags.some(tag => tags.includes(tag)))
  })
}
