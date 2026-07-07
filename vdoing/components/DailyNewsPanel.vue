<template>
  <section class="daily-news card-box">
    <div class="daily-news__header">
      <div>
        <p class="daily-news__eyebrow">AI Daily Brief</p>
        <h2>每日资讯</h2>
      </div>
      <router-link :to="moreLink" class="daily-news__more">更多</router-link>
    </div>

    <div v-if="newsPosts.length" class="daily-news__list">
      <article
        v-for="item in newsPosts"
        :key="item.key"
        class="daily-news__item"
      >
        <div class="daily-news__meta">
          <span class="daily-news__date">{{ getDate(item) }}</span>
          <span v-if="item.frontmatter.sourceName" class="daily-news__source">
            {{ item.frontmatter.sourceName }}
          </span>
        </div>
        <router-link :to="item.path" class="daily-news__title">
          {{ item.title }}
        </router-link>
      </article>
    </div>

    <p v-else class="daily-news__empty">今天还没有新的资讯内容。</p>
  </section>
</template>

<script>
import { filterPostsByTags } from '@theme/util/postData'

export default {
  name: 'DailyNewsPanel',
  props: {
    tag: {
      type: String,
      default: 'AI资讯'
    },
    length: {
      type: [String, Number],
      default: 6
    },
    moreLink: {
      type: String,
      default: '/tags/?tag=AI%E8%B5%84%E8%AE%AF'
    }
  },
  computed: {
    newsPosts() {
      return filterPostsByTags(this.$sortPostsByDate, [this.tag]).slice(0, Number(this.length))
    }
  },
  methods: {
    getDate(item) {
      return item.frontmatter.date
        ? item.frontmatter.date.split(' ')[0]
        : ''
    }
  }
}
</script>

<style lang="stylus" scoped>
.daily-news
  padding 1.4rem 1.5rem
  background linear-gradient(135deg, rgba(12, 31, 57, 0.96), rgba(24, 71, 104, 0.92))
  color #f5fbff
  overflow hidden
  position relative
  &::before
    content ''
    position absolute
    top -60px
    right -30px
    width 180px
    height 180px
    border-radius 50%
    background radial-gradient(circle, rgba(126, 213, 255, 0.28), rgba(126, 213, 255, 0))
    pointer-events none
  &::after
    content ''
    position absolute
    left -40px
    bottom -65px
    width 160px
    height 160px
    border-radius 50%
    background radial-gradient(circle, rgba(77, 169, 255, 0.18), rgba(77, 169, 255, 0))
    pointer-events none
  .daily-news__header
    display flex
    align-items flex-start
    justify-content space-between
    gap 1rem
    position relative
    z-index 1
    margin-bottom 1rem
    h2
      margin 0.2rem 0 0
      font-size 1.5rem
      border none
      color #fff
    .daily-news__eyebrow
      margin 0
      font-size 0.72rem
      letter-spacing 0.22em
      text-transform uppercase
      color rgba(205, 236, 255, 0.82)
    .daily-news__more
      align-self center
      color #9fe2ff
      font-size 0.92rem
      white-space nowrap
  .daily-news__list
    position relative
    z-index 1
  .daily-news__item
    padding 0.9rem 0
    border-top 1px solid rgba(255, 255, 255, 0.12)
    &:first-child
      border-top none
      padding-top 0.2rem
  .daily-news__meta
    display flex
    align-items center
    flex-wrap wrap
    gap 0.6rem
    margin-bottom 0.35rem
    font-size 0.78rem
    color rgba(218, 240, 255, 0.72)
  .daily-news__source
    padding 0.12rem 0.45rem
    border-radius 999px
    background rgba(255, 255, 255, 0.12)
  .daily-news__title
    color #fff
    font-size 1rem
    line-height 1.6
    display block
    transition transform 0.2s ease, color 0.2s ease
    &:hover
      color #9fe2ff
      transform translateX(4px)
  .daily-news__empty
    position relative
    z-index 1
    margin 0
    color rgba(218, 240, 255, 0.78)

@media (max-width $MQMobile)
  .daily-news
    border-radius 0
    padding 1.25rem 1rem
    .daily-news__header
      align-items center
      h2
        font-size 1.3rem
    .daily-news__title
      font-size 0.96rem
</style>
