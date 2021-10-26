<template>
  <div class="switch">
    <label>
      {{ label }}
      <input
        type="checkbox"
        :checked="value"
        @change="$emit('input', $event.target.checked)"
      />
      <span class="lever"></span>
    </label>
  </div>
</template>

<script>
export default {
  name: "SwitchMaterial",
  props: {
    label: String,
    value: Boolean
  }
};
</script>
