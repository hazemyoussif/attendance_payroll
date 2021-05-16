<template>
  <div>
    <div v-if="isMounted" class="columns box" style="padding: 20px !important">
      <div class="field column is-2">
        <label class="label">Start</label>
        <div class="control">
          <input
            class="input"
            :disabled="posting"
            v-model="start"
            type="date"
          />
        </div>
      </div>
      <div class="field column is-2">
        <label class="label">End</label>
        <div class="control">
          <input class="input" :disabled="posting" v-model="end" type="date" />
        </div>
      </div>
      <div class="field column">
        <label class="label">Employee(s)</label>
        <div class="select is-fullwidth">
          <select class="" :disabled="posting" v-model="filter">
            <option selected value="all">Select All</option>
            <option
              v-for="member in fullTeam"
              :key="member.id"
              :value="member.id"
              v-text="member.seel_code + ' | ' + member.name"
            ></option>
          </select>
        </div>
      </div>
      <div class="field column is-2">
        <label class="label">&nbsp;</label>
        <button
          :disabled="!isReady"
          @click="getDays"
          class="button is-fullwidth"
        >
          Check
        </button>
      </div>
      <div class="field column is-2">
        <label class="label">&nbsp;</label>
        <button
          :disabled="!isReady"
          @click="getPayroll"
          class="button is-fullwidth"
        >
          payroll
        </button>
      </div>
    </div>
    <payroll></payroll>
    <div v-if="dataReady" class="is-fullwidth">
      <download-excel class="button is-succes" :data="days"> Download Data </download-excel>
      <table class="table is-fullwidth">
        <thead>
          <tr>
            <!-- <th><abbr title="Day ID">#</abbr></th> -->
            <th><abbr title="">SEEL</abbr></th>
            <th><abbr title="">Section</abbr></th>
            <th><abbr title="Date">D</abbr></th>
            <th><abbr title="Status">S</abbr></th>
            <th><abbr title="Leave">L</abbr></th>
            <th><abbr title="Leave Type">L. Type</abbr></th>
            <th><abbr title="Worked">Worked</abbr></th>
            <th><abbr title="Overtime">OT</abbr></th>
            <th><abbr title="OT. Type">OT. Type</abbr></th>
            <th><abbr title="Violations">V</abbr></th>
            <th><abbr title="Violations Type">V. Type</abbr></th>
            <th><abbr title="Signs">Signs</abbr></th>
            <th><abbr title="Actions">Actions</abbr></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="day in days" :key="day.id">
            <!-- <th v-text="day.id" @click="callCard(day.id)"></th> -->
            <td v-text="day.seel_code"></td>
            <td v-text="day.section"></td>
            <td v-text="day.date" @click="callCard(day.id)"></td>
            <td v-text="day.status"></td>
            <td
              v-text="day.leave"
              class="has-background-warning-light has-text-warning"
            ></td>
            <td
              v-text="day.leave_type"
              class="has-background-warning-light has-text-warning"
            ></td>
            <td
              v-text="day.worked"
              class="has-background-link-light has-text-link"
            ></td>
            <td
              v-text="day.overtime"
              class="has-background-success-light has-text-success"
            ></td>
            <td
              v-text="day.overtime_type"
              class="has-background-success-light has-text-success"
            ></td>
            <!-- <td class="has-background-danger-light has-text-danger">
              <p
                v-for="violation in day.violations"
                :key="violation.id"
                v-text="violation.hours"
              ></p>
            </td>
            <td class="has-background-danger-light has-text-danger">
              <p
                v-for="violation in day.violations"
                :key="violation.id"
                v-text="violation.type.name"
              ></p>
            </td> -->
            <td class="has-background-danger-light has-text-danger">
              <p v-text="day.violations"></p>
            </td>
            <td class="has-background-danger-light has-text-danger">
              <p v-text="day.violation_type"></p>
            </td>
            <td>
              <p>
                <span class="icon has-text-success">
                  <i class="fa fa-arrow-circle-up"></i>
                </span>
                <span>
                  {{ day.in }}
                </span>
              </p>
              <p>
                <span class="icon has-text-danger">
                  <i class="fa fa-arrow-circle-down"></i>
                </span>
                {{ day.out }}
              </p>
            </td>
            <td>
              
              <p>
                <button
                  v-if="power"
                  :disabled="posting"
                  @click="processDay(day.id)"
                  class="button"
                  title="Refresh"
                >
                  <span class="icon is-small">
                    <i class="fa fa-refresh"></i>
                  </span>
                </button>
                <button
                  :disabled="posting"
                  @click="callConcern(day.id)"
                  class="button"
                  title="Add Concern"
                  :class="{'is-warning':day.concern}"
                >
                  <span class="icon is-small">
                    <i class="fa fa-exclamation"></i>
                  </span>
                </button>
                
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <day-concern></day-concern>
  </div>
