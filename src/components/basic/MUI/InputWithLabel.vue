<template>
  <div class="input-field">
    <i v-if="icon" class="material-icons prefix">{{ icon }}</i>
    <input
      :id="uniq_id"
      type="text"
      :value="value"
      @keypress.enter="action"
      class="validate"
      :disabled="disabled"
      @input="$emit('input', $event.target.value)"
    />
    <label :class="{ active: value !== '' }" :for="uniq_id">
      {{ label }}
    </label>
  </div>
</template>

<script>
import MD5 from "js-md5";
export default {
  name: "InputWithLabel",
  props: {
    label: String,
    value: { type: [String, Number], default: "" },
    action: Function,
    disabled: { type: Boolean, default: false },
    icon: { type: String, default: "" }
  },
  data() {
    return {
      uniq_id: MD5("" + this.label + Date.now() * Math.random())
    };
  }
};
</script>
