// Vuex核心store
import Vue from 'vue'
// 引入Vuex
import Vuex from 'vuex'
// 使用Vuex插件
Vue.use(Vuex)

// 准备actions - 响应式组件中的动作
const actions = {
    getNames(context, value) {
        //console.log();
        context.commit('GetNames', value)
    },
    saveStockId(context, value) {
        context.commit('SaveStockId', value)
    }
}

// 准备mutations - 操作数据state
const mutations = {
    GetNames(state, value) {
        state.unit_name = value.map(item => item.name)
        // console.log(state, value);
    },
    SaveStockId(state, value) {
        state.stock_id = value
        console.log(state, value);
    }
}

//准备state - 存储数据
const state = {
    unit_name: '',
    code: '',
    stock_id: '',
    employee_id: '',
}

// 创建并导出store
export default new Vuex.Store({
    actions,
    mutations,
    state,
})

