<template>
  <div class="center">
    <div class="row">
      Уровни
      <div
        v-for="m in tanksMaps"
        @click="
          () => {
            map = JSON.parse(m.MAP);
            startmove();
          }
        "
        :key="m.ID"
        class="chip green lighten-4 purlpe-text pointer"
      >
        {{ m.KOD_STAGE }}
      </div>
    </div>
    <div class="row container">
      <div class="col s12 flow-text">
        <BtnIconsVue
          class="orange"
          :action="() => (pause = !pause)"
          :title="'Пауза'"
          :icon="'pause'"
        />
        <BtnIconsVue
          class="blue"
          :action="saveMap"
          :title="'Сохранить карту'"
          :icon="'save'"
        />
      </div>
    </div>
    <div class="row">
      <div class="row">
          <div class="col">{{ player1.skin }}</div>
          <div class="col">{{ player1.health }}</div>
          <div class="col">{{ player1.speed }}</div>
          <div class="col">{{ player1.x }}</div>
          <div class="col">{{ player1.y }}</div>
          <div class="col">{{ player1.move }}</div>
        </div>
      <div class="col s3">
        Жизни: <span class="big green-text">{{ player1.health }}</span>
        <div class="row" v-if="+player1.health > 0">
          <i
            v-for="k in +player1.health"
            class="material-icons medium red-text"
            :key="'helth_' + k"
            >favorite</i
          >
        </div>
      </div>
      <div class="col s5">
        <canvas id="cnv" map="" width="832" height="832"
          >Обновите браузер</canvas
        >
      </div>
      <div class="col s4">
        <div class="row">
          <div class="col s3 offset-s1">Скин</div>
          <div class="col s2">Броня</div>
          <div class="col s2">Скорость</div>
          <div class="col s2">x</div>
          <div class="col s2">y</div>
        </div>
        <div class="row" v-for="t in enemyTanks" :key="'et' + t.uuid">
          <div class="col s3 offset-s1">{{ t.skin }}</div>
          <div class="col s2">{{ t.health }}</div>
          <div class="col s2">{{ t.speed }}</div>
          <div class="col s2">{{ t.x }}</div>
          <div class="col s2">{{ t.y }}</div>
        </div>
        Убито: <span class="big red-text">{{ killTanks }}</span>
        <div
          class="row"
          v-for="l in Math.ceil(killTanks / 10)"
          :key="'level_' + l"
        >
          <template v-if="l * 10 <= killTanks">
            <i
              v-for="k in 10"
              class="material-icons medium orange-text"
              :key="'grede_' + l + '_' + k"
              >grade</i
            >
          </template>
          <template v-else>
            <i
              v-for="k in killTanks % 10"
              class="material-icons medium orange-text"
              :key="'grede_' + l + '_' + k"
              >grade</i
            >
          </template>
        </div>
      </div>
    </div>

    <div class="row">
      <SelectWithDataVue
        class="col s2"
        :label="'Игрок'"
        :list="gameObjectParams"
        :option="'namien'"
        :extend="false"
        :val="'namien'"
        v-if="gameObjectParams.length"
        @input="changeSkin"
      />
      <div class="col s1">
        <input type="number" id="emy" v-model="maxEnemy" />
      </div>
      <SelectWithDataVue
        class="col s2"
        :label="'Новый блок'"
        :list="gameObjectParams"
        :option="'namien'"
        :extend="false"
        :val="'_id'"
        v-if="gameObjectParams.length"
        v-model="newBlock"
      />
    </div>
    <GameObjectVue />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Tank from "../../js/classes/TankBattle";
