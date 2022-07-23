import http from '../request/index.js';

const userApi = {
	getUserById: '/user',
	getMedicalDetail: '/medicalRecord'
}

export function getUserById(id){
  return http.get(userApi.getUserById +`/${id}`)	
}

export function getMedicalDetail(id) {
	return http.get(userApi.getMedicalDetail + '/' + id);
}