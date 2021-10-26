<template>
  <div class="container center">
    <div class="row">
      Уровни
      <div
        v-for="m in tanksMaps"
        @click="()=>{map = JSON.parse(m.MAP); startmove()}"
        :key="m.ID"
        class="chip green lighten-4 purlpe-text"
      >
        {{ m.KOD_STAGE }}
      </div>
      <SelectWithDataVue
        class="col s2"
        :label="'Игрок'"
        :list="gameObjectsList"
        :option="'name'"
        :extend="false"
        :val="'name'"
        v-if="gameObjectsList.length"
        v-model="playerSkin"
      />
      <SelectWithDataVue
        class="col s2"
        :label="'Противники'"
        :list="gameObjectsList"
        :option="'name'"
        :extend="false"
        :val="'name'"
        v-if="gameObjectsList.length"
        v-model="enemySkin"
      />
      <SelectWithDataVue
        class="col s2"
        :label="'Новый блок'"
        :list="gameObjectsBlocks"
        :option="'name'"
        :extend="false"
        :val="'id'"
        v-if="gameObjectsBlocks.length"
        v-model="newBlock"
      />
    </div>
    <BtnIconsVue :action="()=>pause=!pause" :title="'Пауза'" :icon="'pause'" />
    <BtnIconsVue :action="saveMap" :title="'Сохранить карту'" :icon="'save'" />
    <canvas id="cnv" map="" width="832" height="832">Обновите браузер</canvas>
    <GameObjectVue />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import GameObjectVue from "../components/games/GameObject.vue";
import BtnIconsVue from '../components/basic/MUI/BtnIcons.vue';
import SelectWithDataVue from "../components/basic/MUI/SelectWithData.vue";

