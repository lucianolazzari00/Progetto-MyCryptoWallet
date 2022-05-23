let app = Vue.createApp({
    data(){
        return {
            sumField: "",
            interestField: "",
            timeField: "1",
            compField: "1",
            result: 0.00,
        }
    },
    methods: {
        time_radio_updater(event){
            this.timeField=event.target.value
        },
        comp_radio_updater(event){
            this.compField=event.target.value
        },
        calculator(){
            this.result = (((this.sumField*(this.interestField/100))/365)*parseInt(this.timeField)).toFixed(2)
            //this.result = Math.pow(this.sumField*(1 + this.interestField/100),(this.timeField).toFixed(2));
        },
        reset_result(){
            this.result = 0.00;
        },
    }
});
app.mount('#vueAppApyCalc')

