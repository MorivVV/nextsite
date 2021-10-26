<template>
  <div class="row">
    <div class="col">
      <CategoryBZVue :filterTerms="filterTerms" :searchResult="searchResult" />
    </div>
    <div class="col post-wraper">
      <div @click="switchSearch" class="cl-search pointer">
        <i
          v-if="!JSON.parse(clearSearch)"
          title="Нечеткий поиск"
          class="material-icons orange-text"
          >location_searching</i
        >
        <i v-else title="Четкий поиск" class="material-icons green-text"
          >my_location</i
        >
      </div>
      <SearchInput />
      <div v-if="calcPages > 1" class="row">
        <div class="col s8 offset-s1">
          <Pagination
            :pages="calcPages"
            :step="+perPage"
            :store="{ min: 'postsData/resultMin', max: 'postsData/resultMax' }"
          />
        </div>
      </div>
      <div class="smpanel">
        <ListSMVue />
      </div>

      <NewPostBZ />
      <div class="row center">
        <template v-for="(f, k) in filter">
          <div
            v-if="
              f &&
                f !== 'false' &&
                f !== 'true' &&
                f !== '0' &&
                k !== 'lim' &&
                k !== 'page' &&
                k !== 'terms'
            "
            :key="f + k"
            class="chip"
          >
            {{ k }}: {{ f }}
            <i @click="delFilter(k)" class="material-icons">close</i>
          </div>
        </template>
      </div>
      <div v-if="+loading" class="row center">
        <loadIcon />
      </div>
      <div v-else>
        <PostBZ v-for="post in postsSort" :key="post.id" :post="post" />
      </div>
      <div class="row" v-if="calcPages > 1">
        <div class="col s8 offset-s1">
          <Pagination
            :pages="calcPages"
            :step="+perPage"
            :store="{ min: 'postsData/resultMin', max: 'postsData/resultMax' }"
          />
        </div>
      </div>
      <SberSpaceVue />
    </div>
  </div>
</template>

<script>
// var moment = require('moment');
import { mapActions, mapState, mapMutations } from "vuex";
import loadIcon from "../components/basic/loadIcon";
import SearchInput from "../components/basic/SearchInput";
import PostBZ from "../components/bzpost/PostBZ";
import Pagination from "../components/elements/Pagination";
import NewPostBZ from "../components/bzpost/NewPostBZ";
import ListSMVue from "../components/bzpost/ListSM.vue";
import CategoryBZVue from "../components/bzpost/CategoryBZ.vue";
import SberSpaceVue from "../components/bzpost/SberSpace.vue";

let alias = {
  terms: "kod_term",
  kod_post: "kod_post",
  search: "search",
  clear: "clearSearch",
  favorites: "favorites",
  mypost: "mypost",
  lim: "perPage",
  page: "resultMin"
};
export default {
  components: {
    SearchInput,
    loadIcon,
    PostBZ,
    Pagination,
    NewPostBZ,
    ListSMVue,
    CategoryBZVue,
    SberSpaceVue
  },
  data() {
    return {
      loading: false
    };
  },
  watch: {
    posts() {
      this.loading = false;
    },
    filterTerms() {
      if (!this.loading) this.searchResult();
    },
    favorites() {
      if (!this.loading) this.searchResult();
    },
    clearSearch() {
      if (!this.loading) this.searchResult();
    },
    mypost() {
      if (!this.loading) this.searchResult();
    },
    kod_post() {
      if (!this.loading) this.searchResult();
    },
    search() {
      if (this.filterTerms.length > 0) this.searchResult();
    },
    resultMin() {
      if (!this.loading) this.searchResult();
    }
  },
  computed: {
    ...mapState("postsData", [
      "posts",
      "smlist",
      "terms_list",
      "search",
      "clearSearch",
      "favorites",
      "kod_post",
      "mypost",
      "searchCount",
      "resultMin",
      "perPage",
      "resultMax"
    ]),
    filter() {
      return this.$route.query;
    },
    filterTerms() {
      let terms = [];
      if ("terms" in this.$route.query)
        terms = this.$route.query.terms.split(",");
      let res = this.terms_list.map(e => ({
        ...e,
        active: ~terms.indexOf("" + e.term_id)
      }));
      return res;
    },
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
    ...mapActions(["fetchData", "fetchDataGet"]),
    ...mapMutations(["updateState"]),
    switchSearch() {
      this.updateState({
        state: "postsData/clearSearch",
        data: !JSON.parse(this.clearSearch)
      });
    },
    delFilter(id) {
      delete this.filter[id];
      this.updateState({
        state: "postsData/" + id,
        data: ""
      });
      this.searchResult();
    },
    searchResult() {
      this.loading = true;
      // изменяем адресную строку при изменениях поиска
      if (this.filterTerms.length > 0) {
        this.$router
          .push({
            query: {
              ...this.$route.query,
              terms: this.filterTerms
                .filter(e => e.active)
                .map(e => e.term_id)
                .join(","),
              search: this.search,
              clear: this.clearSearch,
              favorites: this.favorites,
              kod_post: this.kod_post,
              mypost: this.mypost,
              lim: this.perPage,
              page: this.resultMin
            }
          })
          .then(() => {
            this.loading = false;
          });
      }
      let search = this.search;
      if (this.clearSearch) {
        search = search.replace(/\s+/g, " <-> ");
      } else {
        search = search.replace(/\s+/g, " & ");
      }
      this.fetchData({
        data: {
          sqlname: "getPosts",
          kod_term: this.filterTerms.filter(e => e.active).map(e => e.term_id),
          search: search,
          favorites: this.favorites,
          kod_post: this.kod_post,
          mypost: this.mypost,
          lim: this.perPage,
          page: this.resultMin
        },
        stateName: "postsData/posts"
      });

      this.fetchData({
        url: "api/sberSpace",
        data: { search: this.search },
        stateName: "postsData/sberSpace"
      });

      this.fetchData({
        data: {
          sqlname: "getCountPost",
          kod_term: this.filterTerms.filter(e => e.active).map(e => e.term_id),
          kod_post: this.kod_post,
          favorites: this.favorites,
          mypost: this.mypost,
          search: search
        },
        stateName: "postsData/searchCount"
      });

      this.fetchData({
        url: "api/restGet",
        data: {
          fields: ["l.query_num", "to_char(l.add_date,'dd.mm.yy'):add_date"],
          from: ["sm_list:l"],
          filter: {
            use: false
          },
          sort: ["-l.add_date"]
        },
        stateName: "postsData/smlist"
      });
    }
  },
  mounted() {
    this.loading = true;
    this.fetchData({
      data: { sqlname: "getTerms" },
      stateName: "postsData/terms_list"
    }).then(() => {
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
      }
      this.searchResult();
    });
    this.fetchDataGet({
      module: "SM",
      tables: ["url_resource", "sm_url_patterns"]
    });
  }
};
</script>

<style scoped>
.cl-search {
  position: absolute;
  margin-top: 25px;
  margin-left: 75px;
}
.smpanel {
  position: absolute;
  top: 120px;
  right: 240px;
  width: 300px;
}
.post-wraper {
  width: calc(100% - 220px);
}
</style>
