<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<script>
// @ is an alias to /src

import {mapActions, mapGetters} from 'vuex'
export default {
  components: {

  },
  computed:{
    ...mapGetters([''])
  },
  methods: {
    ...mapActions(['']),
  }
  
}
</script>
