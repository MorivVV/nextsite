<template>
  <a
    class="btn-floating btn-small blue darken-2"
    title="Сохранить"
    @click="action"
  >
    <i href="" class="material-icons">save</i>
  </a>
</template>

<script>
export default {
  props: {
    action: Function
  }
};
</script>
