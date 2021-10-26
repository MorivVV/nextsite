<template>
  <div>
    <h5>
      <router-link class="btn blue" to="/dashboard"
        >&lt; К списку ППР</router-link
      >
    </h5>
    <h4 class="center">
      {{ pprs[0].ppr_name }}
    </h4>
    <BarChartVue
      class="card horizontal small"
      :charData="data"
      :options="opt"
    />
    <PprTable :addtask="addtask" :addppr="addppr" />
    <AddTaskVue v-if="addtask.value" :active="addtask" />
    <!-- <AddPPRVue v-if="addppr.value" :active="addppr" /> -->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import BarChartVue from "../components/basic/charts/BarChart.vue";

// import AddPPRVue from "../components/ppr/AddPPR.vue";
import AddTaskVue from "../components/ppr/AddTask.vue";
import PprTable from "../components/ppr/PprTable";
import genColor from "../functions/genColor";

// import genColor from "../functions/genColor";
export default {
  components: {
    BarChartVue,
    PprTable,
    AddTaskVue
    // AddPPRVue
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
    kod_ppr() {
      let kod = this.$route.params.id;

      return kod;
    },
    opt() {
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
    data() {
      if (this.pprs.length === 0) {
        return {};
      }
      let warn = 1;
      let alert_task = 1;
      let ppr = this.pprs[0];
      let percent = (100 * ppr.close_tasks) / ppr.tasks;
      if (!percent) {
        percent = 50;
      }

      let dataset = [];
      let datappr = {
        label: "Общее",
        data: [percent],
        backgroundColor: genColor(percent * warn * alert_task, 0.7),
        hoverBackgroundColor: genColor(percent * warn * alert_task, 0.9),
        borderColor: genColor(percent * warn * alert_task, 1),
        borderWidth: 2
      };
      dataset.push(datappr);
      let task = this.tasks;

      for (const key in task) {
        if (Object.prototype.hasOwnProperty.call(task, key)) {
          const t = task[key];
          percent = t.percent;
          warn = 1;
          alert_task = 1;
          if (t.task_close) {
            percent = 100;
          } else {
            if (t.to_start > 0) {
              warn = 0.5;
            }
            if (t.to_end > 0) {
              alert_task = 0.2;
            }
          }

          if (!percent) {
            percent = 50;
            warn = -1;
          }
          let datatask = {
            label: t.task_name,
            data: [percent],
            backgroundColor: genColor(percent * warn * alert_task, 0.7),
            hoverBackgroundColor: genColor(percent * warn * alert_task, 0.9),
            borderColor: genColor(percent * warn * alert_task, 1),
            borderWidth: 2
          };
          dataset.push(datatask);
        }
      }
      return {
        labels: [ppr.ppr_name],
        datasets: dataset
      };

      // let dataset = [];
      // let ppr = this.pprs;
      // let task = this.tasks;
      // let labels = [];
      // let taskCount = 0;
      // let nullData = [];
      // for (const p in ppr) {
      //   labels.push(ppr[p].ppr_name);
      //   nullData.push(null);
      //   let tc = Object.keys(task).filter(
      //     e => task[e].kod_ppr === ppr[p].ppr_id
      //   ).length;
      //   if (taskCount < tc) {
      //     taskCount = tc;
      //   }
      // }
      // for (i = 0; i <= taskCount; i++) {
      //   let ds = {};
      //   ds.label = i ? "Задача#" + i : "ППР";
      //   ds.data = [...nullData];
      //   ds.backgroundColor = [];
      //   ds.borderColor = [];
      //   ds.borderWidth = 2;
      //   dataset.push(ds);
      // }

      // let i = 0;
      // for (const p in ppr) {
      //   let pprTotal = Object.keys(task)
      //     .filter(e => task[e].kod_ppr === ppr[p].ppr_id)
      //     .reduce(
      //       (a, c) => +a + (task[c].percent * task[c].plan_percent) / 100,
      //       0
      //     );
      //   // console.log("chart3");
      //   // console.log(pprTotal);
      //   dataset[0].data[i] = pprTotal;
      //   dataset[0].backgroundColor[i] = genColor(pprTotal, 1);
      //   dataset[0].borderColor[i] = "#333333";
      //   let j = 1;
      //   for (const t in task) {
      //     if (task[t].kod_ppr === ppr[p].ppr_id) {
      //       let val = (task[t].percent * task[t].plan_percent) / 100;
      //       dataset[j].data[i] = val;
      //       dataset[j].borderColor[i] = genColor(task[t].percent, 1);
      //       dataset[j].backgroundColor[i] = genColor(task[t].percent, 0.5);
      //       j++;
      //     }
      //   }
      //   i++;
      // }
      // // console.log(dataset);
      // return {
      //   labels: labels,
      //   // xLabels: xlabels,
      //   datasets: dataset
      // };
    }
  },
  watch: {
    addTask() {
      this.fetchData({
        data: { sqlname: "getTaskPPR", kod_ppr: this.kod_ppr },
        stateName: "ppr/tasks"
      });
    },
    addPpr() {
      this.fetchData({
        data: { sqlname: "getPPR", kod_ppr: this.kod_ppr },
        stateName: "ppr/pprs"
      });
    },
    deleteTask() {
      this.fetchData({
        data: { sqlname: "getTaskPPR", kod_ppr: this.kod_ppr },
        stateName: "ppr/tasks"
      });
    },
    deletePPR() {
      this.fetchData({
        data: { sqlname: "getPPR", kod_ppr: this.kod_ppr },
        stateName: "ppr/pprs"
      });
    }
  },
  methods: {
    ...mapActions(["fetchData"])
  },
  mounted() {
    this.fetchData({
      data: { sqlname: "getPPR", kod_ppr: this.kod_ppr },
      stateName: "ppr/pprs"
    });
    this.fetchData({
      data: { sqlname: "getUserGroup" },
      stateName: "ppr/userGroup"
    });
    this.fetchData({
      data: { sqlname: "getTaskPPR", kod_ppr: this.kod_ppr, kod_task: 0 },
      stateName: "ppr/tasks"
    });
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
