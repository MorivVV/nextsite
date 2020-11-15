<template>
  <div class="row">
    <OneSQLedit v-if="edit.val" :edit="edit" :ssq="ssq" />
    <OneSQLview v-else :edit="edit" :ssq="ssq" />
  </div>
</template>

<script>
import OneSQLview from './OneSQLview'
import OneSQLedit from './OneSQLedit'
export default {
  components: {
    OneSQLedit,
    OneSQLview
  },
  props: {
    ssq: Object
  },
  data: ()=>({
    edit: {val:false}
  })
}
</script>