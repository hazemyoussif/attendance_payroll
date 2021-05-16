require('./bootstrap');
import Vue from 'vue';
import Day from './components/day.vue';
import dayCard from "./components/dayCard.vue";
import ConcernManager from './components/concernManager.vue';
import ConcernAction from './components/concernAction.vue';
window.Event = new Vue();


import JsonExcel from "vue-json-excel";
 
Vue.component("downloadExcel", JsonExcel);

var app= new Vue({
    el: '#app',
    components:{Day,ConcernManager,dayCard,ConcernManager,ConcernAction},
    data: {
        review:true,
    },
    methods:{
        getConcern(){
            this.review=false;
        },
        getReview(){
            this.review=true;
        }
    }
})