import { mapActions } from "vuex";

export default {
    methods: {
        ...mapActions(["fetchData"])
    }
}