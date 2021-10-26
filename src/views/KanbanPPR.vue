<template>
  <div>
    <div class="row center">
      <div class="switch">
        Вид:
        <label>
          Столбцами
          <input v-model="lineChart" type="checkbox" />
          <span class="lever"></span>
          В одну линию
        </label>
      </div>
    </div>
    <BarChart
      v-if="lineChart"
      :charData="newChartLine"
      :options="chartOption"
    />
    <BarChart v-else :charData="newChartBars" :options="chartOption2" />
    <PprTable :addtask="addtask" :addppr="addppr" />
    <AddTaskVue v-if="addtask.value" :active="addtask" />
    <AddPPRVue v-if="addppr.value" :active="addppr" />
  </div>
</template>

<script>
// const ie = false; // ~navigator.userAgent.indexOf("Trident");

// const MD5 = require('js-md5')
import { mapState, mapActions } from "vuex";
// import BtnAddFlatVue from "../components/basic/BtnAddFlat.vue";
import BarChart from "../components/basic/charts/BarChart";
import AddPPRVue from "../components/ppr/AddPPR.vue";
import AddTaskVue from "../components/ppr/AddTask.vue";
import PprTable from "../components/ppr/PprTable";
import genColor from "../functions/genColor";
export default {
  components: {
    BarChart,
    PprTable,
    AddTaskVue,
    AddPPRVue
  },
  data: () => ({
    lineChart: true,
    addppr: {
      value: false
    },
    addtask: {
      value: false,
      pprid: 0
    }
  }),
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
    chartOption() {
      // let tasks = this.tasks
      return {
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [
            {
              stacked: true,
              ticks: {
                min: 0
              }
            }
          ]
        },
        // tooltips: {
        //   callbacks: {
        //     label(itm, data) {
        //       return data.datasets[itm.datasetIndex].text;
        //     }
        //   }
        // },
        responsive: true,
        maintainAspectRatio: false
      };
    },
    chartOption2() {
      // let tasks = this.tasks
      return {
        scales: {
          xAxes: [],
          yAxes: [
            {
              ticks: {
                min: 0,
                max: 100
              }
            }
          ]
        },
        // tooltips: {
        //   callbacks: {
        //     label(itm, data) {
        //       return data.datasets[itm.datasetIndex].text;
        //     }
        //   }
        // },
        responsive: true,
        maintainAspectRatio: false
      };
    },
    newChartLine() {
      let dataset = [];
      let ppr = this.pprs;
      let task = this.tasks;
      let labels = [];
      let taskCount = 0;
      let nullData = [];
      for (const p in ppr) {
        labels.push(ppr[p].ppr_name);
        nullData.push(null);
        let tc = Object.keys(task).filter(
          e => task[e].kod_ppr === ppr[p].ppr_id
        ).length;
        if (taskCount < tc) {
          taskCount = tc;
        }
      }
      for (i = 0; i < taskCount; i++) {
        let ds = {};
        ds.label = "Задача#" + (i + 1);
        ds.data = [...nullData];
        ds.backgroundColor = [];
        ds.borderColor = [];
        ds.borderWidth = 2;
        dataset.push(ds);
      }
      let i = 0;
      for (const p in ppr) {
        let j = 0;
        for (const t in task) {
          if (task[t].kod_ppr === ppr[p].ppr_id) {
            task[t].percent_active = task[t].percent;
            task[t].plan_percent = Math.round(
              100 / task.filter(e => e.kod_ppr === ppr[p].ppr_id).length
            );
            // let val = (task[t].percent_active * task[t].plan_percent) / 100;
            if (task[t].task_close) {
              task[t].percent_active = 100;
              dataset[j].borderColor[i] = genColor(task[t].percent_active, 1);
              dataset[j].backgroundColor[i] = genColor(
                task[t].percent_active,
                0.5
              );
            } else if (task[t].kod_task) {
              let patent_task = task[t].kod_task;
              if (!task.filter(e => e.task_id === patent_task)[0].task_close) {
                task[t].percent_active = 0;
                dataset[j].borderColor[i] = genColor(task[t].percent_active, 1);
                dataset[j].backgroundColor[i] = genColor(
                  task[t].percent_active,
                  0.5
                );
              } else {
                if (
                  task[t].to_start > 0 &&
                  task[t].to_start < task[t].alltime
                ) {
                  task[t].percent_active = Math.round(
                    (100 * task[t].to_start) / task[t].alltime
                  );
                }
                dataset[j].borderColor[i] = genColor(
                  100 -
                    (task[t].percent_active > 100
                      ? 100
                      : task[t].percent_active),
                  1
                );
                dataset[j].backgroundColor[i] = genColor(
                  100 -
                    (task[t].percent_active > 100
                      ? 100
                      : task[t].percent_active),
                  0.5
                );
              }
            } else {
              dataset[j].borderColor[i] = genColor(task[t].percent_active, 1);
              dataset[j].backgroundColor[i] = genColor(
                task[t].percent_active,
                0.5
              );
            }
            dataset[j].data[i] = task[t].plan_percent; //val
            task[t].percent = task[t].percent_active;
            j++;
          }
        }
        i++;
      }
      // console.log(dataset);
      return {
        labels: labels,
        // xLabels: xlabels,
        datasets: dataset
      };
    },
    newChartBars() {
      let dataset = [];
      let ppr = this.pprs;
      let task = this.tasks;
      let labels = [];
      let taskCount = 0;
      let nullData = [];
      for (const p in ppr) {
        labels.push(ppr[p].ppr_name);
        nullData.push(null);
        let tc = Object.keys(task).filter(
          e => task[e].kod_ppr === ppr[p].ppr_id
        ).length;
        if (taskCount < tc) {
          taskCount = tc;
        }
      }
      for (i = 0; i <= taskCount; i++) {
        let ds = {};
        ds.label = i ? "Задача#" + i : "ППР";
        ds.data = [...nullData];
        ds.backgroundColor = [];
        ds.borderColor = [];
        ds.borderWidth = 2;
        dataset.push(ds);
      }

      let i = 0;
      for (const p in ppr) {
        let pprTotal = Object.keys(task)
          .filter(e => task[e].kod_ppr === ppr[p].ppr_id)
          .reduce(
            (a, c) => +a + (task[c].percent * task[c].plan_percent) / 100,
            0
          );
        // console.log("chart3");
        // console.log(pprTotal);
        dataset[0].data[i] = pprTotal;
        dataset[0].backgroundColor[i] = genColor(pprTotal, 1);
        dataset[0].borderColor[i] = "#333333";
        let j = 1;
        for (const t in task) {
          if (task[t].kod_ppr === ppr[p].ppr_id) {
            let val = (task[t].percent * task[t].plan_percent) / 100;
            dataset[j].data[i] = val;
            dataset[j].borderColor[i] = genColor(task[t].percent, 1);
            dataset[j].backgroundColor[i] = genColor(task[t].percent, 0.5);
            j++;
          }
        }
        i++;
      }
      // console.log(dataset);
      return {
        labels: labels,
        // xLabels: xlabels,
        datasets: dataset
      };
    }
  },
  watch: {
    addTask() {
      this.fetchData({
        data: { sqlname: "getTaskPPR" },
        stateName: "ppr/tasks"
      });
    },
    addPpr() {
      this.fetchData({ data: { sqlname: "getPPR" }, stateName: "ppr/pprs" });
    },
    deleteTask() {
      this.fetchData({
        data: { sqlname: "getTaskPPR" },
        stateName: "ppr/tasks"
      });
    },
    deletePPR() {
      this.fetchData({ data: { sqlname: "getPPR" }, stateName: "ppr/pprs" });
    }
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
      data: { sqlname: "getPPRtype" },
      stateName: "ppr/pprType"
    });
    this.fetchData({
      data: { sqlname: "getPPRTaskStatus" },
      stateName: "ppr/taskStatus"
    });
    this.fetchData({
      data: { sqlname: "getUsersforAllow" },
      stateName: "admin/users"
    });
    this.fetchData({
      data: { sqlname: "getInfoTask" },
      stateName: "ppr/info"
    });
  }
};
</script>
