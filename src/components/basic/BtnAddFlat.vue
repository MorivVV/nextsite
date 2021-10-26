<template>
  <a class="btn-floating btn-small indigo" title="Добавить" @click="action">
    <i class="material-icons">add</i>
  </a>
</template>

<script>
export default {
  props: {
    action: Function
  }
};
</script>
