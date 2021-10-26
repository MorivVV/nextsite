<template>
  <div class="row">
    <div class="row">
      <SearchInput />
      <Pagination
        class="col"
        :pages="calcPages"
        :step="perPage"
        :store="{ min: 'postsData/resultMin', max: 'postsData/resultMax' }"
      />
      <div class="col offset-s1">
        Не нашли что искали? Посмотрите в
        <a
          class="flow-text"
          target="_blank"
          href="http://mysberbank.ca.sbrf.ru/wps/myportal/info/ca/mk/slovar/"
          >Словарь сокращений и терминов Сбербанка</a
        >
      </div>
    </div>
    <div class="col s12">
      <loadIcon v-if="+loading" />
      <div v-else class="masonry">
        <PostGlossary v-for="post in postsSort" :key="post.id" :post="post" />
      </div>
    </div>
  </div>
</template>

<script>
// var moment = require('moment');
import datePickerOpt from "../components/js/datePickerI18";
import { mapActions, mapState, mapMutations } from "vuex";
import loadIcon from "../components/basic/loadIcon";
import SearchInput from "../components/basic/SearchInput";
import PostGlossary from "../components/elements/PostGlossary";
import Pagination from "../components/elements/Pagination";
// import activeFilter from "../components/elements/activeFilter.vue";
export default {
  components: {
    loadIcon,
    SearchInput,
    PostGlossary,
    Pagination
  },
  data: () => ({
    loading: true
  }),
  watch: {
    posts() {
      this.loading = false;
    },
    search() {
      this.searchResult();
    },
    resultMin() {
      this.searchResult();
    }
  },
  computed: {
    ...mapState("postsData", [
      "posts",
      "terms_list",
      "search",
      "searchCount",
      "resultMin",
      "perPage",
      "resultMax"
    ]),
    calcPages() {
      let countPage;
      countPage = Math.ceil(this.searchCount / this.perPage);
      return countPage;
    },
    postsSort() {
      let spo = Object.keys(this.posts).map(key => this.posts[key]);
      spo.sort((a, b) => b.n - a.n);
      return spo;
    }
  },
  methods: {
    ...mapActions(["fetchData"]),
    ...mapMutations(["updateState"]),
    begPick() {
      datePickerOpt.onClose = this.getData;
      let datainstances = this.$M.Datepicker.init(event.target, datePickerOpt);
      datainstances.open();
    },
    setSearch() {
      this.updateState({ state: "postsData/resultMin", data: 0 });
      let search = "";
      if ("value" in event.target) {
        search = event.target.value;
      }
      this.updateState({ state: "postsData/search", data: search });
    },
    searchResult() {
      this.loading = true;

      // изменяем адресную строку при изменениях поиска
      this.$router.push({
        query: {
          ...this.$route.query,
          search: this.search,
          lim: this.perPage,
          page: this.resultMin
        }
      });

      this.fetchData({
        data: {
          sqlname: "getPosts",
          kod_term: [51],
          search: this.search,
          favorites: false,
          mypost: false,
          lim: this.perPage,
          page: this.resultMin
        },
        stateName: "postsData/posts"
      });
      this.fetchData({
        data: {
          sqlname: "getCountPost",
          kod_term: [51],
          favorites: false,
          mypost: false,
          search: this.search
        },
        stateName: "postsData/searchCount"
      });
    }
  },
  mounted() {
    this.loading = true;
    this.fetchData({
      data: { sqlname: "getTerms" },
      stateName: "postsData/terms_list"
    });

    let alias = {
      terms: "kod_term",
      search: "search",
      lim: "perPage",
      page: "resultMin"
    };
    if ("search" in this.$route.query) {
      let object = this.$route.query;
      for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          const element = object[key];
          if (element && key !== "kod_term") {
            this.updateState({
              state: "postsData/" + alias[key],
              data: element
            });
          }
        }
      }
    } else {
      this.updateState({ state: "postsData/resultMin", data: 0 });
      this.searchResult();
    }
  }
};
</script>

<style scoped>
[type="checkbox"] + span:not(.lever) {
  padding-left: 30px;
  height: 20px;
  line-height: 20px;
}
.collection.pinned {
  height: 90%;
  overflow-y: auto;
  width: 200px;
}
.collection.with-header .collection-item {
  padding-left: 5px;
}
.btn {
  letter-spacing: 0.1px;
}
.masonry {
  column-count: 2;
  column-gap: 10px;
}
.lem5 {
  margin-left: -18px;
  margin-right: 10px;
  margin-left: -5px;
}
</style>
