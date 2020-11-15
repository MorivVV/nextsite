<template>
  <div class="row">
    <div class="col s12">
      <div class="card">
        <div class="card-content">
          <div class="row">
            <div class="input-field col s2">
              <input :id="'sql_name'+ssq.ID" type="text" v-model="ssq.sql_name" />
              <label :for="'sql_name'+ssq.ID">sql_name</label>
            </div>
            <div class="input-field col s4">
              <input :id="'sql_params'+ssq.ID" type="text" v-model="ssq.sql_params" />
              <label :for="'sql_params'+ssq.ID">Входные параметры</label>
            </div>
            <div class="input-field col s2">
              <input :id="'result'+ssq.ID" type="text" v-model="ssq.result" />
              <label :for="'result'+ssq.ID">Отдаваемый параметр</label>
            </div>
            <div class="col s2">
              <label>Для авторизованых</label>
              <div class="switch">
                <label>
                  Off
                  <input v-model="ssq.need_token" type="checkbox">
                  <span class="lever"></span>
                  On
                </label>
              </div>
            </div>
            <div class="col s2">
              <div class="switch">
                <label>
                  Сохранить
                  <input type="checkbox" v-model="edit.val">
                  <span class="lever"></span>
                  Редактирование
                </label>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <div class="input-field col s12">
                <textarea rows="10" :id="'query'+ssq.ID"  v-model="ssq.sql_query"></textarea>
                <label :for="'query'+ssq.ID">Текст SQL запроса</label>
              </div>
            </div>
          </div>
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
  },
  mounted(){
    this.$M.textareaAutoResize(document.getElementById('query'+this.ssq.ID));
    this.$M.updateTextFields()
  }
}
</script>