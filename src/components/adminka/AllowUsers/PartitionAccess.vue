<template>
  <li>
    <div
      class="collapsible-header"
      :class="{ 'green accent-1': part.access_all }"
    >
      <div class="col s6">
        <i class="material-icons red-text">place</i>
        {{ part.namien }}
      </div>
      <div class="col s2">
        {{ part.date_add.substr(0, 10) }}
      </div>
      <SwitchMaterialVue
        @input="accessAll(part.id, part.access_all)"
        class="col s3 offset-s1 center"
        :label="
          part.access_all
            ? 'Доступно при регистрации'
            : 'Доступ по предоставлению'
        "
        v-model="part.access_all"
      />
    </div>
    <div class="collapsible-body">
      <template v-if="users.length > 0">
        <div class="row">
          <div
            v-for="a in access.filter(e => e.kod_access === part.id)"
            :key="part.id + '-' + a.kod_user"
            class="col s3"
          >
            <span class="fio blue lighten-4">
              {{
                users
                  .filter(e => e.id === a.kod_user)
                  .map(e => [e.family, e.first_name])[0]
                  .join(" ")
              }}
            </span>
            <i
              title="Убрать"
              @click="delAccess(a.kod_user)"
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
            v-if="users.length > 0"
            :extend="false"
            :label="'Добавить'"
            :list="
              users.map(e => ({ id: e.id, fio: e.family + ' ' + e.first_name }))
            "
            :option="'fio'"
            :val="'id'"
          />
        </div>
      </template>
    </div>
  </li>
</template>

<script>
import { mapActions, mapState } from "vuex";
import SelectWithDataVue from "../../basic/MUI/SelectWithData.vue";
import SwitchMaterialVue from "../../basic/MUI/SwitchMaterial.vue";

export default {
  components: {
    SwitchMaterialVue,
    SelectWithDataVue
  },
  props: {
    part: Object
  },
  computed: {
    ...mapState("admin", ["users", "access"])
  },
  methods: {
    ...mapActions(["fetchData"]),
    addAccess(e) {
      this.fetchData({
        url: "api/restInsert",
        data: {
          fields: {
            kod_access: this.part.id,
            kod_user: e
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
    delAccess(u) {
      this.fetchData({
        url: "api/restDelete",
        data: {
          filter: {
            kod_access: this.part.id,
            kod_user: u
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
    accessAll(id, all) {
      this.fetchData({
        url: "api/restUpdate",
        data: {
          to: "public.partition_access",
          set: { access_all: all },
          filter: { id: id }
        }
      }).then(r => {
        if (r.count) {
          this.$M.toast({ html: "Установленно" });
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
.fio {
  padding: 5px;
  border-radius: 20px;
}
</style>
