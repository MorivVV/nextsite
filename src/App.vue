<template>
  <div id="app">
    <navBar :Logo="'Наш сайт'" />
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