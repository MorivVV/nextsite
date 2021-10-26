<template>
  <ul class="collapsible">
    <li>
      <div class="collapsible-header">Настройки</div>
      <div class="collapsible-body">
        <div class="row">
          <SelectWithDataVue
            class="col s2"
            :label="'Объект'"
            :list="gameObjectParams"
            :option="'namien'"
            :extend="false"
            :val="'_id'"
            v-if="gameObjectParams.length"
            @input="setObject"
            v-model="idBlock"
          />

          <div class="col s5 range-field" :style="'background:' + rgb">
            <label for="red" class="red white-text"
              >красный {{ color.red }} ({{
                Number(color.red).toString(16)
              }})</label
            >
            <input
              type="range"
              id="red"
              v-model="color.red"
              min="0"
              max="255"
            />
            <label for="green" class="green white-text"
              >зеленый {{ color.green }} ({{
                Number(color.green).toString(16)
              }})</label
            >
            <input
              type="range"
              id="green"
              v-model="color.green"
              min="0"
              max="255"
            />
            <label for="blue" class="blue white-text"
              >синий {{ color.blue }} ({{
                Number(color.blue).toString(16)
              }})</label
            >
            <input
              type="range"
              id="blue"
              v-model="color.blue"
              min="0"
              max="255"
            />
          </div>
          <div class="col s1">
            <BtnIconsVue
              :icon="'save'"
              class="blue btn-small"
              :action="saveObject"
              :title="'Сохранить'"
            />
            <BtnIconsVue
              :icon="'clear'"
              class="grey btn-small"
              :action="clearObject"
              :title="'Очистить'"
            />
          </div>
          <div class="col s2">
            <InputWithLabelVue
              class="col s3"
              :label="'x'"
              v-model="mouse.xMove"
            />
            <InputWithLabelVue
              class="col s3"
              :label="'y'"
              v-model="mouse.yMove"
            />
            <InputWithLabelVue
              class="col s3"
              :label="'width'"
              :value="1 + mouse.xMove - mouse.x"
            />
            <InputWithLabelVue
              class="col s3"
              :label="'heigth'"
              :value="1 + mouse.yMove - mouse.y"
            />
          </div>
        </div>
        <div class="row">
          <InputWithLabelVue
            class="col s3 white"
            :label="'Имя'"
            v-model="nBlock.namien"
          />
          <InputWithLabelVue
            class="col s3 white"
            :label="'Броня'"
            v-model="nBlock.health"
          />
          <InputWithLabelVue
            class="col s2 white"
            :label="'Скорость'"
            v-model="nBlock.speed"
          />
          <InputWithLabelVue
            class="col s2 white"
            :label="'Разрушение'"
            v-model="nBlock.crash"
          />
          <InputWithLabelVue
            class="col s2 white"
            :label="'Преграда'"
            v-model="nBlock.stop"
          />
        </div>
        <div class="row grey">
          <canvas class="black" id="block" map="" width="32" height="32"
            >Обновите браузер</canvas
          >
          <div class="col s12">
            <div
              v-for="(e, i) in blockData"
              :key="e.x + 'tag' + i"
              class="chip"
            >
              <i
                @click="getColor(e.color)"
                :style="'color:' + e.color"
                class="material-icons"
                >color_lens</i
              >
              {{ e.x }},{{ e.y }} {{ e.width }}-{{ e.heigth }}
              <i @click="delFrame(e)" class="material-icons">close</i>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import { mapActions, mapState } from "vuex";
import BtnIconsVue from "../basic/MUI/BtnIcons.vue";
import InputWithLabelVue from "../basic/MUI/InputWithLabel.vue";
import SelectWithDataVue from "../basic/MUI/SelectWithData.vue";

