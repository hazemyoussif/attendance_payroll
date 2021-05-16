<template>
  <div v-if="isCalled" class="modal" :class="{ 'is-active': isCalled }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Day# {{ day.id }}</p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <!-- Content ... -->
        <div class="table">
          <table class="table is-fullwidth">
            <thead>
              <tr>
                <th>Date</th>
                <th>SEEL Code</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ day.date }}</td>
                <td>{{ day.seel_code }}</td>
                <td>{{ day.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="container columns">
          <div v-if="day.plan" class="column is-6">
            <h1 class="subtitle is-5">Planned Shift</h1>
            <p>
              {{ day.plan.plan.shift.name }} |
              {{ day.plan.plan.shift.hours }} Hours |
              {{ day.plan.plan.line.name }}
            </p>
            <p>
              <span class="icon has-text-success"
                ><i class="fa fa-arrow-circle-up"></i></span
              >{{ day.plan.plan.start }}
            </p>
            <p>
              <span class="icon has-text-danger"
                ><i class="fa fa-arrow-circle-down"></i></span
              >{{ day.plan.plan.end }}
            </p>
          </div>
          <div v-if="day.otplan" class="column is-6">
            <h1 class="subtitle is-5">Planned Overtime</h1>
            <p>
              {{ day.otplan.plan.shift.name }} |
              {{ day.otplan.plan.hours }} Hours |
              {{ day.otplan.plan.line.name }}
            </p>
            <p>
              <span class="icon has-text-success"
                ><i class="fa fa-arrow-circle-up"></i></span
              >{{ day.otplan.plan.start }}
            </p>
            <p>
              <span class="icon has-text-danger"
                ><i class="fa fa-arrow-circle-down"></i></span
              >{{ day.otplan.plan.end }}
            </p>
          </div>
        </div>
        <h1 class="title is-5 has=background-info-light">
          Fingerprint Records
        </h1>
        <div v-if="day.signs" class="container columns is-multiline">
          <div class="column">
            <h1 class="subtitle is-5">Probable Signs</h1>
            <p v-for="sign in probable_signs" :key="sign.id">
              <span
                class="icon"
                :class="
                  sign.status == 'Check-In'
                    ? 'has-text-success'
                    : 'has-text-danger'
                "
              >
                <i
                  class="fa"
                  :class="
                    sign.status == 'Check-In'
                      ? 'fa-arrow-circle-up'
                      : 'fa-arrow-circle-down'
                  "
                ></i>
              </span>
              {{ sign.time }}
            </p>
          </div>
          <div class="column">
            <h1 class="subtitle is-5">Considred Signs</h1>
            <p v-for="sign in day.signs" :key="sign.id">
              <span
                class="icon"
                :class="
                  sign.type == 'In' ? 'has-text-success' : 'has-text-danger'
                "
              >
                <i
                  class="fa"
                  :class="
                    sign.type == 'In'
                      ? 'fa-arrow-circle-up'
                      : 'fa-arrow-circle-down'
                  "
                ></i>
              </span>
              {{ sign.log.time }}
            </p>
          </div>
        </div>

        
        <!-- <h1
          class="title is-5 has=background-info-light"
          style="padding-top: 15px"
        >
          Calculations
        </h1>
        <div class="container columns">
          <div
            v-if="day.shift"
            class="column is-6"
          >
          <h1
          class="subtitle  is-5"
        >
          Normal Shift
        </h1>
            <article class="message is-info">
              <div class="message-body columns">
                <div class="column is-1">{{ day.plan.plan.shift.name }}</div>
                <div class="column is-3">{{ day.plan.plan.shift.hours }} H.</div>
                <div class="column">{{ day.otplan.plan.line.name }}</div>
              </div>
            </article>
          </div>
          <div
            v-if="day.otplan"
            class="column is-6"
          >
          <h1
          class="subtitle  is-5"        >
          Overtime
        </h1>
          <article class="message is-success">
              <div class="message-body columns">
                <div class="column is-1">{{ day.otplan.plan.shift.name }}</div>
                <div class="column is-3">{{ day.otplan.plan.hours }} H.</div>
                <div class="column">{{ day.otplan.plan.line.name }}</div>
              </div>
            </article>
          </div>
        </div> -->
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success">Save changes</button>
        <button class="button" @click="close">Close</button>
      </footer>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      day: null,
      probable_signs: {},
    };
  },
  methods: {
    close() {
      this.day = null;
      this.probable_signs = {};
    },
    getProbableSings(id) {
      axios.get("./dayattendance/probable_signs/" + id).then(({ data }) => {
        this.probable_signs = data;
      });
    },
  },
  computed: {
    signs(){
      if(this.probable_signs){
       return this.probable_signs.map((sign)=>{
         return {
           statue:sign.status,
           time:sign.time,
           in: this.computedIn[0].log.time==sign.time?true:false,
           out: this.computedOut[0].log.time==sign.time?true:false
   
         }
        })
      }else{return {};}
    },
    computedIn(){
      
         return  this.day.signs.filter((sign)=>{
            return sign.type=='In';
          })
       
    },
    computedOut(){

           return this.day.signs.filter((sign)=>{
            return sign.type=='Out';
          })

    },
    pre(){
      if(this.day){
      if(this.day.otplan && this.day.plan){
        if(this.day.otplan.plan.end==this.day.plan.plan.start){
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    }
    },
    isCalled() {
      return !this.day ? false : true;
    },
    plans() {
      if (this.day.plan && this.day.otplan) {
        if (this.day.plan.plan.shift.end == this.day.otplan.plan.shift.start) {
          return [
            { type: "Shift", Plan: this.day.plan },
            { type: "Overtime", plan: this.day.otplan },
          ];
        }else{
          return [
            { type: "Overtime", plan: this.day.otplan },
            { type: "Shift", Plan: this.day.plan },
            
          ];
        }
      } else if (!this.day.plan && this.day.otplan) {
        return { type: "Overtime", plan: this.day.otplan };
      } else if (this.day.plan && !this.day.otplan) {
        return { type: "Plan", plan: this.day.plan };
      }
    },
  },
  created() {
    Event.$on("call-card", (data) => {
      this.day = data;
      this.getProbableSings(data.id);
    });
  },
};
</script>