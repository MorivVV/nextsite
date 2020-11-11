<template>
    <div class="row collection-item">
        <div class="col s6 m4 l2">{{meter}}</div>
        <div class="col s6 m4 l2">{{meter}}</div>
        <div class="col s4 m4 l1 rel">
          <div class="label">на {{prevMeterBill["DATE_BIL"]}}</div>
          {{prevMeterBill.BILLING}}</div>
        <div class="col s4 m3 l1 right-align" @click="activeBilling=true">
          <input @blur="editBill" class="edit-bill light-green accent-1" type="text" v-if="activeBilling" :value="meterBill.BILLING">
          <span v-else>{{meterBill.BILLING}}</span>
        </div>
        <div class="col s4 m3 l1 right-align">{{+meterBill.BILLING - +prevMeterBill.BILLING}}</div>
        <div class="col s8 m3 l1 rel" :title="currentPrice.DATEPRICE">
          <div class="label">c {{currentPrice.DATEPRICE}}</div>
          {{currentPrice.PRICE}}</div>
        <div class="col s4 m3 l1 right-align">{{calcSum}}</div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
    props: {
        meter: String,
        mid: Number,
        date: String
    },
    data: ()=>({
      activeBilling: false
    }),
    computed: {
      ...mapGetters(["billList", "prevBillList", "priceList"]),
      meterBill(){
        let bill = this.billList.filter(e => e.KOD_METER == this.mid)
        if (bill.length === 0){
          return {BILLING: this.prevMeterBill.BILLING}
        }
        return bill[0]
      },
      prevMeterBill(){
        let bill = this.prevBillList.filter(e => e.KOD_METER == this.mid)
        if (bill.length === 0){
          return {BILLING: 0, DATE_BIL: '0'}
        }
        return bill[0]
      },
      currentPrice(){
        let bill = this.priceList.filter(e => e.KOD_METER == this.mid)
        if (bill.length === 0){
          return {BILLING: 0, DATE_BIL: '0'}
        }
        return bill[0]
      },
      calcSum(){
        let calc = +this.meterBill.BILLING - +this.prevMeterBill.BILLING
        return (calc*this.currentPrice.PRICE).toFixed(2)
      }
    },
    methods: {
      ...mapActions(["fetchData"]),
      editBill(){
        let newBill = event.target.value

        if (this.$store.state.billing.bill.filter(e => e.KOD_METER == this.mid).length === 0){
          this.$store.state.billing.bill.push( {KOD_METER: this.mid, KOD_TYPE: "0", DOP: "0", DATE_BIL: this.date, BILLING: newBill})
          this.fetchData({data: { sqlname: 'addBilling', kod_meter: this.mid, billing: newBill, bil_date: this.date}, stateName: "billing/temp"})
        }
        else{
          if (this.$store.state.billing.bill.filter(e => e.KOD_METER == this.mid)[0].BILLING !== newBill){
            this.$store.state.billing.bill.filter(e => e.KOD_METER == this.mid)[0].BILLING = newBill
            this.fetchData({data: { sqlname: 'updateBilling', kod_meter: this.mid, billing: newBill, bil_date: this.date}, stateName: "billing/temp"})
          }
        }
        
        this.activeBilling = false
      }
    }
}
</script>

<style scoped>
.label{
  font-size: 0.6rem;
  position: absolute;
  top: -11px;
  left: -10px;
}
.row {
  margin:auto
}
input[type=text].edit-bill{
  height: 1rem;
  text-align: center;
  padding: 5px;
  margin: -5px;
  border-radius: 2px;
}
.rel{
  position: relative;
}
</style>