export default {
  components: { SelectWithDataVue, InputWithLabelVue, BtnIconsVue },
  data() {
    return {
      mouseIsDown: false,
      mouse: { x: 0, y: 0, xMove: 0, yMove: 0 },
      nBlock: { namien: "" },
      idBlock: "1",
      blockData: [],
      blockSize: 128,
      pixelOnBlock: 8,
      color: { red: 255, green: 0, blue: 0 },
      cnv: {},
    };
  },
  computed: {
    ...mapState("games", ["gameObjects", "gameObjectParams"]),
    rgb() {
      let col;
      col = `rgb(${this.color.red},${this.color.green},${this.color.blue})`;
      return col;
    },
  },
  methods: {
    ...mapActions(["fetchData"]),
    fr(x, y, wei, hei, color = "") {
      if (color !== "") {
        this.cnv.fillStyle = color;
      }
      this.cnv.fillRect(
        (x * this.blockSize) / this.pixelOnBlock,
        (y * this.blockSize) / this.pixelOnBlock,
        (wei * this.blockSize) / this.pixelOnBlock,
        (hei * this.blockSize) / this.pixelOnBlock
      );
    },
    delFrame(del) {
      this.blockData = this.blockData.filter((e) => e !== del);
      this.genData(this.blockData);
    },
    getColor(rgb) {
      let m = rgb.match(/\d+/g);
      this.color.red = m[0];
      this.color.green = m[1];
      this.color.blue = m[2];
    },
    clearObject() {
      this.cnv.clearRect(0, 0, this.obj.width, this.obj.height);
      this.blockData = [];
    },
    async saveObject() {
      console.log(this.blockData);
      let block = { ...this.nBlock };
      delete block._id;
      if (
        this.gameObjectParams.filter((e) => e._id === this.idBlock).length === 0
      ) {
        await this.fetchData({
          url: "api/restInsert",
          data: {
            fields: { ...block },
            to: "b32_18009385_users.game_objects",
          },
        });
      } else {
        this.fetchData({
          url: "api/restUpdate",
          data: {
            filter: { id: this.nBlock._id },
            to: "b32_18009385_users.game_objects",
            set: { ...block },
          },
        });
      }
      let blockId;
      this.fetchData({
        url: "api/restGet",
        data: {
          fields: ["id"],
          from: "b32_18009385_users.game_objects",
          filter: { namien: this.nBlock.namien },
        },
      })
        .then((r) => {
          blockId = r[0].id;
          return this.fetchData({
            url: "api/restDelete",
            data: {
              from: "b32_18009385_users.game_object_params",
              filter: { kod_object: blockId },
            },
          });
        })
        .then(() => {
          console.log(blockId);
          this.blockData.forEach(async (e, i) => {
            delete e.namien;
            await this.fetchData({
              url: "api/restInsert",
              data: {
                fields: { ...e, ord: i, kod_object: blockId },
                to: "b32_18009385_users.game_object_params",
              },
            }).then((r) => {
              if (r.count === 1) {
                this.$M.toast({ html: "Сохранен фрагмент " + i });
              } else {
                this.$M.toast({ html: "Ошибка сохранения фрагмента " + i });
              }
            });
          });
        });
    },
    setObject(id) {
      let block = this.gameObjectParams.filter((e) => e._id === id);
      if (block.length === 0) {
        return;
      }
      this.nBlock = block[0];
      this.genObject(id);
    },
    genObject(id) {
      this.cnv.clearRect(0, 0, this.obj.width, this.obj.height);
      let data = this.gameObjects.filter((e) => e.kod_object === id);
      this.blockData = [];
      data.forEach((e) => {
        this.fr(e.x, e.y, e.width, e.heigth, e.color);
        this.blockData.push({ ...e });
      });
      console.log(this.blockData);
    },
    genData(data) {
      this.cnv.clearRect(0, 0, this.obj.width, this.obj.height);
      data.forEach((e) => {
        this.fr(e.x, e.y, e.width, e.heigth, e.color);
      });
      console.log(this.blockData);
    },
    MouseKeyD(e) {
      // console.log(e);
      this.mouseIsDown = true;
      let x = Math.floor((e.layerX * this.pixelOnBlock) / this.blockSize);
      let y = Math.floor((e.layerY * this.pixelOnBlock) / this.blockSize);
      this.mouse.x = x;
      this.mouse.y = y;
      this.fr(x, y, 1, 1, this.rgb);
    },
    MouseKeyM(e) {
      // console.log(e);
      let x = Math.floor((e.layerX * this.pixelOnBlock) / this.blockSize);
      let y = Math.floor((e.layerY * this.pixelOnBlock) / this.blockSize);
      if (this.mouseIsDown) {
        if (this.mouse.xMove !== x || this.mouse.yMove !== y) {
          console.log(
            this.mouse.x,
            this.mouse.y,
            1 + this.mouse.xMove - this.mouse.x,
            1 + this.mouse.yMove - this.mouse.y
          );
          this.mouse.xMove = x;
          this.mouse.yMove = y;
          this.fr(
            this.mouse.x,
            this.mouse.y,
            1 + this.mouse.xMove - this.mouse.x,
            1 + this.mouse.yMove - this.mouse.y,
            this.rgb
          );
        }
      } else {
        console.log(x, y);
      }
    },
    MouseKeyU(e) {
      // console.log(e);
      this.mouseIsDown = false;
      let data = {
        x: this.mouse.x,
        y: this.mouse.y,
        width: 1 + this.mouse.xMove - this.mouse.x,
        heigth: 1 + this.mouse.yMove - this.mouse.y,
        color: this.rgb,
      };
      let find = this.blockData.filter(
        (e) =>
          e.x === data.x &&
          e.y === data.y &&
          e.width === data.width &&
          e.height === data.height
      );
      if (find.length > 0) {
        find[0].color = this.rgb;
        console.log("Совпало");
      } else {
        this.blockData.push({ ...data });
      }
      this.genData(this.blockData);
    },
    getObjectParams() {
      return this.fetchData({
        url: "api/restGet",
        data: {
          fields: [
            "o.namien",
            "o.health",
            "o.speed",
            "o.crash",
            "o.stop",
            "o.id:_id",
          ],
          from: ["b32_18009385_users.game_objects:o"],
          sort: ["o.namien"],
        },
        stateName: "games/gameObjectParams",
      });
    },
    getObjects() {
      return this.fetchData({
        url: "api/restGet",
        data: {
          fields: [
            "o.namien",
            "gop.kod_object",
            "gop.ord",
            "gop.x",
            "gop.y",
            "gop.width",
            "gop.heigth",
            "gop.color",
          ],
          from: [
            "b32_18009385_users.game_object_params:gop",
            "b32_18009385_users.game_objects:o",
          ],
          sort: ["o.namien", "gop.ord"],
          join: ["gop.kod_object=o.id"],
        },
        stateName: "admin/gameObjects",
      });
    },
  },
  mounted() {
    this.getObjects()
      .then(() => this.getObjectParams())
      .then(() => {
        this.obj = document.getElementById("block");
        this.obj.width = 2 * this.blockSize;
        this.obj.height = 2 * this.blockSize;
        this.cnv = this.obj.getContext("2d");
        this.obj.onmousedown = this.MouseKeyD;
        this.obj.onmouseup = this.MouseKeyU;
        this.obj.onmousemove = this.MouseKeyM;
        this.setObject(this.idBlock);
        var elems = document.querySelectorAll(".collapsible");
        this.$M.Collapsible.init(elems, {});
      });
  },
};
</script>

<style scoped>
label {
  width: 20%;
  display: inline-block;
}
input[type="range"] {
  max-width: 75%;
  margin: 5px;
}
.row {
  margin-bottom: 1px;
}
</style>