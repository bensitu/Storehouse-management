// Vuex核心store
import Vue from 'vue'
// 引入Vuex
import Vuex from 'vuex'
// 使用Vuex插件
Vue.use(Vuex)

// 准备actions - 响应式组件中的动作
const actions = {}

// 准备mutations - 操作数据state
const mutations = {}

//准备state - 存储数据
const state = {}

// 创建并导出store
export default new Vuex.Store({
    actions,
    mutations,
    state,
})

