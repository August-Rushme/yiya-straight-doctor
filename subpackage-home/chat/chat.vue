<template>
	<view class="page">
		<view class="ask d-flex j-center">
			<template v-if="!hasMore">
				<view class="tip text-center my-3">{{ title }}</view>
			</template>
			<template v-else>
				<template v-if="moreloading">
					<u-loading-icon mode="circle" text="加载中"></u-loading-icon>
				</template>
				<template v-else>
					<view class="tip text-center my-3" @click="lookMoreMessage">查看更多历史消息</view>
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
						<view class="d-flex" :class="item.isMe ? 'j-end' : ''">
							<view class="text">{{ item.text }}</view>
						</view>
					</template>
					<template v-else-if="item.type === 'record'">
						<view class="d-flex" :class="item.isMe ? 'j-end' : ''" @click="playRecord(index)">
							<view class="text">
								{{ item.time }}"
								<text>
									<text class="horn horn1" :class="item.playState ? 'hornActive1' : ''"></text>
									<text class="horn horn2" :class="item.playState ? 'hornActive2' : ''"></text>
									<text class="horn horn3"></text>
								</text>
							</view>
						</view>
					</template>
					<template v-else-if="item.type === 'image'">
						<view class="image"><image @tap="preview(index)" :src="item.url" mode="widthFix"></image></view>
					</template>
					<template v-else-if="item.type === 'ctImage'">
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
                   <template v-else-if="item.type === 'case'">
                   <uni-card spacing="0" margin="0" @click="goToCaseDetail(item.medicalRecord.id)">
                   	<view style="width: 350rpx;">
                   		<view class="d-flex j-sb border-bottom">
                   			<view>
                   						 <text style="width: 3em;">病人:</text> <text> {{item.medicalRecord.userName}}</text>
                   			</view>
                   			<view >
                   					      <text style="width: 3em;">医生:</text> <text> {{item.medicalRecord.doctor}}</text>
                   			</view>
                   		</view>
                   		<view class="d-flex border-bottom pt-1">
                   			<text style="width: 3em;">处置:</text>
                   		     <text class="cardContent">{{item.medicalRecord.handle}}</text>
                   		</view>
                   		<view class="d-flex pt-1">
                   			<text style="width: 3em;">医嘱:</text>
                   		     <text class="cardContent">{{item.medicalRecord.advice}}</text>
                   		</view>
                   	</view>     
                   </uni-card>
                   </template>
					<template v-if="item.isMe">
						<view class="d-flex j-end mt-1">
							<view class="isRead">{{ item.isRead ? '已读' : '未读' }}</view>
						</view>
					</template>
				</view>
			</view>
		</block>

		<view class="block" :style="{ height: blockHeight + 'rpx' }"></view>
		<view class="sendInput">
			<u-input placeholder="请描述您的问题或症状" paddingBottom="50rpx" border="surround" v-model="message" :useInput="useInput">
				<template slot="prefix">
					<view><uni-icons type="mic" size="30" @click="recordVoice"></uni-icons></view>
				</template>
				<template slot="suffix">
					<view class="d-flex a-center">
						<view class="mr-1">
							<template v-if="isPlus">
								<uni-icons type="plus" size="35" @click="open"></uni-icons>
							</template>
							<template v-else>
								<uni-icons type="minus" size="35" @click="close"></uni-icons>
							</template>
						</view>

						<u-button shape="circle" icon="arrow-upward" size="small" @tap="sendMessage"></u-button>
					</view>
				</template>
			</u-input>
			<template v-if="showMoreFn">
				<view class="moreFn  mb-3 d-flex">
					<view class="d-flex flex-column j-center a-center" style="margin-right: 60rpx;">
						<view class="d-flex flex-column j-center a-center" style="width: 120rpx">
							<uni-icons type="image" size="40" @tap="chooseImage"></uni-icons>
							<view class="text-muted" style="margin-top: -30rpx;">照片</view>
						</view>
					</view>
					<view class="d-flex flex-column j-center a-center" style="margin-right: 60rpx;">
						<view class="d-flex flex-column j-center a-center" style="width: 120rpx">
							<uni-icons type="camera" size="40" @tap="chooseVideo"></uni-icons>
							<view class="text-muted" style="margin-top: -30rpx;">视频文件</view>
						</view>
					</view>	
				</view>
	<!-- 			<view class="d-flex mb-5">
					<view class="d-flex flex-column j-center a-center" style="width: 120rpx;margin-left: 60rpx;">
						<view class="d-flex flex-column j-center a-center" >
							<uni-icons type="videocam" size="40" @tap="callVideo"></uni-icons>
							<view class="text-muted" style="margin-top: -30rpx;">视频问诊</view>
						</view>
					</view>
				</view> -->
			</template>
			<template v-if="startRecord">
				<view class="audioModal d-flex flex-column a-center px-5 py-2">
					<template v-if="sendRecord">
						<view>{{ recordTime }}</view>
						<view class="d-flex a-center py-3">
							<uni-icons type="mic-filled" color="#ffffff" size="30"></uni-icons>
							<view class="pt-2">
								<view class="line line1"></view>
								<view class="line line2"></view>
								<view class="line line3"></view>
							</view>
						</view>
						<view class="py-1">松开发送, 上滑取消</view>
					</template>
					<template v-else>
						<image src="/static/images/cancleRecord.png" style="height: 80rpx;width: 80rpx;" class="my-3"></image>
						<view class="py-1" style="color: #22b1ac;">松开,取消发送</view>
					</template>
				</view>
			</template>
		</view>
		
		<!-- 弹出层 -->
			<u-popup :show="casePoupopshow" @close="casePupoClose">
				<view class="p-1">
					<view class="d-flex j-sb">
						<text class="text-muted" style="font-size: 32rpx;" @click="casePupoClose">取消</text>
						<text style="color: #22b1ac;font-size: 32rpx;"  @click="sendCase">发送</text>
					</view>
					
						<scroll-view  scroll-y="true" style="max-height: 440rpx;" >
							<block v-for="(item2,index2) in caseList" :key="index2">
								<uni-card spacing="0" @click="goToCaseDetail(item2.id)">
									<view>
										<view class="d-flex j-sb pb-1 border-bottom">
											<view>
														 <text style="display: inline-block;width: 3em;">病人:</text> <text>{{item2.userName}}</text>
											</view>
											<view @click.stop="selectCase(index2)">
												<template v-if="item2.status === true">
													<u-icon name="checkmark-circle-fill" color="#22b1ac" size="22"></u-icon>
												</template>
												<template v-else>
													<view class="circle">
														
													</view>
												</template>
											</view>
										
								           
										</view  >
										<view class="border-bottom py-1">
												      <text style="display: inline-block;width: 3em;">医生:</text> <text> {{item2.doctor}}</text>
										</view>
										<view class="d-flex border-bottom py-1">
											<text style="width: 3em;">处置:</text>
										     <text class="cardContent">{{item2.handle}}</text>
										</view>
										<view class="d-flex py-1">
											<text style="width: 3em;">医嘱:</text>
										     <text class="cardContent">{{item2.advice}}</text>
										</view>
									</view>
								
								</uni-card>
							</block>
					
						</scroll-view>
				</view>

				</u-popup>
				<!-- CT 弹出层 -->
				<u-popup :show="ctPoupopshow" @close="ctPupopClose">
			
					<view class="p-2">
						<view class="d-flex j-sb">
							<text class="text-muted" style="font-size: 32rpx;" @click="ctPupopClose">取消</text>
							<text style="color: #22b1ac;font-size: 32rpx;"  @click="sendCT">发送</text>
						</view>
						<block v-for="(item3,index3) in myCT" :key="index3">
							<view class="p-2" style="position: relative;" @click.stop="selectCT(index3)">
								<image :src="item3.src" mode="widthFix"></image>
								<view  style="position: absolute;right: 30rpx; top: 30rpx;">
									<template v-if="item3.status === true">
										<u-icon name="checkmark-circle-fill" color="#22b1ac" size="22"></u-icon>
									</template>
									<template v-else>
										<view class="circle">
											
										</view>
									</template>
								</view>
							</view>
					
						</block>
					</view>
		
					
				</u-popup>
		
	</view>
