<template>
  <div class="white">
    <div class="row center">
      <SelectWithDataVue
        v-if="pg_namespace.length > 0"
        class="col s3"
        :label="'Схема'"
        :list="pg_namespace"
        :option="'nspname'"
        :val="'nspname'"
        v-model="space"
      />
    </div>

    <TableDataVue
      :f="v=>{viewFields(v); table=v}"
      :fd="test"
      class="blue lighten-4"
      v-if="tableList.length > 0"
      :data="tableList"
      :label="'Список таблиц ' + space"
    />
    <div class="divider"></div>
    <div class="row"></div>
    <div class="row">
      <h4 class="col">Просмотр полей и данных в таблице</h4>
      <SelectWithDataVue
        v-if="loading"
        class="col s4"
        :label="'Просмотр столбцов'"
        :list="tableList"
        :option="'tablename'"
        :val="'tablename'"
        v-model="table"
        @input="viewFields"
      />
    </div>
    <TableDataVue
      class="purple lighten-4"
      v-if="fieldList.length > 0"
      :data="fieldList"
      :label="'Список полей в таблице ' + table"
    />
    <div class="row"></div>
    <template v-if="table">
      <table v-if="!edit.value">
        <caption class="flow-text">
          Данные в таблице
          {{
            table
          }}
          <input-with-label-vue
            class="col s2"
            :label="'Отобразить записей'"
            v-model="limit"
          />
          <input class="col s1" type="number" min="1" v-model="page" />

          <btn-icons-vue
            :action="viewFields.bind(this, table)"
            :icon="'filter'"
            :title="'Применить фильтр'"
          />
        </caption>
        <thead>
          <tr>
            <th v-for="f in fieldList" :key="f.column_name">
              <span @click="sorting(f.column_name)">{{ f.column_name }}</span>
              <i v-if="~sort.indexOf(f.column_name)" class="material-icons"
                >keyboard_arrow_up</i
              >
              <i
                v-if="~sort.indexOf('-' + f.column_name)"
                class="material-icons"
                >keyboard_arrow_down</i
              >
              <label
                v-if="
                  primarykey.filter(e => e.column_name === f.column_name)
                    .length > 0
                "
                class="red-text"
              >
                (PKey)</label
              ><br />
              <label>({{ f.data_type }})</label>
            </th>
            <th width="50">
              <BtnIconsVue
                v-if="!edit.value"
                class="green"
                :action="
                  () => {
                    edit.value = true;
                  }
                "
                :icon="'edit'"
                :title="'Перейти в режим редактирования данных'"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="f in fieldList" :key="'dataf_'+f.column_name" class="row">
              <CheckBoxVue
                v-if="f.data_type === 'boolean'"
                v-model="newRow[f.column_name]"
              />
              <InputWithLabelVue
                v-else
                :label="f.column_name"
                v-model="newRow[f.column_name]"
              />
            </td>
            <td>
              <BtnIconsVue
                class="purple btn-small"
                :action="addRow"
                :icon="'add'"
                :title="'Добавить'"
              />
            </td>
          </tr>
          <tr v-for="d in workData" :key="'tr_'+pkey + d[pkey]">
            <td v-for="f in fieldList" :key="'td_'+pkey + d[pkey] + f.column_name">
              {{ d[f.column_name] }}
            </td>
            <td>
              <BtnIconsVue
                class="red btn-small"
                :action="deleteRow.bind(this, pkey, d[pkey])"
                :icon="'delete'"
                :title="'Удалить запись'"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table v-else>
        <caption class="flow-text">
          Данные в таблице
          {{
            table
          }}
        </caption>
        <thead>
          <tr>
            <th v-for="f in fieldList" :key="f.column_name">
              {{ f.column_name }}
              <label
                v-if="
                  primarykey.filter(e => e.column_name === f.column_name)
                    .length > 0
                "
                class="red-text"
              >
                (PKey)</label
              ><br />
              <label>({{ f.data_type }})</label>
            </th>
            <th width="50">
              <BtnIconsVue
                v-if="edit.value"
                class="green"
                :action="
                  () => {
                    edit.value = false;
                  }
                "
                :icon="'undo'"
                :title="'Выйти из режима редактирования'"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="f in fieldList" :key="f" class="row">
              <CheckBoxVue
                v-if="f.data_type === 'boolean'"
                v-model="newRow[f.column_name]"
              />
              <InputWithLabelVue
                v-else
                :label="f.column_name"
                v-model="newRow[f.column_name]"
              />
            </td>
            <td>
              <BtnIconsVue
                class="purple btn-small"
                :action="addRow"
                :icon="'add'"
                :title="'Добавить'"
              />
            </td>
          </tr>
          <tr v-for="d in workData" :key="pkey + d[pkey]">
            <td v-for="f in fieldList" :key="pkey + d[pkey] + f.column_name">
              <CheckBoxVue
                v-if="f.data_type === 'boolean'"
                v-model="d[f.column_name]"
              />
              <InputWithLabelVue v-else v-model="d[f.column_name]" />
            </td>
            <td>
              <BtnIconsVue
                class="blue btn-small"
                :action="saveRow.bind(this, pkey, d[pkey])"
                :icon="'save'"
                :title="'Сохранить изменения в строке'"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </template>

    <div class="divider"></div>
    <div class="row">
      <div class="divider"></div>
      <h4 class="col">Создать новую таблицу</h4>
      <InputWithLabelVue
        class="col s4"
        :label="'Название таблицы'"
        v-model="tableName"
      />
    </div>
    <div class="row">
      <InputWithLabelVue
        class="col s3"
        :label="'Имя поля'"
        v-model="field.fname"
      />
      <SelectWithDataVue
        v-if="dataTypes.length > 0"
        class="col s3"
        :label="'Тип данных'"
        :list="dataTypes"
        :option="'type_name'"
        :val="'type_id'"
        v-model="field.ftype"
      />
      <InputWithLabelVue
        class="col s2"
        :label="'Размер'"
        v-model="field.scale"
      />
      <div class="col s1">
        <SwitchMaterialVue v-model="field.fnull" :label="'Not Null'" />
      </div>
      <InputWithLabelVue
        class="col s2"
        :label="'По умолчанию'"
        v-model="field.default"
      />
      <div class="col s1">
        <BtnIconsVue
          class="blue"
          :action="addField"
          :icon="'add'"
          :title="'Добавить поле'"
        />
      </div>
    </div>
    <TableDataVue
      v-if="fields.length > 0"
      class="green lighten-4"
      :data="fields"
      :label="'Структура таблицы ' + tableName"
    />
    <div class="row center" v-if="fields.length > 0">
      <BtnIconsVue
        :icon="'flash_auto'"
        class="blue darken-1"
        :action="addTable"
        :title="'Создать таблицу'"
      />
    </div>
    <div class="divider"></div>
    <TableDataVue
      v-if="dataTypes.length > 0"
      class="yellow lighten-4"
      :data="dataTypes"
      :label="'Список всех типов БД PostgreSQL'"
    />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";

