<template>
  <div>
    <h2 class="center">Форум</h2>
    <div class="collection">
     <div class="collection-item purple lighten-3">
       <div class="row">
        <h5 class="col s8">Тема</h5>
        <h6 class="col s1">Сообщений</h6>
        <h6 class="col s2">Добавлен</h6>
        <h6 class="col s1">Автор</h6>
      </div>
     </div>
      <div class="collection-item" v-for="f in forumList" :key="f.id">
        <Topic :topic="f" />
      </div>
      <div id="editorjs"></div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Topic from '@/components/Topic'
export default {
  components: {
    Topic
  },
  computed: {
    ...mapGetters(["postList", "forumList", "userList"]),
  },
  methods: {
    ...mapActions(["fetchData"]),
  },
  mounted() {
    this.fetchData({data: { sqlname: "getUsers" },stateName: "forum/users"})
    this.fetchData({data: { sqlname: "getForumTheme" },stateName: "forum/forums"})
  },
};
</script>
