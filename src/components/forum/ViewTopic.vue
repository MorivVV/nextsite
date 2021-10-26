<template>
  <div>
    <template v-if="posts.length" >
      <OnePostVue v-for="post in posts" :post="post" :key="'post_' + post.ID"/>
    </template>
    <load-icon v-if="loading" />
    <NewPostVue @sendPost="sendPost" v-intersection="addData" />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import NewPostVue from './NewPost.vue';
import OnePostVue from './OnePost.vue';

export default {
  components: {
    OnePostVue,
    NewPostVue
  },
  data(){
    return {
      loading: false,
      lastPage: false
    }
  },
  computed: {
    ...mapState("forum", ["posts", "page", "limit"]),
  },
  methods: {
    ...mapActions(["fetchData"]),
    ...mapMutations(["updateState"]),
    addData(){
      if (!this.lastPage){
        this.updateState({ state: "forum/page", data: this.page+1 });
        this.getData();
      }
    },
    sendPost(){
      this.updateState({ state: "forum/page", data: -1 });
      this.getData();
    },
    getData() {
      let kod_theme = this.$route.params.id;
      try {
        this.loading = true
        this.fetchData({
          url: "api/restGet",
          data: {
            from: "b32_18009385_users.bd_post",
            fields: [
              "ID",
              "TIME_ADD",
              "POST",
              "ID_THEME",
              "ID_USER",
              "KOD_QUOTED_POST"
            ],
            filter: { ID_THEME: kod_theme },
            limit: this.limit,
            page: this.page,
            sort: ["id"],
          },
        }).then(r=>{
          if (this.page <= 1){
            this.updateState({ state: "forum/posts", data: r });
          }else{
            this.updateState({ state: "forum/posts", data: [ ...this.posts,...r] });
          }
          if (this.posts.length < this.limit) {
            this.lastPage = true
          }
        });
      } catch (error) {
        this.$M.toast({html: "Загрузка не удалась"})
      }finally{
        this.loading = false
      }
      
    },
  },
  mounted() {
    this.getData();
  },
}
</script>