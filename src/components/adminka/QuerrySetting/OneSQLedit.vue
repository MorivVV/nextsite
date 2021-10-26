<template>
  <div class="row">
    <div class="col s12">
      <div class="card">
        <div class="card-content">
          <div class="row">
            <div class="input-field col s2">
              <input
                :id="'sql_name' + ssq.id"
                type="text"
                class="purple-text b"
                v-model="ssq.sql_name"
              />
              <label :for="'sql_name' + ssq.id">sql_name</label>
            </div>
            <div class="input-field col s4">
              <input
                :id="'sql_params' + ssq.id"
                type="text"
                v-model="ssq.sql_params"
              />
              <label :for="'sql_params' + ssq.id">Входные параметры</label>
            </div>
            <div class="input-field col s2">
              <input :id="'result' + ssq.id" type="text" v-model="ssq.result" />
              <label :for="'result' + ssq.id">Отдаваемый параметр</label>
            </div>
            <div class="col s2">
              <label>Требуется авторизация</label>
              <SwitchMaterialVue v-model="ssq.need_token" />
            </div>
            <SelectWithDataVue
              class="col s1"
              :label="'База данных'"
              :extend="false"
              :list="[
                { id: 'pg', bd: 'PostgreSQL' },
                { id: 'orasm', bd: 'ServiceManager' }
              ]"
              :option="'bd'"
              :val="'id'"
              :icon="'settings_input_hdmi'"
              v-model="ssq.data_base"
            />
            <div class="col s1">
              <BtnCloseFlatVue
                :action="() => (edit.val = false)"
                class="right"
              />
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <textarea
                :id="'query' + ssq.id"
                v-model="ssq.sql_query"
              ></textarea>
              <label :for="'query' + ssq.id">Текст SQL запроса</label>
              <BtnSaveFlatVue :action="saveChange" class="right" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import BtnCloseFlatVue from "../../basic/BtnCloseFlat.vue";
import BtnSaveFlatVue from "../../basic/BtnSaveFlat.vue";
// import InputWithLabelVue from "../../basic/InputWithLabel.vue";
import SelectWithDataVue from "../../basic/MUI/SelectWithData.vue";
import SwitchMaterialVue from "../../basic/MUI/SwitchMaterial.vue";

export default {
  components: {
    BtnSaveFlatVue,
    BtnCloseFlatVue,
    SwitchMaterialVue,
    // InputWithLabelVue,
    SelectWithDataVue
  },
  props: {
    ssq: Object,
    edit: Object
  },
  computed: {
    ...mapState("admin", ["update"])
  },
  watch: {
    update(newVal) {
      if (newVal.count === 1) {
        this.$M.toast({ html: "Сохранение прошло успешно" });
        this.edit.val = false;
      } else {
        this.$M.toast({ html: "Сохранение не удалось" });
      }
    }
  },
  methods: {
    ...mapActions(["fetchData"]),
    saveChange() {
      this.fetchData({
        data: { sqlname: "updateSSQ", ...this.ssq },
        stateName: "admin/update"
      });
    }
  },
  mounted() {
    this.$M.textareaAutoResize(document.getElementById("query" + this.ssq.id));
    this.$M.updateTextFields();
  }
};
</script>

<style scoped>
.b {
  font-weight: 500;
}
</style>
