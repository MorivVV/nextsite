<template>
  <div>
    <div class="row">
      <DatePickerVue v-model="datebeg" :label="'Период с'" class="col s2" />
      <DatePickerVue v-model="dateend" :label="'Период по'" class="col s2" />
      <SelectWithDataVue
        class="col s3"
        :label="'Пользователь'"
        :list="sortUsers"
        :option="'fio'"
        :val="'id'"
        v-model="kod_user"
      />

      <div class="input-field col s2">
        <input type="search" v-model="ipsearch" id="ips" />
        <label for="ips">ip</label>
      </div>
      <div class="input-field col s2">
        <input type="search" v-model="comm" id="scom" />
        <label for="scom">Действие</label>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th width="80">Время</th>
          <th width="100">Пользователь</th>
          <th width="100">IP</th>
          <th width="300">Браузер</th>
          <th width="100">Действие</th>
          <th>Параметры</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in sortAudit" :key="a.id">
          <td>{{ a.time_action }}</td>
          <td>{{ a.login }}</td>
          <td>{{ a.ip }}</td>
          <td>{{ a.browser }}</td>
          <td>{{ a.comment }}</td>
          <td>{{ a.action.replaceAll(",", ", ") }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions, mapState } from "vuex";
import datePickerI18 from "../js/datePickerI18";
import DatePickerVue from "../basic/MUI/DatePicker.vue";
import SelectWithDataVue from "../basic/MUI/SelectWithData.vue";

export default {
  components: {
    DatePickerVue,
    SelectWithDataVue
  },
  data: () => ({
    ipsearch: "",
    comm: "",
    datebeg: moment().format("YYYY-MM-DD"),
    dateend: moment().format("YYYY-MM-DD"),
    kod_user: -2
  }),
  watch: {
    ipsearch() {
      this.getAudit();
    },
    datebeg() {
      this.getAudit();
    },
    dateend() {
      this.getAudit();
    },
    comm() {
      this.getAudit();
    },
    kod_user() {
      this.getAudit();
    }
  },
  computed: {
    ...mapState("admin", ["userAudit", "users"]),
    sortAudit() {
      let u = [];
      let object = this.userAudit;
      for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          const element = object[key];
          u.push(element);
        }
      }
      u.sort((a, b) => b.id - a.id);
      return u;
    },
    sortUsers() {
      let u = [];
      let object = this.users;
      for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          const element = object[key];
          u.push(element);
        }
      }
      u.sort((a, b) => {
        if (a.fio > b.fio) return 1;
        if (a.fio < b.fio) return -1;
        return 0;
      });
      return u;
    }
  },
  methods: {
    ...mapActions(["fetchData"]),
    begPick: function() {
      datePickerI18.onSelect = this.setDate.bind(this, event.target.id);
      datePickerI18.autoClose = true;
      let datainstances = this.$M.Datepicker.init(event.target, datePickerI18);
      datainstances.open();
    },
    setDate(id, date) {
      let d = moment(new Date(date)).format("YYYY-MM-DD");
      this[id] = d;
    },
    getAudit() {
      let s = "";
      let c = "";
      if (this.ipsearch) {
        s = "%" + this.ipsearch + "%";
      }
      if (this.comm) {
        c = "%" + this.comm + "%";
      }
      this.fetchData({
        data: {
          sqlname: "getUserAudit",
          kod_user: this.kod_user,
          ipsearch: s,
          datebeg: this.datebeg,
          dateend: this.dateend,
          comm: c
        },
        stateName: "admin/userAudit"
      });
    }
  },
  mounted() {
    this.getAudit();
    this.fetchData({
      data: { sqlname: "getUsersforAllow" },
      stateName: "admin/users"
    }).then(() => this.$M.AutoInit());
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
table {
  table-layout: fixed;
}
</style>
