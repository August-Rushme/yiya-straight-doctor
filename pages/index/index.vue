<template>
	<view>
		<!-- 头部 -->
		<index-header></index-header>
		<view class=""></view>
		<view class="registerApo d-flex j-sb a-center pl-4 py-1 mt-5 mx-2 mb-2">
			<view>
				<view class="font-lg font-weight">日程安排</view>
				<view class="imeBtn mt-2" @click="goCalendar">查看</view>
			</view>
			<image src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/img/calendar.png" mode="heightFix"
				class="img1"></image>
		</view>
		<!-- 搜索区 -->
		<index-search pageName="index" @searchHandle="handleSearch" @clearHandler="handleClear" placeholder="项目名称">
		</index-search>
		<!-- 订单列表区域 -->
		<index-list :appointmentList="appointmentList" @reGetAppointment="reGetAppointment"></index-list>
	</view>
</template>

<script>
	import indexHeader from '@/components/index/index-header.vue';
	import indexSearch from '@/components/common/search.vue';
	import indexList from '@/components/index/index-list.vue';
	import {
		mapActions,
		mapState
	} from 'vuex';
	export default {
		components: {
			indexHeader,
			indexSearch,
			indexList
		},
		data() {
			return {
				pageInfo: {
					pageNum: 1,
					pageSize: 5,
					query: ''
				},
				appointmentList: [],
				userInfo: uni.getStorageSync('userInfo'),
				curDate: new Date(),
				token: uni.getStorageSync('token')
			};
		},
		computed: {
			...mapState(['forcedLogin', 'hasLogin'])
		},
		onLoad() {
			if (this.token == '') {
				uni.$u.route({
					type: 'redirect',
					url: '/subpackage-home/login/login'
				})
			}
			this.getAppointmentList();

		},
		async onPullDownRefresh() {
			this.pageInfo = {
				pageNum: 1,
				pageSize: 5,
				query: ''
			};
			const res = await this.$http.post('/patient/getPatient', this.pageInfo);
			this.appointmentList = res.data.list;
			if (res.code == 200) {
				uni.stopPullDownRefresh();
			}
		},
		async onShow() {
			this.pageInfo = {
				pageNum: 1,
				pageSize: 5,
				query: ''
			};
			this.getAppointmentList();
			const res = await this.hasMessageAction(parseInt(uni.getStorageSync('userInfo').id));
			if (res.count) {

				uni.showTabBarRedDot({
					index: 2,
				})
			} else {
				uni.hideTabBarRedDot({
					index: 2
				})

			}
		},
		async onReachBottom() {
			this.pageInfo.pageNum++;
			uni.showLoading({
				title: '加载中'
			});
			const {
				data: res
			} = await this.$http.post('/patient/getPatient', this.pageInfo);
			if (res.list.length > 0) {
				uni.hideLoading();
				this.appointmentList.push(...res.list);
			} else {
				uni.hideLoading();
				uni.showToast({
					title: '没有更多数据了',
					icon: 'none'
				});
			}
		},
		methods: {
			...mapActions(['getScheduleListAction', 'hasMessageAction']),
			// 获取预约订单列表
			async getAppointmentList() {
				const {
					data: res
				} = await this.$http.post('/patient/getPatient', this.pageInfo);
				this.appointmentList = res.list;
			},
			// 处理搜索
			handleSearch(res) {
				this.appointmentList = res.list;
			},
			// 处理清空搜索
			handleClear(res) {
				this.appointmentList = res.list;
			},
			// 接单成功后刷新数据
			reGetAppointment() {
				this.pageInfo = {
					pageNum: 1,
					pageSize: 4,
					query: ''
				};
				this.getAppointmentList();
			},
			goCalendar() {
				uni.$u.route('/subpackage-index/calendar/calendar', {});
			}
		}
	};
</script>

<style scoped lang="scss">
	.registerIme {
		position: relative;
		width: 700rpx;
		height: 240rpx;
		border-radius: 20rpx;
		color: #eafefd;
		background: linear-gradient(to right, #55a2ef, #378bf9);
		box-shadow: 0rpx 0rpx 10rpx 4rpx #b2e5df;

		.imeBtn {
			width: 150rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
			border-radius: 30rpx;
			color: #10c5a5;
			background: linear-gradient(to bottom, #e8fefc, #bff8eb);
		}
	}

	.img1 {
		position: absolute;
		height: 275rpx;
		top: -15rpx;
		right: 30rpx;
	}

	.img2 {
		position: absolute;
		height: 275rpx;
		top: -15rpx;
		right: 30rpx;
	}

	.registerApo {
		position: relative;
		width: 700rpx;
		height: 240rpx;
		border-radius: 20rpx;
		color: #eafefd;
		background: linear-gradient(to right, #92c7f8, #67a6ff);
		box-shadow: 0rpx 0rpx 10rpx 4rpx #a4c5ea;

		.imeBtn {
			width: 150rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
			border-radius: 30rpx;
			color: #6ea0e5;
			background: linear-gradient(to bottom, #eaf2ff, #d3dffd);
		}
	}
</style>
