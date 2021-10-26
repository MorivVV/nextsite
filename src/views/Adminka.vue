<template>
  <div class="row">
    <div class="col s1">
      <NavAdmin />
    </div>
    <div class="col s11">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NavAdmin from "../components/adminka/NavAdmin";
export default {
  components: {
    NavAdmin
  }
};
</script>
