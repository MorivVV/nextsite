<template>
  <a class="btn-floating btn-small green" title="Подтвердить" @click="action">
    <i class="material-icons">check</i>
  </a>
</template>

<script>
export default {
  props: {
    action: Function
  }
};
</script>
