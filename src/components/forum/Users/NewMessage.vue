<template>
  <div>
    <load-icon v-if="sending" />
    <TextTinyMCE v-else :label="'Новое сообщение'" v-model="post.message" />
    <BtnIcons v-if="post.message" class="btn-small blue" :icon="'send'" :action="addPost" :title="'Отправить сообщение'"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      sending: false,
      post: {
        message: "",
        kod_user_from: 0,
        kod_user_to: +this.$route.params.id
      },
    };
  },
  computed: {
    ...mapGetters(["userId"])
  },
  methods: {
    ...mapActions(["fetchData"]),
    addPost(){
      this.sending = true
      this.post.kod_user_from = this.userId
      this.fetchData({
        url: "api/restInsert",
        data: {
          to: "b32_18009385_users.bd_private_message",
          fields: {...this.post},
        }
      }).then(r=>{
        if (r.count){
          this.post.message = ""
          this.$emit("sendMessage",true)
        }else{
          this.$M.toast({html: "Не удалось"})
        }
        this.sending = false
      });
    }
  }
};
</script>
