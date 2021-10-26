<template>
  <a class="btn-floating btn-small red" title="Удалить" @click="action">
    <i class="material-icons">delete</i>
  </a>
</template>

<script>
export default {
  props: {
    action: Function
  }
};
</script>
