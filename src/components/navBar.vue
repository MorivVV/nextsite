<template>
  <div>
    <nav>
      <div class="nav-wrapper blue">
        <a class="brand-logo">{{ Logo }}</a>
        <a href="" data-target="mobile-demo" class="sidenav-trigger"
          ><i class="material-icons">menu</i></a>
        <mainUrl id="nav-mobile" class="right hide-on-med-and-down"/>
        <Secure />
      </div>
    </nav>
    <mainUrl class="sidenav" id="mobile-demo"/>
  </div>
</template>

<script>
import mainUrl from './mainUrl'
import Secure from './Secure'
export default {
  components:{
    mainUrl, Secure
  },
  props: {
    Logo: String,
  },
  mounted(){
    this.$M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
  }
};
</script>

<style>
nav ul a.router-link-exact-active{
  background-color: yellow;
  color: black;
  font-style: italic;
}
#mobile-demo{
  width: auto;
}
</style>