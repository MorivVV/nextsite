<template>
  <a
    :id="uniq_id"
    :href="url"
    @click.prevent="
      () => {
        $router.push(url);
      }
    "
    class="btn-floating waves-effect waves-light"
    :class="{ disabled: disabled }"
    :data-tooltip="title"
  >
    <i class="material-icons prefix">{{ icon }}</i>
  </a>
</template>

<script>
import MD5 from "js-md5";
export default {
  props: {
    title: { type: String, default: "" },
    icon: { type: String, default: "check" },
    url: { type: String, default: "" },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      uniq_id: MD5(this.title + Date.now() * Math.random()),
      tip: {}
    };
  },
  mounted() {
    if (this.title !== "") {
      this.tip = this.$M.Tooltip.init(document.getElementById(this.uniq_id), {
        exitDelay: 200, //Время задержки до исчезновения подсказки.
        enterDelay: 200, //Время задержки до появления всплывающей подсказки.
        html: null, //Может принимать обычный текст или строки HTML.
        margin: 0, //Всплывающая подсказка «Установить расстояние» появляется в стороне от его активатора, за исключением transitionMovement.
        inDuration: 300, //Введите продолжительность перехода.
        outDuration: 250, //Выходная длительность перехода.
        position: "bottom", // Установите направление всплывающей подсказки. «сверху», «справа», «снизу», «слева».
        transitionMovement: 10 //Величина в пикселях, которую перемещает всплывающая подсказка во время перехода.
      });
    }
  },
  destroyed() {
    let tip = this.tip;
    let p = new Promise(resolve => {
      resolve(tip.close());
    });
    p.then(() => this.tip.destroy());
  }
};
</script>

<style scoped>
.input-field .prefix {
  position: static;
}
</style>
