<template>
  <div class="columns" v-if="ready">
    <div class="column">
      <button class="button is-danger is-fullwidth">
          <download-excel  :data="table_violations" name="deductions">
        Download Deductions
      </download-excel>
      </button>
      <br>
      <table class="table has-background-danger-light payroll-table">
        <thead>
          <tr>
            <th>SEEL</th>
            <th>Date</th>
            <th>Deduction</th>
            <th>Code</th>
          </tr>
        </thead>
        <tbody class="payroll-table-tbody">
          <tr v-for="violation in table_violations" :key="violation.id">
            <td v-text="violation.seel_code"></td>
            <td v-text="violation.date"></td>
            <td v-text="violation.hours"></td>
            <td v-text="violation.code"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="column">
        <button class="button is-info is-fullwidth">
            <download-excel  :data="overtimes" name="overtime">
        Download Overtime
      </download-excel>
      </button>
      <table class="table has-background-info-light payroll-table">
        <thead>
          <tr>
            <th>SEEL</th>
            <th>Date</th>
            <th>Hours</th>
            <th>Factor</th>
          </tr>
        </thead>
        <tbody class="payroll-table-tbody">
          <tr v-for="overtime in overtimes" :key="overtime.id">
            <td v-text="overtime.seel_code"></td>
            <td v-text="overtime.date"></td>
            <td v-text="overtime.hours"></td>
            <td v-text="overtime.factor"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="column">
        <button class="button is-warning is-fullwidth">
            <download-excel  :data="table_leaves" name="leaves">
        Download Leaves
      </download-excel>
        </button>
      <table class="table has-background-warning-light payroll-table">
        <thead>
          <tr>
            <th>SEEL</th>
            <th>Date</th>
            <th>Hours</th>
            <th>Code</th>
          </tr>
        </thead>
        <tbody class="payroll-table-tbody">
          <tr v-for="leave in table_leaves" :key="leave.id">
            <td v-text="leave.seel_code"></td>
            <td v-text="leave.date"></td>
            <td v-text="leave.hours"></td>
            <td v-text="leave.code"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="column">
        <button class="button is-danger is-fullwidth">
            <download-excel  :data="disciplinaries" name="disciplinary">
        Download Disciplinaries
      </download-excel>
        </button>
      <table class="table has-background-danger-light payroll-table">
        <thead>
          <tr>
            <th>SEEL</th>
            <th>Date</th>
            <th>Hours</th>
            <th>Code</th>
          </tr>
        </thead>
        <tbody class="payroll-table-tbody">
          <tr v-for="disc in disciplinaries" :key="disc.id">
            <td v-text="disc.seel_code"></td>
            <td v-text="disc.date"></td>
            <td v-text="disc.hours"></td>
            <td v-text="disc.code"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      violations: {},
      overtimes: {},
      leaves: {},
      disciplinaries: {},
      error: "",
      ready: false,
    };
  },
  created() {
    Event.$on("payroll-call", (data) => {
      axios
        .get("./dayattendance/getpayroll/" + data.start + "/" + data.end)
        .then((response) => {
          this.violations = response.data.violations;
          this.overtimes = response.data.overtimes;
          this.leaves = response.data.leaves;
          this.disciplinaries = response.data.disciplinaries;
          this.ready = true;
        })
        .catch((ex) => {
          this.error = "Faild";
        });
    });

    Event.$on("payroll-cancel", () => {
      this.ready = false;
    });
  },
  computed: {
    table_violations() {
      return this.violations.map((violation) => {
        return {
          seel_code: violation.day.seel_code,
          date: violation.day.date,
          hours: violation.hours,
          code: violation.type.code,
        };
      });
    },
    table_leaves() {
      return this.leaves.map((leave) => {
        return {
          seel_code: leave.day.seel_code,
          date: leave.day.date,
          hours: leave.hours,
          code: leave.code,
        };
      });
    },
  },
};
</script>