<template>
  <div>
    <load-icon v-if="sended" />
    <TextTinyMCE v-else :label="'Новое сообщение'" v-model="post.POST" />
    <BtnIcons v-if="post.POST"  class="btn-small blue" :icon="'send'"  :action="addPost" :title="'Добавить новый пост'"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import loadIcon from '../basic/MUI/loadIcon.vue';

export default {
  components: { loadIcon },
  data() {
    return {
      sended: false,
      post: {
        POST: "",
        ID_USER: "1",
        ID_THEME: +this.$route.params.id
      },
    };
  },
  methods: {
    ...mapActions(["fetchData"]),
    addPost(){
      this.sended = true
      this.fetchData({
        url: "api/restInsert",
        data: {
          to: "b32_18009385_users.bd_post",
          fields: {...this.post},
        }
      }).then(r=>{
        if (r.count){
          this.$emit("sendPost",true)
          this.post.POST = ""
          this.sended = false
        }else{
          this.$M.toast({html: "Не удалось"})
        }
        
      });
    }
  }
};
</script>
