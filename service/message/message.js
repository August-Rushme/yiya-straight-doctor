import http from '../request/index.js';

const messageList = {
	getMessageList: '/message/getRecordByUserId',
	searchMessage: '/message/getMessageByKey',
	getMessage: '/message/getMessageList',
	remarkIsRead: '/message/update',
	hasMessag: '/message/getMessageByReceiverId'
}


export function getMessageList(data){
	return http.post(messageList.getMessageList,{
		...data
	})
}

export function searchMessage(data){
	return http.post(messageList.searchMessage,{
		...data
	})
}

export function getMessage(data){
	return  http.post(messageList.getMessage, {
		...data
	})
}

export function remarkIsRead(data){
	return  http.put(messageList.remarkIsRead, {
		...data
	})
}

export function hasMessage(id){
	return http.get(messageList.hasMessag + '/' + id);
}