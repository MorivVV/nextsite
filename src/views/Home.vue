<template>
  <div class="container">
    <div v-if="trueThemes.length>0" class="collection">
      <ThemeVue :theme="t" v-for="t in trueThemes" :key="'theme_' + t.id" />
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ThemeVue from '../components/forum/Theme.vue';

export default {
  components: {
    ThemeVue
  },
  computed: {
    ...mapState("forum", ["themes", "posts"]),
    trueThemes(){
      let kod_theme = 0
      if ("id" in this.$route.params){
        kod_theme=this.$route.params.id
      }
      let themes = []
      if (this.themes.length>0){
        themes = this.themes.filter(e=>+e.kod_theme === +kod_theme)
      }
      return themes
    }
  },
  methods: {
    ...mapActions(["fetchData"]),
    getUsers(){
      this.fetchData({
        url: "api/restGet",
        data: {
          from: "b32_18009385_users.bd_users",
          fields: [
            "ID",
            "USER_NAME",
            "KOD_RANK",
            "FAMILY",
            "NAME",
            "image"
          ],
          sort: ["id"],
        },
        stateName: "forum/users",
      });
    },
    getRanks(){
      this.fetchData({
        url: "api/restGet",
        data: {
          from: "b32_18009385_users.bd_rank",
          fields: [
            "ID_RANK",
            "RANK",
            "color"
          ]
        },
        stateName: "forum/ranks",
      });
    },
    getData() {
      let kod_theme
      if ("id" in this.$route.params){
        kod_theme=this.$route.params.id
      }

      let s = "%";
      this.fetchData({
        url: "api/restGet",
        data: {
          from: "b32_18009385_users.bd_theme_post:t",
          fields: [
            "id",
            "theme",
            "kod_theme",
            "kod_user",
            "timestamp",
            "private",
            {
              cnt: {
                from: "b32_18009385_users.bd_post:p",
                fields: ["count(1)"],
                filter: { "p.ID_THEME=t.ID": '${joinFields}' }
              }
            }
          ],
          filter: { theme: "like:" + s, kod_theme },
          sort: ["id"],
        },
        stateName: "forum/themes",
      });
    },
  },
  mounted() {
    this.getRanks();
    this.getUsers();
    this.getData();
  },
};
</script>