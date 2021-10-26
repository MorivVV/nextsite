<template>
  <div class="row">
    <div class="col s1 blue lighten-5 full-height">
      <DezhNavVue />
    </div>
    <div class="col s11">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import DezhNavVue from "../components/dezh/DezhNav.vue";

export default {
  components: {
    DezhNavVue
  }
};
</script>

<style scoped>
.full-height {
  height: 800px;
  background: linear-gradient(0deg, white, #388e3c);
}
</style>
