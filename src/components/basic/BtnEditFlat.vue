<template>
  <a class="btn-floating btn-small green" title="Редактировать" @click="action">
    <i href="" class="material-icons">edit</i>
  </a>
</template>

<script>
export default {
  props: {
    action: Function
  }
};
</script>
