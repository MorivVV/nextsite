<template>
  <div>
    <OneSQLedit v-if="edit.val" :edit="edit" :ssq="ssq" />
    <OneSQLview v-else :edit="edit" :ssq="ssq" />
  </div>
</template>

<script>
import OneSQLview from './OneSQLview'
import OneSQLedit from './OneSQLedit'
import { mapActions } from 'vuex'
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
  }),
  methods: {
    ...mapActions(['fetchData'])
  }
}
</script>