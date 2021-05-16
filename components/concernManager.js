<template>
  <div v-if="days" class="table-container">
      <button class="button is-link ">
          <download-excel  :data="displayArray" name="concerns">
        Download Concerns
      </download-excel>
      </button>
      <br>
    <table class="table">
      <thead>
        <tr>
          <th>Day</th>
          <th>Status</th>
          <th>Concern Type</th>
          <th>Concern</th>
          <th>By</th>
          <th>For</th>
          <th>Section</th>
          <th>W</th>

          <th>OT</th>
          <th>OT Type</th>
          <th>L</th>
          <th>L Type</th>
          <th>V</th>
          <th>V Type</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="concern in displayArray" :key="concern.day_id">
          <td v-text="concern.date" @click="callCard(concern.day_id)"></td>
          <td v-text="concern.status"></td>
          <td v-text="concern.concern_type" @click="callAction(concern.concern)" :class="{'has-background-info-light':concern.concern.action}"></td>
          <td v-text="concern.concern_comment"></td>
          <td :title="concern.concern_by">
            {{ concern.concern_by | firstName }}
          </td>
          <td :title="concern.concern_for">
            {{ concern.concern_for | firstName }}
          </td>
          <td v-text="concern.section"></td>
          <td v-text="concern.shift" :class="[{'has-background-success-light':concern.shift},'has-success']"></td>
          <td v-text="concern.overtime_val" :class="[{'has-background-info-light':concern.overtime_val},'has-success']"></td>
          <td v-text="concern.overtime_type" :class="[{'has-background-info-light':concern.overtime_type},'has-success']"></td>
          <td v-text="concern.leave" :class="[{'has-background-warning-light':concern.leave},'has-warning']"></td>
          <td v-text="concern.leave_type" :class="[{'has-background-warning-light':concern.leave},'has-warning']"></td>
          <td v-text="concern.violation_val" :class="[{'has-background-danger-light':concern.violation_val},'has-danger']"></td>
          <td v-text="concern.violation_text" :class="[{'has-background-danger-light':concern.violation_val},'has-danger']"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      power: false,
      days: null,
      filter: null,
    };
  },
  created() {
    axios
      .get("./dayattendance/getconcerns")
      .then(({ data }) => {
        this.days = data.days;
        this.power = data.power;
      })
      .catch((exception) => {
        console.log(exception);
        alert("Error Geeting Concerns");
      });

      Event.$on('concern-action',(data)=>{
      console.log(this.days);
      this.days.forEach(function (day,index,arr){
        if(day.id==data.day_id){
          arr[index].concern.action=data.action;
        }
      });

    })
  },
  filters: {
    firstName(data) {
      return data.split(" ")[0];
    },
  },
  computed: {
    concerns() {
      if (!this.days) {
        return null;
      }
      return this.days.map((day) => {
        return {
          day_id: day.id,
          concern:day.concern,
          concern_by_seel_code: day.seel_code,
          concern_for_seel_code: day.user.seel_code,
          date: day.date,
          action:day.concern?true:false,
          status: day.status,
          shift: day.shift ? day.shift.hours : "",
          overtime_val: day.overtime ? day.overtime.hours : "",
          overtime_type: day.overtime ? day.overtime.type.name : "",
          violation_val: day.violations
            ? this.getViolations(day.violations).val
            : null,
          violation_text: day.violations
            ? this.getViolations(day.violations).text
            : null,
          concern_type: day.concern.type.name,
          concern_comment: day.concern.comment,
          concern_by: day.concern.by.name,
          concern_for: day.user.name,
          section: day.user.unit.section.name,
          leave: day.leave ? day.leave.hours : null,
          leave_type: day.leave ? day.leave.name : null,
          //in_time:day.signs?this.getIn(day.signs)[1].in_time:"",
          //out_time:day.signs?this.getSigns(day.signs).out_time:""
        };
      });
    },
    displayArray() {
      if (!this.filter) {
        return this.concerns;
      }
    },
  },
  methods: {
      callAction(concern){
          Event.$emit('call-action',concern)
      },
      callCard(dayID) {
      this.days.forEach(function (pureDay) {
        if (dayID == pureDay.id) {
          Event.$emit("call-card", pureDay);
        }
      });
    },
    getViolations(violations) {
      let val, text;
      val = 0;
      text = "";
      violations.forEach((element) => {
        val += element.hours;
        text += element.type.name + " ";
      });
      if (val == 0) {
        val = null;
      }
      return { val: val, text: text };
    },
    getIn(signs) {
      return signs.filter((element) => {
        return (element.type = "In");
      });
    },
  },
};
</script>