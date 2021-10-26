<template>
  <div>
    <SMurlService />
    <button @click="test">test</button>
    <table>
      <thead>
        <tr>
          <th>Pattern (Регулярка)</th>
          <th>file (сущность)</th>
          <th>query (приналдежность)</th>
          <th>
            Стиль (вид ссылки)
            <a href="/mcolors" target="_blank">Справочник цветов</a>
          </th>
          <th width="150">Ссылка на</th>
          <th width="90">Применять</th>
          <th width="50"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in sm_url_patterns" :key="p.id">
          <td>
            <input type="text" :class="p.link_style" v-model="p.pattern" />
          </td>
          <td><input type="text" v-model="p.file" /></td>
          <td><input type="text" v-model="p.query" /></td>
          <td>
            <input type="text" :class="p.link_style" v-model="p.link_style" />
          </td>
          <td>
            <SelectWithDataVue
              v-if="urlResource.length > 0"
              :list="urlResource"
              :option="'url_name'"
              :val="'id'"
              v-model="p.kod_resource"
            />
          </td>
          <td>
            <SwitchMaterialVue v-model="p.avcive" />
          </td>
          <td>
            <!-- <BtnSaveFlatVue :action="editRegPattern.bind(this, p)" /> -->
            <BtnIconsVue
              class="btn-small blue darken-2"
              :icon="'save'"
              :title="'Сохранить изменения'"
              :action="editRegPattern.bind(this, p)"
            />
          </td>
        </tr>
        <tr>
          <td><input type="text" v-model="newPat.pattern" /></td>
          <td><input type="text" v-model="newPat.file" /></td>
          <td><input type="text" v-model="newPat.query" /></td>
          <td><input type="text" v-model="newPat.link_style" /></td>
          <td>
            <SelectWithDataVue
              v-if="urlResource.length > 0"
              :list="urlResource"
              :option="'url_name'"
              :val="'id'"
              v-model="newPat.kod_resource"
            />
          </td>
          <td>
            <SwitchMaterialVue v-model="newPat.avcive" />
          </td>
          <td>
            <BtnIconsVue
              class="btn-small indigo"
              :icon="'add'"
              :title="'Добавить'"
              :action="addRegPattern.bind(this, newPat)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import SMurlService from "../../views/SMurlService.vue";
import { mapActions, mapGetters, mapState } from "vuex";
import SwitchMaterialVue from "../basic/MUI/SwitchMaterial.vue";
import SelectWithDataVue from "../basic/MUI/SelectWithData.vue";
import BtnIconsVue from "../basic/MUI/BtnIcons.vue";
// import FABbtnVue from '../basic/FABbtn.vue';
import shifr from "../../store/function/shifr";
export default {
  components: {
    SMurlService,
    SwitchMaterialVue,
    SelectWithDataVue,
    BtnIconsVue
  },
  data: () => ({
    newPat: {
      pattern: "",
      kod_resource: 1,
      query: "",
      link_style: "",
      avcive: true,
      file: ""
    }
  }),
  computed: {
    ...mapGetters("SM", ["urlResource"]),
    ...mapState("SM", ["sm_url_patterns"])
  },
  methods: {
    ...mapActions(["fetchData", "fetchDataGet"]),
    test() {
      console.log(
        shifr(
          "E7QJwwooCWATuQooC2MKWhZQCcMVswsiFQ4J9iUiCrALKCZFC2MKhwq+FBUV4AqPC1skwRUeFRgVqAtkFdILWw==",
          "7b5157fc02"
        )
      );
    },
    getRegPattern() {
      this.fetchDataGet({
        module: "SM",
        tables: ["url_resource", "sm_url_patterns"]
      });
    },
    editRegPattern(p) {
      this.fetchData({
        data: { sqlname: "editSMParser", ...p }
      }).then(res => {
        if (res.count == 1) {
          this.$M.toast({ html: "Сохранение успешно" });
        } else {
          this.$M.toast({ html: "Сохранение не удалось" });
        }
      });
    },
    addRegPattern(p) {
      this.fetchData({
        data: { sqlname: "addSMParser", ...p }
      }).then(res => {
        if (res.count == 1) {
          this.$M.toast({ html: "Добавление успешно" });
          this.newPat.pattern = "";
          this.newPat.query = "";
          this.newPat.link_style = "";
          this.newPat.file = "";
          this.newPat.avcive = true;
          this.newPat.kod_resource = 1;
          this.getRegPattern();
        } else {
          this.$M.toast({ html: "Добавление не удалось" });
        }
      });
    }
  },
  mounted() {
    this.getRegPattern();
  }
};
</script>

<style scoped>
table,
th,
td {
  border: 1px solid silver;
  font-size: 10pt;
  padding: 4px;
}
.input-field {
  margin: 0;
}
table {
  table-layout: fixed;
}
</style>

<style>
td .select-wrapper input.select-dropdown,
td input[type="text"]:not(.browser-default) {
  margin: 0;
  height: 2.25rem;
}
</style>
