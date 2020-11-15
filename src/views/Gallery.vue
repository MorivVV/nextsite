<template>
  <div>
    <h2 class="center">Галерея</h2>
    <div class="row">
      <div class="input-field col s3">
        <select id="users" v-model="user">
          <option v-for="u in userList" :key="u.ID" :value="u.ID">{{u.USER_NAME}}</option>
        </select>
        <label for="users">Пользователь</label>
      </div>
      <div class="input-field col s3">
        <select id="folders" v-model="gallery">
          <option value=0>Все</option>
          <option v-for="f in folderList" :key="f.ID" :value="+f.ID">{{f.NAIMEN_FOLDER}}</option>
        </select>
        <label for="folders">Галерея</label>
      </div>
      <div class="input-field col s3">
        <input type="number" min="1" v-model="start" id="">
      </div>
      <div class="input-field col s3">
        <input type="number" min="10" v-model="end" id="">
      </div>
    </div>
    <Masonry :folder="+gallery" :user="+user" :start="+start" :end="+end" />
  </div>
</template>

<script>
import Masonry from '../components/Masonry'
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  components: {
    Masonry
  },
  data: ()=>( {
    gallery: 0,
    user: 1,
    start: 1,
    end: 50,
  }),
  watch: {
    user(){
      this.fetchData({data:{sqlname:'getGaleryFolders', kod_user: this.user }, stateName: "gallery/folderList"})
      setTimeout(() => {
      this.$M.FormSelect.init(document.querySelectorAll('select'), {})
    }, 50);
    }
  },
  computed: {
    ...mapState("gallery", ["folderList"]),
    ...mapGetters(["userList"])
  },
  methods: {
    ...mapActions(["fetchData"]),
  },
  mounted(){
    this.fetchData({data:{sqlname: 'getUsers'}, stateName: 'forum/users'})
    this.fetchData({data:{sqlname:'getGaleryFolders', kod_user: this.user }, stateName: "gallery/folderList"})
    setTimeout(() => {
      this.$M.FormSelect.init(document.querySelectorAll('select'), {})
    }, 50);
  }
};
</script>
