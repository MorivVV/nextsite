<template>
  <div>
    <h2 class="center">Галерея</h2>
    <form enctype="multipart/form-data" action="/uploadImage.php" method="POST">
      Для загрузки новых фотографий 
      <input type="file" name ="imgupload" multiple='true' min='1' max='10' @change="multiLoad">
    </form>
    
    <div class="row">
      <SelectWithDataVue 
        v-if="userList.length"
        class="col s3"
        :icon="'account_box'" 
        :extend="false" 
        :label="'Пользователь'" 
        :list="userList" 
        :val="'ID'" 
        :option="'USER_NAME'" 
        v-model="user" />
      <SelectWithDataVue 
        class="col s3"
        :icon="'folder_shared'" 
        :extend="true" 
        :label="'Галерея'" 
        :list="folderList" 
        :val="'ID'" 
        :option="'NAIMEN_FOLDER'" 
        v-model="gallery" />
      <DatePickerVue class="col s2" :label="'Начало'" v-model="date_beg" />
      <div class="input-field col s2">
        <input type="number" min="1" v-model="start" id="">
      </div>
      <div class="input-field col s2">
        <input type="number" min="10" v-model="end" id="">
      </div>
    </div>
    {{date_beg}}
    <Masonry :folder="+gallery" :user="+user" :start="+start" :end="+end" />
  </div>
</template>

<script>
import Masonry from '../components/Masonry'
import { mapActions, mapState, mapGetters } from "vuex";
import SelectWithDataVue from '../components/basic/MUI/SelectWithData.vue';
import DatePickerVue from '../components/basic/MUI/DatePicker.vue';
import axios from '@/store/axios'
export default {
  components: {
    Masonry, SelectWithDataVue, DatePickerVue
  },
  data: ()=>( {
    date_beg: "",
    gallery: 0,
    user: 1,
    start: 1,
    end: 50,
  }),
  watch: {
    user(){
      this.fetchData({data:{from:'bd_gallery_folder', filter: {kod_user: this.user} }, stateName: "gallery/folderList"})
      setTimeout(() => {
      this.$M.FormSelect.init(document.querySelectorAll('select'), {})
    }, 50);
    }
  },
  computed: {
    ...mapState("gallery", ["folderList"]),
    ...mapGetters('forum',["userList"])
  },
  methods: {
    ...mapActions(["fetchData"]),
    multiLoad(events) {
      console.log(events);
      let event = events.target
      for (let i = 0; i < event.files.length; i++) {
        let file = event.files[i];
        let form = new FormData();
        form.append("imgupload", file);
        // Создаем запрос
        axios.post("uploadImage.php",form)
      }
      event.value = "";
    }
  },
  mounted(){
    this.fetchData({url: "api/restGet",data:{fields: [],from: 'bd_users'}, stateName: 'forum/users'})
    this.fetchData({url: "api/restGet",data:{fields: [],from:'bd_gallery_folder', filter: {kod_user: this.user} }, stateName: "gallery/folderList"})
  }
};
</script>