import BtnIconsVue from "../basic/MUI/BtnIcons.vue";
import CheckBoxVue from "../basic/MUI/CheckBox.vue";
import InputWithLabelVue from "../basic/MUI/InputWithLabel.vue";
import SelectWithDataVue from "../basic/MUI/SelectWithData.vue";
import SwitchMaterialVue from "../basic/MUI/SwitchMaterial.vue";
import TableDataVue from "../basic/TableData.vue";

export default {
  components: {
    InputWithLabelVue,
    BtnIconsVue,
    SwitchMaterialVue,
    TableDataVue,
    SelectWithDataVue,
    CheckBoxVue
  },
  data() {
    return {
      edit: {
        value: false
      },
      loading: false,
      fields: [],
      table: "",
      space: "",
      limit: 20,
      page: 1,
      sort: ["-1"],
      tableName: "",
      newRow: {},
      field: {
        fname: "",
        ftype: 0,
        fnull: false,
        scale: "",
        default: ""
      }
    };
  },
  watch: {
    space() {
      this.getData();
    }
  },
  computed: {
    ...mapState("admin", [
      "dataTypes",
      "pg_namespace",
      "tableList",
      "fieldList",
      "dataTable",
      "primarykey"
    ]),
    workData() {
      let d = this.dataTable.map(e => ({ ...e })).slice();
      return d;
    },
    pkey() {
      let key = "id";
      let pk = this.primarykey;
      if (pk.length > 0) {
        key = pk[0].column_name;
      }
      return key;
    }
  },
  methods: {
    ...mapActions(["fetchData"]),
    test(e) {
      console.log(e);
    },
    addField() {
      this.fields.push({ ...this.field });
    },
    deleteRow(key, val) {
      let t = this.table;
      if (
        !confirm(
          "Подтвердите удаление записи " + key + "=" + val + " из таблицы " + t
        )
      ) {
        return;
      }
      let fields = {};
      fields[key] = "" + val;
      this.fetchData({
        url: "api/restDelete",
        data: {
          from: this.space + "." + t,
          filter: {
            ...fields
          }
        }
      }).then(r => {
        if (r.count === 1) {
          this.$M.toast({
            html:
              "Запись " + key + "=" + val + " из " + t + "<br>удалена успешно"
          });
          this.getDataTable(t);
        } else {
          this.$M.toast({ html: r });
        }
      });
    },
    saveRow(key, val) {
      let t = this.table;

      let fields = {};
      let row = { ...this.workData.filter(e => e[key] === val)[0] };
      let oldrow = { ...this.dataTable.filter(e => e[key] === val)[0] };

      this.fieldList.forEach(e => {
        if (e.column_name in row) {
          if (row[e.column_name] !== oldrow[e.column_name]) {
            if (e.data_type === "ARRAY") {
              if (row[e.column_name]) {
                row[e.column_name] = row[e.column_name]
                  .split(",")
                  .map(e => +e.trim());
              }
            }
          } else {
            delete row[e.column_name];
          }
        }
      });

      let seter = row;
      if (Object.keys(seter).length === 0) {
        this.$M.toast({
          html: "Обновлять нечего<br>изменения не зафиксисрованы"
        });
        return;
      }
      fields[key] = "" + val;
      this.fetchData({
        url: "api/restUpdate",
        data: {
          to: this.space + "." + t,
          set: {
            ...seter
          },
          filter: {
            ...fields
          }
        }
      }).then(r => {
        if (r.count === 1) {
          this.$M.toast({ html: "Запись обновлена " + t });
          this.getDataTable(t);
        } else {
          this.$M.toast({ html: r });
        }
      });
    },
    addRow() {
      let t = this.table;
      let row = { ...this.newRow };
      this.fieldList.forEach(e => {
        if (e.column_name in row) {
          if (e.data_type === "ARRAY") {
            if (row[e.column_name]) {
              row[e.column_name] = row[e.column_name]
                .split(",")
                .map(e => +e.trim());
            }
          }
        }
      });

      this.fetchData({
        url: "api/restInsert",
        data: {
          to: this.space + "." + t,
          fields: {
            ...row
          }
        }
      }).then(r => {
        if (r.count === 1) {
          this.$M.toast({ html: "Запись добавлена в таблицу " + t });
          this.newRow = {};
          this.getDataTable(t);
        } else {
          this.$M.toast({ html: r });
        }
      });
    },
    addTable() {
      this.fetchData({
        url: "api/cretable/",
        data: { fields: this.fields, table: this.tableName }
      }).then(() => this.getData());
    },
    sorting(field) {
      let f = this.sort[0].split("-");
      if (~f.indexOf(field)) {
        if (f.length === 1) {
          this.sort = ["-" + field];
        } else {
          this.sort = [field];
        }
      } else {
        this.sort = [field];
      }
      this.getDataTable(this.table);
    },
    getDataTable(t) {
      this.fetchData({
        url: "api/restGet",
        data: {
          fields: [],
          from: this.space + "." + t,
          sort: this.sort,
          limit: this.limit,
          page: this.page
        },
        stateName: "admin/dataTable"
      });
    },
    viewFields(t) {
      this.newRow = {};
      this.fetchData({
        url: "api/restGet",
        data: {
          from: "information_schema.columns",
          fields: [
            "column_name",
            "ordinal_position",
            "column_default",
            "is_nullable",
            "data_type",
            "character_maximum_length",
            "COLUMN_TYPE:udt_name",
            "COLUMN_KEY:is_updatable"
          ],
          filter: { table_schema: this.space, table_name: t },
          sort: ["ordinal_position"]
        },
        stateName: "admin/fieldList"
      });
      this.getDataTable(t);
      this.fetchData({
        url: "api/restGet",
        data: {
          fields: ["column_name"],
          from: "information_schema.columns",
          filter: {
            "COLUMN_KEY": "PRI",
            "TABLE_NAME": t,
            "TABLE_SCHEMA": this.space
          },
          sort: ["column_name"]
        },
        stateName: "admin/primarykey"
      });
    },
    getData() {
      this.loading = false;
      this.fetchData({
        url: "api/restGet",
        data: {
          fields: [],
          from: "public.pg_types_fields",
          sort: ["type_name"]
        },
        stateName: "admin/dataTypes"
      });
      this.fetchData({
        url: "api/restGet",
        data: {
          fields: ["SCHEMA_NAME:nspname"],
          from: "INFORMATION_SCHEMA.SCHEMATA",
          sort: ["nspname"]
        },
        stateName: "admin/pg_namespace"
      });
      this.fetchData({
        url: "api/restGet",
        data: {
          fields: [
            "TABLE_NAME:tablename",
            "ENGINE:tableowner",
            "TABLE_CATALOG:tablespace",
            "INDEX_LENGTH:hasindexes",
            "TABLE_COMMENT:hasrules",
            "TABLE_ROWS:hastriggers"
          ],
          from: "INFORMATION_SCHEMA.tables",
          filter: { table_schema: this.space },
          sort: ["table_name"]
        },
        stateName: "admin/tableList"
      }).then(() => {
        setTimeout(() => {
          this.loading = true;
        }, 1000);
        
      });
    }
  },
  mounted() {
    this.getData();
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
  table-layout: auto;
}
</style>

<style>
td .select-wrapper input.select-dropdown,
td input[type="text"]:not(.browser-default) {
  margin: 0;
  height: 2.25rem;
}
</style>
