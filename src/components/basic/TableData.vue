<template>
  <table class="striped">
    <caption v-if="label" class="flow-text">
      {{
        label
      }}
    </caption>
    <thead>
      <tr>
        <th v-for="h in cHead" :key="h" v-html="h"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(d, i) in data" :key="d + i">
        <td @click="f(h)" v-for="(h, ind) in d" :key="i + h + ind" v-html="h"></td>
        <BtnIconsVue v-if="fd" class="btn-small red" :action="fd" :icon="'delete'" />
      </tr>
    </tbody>
  </table>
</template>

<script>
import BtnIconsVue from './MUI/BtnIcons.vue';

export default {
  components: {BtnIconsVue},
  props: {
    data: Array,
    head: Array,
    f: { type: Function, default: null},
    fd: { type: Function, default: null},
    label: { type: String, default: "" }
  },
  computed: {
    cHead() {
      let head = [];
      let d = this.data;
      for (const key in d) {
        if (Object.hasOwnProperty.call(d, key)) {
          const element = d[key];
          for (const k in element) {
            if (Object.hasOwnProperty.call(element, k)) {
              head.push(k);
            }
          }
          break;
        }
      }
      return this.head || head;
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
table thead tr {
  color: #ffffff;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.3);
}
table thead tr td {
  border: 1px solid #01ab73;
}
table tbody tr td {
  border: 1px solid #e8e9eb;
}
table tbody tr:nth-child(2n) {
  background: #f4f4f4;
}
table tbody tr:hover {
  background: #ebffe8;
}

td,
th {
  padding: 4px;
  border-left: 1px solid rgba(0, 0, 0, 0.2);
}
</style>
