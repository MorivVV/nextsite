<template>
  <div>
    <FilesForm />
    <div class="col">
      <PaginationVue
        v-if="searchCount.length > 0"
        :pages="Math.ceil(searchCount[0].count / limit)"
        :step="limit"
        :store="{ min: 'admin/resultMin', max: 'admin/resultMax' }"
      />
    </div>

    <table class="highlight">
      <caption v-if="searchCount.length > 0">
        Файлов
        {{
          searchCount[0].count
        }}
      </caption>
      <tr>
        <th>#</th>
        <th>Файл</th>
        <th class="center">Размер</th>
        <th class="center">Кто загрузил</th>
        <th class="center">Загружен</th>
        <th class="center">Связь</th>
        <th>Доступ</th>
        <th width="40">Del</th>
      </tr>
      <tr v-for="f in uploadFiles" :key="f.file_name">
        <td class="center">{{ f.n }}</td>
        <td>
          <a target="blank" :href="'/' + f.file_name + '/download'">{{
            f.original_name
          }}</a>
        </td>
        <td class="right">{{ (f.file_size / 1024).toFixed(2) }} Кб</td>
        <td class="center">
          {{ f.login }} - {{ f.family }} {{ f.first_name }}
        </td>
        <td class="right">{{ getTime(f.create_time) }}</td>
        <td class="center">
          <a
            target="_blank"
            :href="'/?terms=&search=&kod_post=' + f.kod_post"
            >{{ f.kod_post }}</a
          >
        </td>
        <td>
          <SwitchMaterialVue :value="f.active" />
        </td>
        <td>
          <BtnIconsVue
            class="red btn-small"
            :action="delFile.bind(this, f.file_name)"
            :title="'Удалить файл с сервера (физическое удаление)'"
            :icon="'delete'"
          />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import PaginationVue from "../elements/Pagination.vue";
import BtnIconsVue from "./MUI/BtnIcons.vue";
import FilesForm from "./FilesForm";
import SwitchMaterialVue from "./MUI/SwitchMaterial.vue";
import moment from "moment";
export default {
  components: {
    FilesForm,
    SwitchMaterialVue,
    BtnIconsVue,
    PaginationVue
  },
  data: () => ({
    files: "",
    limit: 50
  }),
  computed: {
    ...mapState("admin", ["uploadFiles", "resultMin", "searchCount"])
  },
  watch: {
    resultMin() {
      this.getFileList();
    }
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
        this.getFileList();
      });
    },
    getTime(time) {
      return moment(time).format("DD MMMM YYYY hh:mm:ss");
    },
    getFileList() {
      // this.fetchData({
      //   data: { sqlname: "getUploadFiles" },
      //   stateName: "admin/uploadFiles"
      // });
      this.fetchData({
        url: "api/restGet",
        data: {
          fields: [
            "f.active",
            "row_number() over(ORDER BY f.id):n",
            "f.original_name",
            "f.create_time",
            "f.file_name",
            "a.kod_post",
            "f.file_size",
            "u.family",
            "u.login",
            "u.first_name"
          ],
          from: [
            "public.upload_files:f",
            "public.bz_users:u",
            "public.bz_post_attach:a"
          ],
          join: ["f.kod_user=(+)u.id", "f.id=(+)a.kod_file"],
          sort: ["-f.id"],
          limit: this.limit,
          page: 1 + this.resultMin / this.limit
        },
        stateName: "admin/uploadFiles"
      });
      this.fetchData({
        url: "api/restGet",
        data: {
          fields: ["count(1):count"],
          from: ["public.upload_files:f"]
        },
        stateName: "admin/searchCount"
      });
    }
  },
  mounted() {
    this.getFileList();
  }
};
</script>

<style scoped>
td {
  padding: 0 1px;
  border-right: 1px solid silver;
}
</style>
