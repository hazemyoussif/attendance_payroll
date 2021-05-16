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
        <div v-if="!submitted" class="container">
          <div class="field">
            <label class="label">Concern Type</label>
            <div class="select is-fullwidth">
              <select class="" :disabled="posting" v-model="type_id">
                <option selected disabled="true" value="all">
                  Select Case
                </option>
                <option
                  v-for="type in concerntypes"
                  :key="type.id"
                  :value="type.id"
                  v-text="type.name"
                ></option>
              </select>
            </div>
          </div>
          <div class="field">
            <label class="label">Comment</label>
            <div class="control">
              <input
                class="input"
                :disabled="posting"
                v-model="comment"
                type="textarea"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <h1 class="title">Concern is Submitted</h1>
          <h3><strong>Type :</strong> {{ day.concern.type.name }}</h3>
          <h3><strong>Comment :</strong> {{ day.concern.comment }}</h3>
          <h3><strong>By :</strong> {{ day.concern.by.name }}</h3>
          <h3><strong>at :</strong> {{ day.concern.created_at }}</h3>


          <br>
          <h1 class="title">HR Reply</h1>
          <table class="table is-fullwidth" v-if="day.concern.action">
            <thead>
                <tr>
                    <th>Action</th>
                    <th>Work</th>
                    <th>Overtme</th>
                    <th>Deduction</th>
                    <th>comment</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{day.concern.action.action}}</td>
                    <td>{{day.concern.action.w}}</td>
                    <td>{{day.concern.action.o}}</td>
                    <td>{{day.concern.action.v}}</td>
                    <td>{{day.concern.action.comment}}</td>
                </tr>
            </tbody>
        </table>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button :disabled="posting || !isReady || submitted" class="button is-success" @click="submit">
          Submit Concern
        </button>
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
      type_id: "",
      concerntypes: {},
      posting: false,
      comment: "",
    };
  },
  methods: {
    close() {
      this.day = null;
    },
    submit() {
      this.posting = true;
      axios
        .post("./dayattendance/concern", {
          day_id: this.day.id,
          type_id: this.type_id,
          comment: this.comment,
        })
        .then((response) => {
          this.day = response.data;
          console.log(response.data);
          Event.$emit("concern-submitted", response.data);
          this.posting = false;
          this.comment='';
          this.type_id='';
        })
        .catch((exception) => {
          this.posting = false;
        });
    },
  },
  computed: {
    isCalled() {
      return !this.day ? false : true;
    },
    submitted() {
      if (this.day.concern) {
        return true;
      } else {
        return false;
      }
    },
    isReady() {
      if (this.type_id && this.comment) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    Event.$on("call-concern", (data) => {
      console.log(data);
      this.day = data.day;
      this.concerntypes = data.concerntypes;
    });
  },
};
</script>