</template>

<script>

import Payroll from "./payroll.vue";
import dayConcern from "./dayConcern.vue";
export default {
  components: {  Payroll,dayConcern },
  data() {
    return {
      start: "",
      end: "",
      filter: "",
      days: {},
      posting: false,
      team: {},
      isMounted: false,
      dataReady: false,
      pureDays: {},
      concerntypes:{},
      power:null
    };
  },
  mounted() {
    axios
      .get("./dayattendance/team")
      .then((response) => {
        this.team = response.data.return;
        this.power = response.data.power;
        this.isMounted = true;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    callCard(dayID) {
      this.pureDays.forEach(function (pureDay) {
        if (dayID == pureDay.id) {
          Event.$emit("call-card", pureDay);
        }
      });
    },
    callConcern(dayID) {
      this.pureDays.forEach( (pureDay)=> {
        if (dayID == pureDay.id) {
          console.log(pureDay);
          console.log(this.concerntypes);
          Event.$emit("call-concern", {day:pureDay,concerntypes:this.concerntypes});
        }
      });
    },
    getDays() {
        Event.$emit('payroll-cancel');
      this.posting = true;
      axios
        .post("./dayattendance/get", {
          start: this.start,
          end: this.end,
          filter: this.filter,
        })
        .then((response) => {
          this.days = response.data.days;
          this.pureDays = response.data.purdays;
          this.concerntypes = response.data.concerntypes;
          
          this.posting = false;
          this.dataReady = true;
        })
        .catch((error) => {
          console.log(error);
          this.posting = false;
        });
    },
    getPayroll(){
        this.dataReady=false;
        Event.$emit('payroll-call',({start:this.start,end:this.end}));
    },
    processDay(id) {
      this.posting = true;
      axios
        .post("./dayattendance/process", {
          id: id,
        })
        .then((response) => {
          this.posting = false;
          console.log(response.data);
          this.days.forEach(function (item, index, arr) {
            if (response.data.id == item.id) {
              console.log(item.id);
              arr[index] = response.data;
            }
          });
        })
        .catch((error) => {
          console.log(error);
          this.posting = false;
        });
    },
  },
  created(){
    Event.$on('concern-submitted',(data)=>{
      console.log(this.days);
      this.days.forEach(function (day,index,arr){
        if(day.id==data.id){
          arr[index].concern=true;
        }
      });

      this.pureDays.forEach(function (day,index,arr){
        if(day.id==data.id){
          arr[index]=data;
        }
      });
    })
  },
  computed: {
    isReady() {
      if (
        this.start != "" &&
        this.end != "" &&
        this.filter != "" &&
        !this.posting
      ) {
        return true;
      } else {
        return false;
      }
    },
    fullTeam(){
        return this.team.map((member)=>{
            return {
                id:member.id,
                seel_code:member.seel_code?member.seel_code:member.lastterm[0].seel_code,
                name:member.name
            };
        })
    },
    computedDays() {
      return this.pureDays.map((day) => {
        if (day.violations) {
        }
        return {
          id: day.id,
          status: day.status,
          seel_code: day.seel_code,
          name: day.user.name,
          date: day.date,
          section: day.user.unit.section.name,
          worked: day.shift ? day.shift.hours : null,
          overtime: day.overtime ? day.overtime.hours : null,
          overtime_type: day.overtime ? day.overtime.type.name : null,
          violations: day.violations ? day.violations : null,
          signs: day.sings ? day.signs : null,
          leave: day.leave ? day.leave.hours : null,
          leave_type: day.leave ? day.leave.name : null,
          //in: day?.signs[0] ? day.signs[0].log.time:null
        };
      });
    },
  },
};
</script>