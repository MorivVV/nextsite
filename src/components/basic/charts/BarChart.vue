<script>
import { Bar } from "vue-chartjs";
export default {
  extends: Bar,
  props: {
    charData: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  watch: {
    charData: {
      handler() {
        this.renderChart(this.charData, this.options);
      },
      deep: true
    }
  },
  mounted() {
    this.renderChart(this.charData, this.options);
  }
};
</script>