</template>

<script>
import GoEasy from 'goeasy';
import { mapActions } from 'vuex';
const recorderManager = uni.getRecorderManager();
const innerAudioContext = uni.createInnerAudioContext();

innerAudioContext.autoplay = true;
export default {
	data() {
		return {
			pageInfo: {
				pageSize: 15,
				pageNum: 1
			},
			caseList: [
			],
			tmpCase: {
				
			},
			ctPoupopshow: false,
			myCT: [
				{
					src: 'https://picb.zhimg.com/v2-4c86675b25f32c2b77910b843f04c7c4_r.jpg',
					status: false
				},
				{
					src: 'https://ts1.cn.mm.bing.net/th/id/R-C.0c9ba80488846941e78754601909cfc4?rik=zNESrtx%2buBYg4g&riu=http%3a%2f%2fwww.xjishu.com%2fimg%2fyytu%2fyx%2f2533-121120120I8.jpg&ehk=OSbrWfp62I8DX1viMqcGb%2bfvKy1QdKg5yEMvy4%2b6KA8%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1',
					status: false
				}
				],
			tmpCT: '',
			startRecord: false,
			nickname: uni.getStorageSync('userInfo').nickname,
			avatar: uni.getStorageSync('userInfo').photo,
			recordSecondTime: 1,
			casePoupopshow: false,
			recordMinTime: 0,
			blockHeight: 180,
			showMoreFn: false,
			isPlus: true,
			sendRecord: true,
			moreloading: false,
			allMessage: [],
			hasMore: false,
			useInput: true,
			canSendRecord: false,
			first: true,
			loadingIndex: 0,
			messageId: [],
			isloading: [true],
			windowHeight: '',
			progress: '0%',
			title: '正在连接该病人',
			messagelist: [],
			lasteTimer: null,
			receiverId: '',
			receiverAvatar: '',
			receiverName: '',
			message: ''
		};
	},
	computed: {
		recordTime() {
			const time = this.recordMinTime.toString().padStart(2, '0') + ':' + this.recordSecondTime.toString().padStart(2, '0');
			return time;
		}
	},
	async onLoad(options) {
		uni.showLoading({
			title: '加载中',
			mask: false
		});
		const _this = this;
		this.receiverId = options.id;
		const myMedicial = await this.getMedicalCaseAction({
			id: parseInt(uni.getStorageSync('userInfo').id),
			pageSize: 99,
			pageNum: 1
		})
	 this.caseList = myMedicial.list.map(item => 
	{
		return {
	       ...item,
			status: false
		}
	})
		const receiverInfo = await this.getUserByIdAction(parseInt(options.id));
		const messagelist = await this.getMessageAction({
			fromId: parseInt(uni.getStorageSync('userInfo').id),
			toId: parseInt(options.id),
			...this.pageInfo
		});
		const messageAll = await this.getMessageAction({
			fromId: parseInt(uni.getStorageSync('userInfo').id),
			toId: parseInt(options.id),
			pageNum: 1,
			pageSize: 9999
		});
		this.hasMore = messageAll.list.length > 15 ? true : false;
		let index = 0;
		const rawList = [];
		this.allMessage = messageAll.list;
		this.setRead();
		messagelist.list.reverse().forEach(item => {
			const message = {
				id: item.id,
				text: item.msg,
				isMe: uni.getStorageSync('userInfo').id == item.userId ? true : false,
				isRead: item.status === 1 ? true : false,
				type: item.type,
				url: item.url,
				medicalRecord: item.medicalRecord,
				nickName: uni.getStorageSync('userInfo').id == item.userId ? _this.nickname : receiverInfo.nickname,
				avatar: uni.getStorageSync('userInfo').id == item.userId ? _this.avatar : receiverInfo.photo
			};
			rawList.push(message);
			const greaterOneDay = new Date() - Date.parse(item.sendDate) > 24 * 60 * 60 * 1000 ? true : false;
			if (item.status === 0 && uni.getStorageSync('userInfo').id != item.userId && !greaterOneDay) {
				index++;
			}
		});
		this.messagelist = rawList.slice(0, index > 10 ? rawList.length - 10 : rawList.length - index);
		uni.hideLoading();
		this.pageToBottom();
		uni.authorize({
			scope: 'scope.record',
			success() {
				console.log('用户授权了录音权限');
			}
		});
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
		this.title = '已为您连接该病人';
		this.goeasy = goeasy;
		this.im = goeasy.im;
		this.messageReceived();
		recorderManager.onStop(function(res) {
			if (_this.canSendRecord) {
				_this.sendAudioMessage(res);
				_this.messagelist.push({
					type: 'record',
					isMe: true,
					isRead: false,
					playState: false,
					text: null,
					url: res.tempFilePath,
					realTime: (res.duration / 1000).toFixed(3),
					time: Math.ceil(res.duration / 1000),
					nickName: _this.nickname,
					avatar: _this.avatar
				});
				_this.pageToBottom();
			}
		});
		uni.getSystemInfo({
			success: res => {
				_this.windowHeight = res.windowHeight;
			}
		});
		let recordInterVal = null;
		uni.$on('startRecord', function() {
			_this.sendRecord = true;
			_this.startRecord = true;
			recorderManager.start();
			recordInterVal = setInterval(() => {
				_this.recordSecondTime++;
				if (_this.recordSecondTime >= 60) {
					_this.recordSecondTime = 0;
					_this.recordMinTime++;
				}
			}, 1000);
		});
		// 监听录音
		uni.$on('stopRecord', function(data) {
			_this.canSendRecord = !(_this.windowHeight - data.position.clientY > 80 || (_this.recordMinTime === 0 && _this.recordSecondTime === 1));
			recorderManager.stop();
			_this.startRecord = false;
			clearInterval(recordInterVal);
			_this.recordSecondTime = 1;
			_this.recordMinTime = 0;
		});

		uni.$on('touchmove', function(data) {
			if (_this.windowHeight - data.position.clientY > 80) {
				_this.sendRecord = false;
			} else {
				_this.sendRecord = true;
			}
		});
	},
	onUnload() {
		this.first = true;
		// 断开连接
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
		...mapActions(['getUserByIdAction', 'messageSaveAction', 'getMessageAction', 'remarkIsReadAction','getMedicalCaseAction']),
	    goToCase(){
		    this.casePoupopshow = true;
		},
		casePupoClose(){
			this.casePoupopshow = false;
		},
		ctPupopClose()
		{
			this.ctPoupopshow = false;
		},
		chooseCT(){
			this.ctPoupopshow = true;
		},
		goToCaseDetail(id){
			uni.navigateTo({
				url: `/subpackage-my/medical-detail/medical-detail?id=${id}`
			})
		},
		// 发送病例
		sendCase(){
			const caseInfo = {
				isMe: true,
				isRead: false,
				text: null,
				nickName: this.nickname,
				avatar: this.avatar,
				medicalRecord: this.tmpCase
			}
			const message = this.wsCreatMessage('case', caseInfo);
			this.wsSendMessage(message);
			this.caseList.forEach(item => {
				item.status = false;
			})

			this.casePoupopshow = false;
			this.isPlus = false;
		    this.pageToBottom();
		},
		// 发送CT
		sendCT() {
	           const ctInfo = {
				isMe: true,
				isRead: false,
				text: null,
				nickName: this.nickname,
				avatar: this.avatar,
				medicalRecord: null,
				url: this.tmpCT
			}
			const message = this.wsCreatMessage('ctImage', ctInfo);
			this.wsSendMessage(message);
			this.myCT.forEach(item => {
				item.status = false;
			})
			
			this.ctPoupopshow = false;
			this.isPlus = false;
			this.pageToBottom();
		},
		selectCase(index){
			this.tmpCase = this.caseList[index];
			this.caseList.forEach(item => {
				item.status = false;
			})
			this.caseList[index].status = !this.caseList[index].status;
		},
		selectCT(index){
			this.tmpCT = this.myCT[index].src;
			this.myCT.forEach(item => {
				item.status = false;
			})
			this.myCT[index].status = !this.myCT[index].status;
		},
		setRead(){
			const _this = this;
			if (_this.first) {
				_this.allMessage.forEach(item => {
					
	      if (item.status === 0 && parseInt(item.receiverId) === parseInt(uni.getStorageSync('userInfo').id)) {
		   const res = _this.remarkIsReadAction({
			id: item.id,
			status: 1
		  });
	        }
				});
				_this.first = false;
			}
		},

		// 底部控件相关函数
		open() {
			this.useInput = true;
			this.blockHeight = 400;
			this.showMoreFn = true;
			this.isPlus = false;
			this.pageToBottom();
		},
		close() {
			this.blockHeight = 180;
			this.showMoreFn = false;
			this.isPlus = true;
			this.pageToBottom();
		},
		recordVoice() {
			this.close();
			this.useInput = !this.useInput;
		},
		playRecord(index) {
			const _this = this;
			if (_this.lasteTimer !== null) {
				clearTimeout(_this.lasteTimer);
			}
			this.messagelist.forEach((item, index2) => {
				if (index2 !== index) {
					item.playState = false;
				}
			});
			this.messagelist[index].playState = !this.messagelist[index].playState;
			if (this.messagelist[index].playState) {
				innerAudioContext.src = this.messagelist[index].url;
			} else {
				innerAudioContext.src = 'https://www.jianshu.com/';
			}
			console.log(innerAudioContext.src);
			innerAudioContext.play();
			_this.lasteTimer = setTimeout(() => {
				_this.messagelist[index].playState = false;
			}, _this.messagelist[index].realTime * 1000);
		},
		async lookMoreMessage() {
			this.moreloading = true;
			const _this = this;
			this.pageInfo.pageNum++;
			const moreMessagelist = await this.getMessageAction({
				fromId: parseInt(uni.getStorageSync('userInfo').id),
				toId: _this.receiverId,
				...this.pageInfo
			});
			const pageInfo = { ...this.pageInfo };
			pageInfo.pageNum++;
			const moreMessagelist2 = await this.getMessageAction({
				fromId: parseInt(uni.getStorageSync('userInfo').id),
				toId: _this.receiverId,
				...pageInfo
			});
			this.hasMore = moreMessagelist2.list.length > 0 ? true : false;
			const rawList = [];
			moreMessagelist.list.reverse().forEach(item => {
				const message = {
					id: item.id,
					text: item.msg,
					isMe: uni.getStorageSync('userInfo').id == item.userId ? true : false,
					isRead: item.status === 1 ? true : false,
					type: item.type,
					url: item.url,
					nickName: uni.getStorageSync('userInfo').id == item.userId ? _this.nickname : _this.receiverName,
					avatar: uni.getStorageSync('userInfo').id == item.userId ? _this.avatar : _this.receiverAvatar
				};
				rawList.push(message);
			});
			this.messagelist = [...rawList, ...this.messagelist];
			this.moreloading = false;
		},
		sendMessage() {
			if (this.message.length > 0) {
				const messageInfo = {
					avatar: this.avatar,
					nickName: this.nickname,
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
					res2 = res;
					let hasPush = false;
					_this.loadingIndex = _this.loadingIndex + 1;
					_this.isloading.push(true);
					let message = this.im.createAudioMessage({
						file: res, //H5获得的图片file对象，Uniapp和小程序调用chooseImage，success时得到的res对象
						to: {
							type: GoEasy.IM_SCENE.PRIVATE, //私聊还是群聊，群聊为GoEasy.IM_SCENE.GROUP
							id: parseInt(_this.receiverId),
							data: {  } //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
						},

						onProgress: function(event) {
							if (!hasPush) {
								_this.messagelist.push({
									type: 'audio',
									isMe: true,
									mark: res,
									tmpId: _this.loadingIndex,
									avatar: _this.avatar,
									nickName: _this.nickname,
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
							};
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
		sendAudioMessage(audioFile){
			//语音消息
			  const  message = im.createAudioMessage({
			      file: audioFile,//H5的视频file对象，Uniapp和小程序中录音组件RecorderManager.onStop得到的res对象
			      to : {
			          type : GoEasy.IM_SCENE.PRIVATE,   //私聊还是群聊，群聊为GoEasy.IM_SCENE.GROUP
			          id : parseInt(_this.receiverId),
			          data:{} //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
			      },
			  });
			  this.im.sendMessage({
			  	message: message,
			  	onSuccess: async function(message) {
			  		const Info = {
			  			msg: message.payload.text,
			  			status: 0,
			  			sendDate: uni.$u.timeFormat(new Date(), 'yyyy-mm-dd hh:MM:ss'),
			  			readDate: uni.$u.timeFormat(new Date(), 'yyyy-mm-dd hh:MM:ss'),
			  			type: 'record',
			  			url: message.payload.url,
			  			userId: uni.getStorageSync('userInfo').id,
			  			receiverId: _this.receiverId
			  		};
			  		const res = await _this.messageSaveAction(Info);
			  		_this.messageId.push(res.id);
			  		_this.pageToBottom();
			  	},
			  	onFailed: function(error) {
			  		uni.$u.toast('发送失败');
			  	}
			  });
			  
		}

		  ,
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
								data: {  } //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
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
									avatar: _this.avatar,
									nickName: _this.nickname,
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
								};
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
					scrollTop: 99999,
					duration: 500
				});
			});
		},
		remarkAndSend(message) {
			const _this = this;
			const payload = {
				messageReadId: message.messageId
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
							url: message.payload.url,
							text: message.payload.text,
							medicalRecord: message.payload.medicalRecord
						});
						const Info = {
							msg: message.payload.text,
							status: 0,
							sendDate: uni.$u.timeFormat(new Date(), 'yyyy-mm-dd hh:MM:ss'),
							readDate: uni.$u.timeFormat(new Date(), 'yyyy-mm-dd hh:MM:ss'),
							type: message.type,
							url: message.payload.url,
							userId: uni.getStorageSync('userInfo').id,
							receiverId: _this.receiverId,
							medicalRecord: message.payload.medicalRecord
						};
						const res = await _this.messageSaveAction(Info);
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
					data: {  } //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
				}
			});
			return textMessage;
		},

		messageReceived() {
			const _this = this;

			let onPrivateMessageReceived = function(message) {
					const pushInfo = {
						type: message.type,
						isMe: false,
						messageId: message.messageId,
						timestamp: message.timestamp,
						isRead: true,
						avatar: _this.receiverAvatar,
						text: message.payload.text,
						medicalRecord: message.payload.medicalRecord,
						url: message.payload.url,
						nickName: _this.receiverName
					};
					const update = () => {
						_this.messagelist.push(pushInfo);
						_this.pageToBottom();
						_this.remarkAndSend(message);
					};
					if (message.type === 'mark') {
				setTimeout(()=>{
					const messageId = _this.messageId[_this.messageId.length-1];
					console.log(messageId, 888);
					const res = _this.remarkIsReadAction({
						id: messageId,
						status: 1
					});
				},100)
						_this.messagelist.forEach(item => {
							if (item.messageId === message.payload.messageReadId) {
								item.isRead = true;
							}
						});
					} else {
								update();
					}
			};
			_this.im.on(GoEasy.IM_EVENT.PRIVATE_MESSAGE_RECEIVED, onPrivateMessageReceived);
		}
	}
};
</script>

