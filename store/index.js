import Vue from 'vue';
import Vuex from 'vuex';
import http from '../service/request/index.js';
import message from '../service/request/message.js';
import {
  getScheduleList
} from '../service/calendar/http-calendar';
import {
  getUserById
} from '../service/user/user.js';
import {
  messageSave
} from '../service/chat/chat.js'
import {
  getMessageList,
  searchMessage,
  getMessage,
  remarkIsRead
} from '../service/message/message.js'
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    scheduleListState: [],
    forcedLogin: false, //是否强制登录
    hasLogin: false,
  },
  mutations: {
    changeScheduleList(state, scheduleList) {
      state.scheduleListState = scheduleList
    }
  },
  actions: {
    async getScheduleListAction({
      commit,
      state
    }, payload) {
      const res = await getScheduleList(payload)
      if (!res.code == 200) {
        return uni.$u.toast('请求失败');
      }
      commit('changeScheduleList', res.data)
      console.log(res.data)
      return res.data
    },
    //用户相关请求
    async getUserByIdAction({
      commit
    }, payload) {
      const res = await getUserById(payload)
      if (!res.code == 200) {
        return uni.$u.toast('请求失败');
      }
      return res.user
    },
    //聊天相关请求
    async messageSaveAction({
      commit
    }, payload) {
      const res = await messageSave(payload);
      if (!res.code == 200) {
        return uni.$u.toast('请求失败');
      }
      return res.data
    },

    //我的消息 
    async getMessageListAction({
      commit
    }, payload) {
      const res = await getMessageList(payload);
      if (!res.code == 200) {
        return uni.$u.toast('请求失败');
      }
      return res.data
    },
    async searchMessageAction({
      commit
    }, payload) {
      const res = await searchMessage(payload);
      if (!res.code == 200) {
        return uni.$u.toast('请求失败');
      }
      return res.data
    },
    async getMessageAction({
      commit
    }, payload) {
      const res = await getMessage(payload);
      if (!res.code == 200) {
        return uni.$u.toast('请求失败');
      }
      return res.data
    },
    async remarkIsReadAction({
      commit
    }, payload) {
      const res = await remarkIsRead(payload);
      if (!res.code == 200) {
        return uni.$u.toast('请求失败');
      }
      return res.data
    },
  },


})
export default store
