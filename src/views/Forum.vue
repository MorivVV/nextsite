<template>
  <div>
    <h2 class="center">Форум</h2>
    <div class="collection">
     <div class="collection-item blue lighten-3">
       <div class="row">
        <h5 class="col s2">Тема</h5>
        <div class="input-field col s6">
          <input id="search" type="text" v-model="search">
          <label for="search">Введите текст для поиска</label>
        </div>
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
  data: ()=> ({
    search: ''
  }),
  watch: {
    search(){
      this.fetchData({data: { sqlname: "getForumTheme", theme: '%'+ this.search +'%' },stateName: "forum/forums"})
    }
  },
  computed: {
    ...mapGetters(["postList", "forumList", "userList"]),
  },
  methods: {
    ...mapActions(["fetchData"]),
  },
  mounted() {
    this.fetchData({data: { sqlname: "getUsers" },stateName: "forum/users"})
    this.fetchData({data: { sqlname: "getForumTheme", theme: '%'+ this.search +'%' },stateName: "forum/forums"})
  },
};
</script>
