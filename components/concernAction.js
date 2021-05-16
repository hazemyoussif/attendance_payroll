<template>
<div v-if="isCalled" class="modal" :class="{ 'is-active': isCalled }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Concern# {{ concern.id }}</p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <!-- Content ... -->
        <div class="container">
<div class="field column">
        <label class="label">Action</label>
        <div class="select is-fullwidth">
          <select class="" :disabled="posting" v-model="action">
            <option selected disabled>Select Action</option>
            <option value="adjust">Adjust</option>
            <option value="reject">Reject</option>
          </select>
        </div>
      </div>
      <div class="columns">
      <div class="field column">
        <label class="label">Work</label>
        <div class="control">
          <input
            class="input"
            :disabled="posting || !filter || action=='reject'"
            v-model="work"
            type="text"
          />
        </div>
      </div>
      <div class="field column">
        <label class="label">OT</label>
        <div class="control">
          <input
            class="input"
            :disabled="posting || !action || action=='reject'"
            v-model="overtime"
            type="text"
          />
        </div>
      </div>
      <div class="field column">
        <label class="label">Deduction</label>
        <div class="control">
          <input
            class="input"
            :disabled="posting || !action || action=='reject'"
            v-model="deduction"
            type="text"
          />
        </div>
      </div>
      </div>
      <div class="field column">
        <label class="label">Comment</label>
        <div class="control">
          <input
            class="input"
            :disabled="posting || !action "
            v-model="comment"
            type="textarea"
          />
        </div>
      </div>
        </div>
        <table class="table is-fullwidth" v-if="concern.action">
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
                    <td>{{concern.action.action}}</td>
                    <td>{{concern.action.w}}</td>
                    <td>{{concern.action.o}}</td>
                    <td>{{concern.action.v}}</td>
                    <td>{{concern.action.comment}}</td>
                </tr>
            </tbody>
        </table>
      </section>
      <footer class="modal-card-foot">
        <button :disabled="posting" class="button is-success" @click="submit">
          Submit Action
        </button>
        <button class="button" @click="close">Close</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            concern:null,
            isCalled:false,
            work:null,
            overtime:null,
            deduction:null,
            filter:null,
            comment:'',
            posting:false,
            action:null

            
        }
    },
    created(){
        Event.$on('call-action',(data)=>{
            console.log(data);
            this.concern=data;
            this.isCalled=true;
        })
    },
    computed: {
        isReady(){
            if(this.action && this.action!='reject'){return true}else{return false}
        },
        iscalled(){
            return this.concern ? true : false
        }
    },
    methods:{
        close(){
            this.isCalled=false;
            this.concern=null;
        },
        submit(){
            this.posting=true;
           axios.post('./dayattendance/concern/action',{
               concern_id:this.concern.id,
               action:this.action,
               w:this.work,
               o:this.overtime,
               v:this.deduction,
               comment:this.comment
           })
           .then(({data})=>{
               this.concern.action=data.action;
               this.posting=false;
               Event.$emit('concern-action',data);
           })
           .catch(excption =>{
               alert('Failed To Update');
               this.posting=false;
           });
        }
    }
}
</script>