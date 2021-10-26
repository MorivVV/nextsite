<template>
<div>
    <div class="row">
    <div class="col s12 l8 offset-l2">
      <div class="card horizontal">
        <div class="card-image">
          <img :src="'/images/tumbs/' + user.image">
          <drop-down :label="'Выбери аватар'" v-if="imgs.length" :extend="false" :list="imgs" :val="'TUMBS'" :option="'id'" v-model="user.image" />
        </div>
        <div class="card-stacked">
          <div class="card-content">
          <span class="card-title">{{user.USER_NAME}}</span>
          <rank :rank="+user.KOD_RANK" />
          <p>{{user.FAMILY}} {{user.NAME}} {{user.SURNAME}}</p>
          <p>{{user.IP}}</p>
          <p>{{user.email}}</p>
          <p>{{user.ENTER_TIME}}</p>
          <p>{{user.USER_AGENT}}</p>
        </div>
        </div>
      </div>
    </div>
  </div>
  
  <private-chats class="container" />
</div>

</template>

<script>
import { mapActions } from 'vuex';
import DropDown from '../../basic/MUI/DropDown.vue';
import Rank from '../../Rank.vue';
import PrivateChats from './PrivateChats.vue';
export default {
  components: {
    Rank,
    DropDown,
    PrivateChats
  },
  data(){
    return {
      loading: false,
      user: {
        
      },
      imgs: []
    }
  },
  computed: {
    
  },
  watch: {
    'user.image': function(newVal, oldVal){
      if (!oldVal){
        return
      }
      console.log(newVal, oldVal);
      let kod_user = this.$route.params.id;
      this.fetchData({
          url: "api/restUpdate",
          data: {
            to: "b32_18009385_users.bd_users",
            set: {image: newVal},
            filter: { ID: kod_user }
          }
          }).then(r=>{
            console.log(r);
          });
    }
  },
  methods: {
    ...mapActions(["fetchData"]),
    
    addData(){
      if (!this.lastPage){
        this.page++
        this.getData();
      }
    },
    getData() {
      let kod_user = this.$route.params.id;
      this.fetchData({
          url: "api/restGet",
          data: {
            from: "b32_18009385_users.bd_gallery",
            fields: [ ],
            filter: { KOD_USER	: kod_user },
            sort: ["-id"]
          }
          }).then(r=>{
            this.imgs = r
          });
      try {
        this.loading = true
        this.fetchData({
          url: "api/restGet",
          data: {
            from: "b32_18009385_users.bd_users",
            fields: [ ],
            filter: { ID: kod_user }
          }
          }).then(r=>{
            this.user = r[0]
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