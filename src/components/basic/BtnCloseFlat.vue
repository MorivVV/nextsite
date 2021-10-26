<template>
  <a class="btn-floating btn-small red" title="Закрыть" @click="action">
    <i class="material-icons">close</i>
  </a>
</template>

<script>
export default {
  props: {
    action: Function
  }
};
</script>
