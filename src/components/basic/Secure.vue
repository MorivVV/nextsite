<template>
  <div id="autorize">
    <div v-if="isLoggedIn">
      Авторизован: {{ userFio }}
      <i @click="logOff" title="Выйти" class="close material-icons red"
        >close</i
      >
    </div>
    <span v-else><router-link to="/login"> Без авторизации</router-link></span>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters(["isLoggedIn", "userFio"])
  },
  methods: {
    ...mapMutations(["updateState"]),
    ...mapActions(["fetchData"]),
    logOff() {
      this.fetchData({
        url: "/autorization",
        data: {},
        stateName: "autorization/token"
      });
      this.updateState({ state: "autorization/token", data: "" });
      this.updateState({ state: "autorization/user", data: "" });
      this.updateState({ state: "autorization/Fio", data: "" });
      this.updateState({ state: "autorization/routes", data: "" });
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
#autorize {
  position: absolute;
  background: rgb(248, 248, 193);
  right: 0;
  top: 0;
  padding: 5px;
  border-radius: 0 0 0 8px;
}
#autorize .close {
  cursor: pointer;
  float: right;
  font-size: 16px;
  margin-left: 4px;
}
</style>
