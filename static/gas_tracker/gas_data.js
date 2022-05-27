
let app = Vue.createApp({
    data(){
        return {
            slow:"",
            standard: "",
            fast:"",
            time:10,
        }
    },
    methods: {
        myf : function(){
              axios
              .get("http://localhost:8080/api/gas")
              .then(res2 => {
                
                var info = res2.data
                
                var low = info.low
                var average = info.average
                var high = info.high

                this.slow = info.low
                this.standard = info.average
                this.fast = info.high
              })
              .catch(error => {
                  console.log("ERROREE")
                  console.error(error)
              })
            this.time = 10
        },
        myf2(){
            this.time -= 1;
        }
    },

    created(){
        this.myf()
        this.interval2 = setInterval(()=> this.myf2(), 1000)
        this.interval = setInterval(()=> this.myf(), 10000)
    }
});
app.mount('#vueAppGas')
