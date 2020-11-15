<template>
  <div class="row">
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
              <div class="switch">
                <label>
                  Просмотр
                  <input type="checkbox" v-model="edit.val">
                  <span class="lever"></span>
                  Редактирование
                </label>
              </div>
            </div>
          </div>
          <label>Текст SQL запроса</label>
          <p><pre>{{ssq.sql_query}}</pre></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ssq: Object,
    edit: Object
  }
}
</script>