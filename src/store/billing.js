export default {
    state: {
        bill: [],
        prevBill: [],
        price: [],
        meters: [],
        home: [],
        billdate: [],
        billHead: [
            { name: 'Счетчик', class: 's6 m4 l2' },
            { name: 'Услуга', class: 's6 m4 l2' },
            { name: 'Было', class: 's4 m4 l1' },
            { name: 'Стало', class: 's4 m3 l1 right-align' },
            { name: 'Расход', class: 's4 m3 l1 right-align' },
            { name: 'Цена', class: 's8 m3 l1' },
            { name: 'Сумма', class: 's4 m3 l1 right-align' },
        ]
    },
    mutations: {},
    actions: {

    },
    getters: {
        billList(state) {
            let object
            if (state.bill.length > 0) {
                object = state.bill
            } else {
                object = state.prevBill
            }
            return object
        },
        prevBillList(state) {
            let object = state.prevBill
            return object
        },
        priceList(state) {
            let object = state.price
            return object
        },
        billHead(state) {
            let object = state.billHead
            return object
        },
        meterList(state) {
            let object = state.meters
            return object
        },
        homeList(state) {
            let object = state.home
            return object
        },
        billDateList(state) {
            let object = state.billdate.map(e => new Date(e.DBILL).toDateString())
            return object
        },
    }
}