export default {
    state: {
        globalCounter: 0
    },
    mutations: {
        increment(state) {
            state.globalCounter++;
        }
    }
}