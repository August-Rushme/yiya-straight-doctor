<template>
	<view class="page">
		<view class="ask d-flex j-center">
			<template v-if="!hasMore">
					<view class="tip text-center my-3">  {{title}}</view>
			</template>
			<template v-else>
				<template v-if="moreloading">
						<u-loading-icon mode="circle" text="加载中"></u-loading-icon>
				</template>
			   <template v-else>
			   	<view class="tip text-center my-3" @click="lookMoreMessage"> 查看更多历史消息</view>
			   </template>
			
			</template>
		
		</view>

		<block v-for="(item, index) in messagelist" :key="index">
			<view class="p-1 my-1" :class="item.isMe ? 'isMe' : 'isNotMe'">
				<u-avatar :size="50" :src="item.avatar"></u-avatar>
				<view class="mx-1">
					<template v-if="!item.isMe">
						<view class="name">{{ item.nickName }}</view>
					</template>
					<template v-if="item.type === 'message'">
						<view class="d-flex" :class="item.isMe ? 'j-end': ''">
						<view class="text">{{ item.text }}</view>
						</view>
					
					</template>
					<template v-else-if="item.type === 'image'">
						<view class="image"><image @tap="preview(index)" :src="item.url" mode="widthFix"></image></view>
					</template>
					<template v-else-if="item.type === 'audio'">
						<template v-if="item.tmpId === loadingIndex && item.isMe ? isloading[loadingIndex] : false">
							<u-loading-icon mode="circle" :text="progress"></u-loading-icon>
						</template>
						<template v-else>
							<view class="video"><video :src="item.url" v-if="!!item.url" controls show-progress></video></view>
						</template>
					</template>
					<template v-if="item.isMe">
						<view class="d-flex j-end mt-1">
							<view class="isRead">{{ item.isRead ? '已读' : '未读' }}</view>
						</view>
					</template>
				</view>
			</view>
		</block>

		<view class="block"></view>
		<view class="sendInput">
			<u-input placeholder="请描述您的问题或症状" border="surround" v-model="message">
				<template slot="suffix">
					<view class="d-flex a-center">
						<view class="mr-1"><uni-icons type="image" size="30" @tap="chooseImage"></uni-icons></view>
						<view class="mr-1"><uni-icons type="videocam" size="30" @tap="chooseVideo"></uni-icons></view>
						<u-button shape="circle" icon="arrow-upward" size="small" @tap="sendMessage"></u-button>
					</view>
				</template>
			</u-input>
		</view>
	</view>
</template>


