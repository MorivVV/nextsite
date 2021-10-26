<template>
  <div id="app">
    <navBar :Logo="'NextSite'" />
    <router-view/>
    <Footer />
  </div>
</template>

<script>
import navBar from '@/components/navBar'
import Footer from '@/components/Footer'
export default {
  components: {
    navBar,
    Footer
  }
}
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>