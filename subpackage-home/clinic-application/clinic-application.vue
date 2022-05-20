<template>
	<view>
		<u-empty v-if="applyList.length == 0" mode="order" icon="http://cdn.uviewui.com/uview/empty/order.png"
			text="您还没有相关申请" marginTop="150"></u-empty>
		<view class="card-wrap">
			<block v-for="(item, index) in applyList" :key="index">
				<view class="card-box" v-if="item.status == 0">
					<view class="card-info" style="border-left: 4px solid #5f9ffb;"
						@click="handleApplyDetail(item.id,0)">
						<view class="content-header d-flex j-sb mt-2 mx-2">
							<view class="" style="color: #999;">{{ item.createAt }}</view>
							<view class="applyIng" style="color: #5ea0ff;">申请中</view>
						</view>
						<view class="content-body d-flex j-sb mt-1 mx-2">
							<view class="clinic">{{ item.clinic }}</view>
							<view class="" style="color: #999999;">申请人：{{ item.userName }}</view>
						</view>
					</view>
				</view>
				<view class="card-box" v-if="item.status == 1">
					<view class="card-info" style="border-left: 4px solid #f99901;"
						@click="handleApplyDetail(item.id,1)">
						<view class="content-header d-flex j-sb mt-2 mx-2">
							<view class="" style="color: #999;">{{ item.createAt }}</view>

							<view class="applyReject" style="color: #5ea0ff;">被驳回</view>
						</view>
						<view class="content-body d-flex j-sb mt-1 mx-2">
							<view class="clinic">{{ item.clinic }}</view>
							<view class="" style="color: #999999;">申请人：{{ item.userName }}</view>
						</view>
					</view>
				</view>
				<view class="card-box" v-if="item.status == 2">
					<view class="card-info" style="border-left: 4px solid #63be4f;"
						@click="handleApplyDetail(item.id,2)">
						<view class="content-header d-flex j-sb mt-2 mx-2">
							<view class="" style="color: #999;">{{ item.createAt }}</view>
							<view class="applyComplete" style="color: #5ea0ff;">申请通过</view>
						</view>
						<view class="content-body d-flex j-sb mt-1 mx-2">
							<view class="clinic">{{ item.clinic }}</view>
							<view class="" style="color: #999999;">申请人：{{ item.userName }}</view>
						</view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				applyList: [],

				pageInfo: {
					pageNmu: 1,
					pageSize: 5,
					userId: uni.getStorageSync('userInfo').id,
					status: 0,
				}
			};
		},
		onLoad(option) {
			this.pageInfo.status = option.status
		},
		onShow() {
			this.getApplyData()
		},
		methods: {
			handleApplyDetail(id, status) {
				uni.$u.route('/subpackage-home/applyDetail/applyDetail', {
					id: id,
					status: status
				});
			},
			// 获取申请数据
			async getApplyData() {
				const {
					data: res
				} = await this.$http.post('/qualification/getByIdAndStatus', this.pageInfo)
				this.applyList = res.list
			}
		}
	};
</script>

<style lang="scss" scoped>
	.card-box {
		width: 100%;
		height: 160rpx;

		.card-info {
			margin: auto;
			width: 92%;
			height: 130rpx;
			background: #ffffff;
			box-shadow: 0 4px 8px 0 rgba(190, 195, 199, 0.5);
			border-radius: 8rpx;
		}
	}

	.applyIng::after {
		content: '';
		display: inline-block;
		width: 15rpx;
		height: 15rpx;
		margin-left: 8rpx;
		margin-top: -8rpx;
		background: #5ea0ff;
		border-radius: 50%;
	}

	.applyComplete::after {
		content: '';
		display: inline-block;
		width: 15rpx;
		height: 15rpx;
		margin-left: 8rpx;
		margin-top: -8rpx;
		background: #63be50;
		border-radius: 50%;
	}

	.applyReject::after {
		content: '';
		display: inline-block;
		width: 15rpx;
		height: 15rpx;
		margin-left: 8rpx;
		margin-top: -8rpx;
		background: #f89901;
		border-radius: 50%;
	}
</style>
