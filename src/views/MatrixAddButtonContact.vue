<template>
  <div>
    <div class="matrix_add_button">
      <ul>
        <li>
          <a @click="isButtonVisible = !isButtonVisible" class="col s2 btn">
            <i class="material-icons">
              playlist_add
            </i>
            Добавить контакт
          </a>
        </li>
      </ul>
    </div>
    <div
      v-if="isButtonVisible"
      id="new_matrix"
      class="row card white z-depth-3"
    >
      <fieldset>
        <legend>Введите данные</legend>
        <div class="form-group">
          <div class="input-field col s6">
            <label for="title">Подразделение</label>
            <input
              id="title"
              name="depart"
              type="text"
              v-model="newContact.depart"
            />
          </div>
          <div class="input-field col s6">
            <label for="face_friend_template">Шаблон в Лице Друга</label>
            <input
              id="title"
              name="face_friend_template"
              type="text"
              v-model="newContact.face_friend_template"
            />
          </div>
          <div class="input-field col s6">
            <label for="SM_name">Группа(ы) в ServiceManager</label>
            <input
              id="title"
              name="SM_name"
              type="text"
              v-model="newContact.sm_name"
            />
          </div>
          <div class="input-field col s6">
            <label for="communication_process">Иные способы обращения</label>
            <input
              id="title"
              name="communication_process"
              type="text"
              v-model="newContact.communication_process"
            />
          </div>
          <div>
            <label class="control-label" for="addressbook_ref">
              <br />
              <h3 style="margin-left: 6px;">Ссылки в справочнике:</h3>
            </label>
            <div class=" col s12">
              <TextTinyMCEVue
                :label="''"
                v-model="newContact.addressbook_ref"
              />
            </div>
            <div>
              <a
                @click="isElVisible = !isElVisible"
                id="showSolutionArea"
                style="margin-left: 12px; cursor: pointer;"
                >Добавить контакты</a
              >
              <div v-if="isElVisible" id="solutionArea">
                <label for="contacts" class="control-label">
                  <h3 style="margin-left: 6px;">Контакты</h3>
                </label>
                <div class=" col s12">
                  <TextTinyMCEVue :label="''" v-model="newContact.contacts" />
                </div>
              </div>
            </div>
            <hr
              style="margin-bottom: 10px; margin-right: 12px; margin-left: 12px;"
            />
            <div class="form-group">
              <div>
                <button
                  id="send"
                  class="send_button"
                  name="send"
                  style="margin-left: 12px;"
                  @click="addMatrixContact"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script>
import TextTinyMCEVue from "../components/basic/MUI/TextTinyMCE.vue";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    TextTinyMCEVue
  },
  data() {
    return {
      newContact: {
        depart: "",
        addressbook_ref: "",
        face_friend_template: "",
        sm_name: "",
        communication_process: "",
        contacts: "",
        modified: null,
        active: true
      },
      isElVisible: false,
      isButtonVisible: false
    };
  },
  computed: {
    ...mapState("postsData", ["matrixContacts"])
  },
  methods: {
    ...mapActions(["fetchData"]),
    addMatrixContact() {
      this.fetchData({
        data: {
          sqlname: "addMatrix",
          depart: this.newContact.depart,
          addressbook_ref: this.newContact.addressbook_ref,
          face_friend_template: this.newContact.face_friend_template,
          sm_name: this.newContact.sm_name,
          communication_process: this.newContact.communication_process,
          contacts: this.newContact.contacts,
          modified: null,
          active: true
        },
        stateName: "postsData/addMatrixContacts"
      })
        .then(r => {
          if (r.count === 1) {
            this.fetchData({
              data: { sqlname: "getMatrixContact" },
              stateName: "postsData/matrixContacts"
            });
            this.$M.toast({ html: "Добавление успешно" });
            this.active.value = false;
          }
        })
        .catch(err => console.log(err));
    }
  },
  mounted() {}
};
</script>

<style scoped>
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
</style>
