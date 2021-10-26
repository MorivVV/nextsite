<template>
  <div class="row">
    <div class="cols12">
      <div class="card">
        <div class="card-content">
          <div class="row">
            <div class="col s2 blue lighten-5">
              <label>sql_name</label>
              <span class="card-title purple-text b">{{ ssq.sql_name }}</span>
            </div>
            <div class="col s4">
              <label>Входные параметры</label>
              <p>{{ ssq.sql_params }}</p>
            </div>
            <div class="col s1">
              <label>Отдаваемый параметр</label>
              <p>{{ ssq.result }}</p>
            </div>
            <div class="col s2">
              <SwitchMaterialVue
                :label="'Требуется авторизация'"
                :value="+ssq.need_token"
              />
            </div>
            <SelectWithDataVue
              :label="'База данных'"
              :disabled="true"
              class="col s2"
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
            <BtnEditFlatVue :action="() => (edit.val = true)" class="right" />
          </div>
          <label>Текст SQL запроса</label>
          <p class="pre">{{ ssq.sql_query }}</p>
        </div>
        <div class="divider"></div>
        <div class="row">
          <div class="col">
            <BtnIconsVue
              :action="testSQL"
              :disabled="!ssq.sql_query"
              :icon="'play_arrow'"
              class="btn-small blue"
              :title="'Выполнить скрипт и получить результат'"
            />
          </div>
          <InputWithLabelVue
            class="col s1"
            v-for="p in qParam"
            :label="p"
            v-model="params[p]"
            :key="ssq.sql_name + p"
          />
        </div>
        <TableDataVue v-if="run" :data="queryResult" :label="ssq.sql_name" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import BtnEditFlatVue from "../../basic/BtnEditFlat.vue";
import BtnIconsVue from "../../basic/MUI/BtnIcons.vue";
import InputWithLabelVue from "../../basic/MUI/InputWithLabel.vue";
import SelectWithDataVue from "../../basic/MUI/SelectWithData.vue";
import SwitchMaterialVue from "../../basic/MUI/SwitchMaterial.vue";
import TableDataVue from "../../basic/TableData.vue";

export default {
  components: {
    BtnEditFlatVue,
    SwitchMaterialVue,
    BtnIconsVue,
    TableDataVue,
    InputWithLabelVue,
    SelectWithDataVue
  },
  data() {
    return {
      queryResult: [],
      params: {},
      run: false
    };
  },
  props: {
    ssq: Object,
    edit: Object
  },
  computed: {
    qParam() {
      let p = [];
      if (this.ssq.sql_params) {
        p = this.ssq.sql_params.split(",").map(e => {
          let t = e.split(":");
          if (t.length > 1) {
            t = t[1];
          } else {
            t = t[0];
          }
          return t.trim();
        });
      }
      return p;
    }
  },
  methods: {
    ...mapActions(["fetchData"]),
    testSQL() {
      this.fetchData({
        data: {
          sqlname: this.ssq.sql_name,
          ...this.params
        }
      }).then(r => {
        this.queryResult = r;
        this.run = true;
      });
    }
  }
};
</script>

<style scoped>
.b {
  font-weight: 500;
}
.row {
  margin: 0;
  padding: 1px;
}
.col {
  margin: 1px;
}
.pre {
  display: block;
  white-space: pre;
  margin: 1em 0px;
  font-family: monospace, monospace;
  font-size: 1em;
}
</style>
