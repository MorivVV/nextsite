<template>
  <div>
    <h4>Список серверов ({{ serverList.length }})</h4>
    <div class="container">
      <div class="card amber lighten-5">
        <div class="row">
          <div class="input-field col s4">
            <input class="white" v-model="search" id="search" type="text" />
            <label for="search">Введите текст для поиска</label>
          </div>
          <SelectWithDataVue
            class="col s2"
            v-model="filters.kod_ac"
            v-if="Object.keys(ac_system).length > 0"
            :label="'AC'"
            :list="ac_system"
            :option="'short_name'"
            :val="'id'"
          />
          <SelectWithDataVue
            class="col s2"
            v-model="filters.kod_responsible"
            v-if="Object.keys(users).length > 0"
            :label="'Ответственный'"
            :list="Object.keys(users).map(e => ({ ...users[e] }))"
            :option="'fio'"
            :val="'id'"
          />
          <SelectWithDataVue
            class="col s2"
            v-model="filters.kod_place"
            v-if="Object.keys(place).length > 0"
            :label="'Площадка'"
            :list="place"
            :option="'naimen'"
            :val="'id'"
          />
          <SelectWithDataVue
            class="col s2"
            v-model="filters.kod_stand"
            v-if="Object.keys(stand).length > 0"
            :label="'Стенд'"
            :list="stand"
            :option="'stand'"
            :val="'id'"
          />
        </div>
      </div>
    </div>
    <SwitchMaterialVue :label="'Текстовый вид'" v-model="text" />
    <div class="card yellow lighten-5">
      <table v-if="!text" class="highlight">
        <thead>
          <tr>
            <td>Сервер</td>
            <td>IP</td>
            <td>КЭ сервера</td>
            <td>КЭ WAS/DB/DP/KF</td>
            <td>Функционал</td>
            <td>Отв</td>
            <td width="130">Ссылки</td>
            <td>Площадка</td>
            <td>Стенд</td>
            <td>АС/Статус</td>
            <td width="50">
              <BtnIconsVue
                class="indigo"
                :icon="'add'"
                :title="'Добавить новый сервер'"
                :action="() => (add.value = true)"
              />
            </td>
          </tr>
        </thead>
        <tbody>
          <OneServer v-for="s in serverList" :server="s" :key="s.id" />
        </tbody>
      </table>
      <div v-else>
        <div v-for="s in serverList" :key="s.id">
          {{ s.server }} {{ s.ip }} {{ s.ci }}
        </div>
      </div>
    </div>

    <AddServer v-if="add.value" :active="add" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import OneServer from "../components/servers/OneServer";
import AddServer from "../components/servers/AddServer";
import BtnIconsVue from "../components/basic/MUI/BtnIcons.vue";
import SelectWithDataVue from "../components/basic/MUI/SelectWithData.vue";
import SwitchMaterialVue from "../components/basic/MUI/SwitchMaterial.vue";

export default {
  components: {
    OneServer,
    BtnIconsVue,
    AddServer,
    SelectWithDataVue,
    SwitchMaterialVue
  },
  data: () => ({
    search: "",
    text: false,
    filters: {},
    add: {
      value: false
    }
  }),
  computed: {
    ...mapState("servers", ["servers", "ac_system", "place", "stand"]),
    ...mapState("admin", ["users"]),
    serverList() {
      let res = [];
      let s = this.search.toLowerCase();
      let servers = Object.keys(this.servers).map(e => this.servers[e]);
      if (s) {
        servers.forEach(element => {
          for (const e in element) {
            if (~("" + element[e]).toLowerCase().indexOf(s)) {
              res.push(element);
              return;
            }
          }
        });
      } else {
        res = servers;
      }
      return res;
    }
  },
  watch: {
    filters: {
      handler: "getData",
      deep: true
    }
  },
  methods: {
    ...mapActions(["fetchData", "fetchDataGet"]),
    getData() {
      let filters = this.filters;
      for (const key in filters) {
        if (Object.hasOwnProperty.call(filters, key)) {
          const element = filters[key];
          if (element === "-2") {
            delete filters[key];
          }
        }
      }
      this.fetchData({
        url: "api/restGet",
        data: {
          from: "bz_server_info",
          filter: {
            ...filters
          },
          sort: ["-id"]
        },
        stateName: "servers/servers"
      });
    }
  },
  mounted() {
    this.fetchDataGet({
      module: "SM",
      tables: ["url_resource", "sm_url_patterns"]
    });
    this.fetchData({
      url: "api/restGet",
      data: {
        from: "bz_auto_systems",
        sort: ["short_name"]
      },
      stateName: "servers/ac_system"
    });
    this.fetchData({
      url: "api/restGet",
      data: {
        from: "server_place",
        sort: ["naimen"],
        filter: {
          active: true
        }
      },
      stateName: "servers/place"
    });
    this.fetchData({
      url: "api/restGet",
      data: {
        from: "server_stand",
        sort: ["stand"],
        filter: {
          active: true
        }
      },
      stateName: "servers/stand"
    });
    this.fetchData({
      url: "api/restGet",
      data: {
        fields: ["id", "u.family||' '||u.first_name:fio"],
        from: "bz_users:u",
        filter: {
          active: true
        },
        sort: ["family"]
      },
      stateName: "admin/users"
    }).then(() => this.getData());
  }
};
</script>

<style scoped>
.card {
  margin: 20px;
}
thead {
  font-weight: bold;
}
td {
  text-align: center;
  padding: 5px;
  border: 1px solid gray;
}
</style>
