<template>
  <table>
    <tr v-for="f in value" :key="f.file_name">
      <td>
        <a target="blank" :href="'/' + f.file_name + '/download'">{{
          f.original_name
        }}</a>
      </td>
      <!-- <td class="right">{{ f.create_time || Date().substr(4, 20) }}</td> -->
      <td class="right">{{ (f.file_size / 1024).toFixed(2) }} Кб</td>
      <td class="red white-text center" v-if="edit">
        <span title="Удалить" class="pointer" @click="delFile(f.file_name)"
          >X</span
        >
      </td>
    </tr>
  </table>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: {
    // files: Array,
    value: Array,
    edit: { type: Boolean, default: false }
  },
  methods: {
    ...mapActions(["fetchData"]),
    delFile(file) {
      if (!confirm("Удалить файл?")) {
        return;
      }

      this.fetchData({
        url: file + "/delete"
      }).then(r => {
        this.$M.toast({ html: r });
        console.log(
          "/delete",
          file,
          this.value,
          this.value.filter(e => e.file_name !== file)
        );
        this.$emit(
          "input",
          this.value.filter(e => e.file_name !== file)
        );
      });
    }
  }
};
</script>

<style scoped>
td {
  padding: 0 1px;
  border-right: 1px solid silver;
}
</style>
