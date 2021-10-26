<template>
  <div class="container">
    <h4>Получить структуру подчинения</h4>
    <div class="row">
      <InputWithLabelVue
        class="col s4"
        :icon="'account_box'"
        :label="'Табельный номер руководителя'"
        v-model="param.tabnum"
      />
      <InputWithLabelVue
        class="col s7"
        :icon="'mail'"
        :label="'Получить на почту'"
        v-model="param.email"
      />
      <BtnIconsVue
        class="blue"
        :disabled="
          param.tabnum.length < 4 ||
            !~param.email.indexOf('@') ||
            !~param.email.indexOf('.ru')
        "
        :action="getStruct"
        :title="'Запросить данные'"
        :icon="'send'"
      />
    </div>
    <div class="row center">
      <h5>{{ result }}</h5>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import BtnIconsVue from "../components/basic/MUI/BtnIcons.vue";
import InputWithLabelVue from "../components/basic/MUI/InputWithLabel.vue";

export default {
  components: {
    InputWithLabelVue,
    BtnIconsVue
  },
  data() {
    return {
      result: "",
      param: {
        tabnum: "",
        email: ""
      }
    };
  },
  methods: {
    ...mapActions(["fetchData"]),
    getStruct() {
      this.fetchData({
        url: "api/struct",
        data: { ...this.param }
      }).then(res => (this.result = res));
    }
  }
};
</script>
