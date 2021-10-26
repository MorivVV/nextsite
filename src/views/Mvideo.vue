<template>
  <div>
    <InputWithLabelVue
      class="container"
      :label="'search'"
      @input="getProductsPrices"
      v-model="search"
    />
    <ul class="collapsible" data-collapsible="expandable">
      <li>
        <div class="collapsible-header row">
          <i class="material-icons">assistant_photo</i>
          <div class="col s2 center">Товар</div>
          <div class="col s1">Текущая цена</div>
          <div class="col s1">Средняя цена</div>
          <div class="col s1">дельта</div>
          <div class="col s3 center">мин/макс</div>
          <div class="col s3 center">База мин/макс</div>
        </div>
      </li>
      <ProductVue v-for="p in products" :p="p" :key="p.id" />
    </ul>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import InputWithLabelVue from "../components/basic/MUI/InputWithLabel.vue";
import ProductVue from "../components/basic/mvideo/Product.vue";

export default {
  components: {
    ProductVue,
    InputWithLabelVue,
  },
  data() {
    return {
      search: "",
    };
  },
  computed: {
    ...mapState("mvideo", ["prices", "products"]),
  },
  methods: {
    ...mapActions(["fetchData"]),

    getProducts() {
      return this.fetchData({
        url: "api/restGet",
        data: {
          fields: [],
          from: "mvideo_product",
        },
        stateName: "mvideo/products",
      });
    },
    getPriceAll() {
      return this.fetchData({
        url: "api/restGet",
        data: {
          fields: [],
          from: "mvideo_price",
          sort: ["date_price"],
        },
        stateName: "mvideo/prices",
      });
    },
    getProductsPrices() {
      return this.fetchData({
        data: {
          sqlname: "getMvideoPrices2",
          product: "%" + this.search + "%",
        },
        stateName: "mvideo/products",
      });
    },
  },
  mounted() {
    this.getProductsPrices()
      .then(() => this.getPriceAll())
      .then(() => {
        this.$M.Collapsible.init(document.querySelectorAll(".collapsible"), {
          accordion: false,
        });
      });
  },
};
</script>