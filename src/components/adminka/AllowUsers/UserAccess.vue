<template>
  <li>
    <div class="collapsible-header">
      <div class="col s4">
        <i class="material-icons blue-text">account_circle</i>
        {{ user.family }} {{ user.first_name }} {{ user.second_name }}
      </div>
      <div class="col s1">{{ user.tabnum }}</div>
      <div class="col s2" v-html="user.login"></div>
      <div class="col s1">id:{{ user.id }}</div>

      <SwitchMaterialVue
        @input="accessUser(user.id, user.active)"
        class="col s3 offset-s1 center"
        :label="user.active ? 'Активный' : 'Заблокирован'"
        v-model="user.active"
      />
    </div>
    <div class="collapsible-body">
      <div class="flow-text">Доступы</div>
      <template v-if="partition.length > 0">
        <div class="row">
          <div
            v-for="a in access.filter(e => e.kod_user === user.id)"
            :key="user.id + '-' + a.kod_access"
            class="col s3"
          >
            <span class="user green lighten-4">
              {{ partition.filter(e => e.id === a.kod_access)[0].namien }} (c
              {{ a.date_add.substr(0, 10) }})
            </span>
            <i
              title="Убрать доступ"
              @click="delAccess(a.kod_access)"
              class="material-icons pointer"
              >close</i
            >
          </div>
        </div>
        <div class="divider"></div>
        <div class="row">
          <SelectWithDataVue
            @input="addAccess"
            class="col s8 offset-s2"
            v-if="partition.length > 0"
            :extend="false"
            :label="'Добавить раздел'"
            :list="partition"
            :option="'namien'"
            :val="'id'"
          />
          <div class="col offset-s1">
            <btn-icons-vue
              class="green darken-3"
              :action="allAllow"
              :icon="'filter_9_plus'"
              :title="'Предоставить все доступы'"
            />
          </div>
        </div>
        <div class="divider"></div>
        <div class="flow-text pointer" @click="getAudit">
          История активности
        </div>
        <template v-if="aud" class="row">
          <div class="row" v-for="a in userAudit" :key="a">
            <div class="col">
              {{ a.time_action.substr(0, 10) }}
            </div>
            <div class="col">
              {{ a.ip }}
            </div>
            <div class="col">
              {{ a.action }}
            </div>
          </div>
        </template>
      </template>
    </div>
  </li>
</template>

<script>
import { mapActions, mapState } from "vuex";
import BtnIconsVue from "../../basic/MUI/BtnIcons.vue";
import SelectWithDataVue from "../../basic/MUI/SelectWithData.vue";
import SwitchMaterialVue from "../../basic/MUI/SwitchMaterial.vue";

export default {
  components: {
    SelectWithDataVue,
    BtnIconsVue,
    SwitchMaterialVue
  },
  props: {
    user: Object
  },
  data() {
    return {
      aud: false
    };
  },
  computed: {
    ...mapState("admin", ["access", "partition", "userAudit"])
  },
  methods: {
    ...mapActions(["fetchData"]),
    addAccess(e) {
      this.fetchData({
        url: "api/restInsert",
        data: {
          fields: {
            kod_access: e,
            kod_user: this.user.id
          },
          to: "public.user_access"
        }
      }).then(r => {
        if (r.count) {
          this.$M.toast({ html: "Доступ предоставлен" });
          this.getAccess();
        }
      });
    },
    getAudit() {
      this.aud = true;
      this.fetchData({
        data: {
          sqlname: "getLastAudit",
          kod_user: this.user.id
        },
        stateName: "admin/userAudit"
      });
    },
    delAccess(a) {
      this.fetchData({
        url: "api/restDelete",
        data: {
          filter: {
            kod_access: a,
            kod_user: this.user.id
          },
          from: "public.user_access"
        }
      }).then(r => {
        if (r.count) {
          this.$M.toast({ html: "Доступ закрыт" });
          this.getAccess();
        }
      });
    },
    accessUser(u, a) {
      let msg = "Заблокирован";
      if (a) {
        msg = "Активирован";
      }
      this.fetchData({
        url: "api/restUpdate",
        data: {
          to: "public.bz_users",
          set: { active: a },
          filter: { id: u }
        }
      }).then(r => {
        if (r.count) {
          this.$M.toast({ html: msg });
        }
      });
    },
    allAllow() {
      this.fetchData({
        data: {
          sqlname: "addAllAllow",
          kod_user: this.user.id
        }
      }).then(r => {
        if (r.count) {
          this.$M.toast({ html: "Доступ ко всем разделам предоставлен" });
          this.getAccess();
        }
      });
    },
    getAccess() {
      this.fetchData({
        url: "api/restGet",
        data: {
          from: "public.USER_ACCESS",
          sort: ["kod_access"]
        },
        stateName: "admin/access"
      });
    }
  }
};
</script>

<style scoped>
.user {
  padding: 5px;
  border-radius: 20px;
}
</style>
