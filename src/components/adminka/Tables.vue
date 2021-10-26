<template>
  <div>Структура БД
    <table>
      <thead>
        <tr>
          <th v-for="(h, k) in tables[0]" :key="k">{{k}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tables" :key="row">
          <template v-for="(r, k) in row" >
            <td class="red-text" v-if="k === 'TABLE_NAME'" @click="table = r" :key="r" >{{r}}</td>
            <td v-else :key="r" >{{r}}</td>
          </template>
        </tr>
      </tbody>
    </table>

    <table>
      <caption>Поля в таблице {{table}}</caption>
      <thead>
        <tr>
          <th v-for="(h, k) in tableFields[0]" :key="k">{{k}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableFields" :key="row">
          <template v-for="r in row" >
            <td :key="r" >{{r}}</td>
          </template>
        </tr>
      </tbody>
    </table>

    <table>
      <caption>{{table}}</caption>
      <thead>
        <tr>
          <th v-for="(h, k) in tableData[0]" :key="k">{{k}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableData" :key="row">
          <template v-for="r in row" >
            <td :key="r" >{{r}}</td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data(){
    return {
      table: ""
    }
  },
  watch: {
    table(newVal){
      if (newVal){
        this.getTableData(newVal)
      }
    }
  },
  computed:{
    ...mapState("admin",["tables","tableData","tableFields"])
  },
  methods: {
    ...mapActions(["fetchData"]),
    getTableData(t){
      this.fetchData(
        {
          data:{
            from: t
          }, 
          stateName: 'admin/tableData'
          }
      )
      this.fetchData(
        {
          data:{
            from: "information_schema.columns",
            filter: {
              TABLE_NAME: t
            }
          }, 
          stateName: 'admin/tableFields'
          }
      )
    },
    getSchema(){
      this.fetchData(
        {
          url: "api/restGet",
          data:{
            fields: ["TABLE_NAME", "TABLE_TYPE", "ENGINE", "VERSION", "TABLE_ROWS", "DATA_LENGTH", "AUTO_INCREMENT", "CREATE_TIME", "UPDATE_TIME", "TABLE_COLLATION", "TABLE_COMMENT"],
            from: 'information_schema.tables',
            filter: {
              table_schema: "b32_18009385_users"
            }
          }, 
          stateName: 'admin/tables'})
    }
  },
  mounted(){
    this.getSchema()
  }
}
</script>

<style>
td, th {
    padding: 2px;
    display: table-cell;
    text-align: left;
    vertical-align: middle;
    border-radius: 2px;
    border: 1px solid silver;
}
</style>