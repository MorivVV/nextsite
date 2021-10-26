<template>
  <div>
    <div class="row">
      <div class="col s12">
        <SearchInput :nstate="'admin'" />
        <!-- <Pagination
          :pages="calcPages"
          :step="+perPage"
          :store="{ min: 'admin/resultMin', max: 'admin/resultMax' }"
        /> -->
      </div>
      <div class="col offset-s6">
        <BtnIconsVue
          class="blue darken-2 small-btn"
          :action="addSSQ"
          :icon="'add'"
          :title="'Добавить новый запрос'"
        />
      </div>
    </div>
    <OneSQL v-for="ssq in sqlQuery" :ssq="ssq" :key="ssq.id" />
    <div class="col s12">
      <!-- <Pagination
        :pages="calcPages"
        :step="+perPage"
        :store="{ min: 'admin/resultMin', max: 'admin/resultMax' }"
      /> -->
    </div>
  </div>
</template>

<script>
import OneSQL from "./QuerrySetting/OneSQL";
// import Pagination from "../elements/Pagination";
import SearchInput from "../basic/SearchInput";

import { mapActions, mapGetters, mapState } from "vuex";
import BtnIconsVue from "../basic/MUI/BtnIcons.vue";
export default {
  components: {
    OneSQL,
    SearchInput,
    // Pagination,
    BtnIconsVue
  },
  computed: {
    ...mapGetters("admin", ["sqlQuery"]),
    ...mapState("admin", [
      "addQuery",
      "search",
      "searchCount",
      "resultMin",
      "perPage"
    ]),
    calcPages() {
      let p = this.searchCount;
      return Math.ceil(p / 10);
    }
  },
  watch: {
    search() {
      this.getSSQ();
    },
    resultMin() {
      this.getSSQ();
    },
    addQuery(newVal) {
      if (newVal.count === 1) {
        this.getSSQ();
        this.$M.toast({ html: "Запрос добавлен успешно" });
      }
    }
  },
  methods: {
    ...mapActions(["fetchData"]),
    addSSQ() {
      this.fetchData({
        data: { sqlname: "insertSSQ" },
        stateName: "admin/addQuery"
      });
    },
    getSSQ() {
      this.fetchData({
        url: "api/restGet",
        data: {
          fields: [],
          from: "sys_sql_query",
          sort: ["sql_name"],
          filter: { sql_name: "like:%" + this.search + "%" },
          limit: this.perPage,
          page: 1 + this.resultMin / this.perPage
        },
        stateName: "admin/sqlQuery"
      });
      this.fetchData({
        data: {
          sqlname: "ssqCount",
          search: "%" + this.search + "%"
        },
        stateName: "admin/searchCount"
      });
    }
  },
  mounted() {
    this.getSSQ();
  }
};
</script>

<style scoped>
.b {
  font-weight: 500;
}
</style>
