import Vue from 'vue';
import Vuex from 'vuex';
import http from '../service/request/index.js';
import message from '../service/request/message.js';
import {
  getScheduleList
} from '../service/calendar/http-calendar'

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    scheduleListState: []
  },
  mutations: {
    changeScheduleList(state, scheduleList) {
      state.scheduleListState = scheduleList
    }
  },
  actions: {
    async getScheduleListAction({
      commit,state
    }, payload) {
      const res = await getScheduleList(payload)
      if (!res.code == 200) {
        return uni.$u.toast('请求失败');
      }
      commit('changeScheduleList', res.data)
      console.log(res.data)
      return res.data
    }
  },


})
export default store
