<template>
  <label>
    <input
      :id="uniq_id"
      type="checkbox"
      :checked="value"
      :disabled="disabled"
      @change="$emit('input', $event.target.checked)"
    />
    <span>{{ label }}</span>
  </label>
</template>

<script>
import MD5 from "js-md5";
export default {
  name: "CheckBox",
  props: {
    label: String,
    value: { type: String, default: "" },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      uniq_id: MD5("" + this.label + Date.now() * Math.random())
    };
  }
};
</script>
