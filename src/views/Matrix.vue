<template>
  <div>
    <h4 class="center">Матрица контактов</h4>
    <matrix-add-button-contact></matrix-add-button-contact>
    <div v-for="post in matrixContacts" :key="post.id" class="post">
      <div class="row">
        <div class="col s4 m12">
          <div class="card green lighten-4">
            <span class="card-title">
              <div class="card-content black-text" v-html="post.depart"></div>
              <div class="btn-delete-right">
                <BtnIconsVue
                  :icon="'delete'"
                  :title="'Удалить запись из МК'"
                  :action="delMatrixContact.bind(this, post.id)"
                  class="red"
                />
              </div>
            </span>
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

            <div class="text res_bottom" style="margin-left: 5px;">
              Контактные лица: <span v-html="post.contacts"></span>
            </div>
            <div class="s2" style="">
              <span class="card-title">
                <div class="card-content black-text"></div>
                <!--
                <button
                  id="send"
                  class="send_button"
                  name="send"
                  style="margin-left: 12px;"
                  @click="editMatrixContact"
                >
                  Редактировать
                </button>
                -->
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import MatrixAddButtonContact from "./MatrixAddButtonContact.vue";
import BtnIconsVue from "../components/basic/MUI/BtnIcons.vue";
export default {
  components: {
    MatrixAddButtonContact,
    BtnIconsVue
  },
  data() {
    return {
      content: "",
      isElVisible: false,
      isButtonVisible: false
    };
  },
  computed: {
    ...mapState("postsData", ["matrixContacts"])
  },
  methods: {
    ...mapActions(["fetchData"]),
    //editMatrixContact() {}
    delMatrixContact(post_id) {
      this.fetchData({
        url: "api/restDelete",
        data: {
          from: "public.bz_contact_matrix",
          filter: { id: post_id }
        }
      })
        .then(r => {
          console.log(r);
          if (r.count === 1) {
            this.$M.toast({ html: "Запись удалена" });
            this.getMatrixContact();
          } else {
            this.$M.toast({ html: "Удалить не удалось" });
          }
        })
        .catch(err => console.log(err));
    },
    getMatrixContact() {
      this.fetchData({
        data: {
          sqlname: "getMatrixContact",
          search: this.search
        },
        stateName: "postsData/matrixContacts"
      });
    }
  },
  mounted() {
    this.getMatrixContact();
  }
};
</script>

<style scoped>
.res {
  padding-left: 5px;
  background: white;
  flex-basis: 100%;
  font-size: medium;
  border-top: solid 1px gray;
}
.btn {
  border: none;
  display: inline-block;
  vertical-align: middle;
  font-weight: 500;
  color: black;
  background-color: #aed581;
  padding: 0.19em 1em calc(0.8em + 3px);
  border-radius: 3px;
  background: rgb(88, 219, 154);
  transition: 0.2s;
}
.btn:hover {
  background: rgb(69, 190, 130);
}
.btn:active {
  box-shadow: 0 3px rgb(33, 147, 90) inset;
  background: rgb(33, 147, 90) inset;
}
.matrix_add_button {
  display: flex;
  flex-wrap: wrap;
  margin: 5px;
  padding: 5px;
}
.s1 {
  text-decoration-line: underline;
  text-decoration-color: #004d40;
}
.res_bottom {
  padding-left: 5px;
  background: white;
  flex-basis: 100%;
  font-size: medium;
  border-top: solid 1px gray;
  border-bottom: solid 1px gray;
}
.btn-delete-right {
  display: flex;
  justify-content: flex-end;
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
.card
  .card-action
  a:not(.btn):not(.btn-large):not(.btn-small):not(.btn-large):not(.btn-floating):hover {
  color: black;
}
</style>
