<template>
  <div class="input-field mod">
    <i v-if="icon" class="material-icons prefix">{{ icon }}</i>
    <select
      :id="uniq_id"
      :value="value"
      :disabled="disabled"
      @change="$emit('input', $event.target.value)"
    >
      <template v-if="extend">
        <option value="">-Выберите-</option>
        <option value="null">-Нет-</option>
        <option value="-2">-Все-</option>
      </template>

      <option v-for="e in compList" :key="e.val" :value="e.val">{{
        e.opt
      }}</option>
    </select>
    <label v-if="label" :for="label">{{ label }}</label>
  </div>
</template>

<script>
import MD5 from "js-md5";
export default {
  name: "SelectWithData",
  data() {
    return {
      uniq_id: MD5("select" + this.label + Math.random() * Date.now())
    };
  },
  props: {
    list: Array,
    extend: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    label: String,
    dataIcon: { type: String, default: "" },
    val: String,
    option: String,
    icon: String,
    value: [String, Number]
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
        let icon = ""
        if (this.dataIcon in e){
          icon = e[this.dataIcon]
        }
        res.push({
          val: e[v],
          opt: e[o],
          icon: icon
        });
      });
      return res;
    }
  },
  mounted() {
    this.$M.FormSelect.init(document.getElementById(this.uniq_id), {});
  }
};
</script>

<style>
.mod .select-wrapper input.select-dropdown {
    height: 2rem;
    line-height: 2rem;
    margin: 0 0 4px 0;
}
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
