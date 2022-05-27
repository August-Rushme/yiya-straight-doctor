<template>
	<view class="p-2">
		
		<view class="search mb-1">
			<u--input
			    placeholder="搜索"
				v-model="searchContent"
				@change="change"
			    prefixIcon="search"
			    prefixIconStyle="font-size: 22px;color: #909399"
			></u--input>
		</view>
		
		<block v-for="(item,index) in friends" :key="index">
			<view class="my-2" @click="goToChatPage(item.id)">
				<uni-card :is-full="true">
					<view class="d-flex a-center">
						<view>
					
							<u-avatar :src="item.avatar" shape="square" :size="50">				
							</u-avatar>

						</view>

						  <view class=" ml-2 " style="width: 100%;">
						  	<view class="d-flex j-sb a-center">
								<view class="font-md font-weight">
									{{item.nickName}}
								</view>
						  		<view class=" text-light-muted">
						  			{{item.latestMessage.time}}
						  		</view>
						  	</view>
							<view class="d-flex j-sb a-center">
								<template v-if="item.latestMessage.type === 'message'">
									<view class="text-light-muted mt-1 content">
										{{item.latestMessage.content}}				
									</view>
								</template>
						        <template v-else-if="item.latestMessage.type === 'image'">
						        	<view class="text-light-muted mt-1 content">
						        		【图片】				
						        	</view>
						        </template>
								<template v-else>
									<view class="text-light-muted mt-1 content">
										【视频】				
									</view>
								</template>
								<template v-if="item.unReadMount>0">
								<view class="myBadage" :class="item.unReadMount > 99 ? 'px-2' : ''">
									 {{item.unReadMount > 99 ? '99+' : item.unReadMount}}
								</view>	
								</template>
						
							</view>
						
						  </view>
					</view>
				</uni-card>
			</view>
	
		</block>

	</view>
</template>

<script>
	import { mapActions } from 'vuex';
	export default {
		data() {
			return {
				searchContent:'',
				allInfo: [],
				pageInfo: {
					pageNum: 1,
					pageSize: 10,
				},
				friends: [
				]
			}
		},
	  async	onShow() {
		  uni.showLoading({
		  	title: '加载中',
		  	mask: false
		  });
		  this.friends = [];
			const res = await this.getMessageListAction({
				userId: uni.getStorageSync('userInfo').id,
				...this.pageInfo
			})
			const friends = [];
           this.setFriendsInfo(res.list);
		   this.allInfo = this.friends;
		   uni.hideLoading();
		},
		methods: {
			...mapActions(['getMessageListAction','searchMessageAction']),
			setFriendsInfo(res,isReset = false){
				  const _this = this;
				  if(res.length > 0){
					  if(isReset){
					  	_this.friends = []
					  }
					  res.forEach(item => {
					  	if(item.message.length > 0){
					  		const latestMessage = {
					  		content: item.message[item.message.length-1].msg,
					  		time: item.message[item.message.length-1].sendDate,
							type: item.message[item.message.length-1].type
					  			}
								console.log(latestMessage);
					  			const userInfo = {
								  id: item.user.userId,
					  			  avatar:item.user.avatar,
					  			  nickName: item.user.nickName,
					  			  unReadMount: item.unReadMount
					  			}
					  			const friend = {
					  				latestMessage:latestMessage,
					  				...userInfo
					  			}
					
								console.log(friend);
					  			_this.friends.push(friend)
					  	}
					  })
				  }else{
					  _this.friends = [];
				  }
	
			},
			goToChatPage(id){
				uni.navigateTo({
					url: `/subpackage-home/chat/chat?id=${id}`
				})
			},
		  	change(){
				const _this = this;
				uni.showLoading({
					title: '加载中'
				});
				  uni.$u.debounce( async () => {
					    if(this.searchContent.length > 0){
					  const res = await _this .searchMessageAction({
					  				  				  key: _this .searchContent,
					  				  				  userId: uni.getStorageSync('userInfo').id
					  				  })
					  				  console.log(res)
					  this.setFriendsInfo(res,true);
					    }
						else{
									  this.friends = this.allInfo
						}
				uni.hideLoading();
				  }, 400)
	
			
	
			}
		}
	}
</script>

<style scope lang="less">
	.myBadage {
	 min-width: 40rpx;
	 height: 40rpx;
	 line-height: 40rpx;
	 text-align: center;
	 border-radius: 20rpx;
	 background-color: #f56c6c;
	 color: white;
	}
	.content {
		max-width: 400rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>