<style scoped lang="scss">
.page {
	min-height: 100vh;
	scroll-behavior: smooth;
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
	.moreFn {
		padding: 10rpx 60rpx;
	}
	.audioModal {
		position: absolute;
		left: 50%;
		bottom: 150px;
		transform: translate(-50%, -50%);
		color: white;
		border-radius: 15rpx;
		background-color: rgba(51, 51, 51, 0.8);

		.line {
			width: 30rpx;
			height: 4rpx;
			margin-bottom: 6rpx;
			border-radius: 15rpx;
			background-color: white;
		}
		.line1 {
			visibility: hidden;
			animation: line1 1.5s ease infinite;
		}
		.line2 {
			visibility: hidden;
			width: 20rpx;
			animation: line2 1.5s ease infinite;
		}
		.line3 {
			width: 10rpx;
		}

		@keyframes line1 {
			0% {
				visibility: hidden;
			}
			66% {
				visibility: hidden;
			}
			67% {
				visibility: visible;
			}
			100% {
				visibility: visible;
			}
		}
		@keyframes line2 {
			0% {
				visibility: hidden;
			}
			33% {
				visibility: hidden;
			}
			34% {
				visibility: visible;
			}
			100% {
				visibility: visible;
			}
		}
	}
	// 录音播放
	.horn {
		display: inline-block;
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
		background-color: #21b0ab;
		border: 6rpx solid #21b0ab;
		border-left-color: white;
		vertical-align: middle;
	}
	.horn1 {
		margin-left: 20rpx;
		margin-right: -40rpx;
	}
	.horn2 {
		width: 30rpx;
		height: 30rpx;
		margin-right: -20rpx;
	}
	.horn3 {
		margin-right: 6rpx;
		width: 10rpx;
		height: 10rpx;
	}
	.hornActive1 {
		animation: horn1 1.2s ease infinite;
	}
	.hornActive2 {
		animation: horn2 1.2s ease infinite;
	}
	@keyframes horn1 {
		0% {
			visibility: hidden;
		}
		66% {
			visibility: hidden;
		}
		67% {
			visibility: visible;
		}
		100% {
			visibility: visible;
		}
	}
	@keyframes horn2 {
		0% {
			visibility: hidden;
		}
		33% {
			visibility: hidden;
		}
		34% {
			visibility: visible;
		}
		100% {
			visibility: visible;
		}
	}
	// 病例card 
	.cardContent {
		flex: 1;
		overflow: hidden;
	    white-space: nowrap;
		text-overflow: ellipsis;
	}
	.circle {
		width: 44rpx;
		height: 44rpx;
		border-radius: 50%;
		border: 2rpx solid #eeeeee;
	}
}
</style>
