import index from './pages/index/index';
import list from './pages/list/index';
export default [
    {
        path: '/{{name}}',
        redirect: '/{{name}}/index'
    },
    {
        path: '/{{name}}/index',
        component: index
    },
    {
        path: '/{{name}}/detail',
        component: (resolve, reject) => {
            import(/* webpackChunkName: "async" */'./pages/detail/index')
            .then((async_component) => {
                resolve(async_component);
            })
        }
    },
    {
        path: '/{{name}}/list',
        component: list
    },
]
