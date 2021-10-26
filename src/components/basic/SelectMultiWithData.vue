<template>
  <div class="input-field mod">
    <select multiple :id="uniq_id" :value="value" @change="getSelected">
      <option
        v-for="e in compList"
        :key="+e.val"
        :selected="~value.indexOf(+e.val)"
        :value="e.val"
        >{{ e.opt }}</option
      >
    </select>
    <label :for="label">{{ label }}</label>
  </div>
</template>

<script>
import MD5 from "js-md5";
export default {
  data() {
    return {
      uniq_id: MD5(this.label + Math.random() * Date.now()),
      instance: {}
    };
  },
  props: {
    list: Array,
    label: String,
    val: String,
    option: String,
    value: Array
  },
  computed: {
    compList() {
      let l = this.list;
      if (l.length === 0) {
        return [{ val: 0, opt: "Нет данных" }];
      }
      let v = this.val;
      let o = this.option;
      let res = [];
      l.forEach(e => {
        res.push({
          val: e[v],
          opt: e[o]
        });
      });
      return res;
    }
  },
  methods: {
    getSelected() {
      console.log(this.value);
      console.log(this.instance.getSelectedValues());
      this.$emit("input", this.instance.getSelectedValues());
    }
  },
  mounted() {
    let el = document.getElementById(this.uniq_id);
    this.instance = this.$M.FormSelect.init(el, { isMultiple: true });
  }
};
</script>

<style>
.mod .dropdown-content li > span {
  font-size: 16px;
  color: #18014d;
  line-height: 1rem;
  padding: 4px 4px;
}
.mod .dropdown-content li {
  min-height: 28px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.17);
}
</style>
