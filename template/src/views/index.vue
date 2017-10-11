<template>
    <div>
        <div>
            这是{{page}}页面
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
    // import css from '../style.css';
    export default {
        data: function () {
            return {
                page: 'index'
            }
        }
    }
</script>
<style lang=less>

body {
    div {
            color: yellow;
            animation: test 1s;
            height: 500px;
            width: 500px;
            background: url('../assets/youliao.png');
    }
}
@keyframes test {
    to {
        transform: translate(100px);
    }
}
</style>