<template>
  <div>
    <h4 class="center">Матрица контактов</h4>
    <div v-for="post in matrixContacts" :key="post.id" class="post">
      <div class="row">
        <div class="col s4 m12">
          <div class="card green lighten-4">
            <span class="card-title">
              <div class="card-content black-text" v-html="post.depart"></div>
            </span>
            <!--
              <div class="text time">
            <img title="бесполезное (идея не реализована)" height="25"
            src=images/system/dislike_off.png>
            </div>
          <div class="text time">
            <img title="полезное (идея не реализована)" height="25"
            src=images/system/like_off.png>
          </div>
          -->
            <!-- <div v-if="post.id >0" class="text time" @dblclick="editorTiny++, post_edit=post.id, post_cats = post.cat"><img title="Двойной клик для активации режима редактирования" src=images/system/edit.png></div> -->
            <div class="card-action">
              <div class="card-content black-text">
                <span class="card-title"> Ссылка в справочнике:</span>
                <span class="s1" v-html="post.addressbook_ref"></span>
              </div>
            </div>

            <div class="text res" style="margin-left: 5px;">
              Шаблон в Лице Друга:
              <span v-html="post.face_friend_template"></span>
            </div>

            <div class="text res" style="margin-left: 5px;">
              Название группы в ServiceManager:
              <span v-html="post.sm_name"></span>
            </div>

            <div class="text res" style="margin-left: 5px;">
              Иные способы обращения:
              <span v-html="post.communication_process"></span>
            </div>

            <div class="text res" style="margin-left: 5px;">
              Контактные лица: <span v-html="post.contacts"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  computed: {
    ...mapState("postsData", ["matrixContacts"])
  },
  methods: {
    ...mapActions(["fetchData"])
  },
  mounted() {
    this.fetchData({
      data: { sqlname: "getMatrixContact", search: this.search },
      stateName: "postsData/matrixContacts"
    });
  }
};
</script>

<style scoped>
div.style-five {
  height: 45px;
  background: #fff no repeat scroll left;
  background-size: 80px 75px;
  margin-left: -40px;
}
hr.style-five {
  width: 100%;
  margin-top: -40px;
  border: 0;
  border-bottom: 1px dashed black;
  background: #111;
}
.s1 {
  text-decoration-line: underline;
  text-decoration-color: #004d40;
}
.res {
  padding-left: 5px;
  background: white;
  flex-basis: 100%;
  font-size: medium;
  border-top: solid 1px gray;
}
</style>
<style>
.card
  .card-action
  a:not(.btn):not(.btn-large):not(.btn-small):not(.btn-large):not(.btn-floating) {
  color: #004d40;
}
.card .card-content p {
  color: navy;
}
</style>