<script>
import GoEasy from 'goeasy';
import { mapActions } from 'vuex';
export default {
	data() {
		return {
			pageInfo: {
				pageSize: 15,
				pageNum: 1
			},
			moreloading: false, 
			allMessage: [],
			hasMore: false,
			first: true,
			loadingIndex: 0,
			messageId: [],
			isloading: [true],
			progress: '0%',
			title: '正在连接该医生',
			messagelist: [],
			receiverId: '',
			receiverAvatar: '',
			receiverName: '',
			message: ''
		};
	},
	async onLoad(options) {
	     uni.showLoading({
	     	title: '加载中',
	     	mask: false
	     });
		this.receiverId = options.id;
		const receiverInfo = await this.getUserByIdAction(parseInt(options.id));
		const messagelist = await this.getMessageAction({
			fromId: parseInt(uni.getStorageSync('userInfo').id),
			toId: parseInt(options.id),
			...this.pageInfo
		})
		const messageAll =  await this.getMessageAction({
			fromId: parseInt(uni.getStorageSync('userInfo').id),
			toId: parseInt(options.id),
			pageNum: 1,
			pageSize: 99999
		})
		this.hasMore = messageAll.list.length > 15 ? true : false;
		let index = 0;
		const rawList = [];
		this.allMessage = messageAll.list;
		messagelist.list.reverse().forEach(item => {
				const message = {
					    id: item.id,
						text: item.msg,
						isMe: uni.getStorageSync('userInfo').id == item.userId ?  true : false,
						isRead: item.status === 1 ? true : false,
						type: item.type,
						url: item.url,
						nickName: uni.getStorageSync('userInfo').id == item.userId ? uni.getStorageSync('userInfo').nickname : receiverInfo.nickname,
						avatar: uni.getStorageSync('userInfo').id == item.userId ? uni.getStorageSync('userInfo').photo : receiverInfo.photo
				}
				rawList.push(message)
				const greaterOneDay =  new Date() - Date.parse(item.sendDate) > 24*60*60*1000 ? true : false 
				if( item.status === 0 && uni.getStorageSync('userInfo').id != item.userId && !greaterOneDay){
			      	index ++;
				}
				
		})
      this.messagelist = rawList.slice(0,index > 10 ? rawList.length-10 : rawList.length-index);
	  	uni.hideLoading();
	  this.pageToBottom();
		this.receiverAvatar = receiverInfo.photo;
		this.receiverName = receiverInfo.nickname;
		const goeasy = GoEasy.getInstance({
			host: 'hangzhou.goeasy.io', //若是新加坡区域：singapore.goeasy.io
			appkey: 'BC-e96694fd44c241118ac251cc61492c8d',
			allowNotification: true,
			modules: ['im'] //根据需要，传入‘pubsub’或'im’，或数组方式同时传入
		});
		goeasy.connect({
			id: uni.getStorageSync('userInfo').id, //pubsub选填，im必填，最大长度60字符
			data: {
				avatar: uni.getStorageSync('userInfo').photo,
				nickname: uni.getStorageSync('userInfo').nickname
			}, //必须是一个对象，pubsub选填，im必填，最大长度300字符，用于上下线提醒和查询在线用户列表时，扩展更多的属性
			onSuccess: function() {
				//连接成功
				console.log('GoEasy connect successfully.'); //连接成功
			},
			onFailed: function(error) {
				//连接失败
				console.log('Failed to connect GoEasy, code:' + error.code + ',error:' + error.content);
			},
			onProgress: function(attempts) {
				//连接或自动重连中
				console.log('GoEasy is connecting', attempts);
			}
		});
		this.title = '已为您连接该医生';
		this.goeasy = goeasy;
		this.im = goeasy.im;
		this.messageReceived();
	},
	onUnload() {
		this.first = true;
		this.goeasy.disconnect({
			onSuccess: function() {
				console.log('GoEasy disconnect successfully.');
			},
			onFailed: function(error) {
				console.log('Failed to disconnect GoEasy, code:' + error.code + ',error:' + error.content);
			}
		});
	},
	methods: {
		...mapActions(['getUserByIdAction','messageSaveAction','getMessageAction','remarkIsReadAction']),
		async lookMoreMessage(){
			this.moreloading = true
			const _this = this
			this.pageInfo.pageNum++;
			const moreMessagelist = await this.getMessageAction({
				fromId: parseInt(uni.getStorageSync('userInfo').id),
				toId: _this.receiverId,
				...this.pageInfo
			});
			const pageInfo = {...this.pageInfo};
			pageInfo.pageNum++;
			const moreMessagelist2 = await this.getMessageAction({
				fromId: parseInt(uni.getStorageSync('userInfo').id),
				toId: _this.receiverId,
				...pageInfo 
			});
			this.hasMore =  moreMessagelist2.list.length > 0 ? true : false;
			const rawList = [];
			moreMessagelist.list.reverse().forEach(item => {
					const message = {
						    id: item.id,
							text: item.msg,
							isMe: uni.getStorageSync('userInfo').id == item.userId ?  true : false,
							isRead: item.status === 1 ? true : false,
							type: item.type,
							url: item.url,
							nickName: uni.getStorageSync('userInfo').id == item.userId ? uni.getStorageSync('userInfo').nickname : receiverInfo.nickname,
							avatar: uni.getStorageSync('userInfo').id == item.userId ? uni.getStorageSync('userInfo').photo  : _this.receiverAvatar
					}
					rawList.push(message)
					})
			this.messagelist = [...rawList ,...this.messagelist];
			this.moreloading = false
          console.log(moreMessagelist,6666);
		},
		sendMessage() {
			if (this.message.length > 0) {
				const messageInfo = {
					avatar: uni.getStorageSync('userInfo').photo ,
					nickName: uni.getStorageSync('username'),
					isMe: true,
					text: this.message
				};
				const message = this.wsCreatMessage('message', messageInfo);
				this.wsSendMessage(message);
				this.pageToBottom();
			}
		},
		preview(index) {
			uni.previewImage({
				urls: [this.messagelist[index].url]
			});
		},
		chooseVideo() {
			const _this = this;
			let res2 = null;
			uni.chooseVideo({
				mediaType: ['image', 'video'],
				success: res => {
					res2 = res
					let hasPush = false;
					_this.loadingIndex = _this.loadingIndex + 1;
					_this.isloading.push(true);
					let message = this.im.createAudioMessage({
						file: res, //H5获得的图片file对象，Uniapp和小程序调用chooseImage，success时得到的res对象
						to: {
							type: GoEasy.IM_SCENE.PRIVATE, //私聊还是群聊，群聊为GoEasy.IM_SCENE.GROUP
							id: parseInt(_this.receiverId),
							data: { avatar: uni.getStorageSync('userInfo').photo, nickname: uni.getStorageSync('userInfo').nickname } //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
						},

						onProgress: function(event) {
							if (!hasPush) {
								_this.messagelist.push({
									type: 'audio',
									isMe: true,
									mark: res,
									tmpId: _this.loadingIndex,
									avatar: uni.getStorageSync('userInfo').photo ,
									nickName: uni.getStorageSync('userInfo').nickname ,
									text: null
								});
								_this.pageToBottom();
								hasPush = true;
							}
							_this.progress = event.progress + '%';
						} //获取上传进度
					});
					this.im.sendMessage({
						message: message,
						onSuccess: async function(message) {
							_this.isloading[_this.loadingIndex] = false;
							_this.progress = '0%';
							const index = _this.messagelist.findIndex(item => {
								return item.mark == res2;
							});
							const currentItem = _this.messagelist.find(item => {
								return item.mark == res2;
							});
							const moreMessInfo = {
								messageId: message.messageId,
								timestamp: message.timestamp,
								isRead: message.read,
								url: message.payload.url
							};
							const moreInfo = { ...currentItem, ...moreMessInfo };
							_this.messagelist.splice(index, 1, moreInfo);
							const Info = {
								msg: message.payload.text,
								status: 0,
								sendDate: uni.$u.timeFormat(new Date(), 'yyyy-mm-dd hh:MM:ss'),
								readDate: uni.$u.timeFormat(new Date(), 'yyyy-mm-dd hh:MM:ss'),
								type: message.type,
								url: message.payload.url,
								userId: uni.getStorageSync('userInfo').id,
								receiverId: _this.receiverId
							}
							const res = await _this.messageSaveAction(Info);
							_this.messageId.push(res.id);
							_this.pageToBottom();
						},
						onFailed: function(error) {
							uni.$u.toast('发送失败');
						}
					});
				}
			});
		},
		chooseImage() {
			const _this = this;
			uni.chooseImage({
				count: 3,
				sizeType: ['compressed'],
				success: res => {
					res.tempFiles.forEach(file => {
						var message = this.im.createImageMessage({
							file: file, //H5获得的图片file对象，Uniapp和小程序调用chooseImage，success时得到的res对象
							to: {
								type: GoEasy.IM_SCENE.PRIVATE, //私聊还是群聊，群聊为GoEasy.IM_SCENE.GROUP
								id: parseInt(_this.receiverId),
								data: { avatar: uni.getStorageSync('userInfo').photo, nickname: uni.getStorageSync('userInfo').nickname } //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
							},
							onProgress: function(event) {
								console.log('file uploading:', event);
							} //获取上传进度
						});
						this.im.sendMessage({
							message: message,
							onSuccess: async function(message) {
								_this.messagelist.push({
									type: message.type,
									isMe: true,
									avatar: uni.getStorageSync('userInfo').photo ,
									nickName: uni.getStorageSync('userInfo').nickname ,
									messageId: message.messageId,
									timestamp: message.timestamp,
									isRead: message.read,
									text: null,
									url: message.payload.url
								});
								const Info = {
									msg: message.payload.text,
									status: 0,
									sendDate: uni.$u.timeFormat(new Date(), 'yyyy-mm-dd hh:MM:ss'),
									readDate: uni.$u.timeFormat(new Date(), 'yyyy-mm-dd hh:MM:ss'),
									type: message.type,
									url: message.payload.url,
									userId: uni.getStorageSync('userInfo').id,
									receiverId: _this.receiverId
								}
								const res = await _this.messageSaveAction(Info);
								_this.messageId.push(res.id);
								_this.pageToBottom();
							},
							onFailed: function(error) {
								//发送失败
								uni.$u.toast('发送失败');
							}
						});
					});
				}
			});
		},
		pageToBottom() {
			this.$nextTick(function() {
				uni.pageScrollTo({
					scrollTop: 9999,
					duration: 0
				});
			});
		},
		remarkAndSend(message) {
			const _this = this;
			const payload = {
				messageReadId: message.messageId,
			};
			_this.im.markPrivateMessageAsRead({
				userId: message.senderId, //聊天对象的userId
				onSuccess: function() {
					//标记对方的消息为已读
					let textMessage = _this.wsCreatMessage('mark', payload);
					_this.wsSendMessage(textMessage);
				},
				onFailed: function(error) {
					//标记失败
					console.log('Failed to mark as read, code:' + error.code + ' content:' + error.content);
				}
			});
		},
		wsSendMessage(messageInfo) {
			const _this = this;
			this.im.sendMessage({
				message: messageInfo,
				onSuccess: async function(message) {
					if (message.type !== 'mark') {
						//发送成功
						_this.messagelist.push({
							type: message.type,
							isMe: message.payload.isMe,
							avatar: message.payload.avatar,
							nickName: message.payload.nickName,
							messageId: message.messageId,
							timestamp: message.timestamp,
							isRead: message.read,
							url: '',
							text: message.payload.text
						});
						const Info = {
							msg: message.payload.text,
							status: 0,
							sendDate: uni.$u.timeFormat(new Date(), 'yyyy-mm-dd hh:MM:ss'),
							readDate: uni.$u.timeFormat(new Date(), 'yyyy-mm-dd hh:MM:ss'),
							type: message.type,
							url: '',
							userId: uni.getStorageSync('userInfo').id,
							receiverId: _this.receiverId
						}
					  const res = await	_this.messageSaveAction(Info);
					  _this.messageId.push(res.id);
					  _this.pageToBottom();
						_this.message = '';
					}
				},
				onFailed: function(error) {
					//发送失败
					uni.$u.toast('发送失败');
				}
			});
		},

		wsCreatMessage(messageType, moreInfo) {
			const _this = this;
			let textMessage = _this.im.createCustomMessage({
				type: messageType,
				payload: {
					...moreInfo
				},
				to: {
					type: GoEasy.IM_SCENE.PRIVATE, //私聊还是群聊，群聊为GoEasy.IM_SCENE.GROUP
					id: parseInt(_this.receiverId),
					data: { avatar: uni.getStorageSync('userInfo').photo, nickname: uni.getStorageSync('userInfo').nickname } //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
				}
			});
			return textMessage;
		},

		messageReceived() {
			const _this = this;

			let onPrivateMessageReceived = function(message) {
				if(_this.first){
					_this.allMessage.forEach(item => {
						if(item.status === 0){
							const res = _this.remarkIsReadAction({
								id: item.id,
								status: 1
							})
						}
				
					});
					_this.first = false;
				}
	
				if (_this.receiverId === message.senderId) {
					const pushInfo = {
						type: message.type,
						isMe: false,
						messageId: message.messageId,
						timestamp: message.timestamp,
						isRead: true,
						avatar: _this.receiverAvatar,
						text: message.payload.text,
						url: message.payload.url,
						nickName: _this.receiverName
					};
					const update = () => {
						_this.messagelist.push(pushInfo);
						_this.pageToBottom();
						_this.remarkAndSend(message);
					};
					if (message.type === 'mark') {
						const messageId = _this.messageId[_this.messageId.length-1];
						console.log(messageId,888)
						const res = _this.remarkIsReadAction({
							id: messageId,
							status: 1
						});
						_this.messagelist.forEach(item => {
							if (item.messageId === message.payload.messageReadId) {
							
								item.isRead = true;
							}
						});
					} else if (message.type === 'image') {
						update();
					} else if (message.type === 'audio') {
						update();
					} else if (message.type === 'message') {
						update();
					}
				}
			};
			_this.im.on(GoEasy.IM_EVENT.PRIVATE_MESSAGE_RECEIVED, onPrivateMessageReceived);
		}
	}
};
</script>

<style scoped lang="scss">
.page {
	// height: 100vh;
	.tip {
		width: 300rpx;
		background-color: #efefef;
		line-height: 50rpx;
		height: 50rpx;
		border-radius: 25rpx;
	}
	.isMe {
		display: flex;
		justify-content: end;
		align-items: center;
		flex-direction: row-reverse;
	}
	.isNotMe {
		display: flex;
			align-items: center;
	}
	.isRead {
		width: 100rpx;
		background-color: #efefef;
		text-align: center;
		border-radius: 20rpx;
		padding: 0 5rpx;
		line-height: 40rpx;
		height: 40rpx;
	}

	.block {
		background-color: #ffffff;
		height: 120rpx;
	}
	.image {
		width: 250rpx;
	}
	.text {
		display: inline-block;
		background-color: #21b0ab;
		max-width: 400rpx;
		text-align: justify; 
		word-break: break-all;
		border-radius: 15rpx;
		padding: 5rpx 15rpx;
		color: white;
	}
	video {
		width: 420rpx !important;
		height: 350rpx !important;
	}
	.sendInput {
		position: fixed;
		width: 750rpx;
		bottom: 0;
		background-color: #ffffff;
	}
}
</style>
