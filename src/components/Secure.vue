<template>
  <div id="autorize">
    <span  v-if="isLoggedIn">Авторизован {{userLogin}}</span>
    <span v-else>Без авторизации</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['isLoggedIn', 'userLogin'])
  },
}
</script>

<style >
#autorize {
  position: absolute;
  top: -20px;
  left: 163px;
}
</style>