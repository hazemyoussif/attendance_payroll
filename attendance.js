require('./bootstrap');
import Vue from 'vue';
import attendanceConfirmation from './components/attendanceConfirmation.vue';

window.Event = new Vue();
var app= new Vue({
    el: '#app',
    components:{attendanceConfirmation},
    data: {
        monitor:null,
    },
    methods:{
        
    }
})