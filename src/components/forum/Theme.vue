<template>
  <router-link :to="'/view/' + theme.id" class="collection-item row">
    <div class="col l1 s2">
      <template v-if="themeParent">
        <i class="green-text material-icons tiny" title="Есть вложеные темы"
          >folder</i
        >{{ themeParent }}
      </template>
      <i v-else class="blue-text material-icons tiny">chevron_right</i>
    </div>

    <span class="title col l8 s9">{{ theme.theme }} </span>
    <span class="messages col s1 tags" title="Сообщенией в теме"
      >{{ theme.cnt }}
    </span>
    <UserInfoVue class="right" :userId="+theme.kod_user">Автор</UserInfoVue>
  </router-link>
</template>

<script>
import { mapState } from "vuex";
import UserInfoVue from "./UserInfo.vue";

export default {
  components: {
    UserInfoVue,
  },
  props: {
    theme: Object,
  },
  computed: {
    ...mapState("forum", ["themes", "users"]),
    themeParent() {
      let t = this.themes;
      let cur_t = this.theme.id;

      return t.filter((e) => e.kod_theme === cur_t).length;
    },
  },
};
</script>

<style scoped>
.title {
  display: inline;
  margin-left: 10px;
  color: blue;
  min-width: 50%;
}
.messages {
  margin-left: 10px;
}
</style>