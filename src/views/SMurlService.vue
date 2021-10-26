<template>
  <div class="container">
    <h4 class="center">Преобразование в ссылки на Service Manager</h4>
    <div class="input-field col s4">
      <input type="text" class="validate" v-model="smnumber" />
      <label class="active" for="SM_ID">ID Service Manager</label>
    </div>
    <div v-html="nameUrlSM(smnumber)"></div>
  </div>
</template>

<script>
import smurl from "../functions/nameUrlSM";
import { mapGetters, mapActions } from "vuex";
export default {
  data: () => ({
    smnumber: ""
  }),
  computed: {
    ...mapGetters("SM", ["activeRegSetting", "urlResource"])
  },
  methods: {
    ...mapActions(["fetchData", "fetchDataGet"]),
    nameUrlSM(text) {
      return smurl(text, this.activeRegSetting, this.urlResource);
    }
  },
  mounted() {
    this.fetchDataGet({
      module: "SM",
      tables: ["url_resource", "sm_url_patterns"]
    });
  }
};
</script>
