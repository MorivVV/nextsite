<template>
  <div class="collection">
    <Post v-for="p in posts" :post="p" :key="p.ID" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Post from '../components/forum/OnePost'
export default {
  components:{
    Post
  },
  computed:{
    ...mapState('forum',['posts'])
  },
  methods: {
    ...mapActions(['fetchData'])
  },
  mounted(){
    this.fetchData({data:{sqlname: 'getForumPosts', kod_theme: this.$route.params.id}, stateName: 'forum/posts'})
  }
}
</script>