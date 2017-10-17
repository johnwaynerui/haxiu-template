<template>
    <div class="header">
        <img src="../assets/hao123_logo.png" alt="">
        <timer></timer>
        {{{{vue-js}}}}
        <p>我是计数器{{$store.state.global.globalCounter}}</p>
        {{{{/vue-js}}}}
    </div>
</template>
<script>
import timer from './timer';
import store from '../store';
    export default {
        store,
        components: {
            timer
        }
    }
</script>
<style lang=less scoped>
div {
    position: relative;
    p {
        margin: 0px;
        font-size: 14px;
    }
}
</style>