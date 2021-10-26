<template>
  <div>
      <!-- Dropdown Trigger -->
  <a class='dropdown-trigger btn' :id="uniq_id" href='#' data-target='dropdown1'>{{label}}</a>

  <!-- Dropdown Structure -->
  <ul id='dropdown1' class='dropdown-content'>
    <li v-for="i in compList" :key="'drop_'+i.val">
      <img @click="$emit('input', i.val)" alt="" :src="'/images/tumbs/' + i.val">
    </li>
  </ul>
  </div>
</template>

<script>
import MD5 from "js-md5";
export default {
  props: {
    list: Array,
    label: String,
    val: String,
    option: String,
    icon: String,
    value: String
  },
  data() {
    return {
      uniq_id: MD5("drop" + this.label + Math.random() * Date.now())
    }
  },
  computed: {
    compList() {
      let l = this.list;
      if (l.length === 0) {
        return [{ val: 0, opt: "Нет данных" }];
      }
      let v = this.val;
      let o = this.option;
      let res = [];
      l.forEach(e => {
        let icon = ""
        if (this.dataIcon in e){
          icon = e[this.dataIcon]
        }
        res.push({
          val: e[v],
          opt: e[o],
          icon: icon
        });
      });
      return res;
    }
  },
  mounted(){
    var elems = document.getElementById(this.uniq_id);
    this.$M.Dropdown.init(elems, {});
  }
}
</script>

<style scoped>
#dropdown1 li img:hover{
  border: 1px solid red;
  margin: 0;
}
</style>