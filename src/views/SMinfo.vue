<template>
  <div class="container">
    <div class="row"></div>
    <div class="row">
      <InputWithLabelVue
        class="col s6 offset-s3"
        :icon="'info_outline'"
        :label="'Введите номер обращения для поиска'"
        v-model.lazy="numberZNO"
      />
      <BtnIconsVue
        class="green darken-4"
        :action="getData"
        :icon="'search'"
        :title="'Получить информацию из обращения'"
      />
    </div>
    <div class="row">
      <div v-if="loading" class="row center"><loadIcon /></div>
      <div v-else v-for="(z, i) in fullZNO" :key="'z' + i">
        <h6 class="center blue lighten-4">Общее</h6>
        <table>
          <tr v-for="(h, ind) in z" :key="'head' + ind">
            <td v-if="h">{{ ind }}</td>
            <td v-if="h">
              <div v-html="parseOption(h, ind)"></div>
            </td>
          </tr>
        </table>

        <h6 class="center green accent-1">Протокол</h6>
        <div v-for="p in protocol" class="prot" :key="'prot' + p.ZNUM">
          <h6>{{ p.ADDAT }} {{ p.ADBY }} ({{ p.ZNUM }})</h6>
          <pre>{{ p.COMM }}</pre>
        </div>

        <h6 class="center yellow lighten-5">Вложения</h6>
        <table border="1">
          <tr v-for="f in files" class="prot" :key="'incl' + f.SENDDATE">
            <td>{{ f.SENDDATE }}</td>
            <td>{{ f.FILENAME }}</td>
            <td>{{ f.USERNAME }}</td>
            <td>{{ (+f.FILESIZE / 1024).toFixed(2) }} Кб</td>
            <td>{{ f.PARENTOBJID }}</td>
          </tr>
        </table>

        <h6 class="center orange accent-1">Аудит</h6>
        <table border="1">
          <template v-for="a in audit" class="prot">
            <tr v-if="a.ID === z.NUMBER" :key="'audit' + a.ID + a.TIME">
              <td>{{ a.FIELD }}</td>
              <td>{{ a.OLD_SIMPLE_VAL }}</td>
              <td>{{ a.NEW_SIMPLE_VAL }}</td>
              <td>{{ a.WHO_NAME }}</td>
              <td>{{ a.TIME }}</td>
            </tr>
          </template>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import loadIcon from "../components/basic/loadIcon";
import { mapState, mapActions } from "vuex";
import InputWithLabelVue from "../components/basic/MUI/InputWithLabel.vue";
import BtnIconsVue from "../components/basic/MUI/BtnIcons.vue";

export default {
  components: {
    loadIcon,
    InputWithLabelVue,
    BtnIconsVue
  },
  data: () => ({
    numberZNO: "",
    loading: false
  }),
  computed: {
    ...mapState("SM", ["ZNO", "protocol", "files", "audit"]),
    fullZNO() {
      let z = [];
      this.ZNO.forEach(e => {
        e.ИНФОРМАЦИЯ =
          e.ИНФОРМАЦИЯ1 + e.ИНФОРМАЦИЯ2 || "" + e.ИНФОРМАЦИЯ3 || "";
        delete e.ИНФОРМАЦИЯ1;
        delete e.ИНФОРМАЦИЯ2;
        delete e.ИНФОРМАЦИЯ3;
        z.push(e);
      });
      return z;
    }
  },
  watch: {
    ZNO: function() {
      this.$M.toast({ html: "Загружено" });
      this.loading = false;
    }
  },
  methods: {
    ...mapActions(["fetchData"]),
    parseOption(text, id) {
      if (text) {
        text = text.replace(
          /<text[^>]+?label="([^"]+)"[^>]+>([^<]+)<\/text>/g,
          '<div class="col-md-4"><label>$1</label><span>$2</span></div>'
        );
        text = text.replace(
          /(<select.+?)(label=")(.*?)(")(.+?>)/g,
          '<div class="col-md-4"><label>$3</label><select>'
        );
        text = text.replace(/(\|[-]{8,50}\|)/g, "<br>$1<br>");
      }
      if (id === "NUMBER") {
        text = "<b>" + text + "</b>";
      }

      return text;
    },
    getData() {
      if (this.numberZNO) {
        this.$router.push({ path: "/zno/" + this.numberZNO });
        this.loading = true;
        this.fetchData({
          data: { zno: this.numberZNO, sqlname: "getSMQuery" },
          stateName: "SM/ZNO"
        });
        this.fetchData({
          data: { zno: this.numberZNO, sqlname: "getSMprotocol" },
          stateName: "SM/protocol"
        });
        this.fetchData({
          data: { zno: this.numberZNO, sqlname: "getSMaudit" },
          stateName: "SM/audit"
        });
        this.fetchData({
          data: { zno: this.numberZNO, sqlname: "getSMinclude" },
          stateName: "SM/files"
        });
      }
    }
  },
  mounted() {
    if ("znonum" in this.$route.params) {
      this.numberZNO = this.$route.params.znonum;
      this.getData();
    }
  }
};
</script>

<style scoped>
td {
  padding: 0 1px;
}
h6 {
  padding: 4px;
  border: 1px solid gray;
}
input#search {
  margin-top: 10px;
}
pre {
  white-space: pre-wrap;
}
</style>
