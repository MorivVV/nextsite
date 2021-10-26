<template>
  <div>
    <h5>Доступы к разделам сайта</h5>

    <div class="container">
      <InputWithLabelVue
        :icon="'search'"
        :label="'Поиск по разделам'"
        v-model="sPartition"
      />
      <ul class="collapsible" data-collapsible="accordion">
        <PartitionAccessVue
          v-for="p in partitionFilter"
          :key="p.id"
          :part="p"
        />
      </ul>

      <InputWithLabelVue
        :icon="'search'"
        :label="'Поиск по пользователю'"
        v-model="sFio"
      />
      <ul class="collapsible" data-collapsible="accordion">
        <UserAccessVue v-for="u in usersFilter" :key="u.id" :user="u" />
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import InputWithLabelVue from "../basic/MUI/InputWithLabel.vue";
import PartitionAccessVue from "./AllowUsers/PartitionAccess.vue";
import UserAccessVue from "./AllowUsers/UserAccess.vue";

export default {
  components: {
    PartitionAccessVue,
    UserAccessVue,
    InputWithLabelVue
  },
  data() {
    return {
      sFio: "",
      sPartition: ""
    };
  },
  computed: {
    ...mapState("admin", ["users", "partition"]),
    usersFilter() {
      let u = this.users;
      let f = this.sFio.toLowerCase();
      return u.filter(
        e =>
          ~(
            e.family.toLowerCase() +
            e.first_name.toLowerCase() +
            e.login.toLowerCase() +
            e.tabnum
          ).indexOf(f)
      );
    },
    partitionFilter() {
      let u = this.partition;
      let f = this.sPartition.toLowerCase();
      return u.filter(
        e => ~(e.namien.toLowerCase() + e.route.toLowerCase()).indexOf(f)
      );
    }
  },
  methods: {
    ...mapActions(["fetchData"]),
    getAllowUsers() {
      this.fetchData({
        data: { sqlname: "getAllowUsers" },
        stateName: "admin/allowUsers"
      });
      this.fetchData({
        url: "api/restGet",
        data: {
          fields: [
            "id",
            "login",
            "tabnum",
            "family",
            "first_name",
            "second_name",
            "login_ip",
            "login_time",
            "create_time",
            "active"
          ],
          from: "public.bz_users",
          sort: ["family", "first_name"]
        },
        stateName: "admin/users"
      });
      this.fetchData({
        url: "api/restGet",
        data: {
          from: "public.USER_ACCESS",
          sort: ["kod_access"]
        },
        stateName: "admin/access"
      });
      this.fetchData({
        url: "api/restGet",
        data: {
          from: "public.partition_access",
          sort: ["namien"]
        },
        stateName: "admin/partition"
      });
    }
  },
  mounted() {
    this.getAllowUsers();
    this.$M.AutoInit();
    this.$M.Tooltip.init(document.querySelector(".tooltipped"), {});
  }
};
</script>
