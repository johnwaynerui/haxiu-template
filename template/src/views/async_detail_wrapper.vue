<template>
    
</template>
<script>
    export default (resolve, reject) => {
        import('./async_detail.vue').then(() => {
            resolve();
        });
    }
</script>