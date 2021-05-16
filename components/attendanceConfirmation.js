<template>
<div>
    <div v-if="monitor">

    </div>
    <div v-else>
        <h1>Kindly wait a moment for loading,...</h1>
    </div>
</div>
</template>

<script>
export default {
    data(){
        return {
            monitor:null
        }
    },
    created(){
        alert('attendance');
    },
    mounted(){
        axios.get('../attendance/monitor/1')
        .then(({data})=>this.monitor=data)
        .catch(ex=>{alert('faild')})
    }
}
</script>