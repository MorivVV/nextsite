<template>
  <div :id="uniq_id" class="chips chips-autocomplete">{{ autoUpdate }}</div>
</template>

<script>
import MD5 from "js-md5";
export default {
  data() {
    return {
      uniq_id: MD5("chips" + Math.random * Date.now()),
      instance: {}
    };
  },
  props: {
    chipses: Array
  },
  computed: {
    autoUpdate() {
      if (!("chipsData" in this.instance)) {
        return 0;
      }
      let cnt = this.instance.chipsData.length;
      while (this.instance.chipsData.length > 0) {
        this.instance.deleteChip(cnt--);
      }
      this.chipses.forEach(e => this.instance.addChip({ tag: e, image: "" }));
      return this.instance.chipsData.length;
    }
  },
  mounted() {
    this.instance = this.$M.Chips.init(document.getElementById(this.uniq_id), {
      limit: Infinity,
      minLength: 1
    });
  }
};
</script>
