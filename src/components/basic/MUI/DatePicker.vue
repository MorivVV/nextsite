<template>
  <div class="input-field">
    <i class="material-icons prefix">date_range</i>
    <input
      :id="uniqid"
      type="text"
      :value="value"
      @focus="datePick"
      @change="$emit('input', $event.target.value)"
    />
    <label :for="uniqid" class="active purple-text text-darken-4">{{
      label
    }}</label>
  </div>
</template>

<script>
import MD5 from "js-md5";
import datePickerI18 from "../../js/datePickerI18";
export default {
  name: "DatePicker",
  props: {
    label: String,
    value: String
  },
  data() {
    return {
      uniqid: MD5(this.label + Date.now())
    };
  },
  methods: {
    datePick: function() {
      datePickerI18.autoClose = true;
      let datainstances = this.$M.Datepicker.init(event.target, datePickerI18);
      datainstances.open();
    }
  }
};
</script>
