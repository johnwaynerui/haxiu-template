import index from './views/index.vue';
// import async_detail_wrapper from './views/async_detail_wrapper.vue';
export default [{
        path: '/',
        component: index,
        children: [{
            path: 'detail',
            component: (resolve, reject) => {
                import(/* webpackChunkName: "async" */'./views/async_detail.vue')
                .then((async_component) => {
                    resolve(async_component);
                });
            }
        }]
    }]
