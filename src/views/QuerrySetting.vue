<template>
  <div>
    <OneSQL v-for="ssq in sqlQuery" :ssq="ssq" :key="ssq.id" />
  </div>
</template>

<script>
import OneSQL from '../components/adminka/OneSQL'
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    OneSQL
  },
  computed: {
    ...mapGetters('admin',['sqlQuery']),
  },
  methods: {
    ...mapActions(['fetchData'])
  },
  mounted(){
    this.fetchData({url: "api/restGet",data:{fields: [],from: 'sys_sql_query'}, stateName: 'admin/sqlQuery'})
  }
}
</script>

<style scoped>
.b {
      font-weight: 500;
}
</style>
