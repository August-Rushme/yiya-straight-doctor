import http from '../request/index.js';

const chatApi = {
    messageSave: '/message/save'
}

export function messageSave(data){
  return http.post(chatApi.messageSave,{
	  ...data
  })	
}
