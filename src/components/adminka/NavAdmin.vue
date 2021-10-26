<template>
  <div class="collection">
    <div class="collection-item row hoverable">
      <div class="col s12">
        <router-link to="/admin/querysetting"> Настройки запросов </router-link> 
      </div>
    </div>
    <div class="collection-item row hoverable">
      <div class="col s12">
        <router-link to="/admin/querysettingpg"> Настройки запросов2 </router-link> 
      </div>
    </div>
    <div class="collection-item row hoverable">
      <div class="col s12">
        <router-link to="/admin/security"> Настройки доступа </router-link> 
      </div>
    </div>
    <div class="collection-item row hoverable">
      <div class="col s12">
        <router-link to="/admin/bdtables"> Таблицы БД  </router-link> 
      </div>
    </div>
    <div class="collection-item row hoverable">
      <div class="col s12">
        <router-link to="/admin/tables"> Структура БД  </router-link> 
      </div>
    </div>
  </div>
</template>