<template>
  <div class="container login-form">
    <div class="card">
      <h4 class="center">Поиск информации по сотруднику</h4>
      <div class="row">
        <InputWithLabelVue
          class="col s11"
          :label="'Введите Табельный №'"
          v-model="tabnum"
          :icon="'account_box'"
        />
        <div class="col s1">
          <BtnIconsVue
            :icon="'search'"
            class="green darken-2"
            :disabled="tabnum.length < 4"
            :title="'Найти'"
            :action="find"
          />
        </div>
      </div>
    </div>
    <div v-if="userAddressBook" class="card">
      <div class="row blue lighten-4 flow-text">
        <div class="col s4">Параметр</div>
        <div class="col s4">Адресная книга</div>
        <div class="col s4">История</div>
      </div>
      <div class="row">
        <div class="col s4">Табельный номер</div>
        <div class="col s4">{{ userAddressBook.r.id }}</div>
        <div class="col s4">{{ userAddressBook.localInfo.tabnum }}</div>
      </div>
      <div class="row">
        <div class="col s4">Сотрудник</div>
        <div class="col s4">{{ userAddressBook.r.fio }}</div>
        <div class="col s4">{{ userAddressBook.localInfo.fio }}</div>
      </div>
      <div class="row">
        <div class="col s4">Должность</div>
        <div class="col s4">{{ userAddressBook.r.post }}</div>
        <div class="col s4">{{ userAddressBook.localInfo.post }}</div>
      </div>
      <div class="row">
        <div class="col s4">Почта Alpha</div>
        <div class="col s4">{{ userAddressBook.r.emailAlpha }}</div>
        <div class="col s4">{{ userAddressBook.localInfo.email_alpha }}</div>
      </div>
      <div class="row">
        <div class="col s4">Почта Omega</div>
        <div class="col s4">{{ userAddressBook.r.emailOmega }}</div>
        <div class="col s4">{{ userAddressBook.localInfo.email_omega }}</div>
      </div>
      <div class="row">
        <div class="col s4">Почта Sigma</div>
        <div class="col s4">{{ userAddressBook.r.emailSigma }}</div>
        <div class="col s4">{{ userAddressBook.localInfo.email_sigma }}</div>
      </div>
      <div class="row">
        <div class="col s4">Рабочий телефон</div>
        <div class="col s4">{{ userAddressBook.r.phone }}</div>
        <div class="col s4">{{ userAddressBook.localInfo.phone_inner }}</div>
      </div>
      <div class="row">
        <div class="col s4">Сотовый телефон</div>
        <div class="col s4">{{ userAddressBook.r.mobile }}</div>
        <div class="col s4">{{ userAddressBook.localInfo.phone_mobile }}</div>
      </div>
      <div class="row">
        <div class="col s4">Актуальность</div>
        <div class="col s4">{{ userAddressBook.r.result }}</div>
        <div class="col s4">{{ userAddressBook.localInfo.date_add }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import BtnIconsVue from "../components/basic/MUI/BtnIcons.vue";
import InputWithLabelVue from "../components/basic/MUI/InputWithLabel.vue";

export default {
  components: {
    BtnIconsVue,
    InputWithLabelVue
  },
  data() {
    return {
      tabnum: ""
    };
  },
  computed: {
    ...mapGetters(["userAddressBook"])
  },
  methods: {
    ...mapActions(["fetchData"]),
    find() {
      let tabnum = this.tabnum;
      this.fetchData({
        url: "/api/abInfo",
        data: { tabnum: tabnum },
        stateName: "autorization/userInfo"
      });
    }
  }
};
</script>

<style scoped>
.login-form {
  max-width: 700px;
}
</style>
