<template>
  <div>
    <div class="row">
      <div class="col">
        <div class="hide">
          <input
            class="hide"
            type="file"
            ref="file"
            name="filedata"
            multiple
            @change="handleFileUpload"
          />
        </div>
        Добавить файлы:
        <BtnIconsVue
          class="blue"
          :icon="'add_to_photos'"
          :action="selectFiles"
          :title="'Выбрать файлы'"
        />
        <div class="chip" v-for="(f, i) in files" :key="f.name">
          {{ f.name }}
          <i class="material-icons" title="Убрать" @click="delFileList(i)"
            >close</i
          >
        </div>
      </div>
      <div class="col">
        <BtnIconsVue
          class="blue"
          :icon="'attach_file'"
          :action="uploadFile"
          :title="'Прикрепить файлы'"
          :disabled="files.length === 0"
        />
      </div>
    </div>
    <div class="row">
      <div class="col s5 offset-s3">
        <FileList
          class="card"
          v-if="attachFiles.length > 0"
          :edit="true"
          v-model="attachFiles"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../store/modules/axios";
import { mapActions, mapMutations } from "vuex";
import FileList from "./FileList";
import BtnIconsVue from "./MUI/BtnIcons.vue";

export default {
  components: {
    FileList,
    BtnIconsVue
  },
  data: () => ({
    files: [],
    attachFiles: []
  }),
  props: {
    newfiles: String
  },
  methods: {
    ...mapActions(["fetchData"]),
    ...mapMutations(["updateState"]),
    delFileList(key) {
      this.files.splice(key, 1);
    },
    selectFiles() {
      console.log(this.$refs.file);
      this.$refs.file.click();
    },
    handleFileUpload() {
      console.log(this.$refs.file.files);
      let object = this.$refs.file.files;
      for (const key in object) {
        const element = object[key];
        if ("name" in element) {
          this.files.push(element);
        }
      }
    },
    uploadFile() {
      if (this.files.length === 0) {
        this.$M.toast({ html: "Вы не выбрали файл для загрузки" });
        return;
      }
      let formData = new FormData();
      let conf = {
        headers: {
          "Content-Type": "multipart/form-data",
          post: {
            "V-Token": this.$store.state.autorization.token
          }
        }
      };
      this.files.forEach(file => {
        formData.append("filedata", file);
      });

      axios
        .post("/upload", formData, conf)
        .then(r => {
          let res = r.data;
          if (res.length > 0) {
            this.attachFiles = this.attachFiles.concat(res);
            this.files = [];
            this.updateState({ state: this.newfiles, data: this.attachFiles });

            res.forEach(e =>
              this.$M.toast({ html: e.original_name + " загружен" })
            );
          }
        })
        .catch(err => console.log(err, "Не получилось"));
    }
  },
  mounted() {
    // this.updateState({ state: this.newfiles, data: "" });
  }
};
</script>

<style scoped>
td {
  padding: 2px;
  border-right: 1px solid silver;
}
.btn .material-icons {
  line-height: inherit;
}
</style>
