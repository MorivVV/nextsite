<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col s2" v-for="data in datappr" :key="data">
          <div class="card ">
            <div class="card-content small">
              <BarChartVue
                style="height: 200px;"
                :charData="data"
                :options="opt"
              />
              <BtnIconsLinkVue
                class="blue"
                :url="'/dashboard/' + data.kod_ppr"
                :icon="'pageview'"
                :title="'Просмотр подробной информации'"
              />
            </div>
          </div>
        </div>
        <div class="col s1">
          <div class="card center">
            <BtnIconsVue
              :title="'Добавить новый ППР'"
              :icon="'add'"
              class="btn-small indigo"
              :action="() => (addppr.value = true)"
            />
          </div>
        </div>
      </div>
    </div>
    <AddPPRVue v-if="addppr.value" :active="addppr" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import BtnIconsVue from "../components/basic/MUI/BtnIcons.vue";
import BtnIconsLinkVue from "../components/basic/BtnIconsLink.vue";
import BarChartVue from "../components/basic/charts/BarChart.vue";
import AddPPRVue from "../components/ppr/AddPPR.vue";

import genColor from "../functions/genColor";
export default {
  components: {
    BarChartVue,
    AddPPRVue,
    BtnIconsVue,
    BtnIconsLinkVue
  },
  computed: {
    ...mapState("ppr", [
      "pprs",
      "tasks",
      "addTask",
      "addPpr",
      "taskStatus",
      "deleteTask",
      "deletePPR"
    ]),
    datappr() {
      let pprList = this.pprs;
      if (pprList.length === 0) {
        return [];
      }
      let ppr = pprList.map(e => {
        let percent = 100; //(100 * e.close_tasks) / e.tasks;
        let warn = 1;
        if (e.warn_tasks > 0) {
          warn = 1 / e.warn_tasks;
        }
        let alert_task = 1;
        if (e.alert_tasks > 0) {
          alert_task = 0.4 / e.alert_tasks;
        }
        return {
          labels: [e.ppr_name],
          kod_ppr: e.ppr_id,
          datasets: [
            {
              label: e.ppr_name,
              data: [percent],
              backgroundColor: genColor(percent * warn * alert_task, 0.7),
              hoverBackgroundColor: genColor(percent * warn * alert_task, 0.9),
              borderColor: genColor(percent * warn * alert_task, 1),
              borderWidth: 2
            }
          ]
        };
      });
      return ppr;
    }
  },
  data() {
    return {
      addppr: {
        value: false
      },
      opt: {
        scales: {
          legend: {
            display: false,
            labels: { fontColor: "rgb(255,99,132" }
          },
          xAxes: [{ display: false }],
          yAxes: [
            {
              display: false,
              ticks: {
                // min: 0,
                beginAtZero: true,
                max: 100
              }
            }
          ]
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  methods: {
    ...mapActions(["fetchData"])
  },
  mounted() {
    this.fetchData({ data: { sqlname: "getPPR" }, stateName: "ppr/pprs" });
    this.fetchData({
      data: { sqlname: "getUserGroup" },
      stateName: "ppr/userGroup"
    });
    this.fetchData({ data: { sqlname: "getTaskPPR" }, stateName: "ppr/tasks" });
    this.fetchData({
      url: "api/ajax",
      data: { sqlname: "getPPRtype" },
      stateName: "ppr/pprType"
    });
    this.fetchData({
      url: "api/ajax",
      data: { sqlname: "getPPRTaskStatus" },
      stateName: "ppr/taskStatus"
    });
    this.fetchData({
      url: "api/ajax",
      data: { sqlname: "getUsersforAllow" },
      stateName: "admin/users"
    });
  }
};
</script>

<style scoped>
.item {
  height: 200px;
  width: 200px;
}
</style>