export default {
  components: {
    GameObjectVue,
    SelectWithDataVue,
    BtnIconsVue
  },
  data() {
    return {
      obj: {},
      track: true,
      timerId: {},
      playerSkin: "tank",
      enemySkin: "enemyTankLight",
      gameObjectsBlocks: [
        {id: 0, name: "blackBlock"},
        {id: 1, name: "brickBlock"},
        {id: 2, name: "betonBlock"},
        {id: 3, name: "greenBlock"},
        {id: 4, name: "waterBlock"},
        {id: 5, name: "iceBlock"},
        {id: 8, name: "eagle"},
      ],
      newBlock: 1,
      player1: {},
      player2: {},
      enemyTanks: [
        { x: 0, y: 0, move: 180, skin: "enemyTankLight", health: 1, speed: 1, pulya: { x: -32, y: -32, speed: 4, move: 180 } },
        { x: 256, y: 0, move: 90, skin: "enemyTankSpeed", health: 1, speed: 2, pulya: { x: -32, y: -32, speed: 4, move: 90 } },
        { x: 512, y: 0, move: 180, skin: "enemyTankLight2", health: 2, speed: 1, pulya: { x: -32, y: -32, speed: 4, move: 180 } },
        { x: 768, y: 0, move: 270, skin: "enemyTankHeavy", health: 3, speed: 1, pulya: { x: -32, y: -32, speed: 4, move: 270 } },
      ],
      wave: false,
      map: [],
      pause: false,
      blockSize: 32,
      pixelOnBlock: 8,
      cnv: {},
    };
  },
  computed: {
    ...mapState("admin", ["tanksMaps", "gameObjects"]),
    gameObjectsList() {
      let o = this.gameObjects;
      let l = [];
      let lo = [];
      o.forEach((e) => {
        if (!~l.indexOf(e.namien)) {
          l.push(e.namien);
          lo.push({ name: e.namien, id: e.kod_object });
        }
      });
      return lo;
    },
  },
  methods: {
    ...mapActions(["fetchData"]),
    checkMap(telo, stopBlock, destroy = 0, debug = false) {
      let x = telo.x;
      let y = telo.y;
      let w = 0;
      let h = 0;
      let nextWay = 4;
      let ofsety1 = 0;
      let ofsety2 = 0;
      let ofsety3 = 0;
      let ofsetx1 = 0;
      let ofsetx2 = 0;
      let ofsetx3 = 0;
      let checkBlock;
      let chk = false;
      switch (telo.move) {
        case 0: //y--
          y -= nextWay;
          break;
        case 90: //x++
          x += 0;
          break;
        case 180: //y++
          y += 0;
          break;
        case 270: //x--
          x -= nextWay;
          break;
      }
      w = Math.floor(x / this.blockSize);
      h = Math.floor(y / this.blockSize);
      if (debug) {
        console.log(w, h, telo.move);
      }
      switch (telo.move) {
        case 0: //y--
          ofsetx2 = 1;
          if (x % this.blockSize > this.blockSize / 4) {
            ofsetx3 = 2;
          }
          break;
        case 90: //x++
          ofsety2 = 1;
          ofsetx1 = ofsetx2 = ofsetx3 = 2;
          if (y % this.blockSize > this.blockSize / 4) {
            ofsety3 = 2;
          }
          break;
        case 180: //y++
          ofsety1 = 2;
          ofsety2 = 2;
          ofsetx2 = 1;
          ofsety3 = 2;
          if (x % this.blockSize > this.blockSize / 4) {
            ofsetx3 = 2;
          }
          break;
        case 270: //x--
          ofsety2 = 1;
          if (y % this.blockSize > this.blockSize / 4) {
            ofsety3 = 2;
          }
          break;
      }
      if (
        w + ofsetx1 < 0 ||
        h + ofsety1 < 0 ||
        w + ofsetx1 > 25 ||
        h + ofsety1 > 25 ||
        w + ofsetx2 < 0 ||
        h + ofsety2 < 0 ||
        w + ofsetx2 > 25 ||
        h + ofsety2 > 25 ||
        w + ofsetx3 < 0 ||
        h + ofsety3 < 0 ||
        w + ofsetx3 > 25 ||
        h + ofsety3 > 25
      ) {
        chk = true;
      } else {
        checkBlock = this.map[h + ofsety1][w + ofsetx1];
        if (stopBlock.indexOf(checkBlock) !== -1) {
          if (destroy) {
            this.map[h + ofsety1][w + ofsetx1] = 0;
          }
          chk = true;
        }
        checkBlock = this.map[h + ofsety2][w + ofsetx2];
        if (stopBlock.indexOf(checkBlock) !== -1) {
          if (destroy) {
            this.map[h + ofsety2][w + ofsetx2] = 0;
          }
          chk = true;
        }
        checkBlock = this.map[h + ofsety3][w + ofsetx3];
        if (stopBlock.indexOf(checkBlock) !== -1) {
          if (destroy) {
            this.map[h + ofsety3][w + ofsetx3] = 0;
          }
          chk = true;
        }
      }
      return chk;
    },
    PressKey(e) {
      if (this.pause) return;
      let step = e.keyCode;
      switch (step) {
        case 32: //пробел - выстрел
          if (this.player1.pulya.x <= 0 && this.player1.pulya.y <= 0) {
            this.player1.pulya.x = this.player1.x;
            this.player1.pulya.y = this.player1.y;
          }
          break;
        case 37: //лево
        case 65: //A
          this.keyMove(270, this.player1);
          break;
        case 38: //вверх
        case 87: //W
          this.keyMove(0, this.player1);
          break;
        case 39: //право
        case 68: //D
          this.keyMove(90, this.player1);
          break;
        case 40: //вниз
        case 83: //S
          this.keyMove(180, this.player1);
          break;
        default:
          break;
      }
    },
    keyMove(grad, object) {
      if (object.move != grad) {
        object.move = grad;
      } else {
        let coord = "y";
        let vector = 1;
        if (grad % 180 === 90) {
          coord = "x";
        }
        if (grad === 0 || grad === 270) {
          vector = -1;
        }
        this.track = !this.track;
        if (!this.checkMap(object, [1, 2, 4], 0)) {
          object[coord] += (vector * this.blockSize) / this.pixelOnBlock;
        }
      }
    },
    enemyMove() {
      this.track = !this.track;
      this.enemyTanks.forEach((e) => {
        if (this.checkMap(e, [1, 2, 4], 0)) {
          e.move += 90 * Math.ceil(Math.random() * 3);
          e.move = e.move % 360;
        } else {
          if (e.pulya.x < 0 && Math.ceil(Math.random() * 3) === 3) {
            e.pulya.x = e.x;
            e.pulya.y = e.y;
            e.pulya.move = e.move;
          }
          if (e.pulya.x > 0 && Math.ceil(Math.random() * 50) === 50) {
            e.move += 90 * Math.ceil(Math.random() * 3);
            e.move = e.move % 360;
          } else {
            switch (e.move) {
              case 0:
                e.y -= e.speed * this.blockSize / this.pixelOnBlock;
                break;
              case 90:
                e.x += e.speed * this.blockSize / this.pixelOnBlock;
                break;
              case 180:
                e.y += e.speed * this.blockSize / this.pixelOnBlock;
                break;
              case 270:
                e.x -= e.speed * this.blockSize / this.pixelOnBlock;
                break;

              default:
                break;
            }
          }
        }
      });
    },
    startmove() {
      this.cnv.clearRect(0, 0, this.obj.width, this.obj.height);
      for (let o = 0; o < 26; o++)
        for (let m = 0; m < 26; m++)
          // this.changePos(o, m, 0, this.map[m][o]);
          switch (this.map[m][o]) {
            case 0:
              this.changePos(o, m, 0, "blackBlock");
              break;
            case 1:
              this.changePos(o, m, 0, "brickBlock");
              break;
            case 2:
              this.changePos(o, m, 0, "betonBlock");
              break;
            case 3:
              this.changePos(o, m, 0, "greenBlock");
              break;
            case 4:
              if (this.wave) {
                this.changePos(o, m, 0, "waterBlock");
              } else {
                this.changePos(o, m, 0, "waterBlock2");
              }
              break;
            case 5:
              // this.changePos(this.iceBlock, o, m);
              this.changePos(o, m, 0, "iceBlock");
              break;
            case 8:
              this.changePos(o, m, 0, "eagle");
              break;
            default:
              break;
          }
      this.changePos(
        this.player1.x / this.blockSize,
        this.player1.y / this.blockSize,
        this.player1.move,
        this.playerSkin
      );

      for (const e of this.enemyTanks) {
        this.changePos(
          e.x / this.blockSize,
          e.y / this.blockSize,
          e.move,
          e.skin
        );
        this.changePos(
          e.pulya.x / this.blockSize,
          e.pulya.y / this.blockSize,
          e.pulya.move,
          "bullet"
        );
      }
      this.changePos(
        this.player1.pulya.x / this.blockSize,
        this.player1.pulya.y / this.blockSize,
        this.player1.pulya.move,
        "bullet"
      );
    },
    genObject(name) {
      let data = this.gameObjects.filter((e) => e.namien === name || e.kod_object == name);
      data.forEach((e) => {
        this.fr(e.x, e.y, e.width, e.heigth, e.color);
      });
    },

    setOfset(grad) {
      let ofsetx = 0,
        ofsety = 0;
      switch (grad) {
        case 0:
          ofsetx = 0;
          ofsety = 0;
          break;
        case 90:
          ofsetx = 2 * this.blockSize;
          ofsety = 0;
          break;
        case 180:
          ofsetx = 2 * this.blockSize;
          ofsety = 2 * this.blockSize;
          break;
        case 270:
          ofsetx = 0;
          ofsety = 2 * this.blockSize;
          break;
      }
      return { x: ofsetx, y: ofsety };
    },
    movePule() {
      this.movePuleOne(this.player1.pulya);
      for (const e of this.enemyTanks) {
        this.movePuleOne(e.pulya);
      }
    },
    movePuleOne(bull, debug = false) {
      if (bull.x < 0 && bull.y < 0) {
        bull.move = this.player1.move;
        return 0;
      }
      let sel = bull.move;
      switch (sel) {
        case 0:
          bull.y -= (bull.speed * this.blockSize) / this.pixelOnBlock;
          break;
        case 180:
          bull.y += (bull.speed * this.blockSize) / this.pixelOnBlock;
          break;
        case 270:
          bull.x -= (bull.speed * this.blockSize) / this.pixelOnBlock;
          break;
        case 90:
          bull.x += (bull.speed * this.blockSize) / this.pixelOnBlock;
          break;
        default:
          break;
      }
      if (
        bull.x < 0 ||
        bull.y < 0 ||
        bull.x > this.obj.width ||
        bull.y > this.obj.height
      ) {
        bull.x = -this.blockSize * 2;
        bull.y = -this.blockSize * 2;
      }
      if (this.checkMap(bull, [1, 2], 1, debug)) {
        this.changePos(
          bull.x / this.blockSize,
          bull.y / this.blockSize,
          bull.move,
          "babax"
        );
        bull.x = -this.blockSize * 2;
        bull.y = -this.blockSize * 2;
      }
      this.enemyTanks.forEach((e) => {
        if (bull.x > e.x && bull.x < e.x + 1.5*this.blockSize && bull.y > e.y && bull.y < e.y + 1.5*this.blockSize){
          this.changePos(
            e.x / this.blockSize,
            e.y / this.blockSize,
            bull.move,
            "test3"
          );
          e.health--;
          if (e.health < 1){
            e.x = Math.floor(Math.random() * 4)*256
            e.y = 0
          }
          
          bull.x = -this.blockSize * 2;
          bull.y = -this.blockSize * 2;
        }
      })
    },
    changePos(x, y, grad = 0, obj = "") {
      let ofset;
      ofset = this.setOfset(grad);
      this.cnv.translate(
        x * this.blockSize + ofset.x,
        y * this.blockSize + ofset.y
      );
      this.cnv.rotate((Number(grad) * Math.PI) / 180);
      if (obj) {
        this.genObject(obj);
      } 
      this.cnv.rotate((Number(-grad) * Math.PI) / 180);
      this.cnv.translate(
        -x * this.blockSize - ofset.x,
        -y * this.blockSize - ofset.y
      );
    },
    getMaps() {
      return this.fetchData({
        url: "api/restGet",
        data: {
          fields: [],
          from: "b32_18009385_users.battle_city",
          sort: ["KOD_STAGE"],
          limit: 20,
          page: 1,
        },
        stateName: "admin/tanksMaps",
      });
    },
    saveMap(){
      let level = prompt("Введите номер уровня для сохранения")
      this.fetchData({
        url: "api/restInsert",
        data: {
          fields: {KOD_STAGE: level, map: JSON.stringify(this.map), enemy: 20},
          to: "b32_18009385_users.battle_city",
        }
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
          sort: ["gop.ord"],
          join: ["gop.kod_object=o.id"],
        },
        stateName: "admin/gameObjects",
      });
    },
    mouseClick(e){
      let w = Math.floor(e.layerX / this.blockSize);
      let h = Math.floor(e.layerY / this.blockSize);
      console.log(e);
      console.log(e.layerX, e.layerY);
      console.log(w, h);
      if (e.button === 0) this.map[h][w] = +this.newBlock;
      if (e.button === 2) this.map[h][w] = 9;
      this.startmove()
    },
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
  },
  mounted() {
    this.getObjects()
      .then(() => this.getMaps())
      .then(() => {
        this.player1 = {
          x: this.blockSize * 9,
          y: this.blockSize * 24,
          move: 0,
          health: 1, speed:1,
          pulya: { x: -this.blockSize * 2,  y: -this.blockSize * 2, speed:4, move: 0 },
        };
        // this.pulya = { x: -this.blockSize * 2, y: -this.blockSize * 2, move: 0 };
        this.obj = document.getElementById("cnv");
        this.obj.width = 26 * this.blockSize;
        this.obj.height = 26 * this.blockSize;
        this.cnv = this.obj.getContext("2d");
        this.obj.addEventListener("mousedown",this.mouseClick)
        this.obj.oncontextmenu = e=>e.preventDefault()
        this.map = JSON.parse(this.tanksMaps[2].MAP);
        addEventListener("keydown", this.PressKey);
        //обновление карты
        let num = 0;
        this.timerId = setInterval(() => {
          if (this.pause) return;
          num++;
          if (num % 16 === 0) this.wave = !this.wave;
          this.startmove();
          this.enemyMove();
          //анимация пули
          this.movePule();
        }, 30);
        //анимация волн
      });
  },
  beforeDestroy() {
    clearInterval(this.timerId);
  },
};
</script>