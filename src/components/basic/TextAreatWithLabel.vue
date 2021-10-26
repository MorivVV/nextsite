<template>
  <div class="input-field">
    <textarea
      class="materialize-textarea"
      v-model="inputVal"
      @input="$emit('input', inputVal)"
    ></textarea>
    <label>{{ label }}</label>
  </div>
</template>

<script>
export default {
  props: {
    val: { type: String, default: "" },
    label: { type: String, default: "" }
  },
  data() {
    return {
      inputVal: this.val
    };
  }
};
</script>

<style scoped>
input[type="text"]:not(.browser-default) {
  margin: 0;
}
</style>
