<template>
	<view>
		<view class="card-wrap" style="padding: 60rpx 0pt;">
			<view class="card-box ">
				<view class="card-info  pt-3 rpx-2">
					<view class="name d-flex j-sb a-center pb-1 pr-3 px-3">
						<view class="label">姓名:</view>
						<text style="color: #939393;">{{applyDetail.userName}}</text>
					</view>
					<view class="name d-flex j-sb a-center pb-1 pr-3 px-3">
						<view class="label">性别:</view>
						<text style="color: #939393;">{{applyDetail.gender}}</text>
					</view>
					<view class="name d-flex j-sb a-center pb-1 pr-3 px-3">
						<view class="label">年龄:</view>
						<text style="color: #939393;">{{applyDetail.age}}</text>
					</view>
					<view class="name d-flex j-sb a-center pb-1 pr-3 px-3">
						<view class="label">手机号码:</view>
						<text style="color: #939393;">{{applyDetail.phone}}</text>
					</view>
					<view class="name d-flex j-sb a-center pb-1  pr-3 px-3">
						<view class="label">执业时长:</view>
						<text style="color: #939393;">{{applyDetail.practiceDuration}}</text>
					</view>
					<view class="name d-flex j-sb a-center pb-1  pr-3 px-3">
						<view class="label">身份证号:</view>
						<text style="color: #939393;">{{applyDetail.idNumber}}</text>
					</view>
					<view class="name d-flex j-sb a-center pb-1  pr-3 px-3">
						<view class="label">操作项目:</view>
						<view class="">
							<text style="color: #939393;" v-for="(item,index) in applyDetail.skills"
								:key="index">{{item}},</text>
						</view>

					</view>
					<view class="name d-flex j-sb a-center pb-1 pr-3 px-3">
						<view class="label">申请诊所:</view>
						<text style="color: #939393;">{{applyDetail.clinic}}</text>
					</view>
				</view>
			</view>
			<view class="row">
				<view class="connect">
					<view class="rope"></view>
				</view>
				<view class="connect">
					<view class="rope"></view>
				</view>
			</view>
			<view class="card-box">
				<view class="card-info pt-3 px-2">
					<image :src="applyDetail.certificate" mode=""
						v-if="status == 0">
						<view class="reason" v-if="status == 1">
							<view class="name d-flex j-sb a-center pb-1  pr-3 px-3 mt-2">
								<view class="label">驳回原因:</view>
								<text style="color: #939393;">不会符合本诊所要求</text>
							</view>
						</view>
						<view class="reason" v-if="status == 2">
							<view class="name d-flex j-sb a-center pb-1  pr-3 px-3 mt-2">
								<view class="label">状态:</view>
								<text style="color: #939393;">恭喜您，您的申请已通过</text>
							</view>
						</view>
					</image>
				</view>
			</view>
		</view>
		<view class="mx-2 mt-5">
			<u-button type="primary" text="撤回申请" v-if="status == 0"></u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				qualifierId: '',
				status: 0,
				userId: uni.getStorageSync('userInfo').id,
				applyDetail: {},
				skillLabels: []
			};
		},
		onLoad(option) {
			this.qualifierId = option.id;
			this.status = option.status
		},
		onShow() {
			this.getSkillLabels()
		},
		methods: {
			// 获得申请详情
			async getApplyDetail() {
				const {
					data: res
				} = await this.$http.post('/qualification/getQualificationById', {
					qualifierId: this.qualifierId,
					userId: this.userId
				})
				let skills = []
				res.skills.forEach(item => {
					this.skillLabels.forEach(item2 => {
						if (item2.id == item) {
							skills.push(item2.label)
						}
					})
				})
				res.skills = skills
				this.applyDetail = res
				console.log(skills)
				console.log(this.applyDetail)
			},
			// 获取医生选择方向标签
			async getSkillLabels() {
				const {
					data: res
				} = await this.$http.get("/qualification/getDoctorLabels")
				this.skillLabels = res
				this.getApplyDetail()
			}
		}
	};
</script>

<style lang="scss" scoped>
	.card-wrap {
		width: 100%;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: -1;
		overflow: hidden;
	}

	.card-wrap::after {
		width: 140%;
		height: 400rpx;
		position: absolute;
		left: -20%;
		top: 0;
		z-index: -1;
		content: '';
		border-radius: 0 0 50% 50%;
		background: linear-gradient(to bottom, #55a2ef, #88d1f1);
	}

	.card-box {
		float: left;
		width: 100%;

		.card-info {
			margin: auto;
			width: 92%;
			height: 550rpx;
			background: #ffffff;
			box-shadow: 0 4rpx 8rpx 0 rgba(190, 195, 199, 0.5);
			border-radius: 8rpx;
		}
	}

	.row {
		z-index: 99;
		float: left;
		box-sizing: border-box;
		width: 100%;
		height: 25rpx;
		padding: 0 60rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.connect {
		position: relative;
		--rope_width: 8rpx;
		--rope_height: 55rpx;
		--hole_size: 18rpx;
		margin-top: -15rpx;
	}

	.connect .rope {
		height: var(--rope_height);
		width: var(--rope_width);
		background: #acccf6;
		border-radius: 5rpx;
		position: relative;
		z-index: 99;
		box-shadow: 0 0 0 2rpx rgba(238, 238, 238, 0.781);
	}

	.connect::after,
	.connect::before {
		content: '';
		width: var(--hole_size);
		height: var(--hole_size);
		border-radius: 50%;
		background: #559cfc;
		position: absolute;
		z-index: 9;
		left: calc(-0.5 * (var(--hole_size) - var(--rope_width)));
	}

	.connect::before {
		top: calc(-0.5 * (var(--hole_size) - var(--rope_width)));
	}

	.connect::after {
		bottom: calc(-0.5 * (var(--hole_size) - var(--rope_width)));
	}
</style>
