<template>
<div id='bd'>
    <router-link to='/detail'>t detail page</router-link>
    <router-view></router-view>
</div>
</template>
<script>
    import index from './views/index.vue';
    export default {
        components: {
            index
        }
    }
</script>