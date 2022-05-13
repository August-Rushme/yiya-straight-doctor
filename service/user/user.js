import http from '../request/index.js';

const userApi = {
	getUserById: '/user',
}

export function getUserById(id){
  return http.get(userApi.getUserById +`/${id}`)	
}