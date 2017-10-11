<template>
    <div id="async-detail-wrapper">
        我是异步的详情页面
        <router-link to='/'>
            点我回到首页
        </router-link>
    </div>
</template>
<script>
    export default {
        data: () => {
            return {

            }
        }
    }
</script>  
<style lang="less">
    #async-detail-wrapper {
        color: red;
    }
</style>