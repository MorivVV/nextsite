<template>
  <div>
    <router-link exact to="/dashboard">К списку ППР</router-link>

    <h4 v-for="p in pprs" class="center" :key="p">
      {{ p.ppr_name }}
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
    kod_task() {
      let kod = this.$route.params.taskid;
      return kod;
    },
    kod_ppr() {
      let kod = this.$route.params.pprid;
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
    }
  },
  watch: {
    kod_task() {
      this.getData();
    },
    addTask() {
      this.getData();
    },
    deleteTask() {
      this.getData();
    }
  },
  methods: {
    ...mapActions(["fetchData"]),
    getData() {
      this.fetchData({
        data: { sqlname: "getPPR", kod_ppr: this.kod_ppr },
        stateName: "ppr/pprs"
      });
      this.fetchData({
        data: { sqlname: "getTaskPPR", kod_task: this.kod_task },
        stateName: "ppr/tasks"
      });
    }
  },
  mounted() {
    this.getData();
    this.fetchData({
      data: { sqlname: "getUserGroup" },
      stateName: "ppr/userGroup"
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
