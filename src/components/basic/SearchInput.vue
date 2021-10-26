<template>
  <div class="row">
    <div class="input-field col s9 offset-s1">
      <input
        @keypress.enter="setSearch"
        class="white"
        id="search"
        :value="search"
        name="s"
        type="text"
      />
      <label for="search" :class="{ active: search }"
        >Введите текст для поиска</label
      >
    </div>
    <div class="col s2">
      <h6>
        <i class="material-icons lem5" title="Очистить поиск" @click="setSearch"
          >backspace</i
        >
        <span v-if="search">Найдено: </span>
        <span v-else>Всего: </span>
        {{ searchCount }}
      </h6>
    </div>
  </div>
</template>

<script>

import { mapMutations } from "vuex";
export default {
  props: {
    nstate: {
      type: String,
      default: "postsData"
    }
  },
  computed: {
    search() {
      return this.$store.state[this.nstate].search;
    },
    searchCount() {
      return this.$store.state[this.nstate].searchCount;
    }
  },
  methods: {
    ...mapMutations(["updateState"]),
    setSearch() {
      this.updateState({ state: this.nstate + "/resultMin", data: 0 });
      let search = "";
      if ("value" in event.target) {
        search = event.target.value;
      }
      this.updateState({ state: this.nstate + "/search", data: search });
    }
  }
};
</script>

<style scoped>
.lem5 {
  margin-left: -18px;
  margin-right: 10px;
  margin-left: -5px;
  cursor: pointer;
}
</style>
