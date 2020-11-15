<template>
  <div>Админrf
    <OneSQL v-for="ssq in sqlQuery" :ssq="ssq" :key="ssq.ID" />
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
    ...mapGetters(['sqlQuery']),
  },
  methods: {
    ...mapActions(['fetchData'])
  },
  mounted(){
    this.fetchData({data:{sqlname: 'ssq'}, stateName: 'admin/sqlQuery'})
  }
}
</script>

<style scoped>
.b {
      font-weight: 500;
}
</style>