import BtnIconsVue from "../basic/MUI/BtnIcons.vue";
import SelectWithDataVue from "../basic/MUI/SelectWithData.vue";
import GameObjectVue from './GameObject.vue';
export default {
  components: {
    GameObjectVue,
    SelectWithDataVue,
    BtnIconsVue,
  },
  data() {
    return {
      obj: {},
      killTanks: 0,
      babax: "babax",
      killAnimation: "test3",
      blackBlack: 3,
      maxEnemy: 5,
      track: true,
      timerId: {},
      newBlock: 1,
      player1: {},
      player2: {},
      enemyTanks: [],
      map: [],
      pause: false,
      blockSize: 32,
      pixelOnBlock: 8,
      cnv: {},
    };
  },
  computed: {
    ...mapState("games", ["tanksMaps", "gameObjects", "gameObjectParams"]),
    gameObjectsList() {
      let o = this.gameObjectParams.filter((e) => +e.speed > 0);
      return o;
    },
  },
  methods: {
    ...mapActions(["fetchData"]),
    getTankParameter(name) {
      let p = this.gameObjectParams.filter((e) => e.namien === name)[0];
      return [p.namien, p.health, p.speed, this.blockSize];
    },
    changeSkin(e) {
      console.log(e);
      this.player1 = new Tank(
        this.blockSize * 8,
        this.blockSize * 24,
        ...this.getTankParameter(e)
      );
    },
    intersects(a, b) {
      return Math.abs(a.x - b.x) < a.size+1 && Math.abs(a.y - b.y) < a.size+1;
    },
    _checkMap(telo, stopBlock, destroy = 0, debug = false) {
      let pos =  this.getVector(telo.move);
      let cloneTelo = {...telo};
      cloneTelo[pos.coord] += this.blockSize * pos.vector/4;
      let w = Math.floor(cloneTelo.x / this.blockSize);
      let we = Math.floor((cloneTelo.x+cloneTelo.size )/ this.blockSize);
      let h = Math.floor(cloneTelo.y / this.blockSize);
      let he = Math.floor((cloneTelo.y+cloneTelo.size) / this.blockSize);
      
      let chk = false;
      console.log(w,h);
      if (w >= 0 && h >= 0 && w < 26 && h < 26) {
        let cell = this.map[h][w];
        let block = this.gameObjectParams.filter((e) => +e._id === cell)[0];
        if (!"stop" in block) {
          console.log(block);
        }
        if (+block.stop) {
          let obj = new Tank(
            this.blockSize * w,
            this.blockSize * h,
            ...this.getTankParameter(block.namien)
          );
          chk = this.intersects(cloneTelo, obj);
        }
        if (destroy && +block.crash) {
          this.map[h][w] = this.blackBlack;
        }
      }else{
        chk = true;
      }

      return chk;
    },
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
            this.map[h + ofsety1][w + ofsetx1] = this.blackBlack;
          }
          chk = true;
        }
        checkBlock = this.map[h + ofsety2][w + ofsetx2];
        if (stopBlock.indexOf(checkBlock) !== -1) {
          if (destroy) {
            this.map[h + ofsety2][w + ofsetx2] = this.blackBlack;
          }
          chk = true;
        }
        checkBlock = this.map[h + ofsety3][w + ofsetx3];
        if (stopBlock.indexOf(checkBlock) !== -1) {
          if (destroy) {
            this.map[h + ofsety3][w + ofsetx3] = this.blackBlack;
          }
          chk = true;
        }
      }
      return chk;
    },
    startPyle(tank) {
      let pos = this.getVector(tank.move);
      tank.pulya.x = tank.x;
      tank.pulya.y = tank.y;
      tank.pulya.move = tank.move;
      tank.pulya[pos.coord] += this.blockSize * pos.vector;
    },
    PressKey(e) {
      if (this.pause) return;
      
      let step = e.keyCode;
      // console.log(this.player1.x, this.player1.y);
      switch (step) {
        case 32: //пробел - выстрел
          if (this.player1.pulya.x <= 0 && this.player1.pulya.y <= 0) {
            this.startPyle(this.player1);
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
          return;
      }
      e.preventDefault();
    },
    getVector(grad) {
      let coord = "y";
      let vector = 1;
      if (grad % 180 === 90) {
        coord = "x";
      }
      if (grad === 0 || grad === 270) {
        vector = -1;
      }
      return { coord, vector };
    },
    keyMove(grad, object) {
      if (object.move != grad) {
        object.move = grad;
      } else {
        this.track = !this.track;
        let stops = this.gameObjectParams
          .filter((e) => +e.speed === 0 && +e.stop)
          .map((e) => +e._id);
        if (!this.checkMap(object, stops, 0)) {
          let pos = this.getVector(grad);
          object[pos.coord] +=
            (object.speed * pos.vector * this.blockSize) / this.pixelOnBlock;
        }
      }
    },
    enemyMove() {
      this.track = !this.track;
      let stops = this.gameObjectParams
        .filter((e) => +e.speed === 0 && +e.stop)
        .map((e) => +e._id);
      this.enemyTanks.forEach((e) => {
        if (this.checkMap(e, stops, 0)) {
          e.move += 90 * Math.ceil(Math.random() * 3);
          e.move = e.move % 360;
        } else {
          if (e.pulya.x < 0 && Math.ceil(Math.random() * 3) === 3) {
            this.startPyle(e);
          }
          if (e.pulya.x > 0 && Math.ceil(Math.random() * 50) === 50) {
            e.move += 90 * Math.ceil(Math.random() * 3);
            e.move = e.move % 360;
          } else {
            switch (e.move) {
              case 0:
                e.y -= (e.speed * this.blockSize) / this.pixelOnBlock;
                break;
              case 90:
                e.x += (e.speed * this.blockSize) / this.pixelOnBlock;
                break;
              case 180:
                e.y += (e.speed * this.blockSize) / this.pixelOnBlock;
                break;
              case 270:
                e.x -= (e.speed * this.blockSize) / this.pixelOnBlock;
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
        for (let m = 0; m < 26; m++) this.changePos(o, m, 0, this.map[m][o]);
      this.changePos(
        this.player1.x / this.blockSize,
        this.player1.y / this.blockSize,
        this.player1.move,
        this.player1.skin
      );
      if (this.enemyTanks.filter((e) => +e.health < 1)) {
        this.enemyTanks = this.enemyTanks.filter((e) => +e.health > 0);
      }

      if (this.enemyTanks.length < this.maxEnemy) {
        let enemy = this.gameObjectsList.length;
        enemy = Math.floor(Math.random() * enemy);
        let randTank = this.gameObjectsList[enemy];
        this.enemyTanks.push(
          new Tank(
            this.blockSize * Math.ceil(Math.random() * 24),
            this.blockSize * 1,
            ...this.getTankParameter(randTank.namien)
          )
        );
      }
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
      let data = this.gameObjects.filter(
        (e) => e.namien === name || e.kod_object == name
      );
      data.forEach((e) => {
        this.fr(e.x, e.y, e.width, e.heigth, e.color);
      });
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
      let stops = this.gameObjectParams
        .filter((e) => +e.speed === 0 && +e.stop && +e.crash === 0)
        .map((e) => +e._id);
      let crashs = this.gameObjectParams
        .filter((e) => +e.speed === 0 && +e.stop && +e.crash === 1)
        .map((e) => +e._id);
      if (this.checkMap(bull, crashs, 1, debug) || this.checkMap(bull, stops, 0, debug)) {
        this.changePos(
          bull.x / this.blockSize,
          bull.y / this.blockSize,
          bull.move,
          this.babax
        );
        bull.x = -this.blockSize * 2;
        bull.y = -this.blockSize * 2;
      }
      let allTanks = [];
      allTanks = allTanks.concat(this.enemyTanks);
      allTanks = allTanks.concat(this.player1);
      allTanks.forEach((e) => {
        if (this.intersects(bull, e)) {
          this.changePos(
            e.x / this.blockSize,
            e.y / this.blockSize,
            bull.move,
            this.babax
          );
          e.health--;
          if (e.health < 1) {
            this.changePos(
              e.x / this.blockSize,
              e.y / this.blockSize,
              bull.move,
              this.killAnimation
            );
            if (
              this.player1.pulya.x === bull.x &&
              this.player1.pulya.y === bull.y
            ) {
              this.killTanks++;
            }
            e.x = Math.floor(Math.random() * 4) * 256;
            e.y = 0;
          }

          bull.x = -this.blockSize * 2;
          bull.y = -this.blockSize * 2;
        }
      });
    },
    changePos(x, y, grad = 0, obj = "") {
      this.cnv.translate(x * this.blockSize, y * this.blockSize);
      this.cnv.rotate((Number(grad) * Math.PI) / 180);
      this.cnv.translate(-this.blockSize, -this.blockSize);
      if (obj) {
        this.genObject(obj);
      }
      this.cnv.translate(this.blockSize, this.blockSize);
      this.cnv.rotate((Number(-grad) * Math.PI) / 180);
      this.cnv.translate(-x * this.blockSize, -y * this.blockSize);
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
        stateName: "games/tanksMaps",
      });
    },
    saveMap() {
      let level = prompt("Введите номер уровня для сохранения");
      this.fetchData({
        url: "api/restInsert",
        data: {
          fields: {
            KOD_STAGE: level,
            map: JSON.stringify(this.map),
            enemy: 20,
          },
          to: "b32_18009385_users.battle_city",
        },
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
        stateName: "games/gameObjects",
      });
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
    mouseClick(e) {
      let w = 1 + Math.floor(e.layerX / this.blockSize);
      let h = 1 + Math.floor(e.layerY / this.blockSize);
      console.log(e);
      console.log(e.layerX, e.layerY);
      console.log(w, h);
      if (e.button === 0) this.map[h][w] = +this.newBlock;
      if (e.button === 2) this.map[h][w] = 0;
      this.startmove();
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
    this.getObjectParams()
      .then(() => this.getObjects())
      .then(() => this.getMaps())
      .then(() => {
        this.player1 = new Tank(
          this.blockSize * 8,
          this.blockSize * 24,
          ...this.getTankParameter("tank2")
        );
        this.obj = document.getElementById("cnv");
        this.obj.width = 26 * this.blockSize;
        this.obj.height = 26 * this.blockSize;
        this.cnv = this.obj.getContext("2d");
        this.obj.addEventListener("mousedown", this.mouseClick);
        this.obj.oncontextmenu = (e) => e.preventDefault();
        this.map = JSON.parse(this.tanksMaps[2].MAP);
        addEventListener("keydown", this.PressKey);
        //обновление карты
        this.timerId = setInterval(() => {
          if (this.pause) return;
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

<style scoped>
.big {
  font-size: 6rem;
}
.row {
  margin-bottom: 2px;
}
</style>