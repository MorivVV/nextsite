<template>
  <div>Админrf
    <div v-for="ssq in sqlQuery" :key="ssq.ID" class="row">
    <div class="col s12">
      <div class="card">
        <div class="card-content">
          <div class="row">
            <div class="col s2 blue lighten-5">
              <label>sql_name</label>
               <span class="card-title purple-text b">{{ssq.sql_name}}</span>
            </div>
            <div class="col s4">
              <label>Входные параметры</label>
               <p>{{ssq.sql_params}}</p>
            </div>
            <div class="col s2">
              <label>Отдаваемый параметр</label>
              <p>{{ssq.result}}</p>
            </div>
            <div class="col s2">
              <label>Для авторизованых</label>
              <div class="switch">
                <label>
                  Off
                  <input disabled :checked="+ssq.need_token" type="checkbox">
                  <span class="lever"></span>
                  On
                </label>
              </div>
            </div>
            <div class="col s2">
              <button class="btn right">Редактировать</button>
            </div>
          </div>
          <label>Текст SQL запроса</label>
          <p><pre>{{ssq.sql_query}}</pre></p>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
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
