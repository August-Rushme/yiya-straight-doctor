<template>
	<view class="dayTable">
		<view class="calendar">
			<view class="wrapper">
				<view class="month">{{ curMonth }}月</view>
				<view class="left"></view>
				<view class="daylist">
					<view v-for="(item, index) in list" @click="chooseDay(index, item)" class="daylist-item"
						:class="[index < todayIndex ? 'disable' : '']" :key="index">
						<view class="daylist-day" :class="[index == active ? 'active' : '']">{{ item | filterDay }}
						</view>
						<!-- 后续再更 -->
						<!-- <text class="circle" v-if="selected[index]"></text> -->
						<view class="daylist-week">{{ item | filterWeek }}</view>
					</view>
				</view>
				<view class="right"></view>
			</view>
		</view>
		<view class="" style="margin-top: 300rpx;" v-if="listItem.length == 0">
			<u-loading-icon mode="circle" text="加载中"></u-loading-icon>
		</view>
		<!-- 手动添加日常程按钮 -->
		 <view class="add" @click="addSchedule"></view>
		<swiper :current="active" style="height: 1300rpx; margin-bottom: 20rpx;" @change="handleChangeTab">
			<swiper-item v-for="(item, index) in listItem" :key="index">
				<scroll-view scroll-y="true" style="height: 1300rpx;" enable-flex>
					<date-table v-on:bookMeeting="bookMeeting($event)" :chooseDateProp="curDate"
						:scheduleListProp="item.scheduleList"></date-table>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
		getNextDay,
		getBeforeDay,
		getCurMonthDayNum,
		getElseMonthDayNum,
		isSameDay,
		timeFormat,
		getRecentDay
	} from './util.js';
	import dateTable from '@/components/luoxiao-dayTable/dayTable.vue';
	import {
		mapActions,
		mapState
	} from 'vuex';
	export default {
		name: 'sl-calendar',
		components: {
			dateTable
		},
		props: {
			/**
			 * 是否立即触发change
			 */
			rightnow: {
				type: Boolean,
				default: true
			},
			// 时间范围
			day: {
				type: Number,
				default: 7 * 4 //4周
			},
			//红点
			selected: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		filters: {
			filterWeek: function(time) {
				let t = new Date(time);
				let week = t.getDay();
				let cur = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][week];
				return cur ? cur : '';
			},
			filterYear: function(time) {
				let t = new Date(time);
				let year = t.getFullYear()();
				return year ? year : '';
			},
			filterDay: function(time) {
				let t = new Date(time);
				let day = t.getDate();
				return day ? day : '';
			}
		},
		computed: {
			...mapState(['scheduleListState']),
			curYear() {
				if (this.list[this.active]) {
					let date = new Date(this.list[this.active]);
					let year = date.getFullYear();
					return year;
				}
				return '';
			},
			curMonth() {
				if (this.list[this.active]) {
					let date = new Date(this.list[this.active]);
					let month = date.getMonth() + 1;
					return month;
				}
				return '';
			}
		},
		data() {
			return {
				delay: 0, // 延时秒数
				duration: 1, //执行动画时间
				active: -1,
				todayIndex: -1,
				list: [],
				d: new Date(),
				// 当前月份有几天
				curMonthDayNum: getCurMonthDayNum(),
				curDate: timeFormat(new Date(), 'yyyy/MM/dd'),
				dateInfo: {},
				userInfo: uni.getStorageSync('userInfo'),
				scheduleList: [],
				newList: [],
				listItem: []
			};
		},
		watch: {
			day: {
				async handler(newValue, oldValue) {
					// console.time("create")
					const day = getRecentDay(this.day);
					// console.timeEnd("create")
					this.active = day.index;
					this.todayIndex = day.index;
					this.list = day.list;

					const res = await this.$http.post('/schedule/getByIdAndDateAll', {
						userId: this.userInfo.id,
						dateList: [this.list[0], this.list[1]]
					});
					this.newList = res.data;
					console.log(2);
					for (let i = 0; i < 7; i++) {
						this.listItem[i] = res.data[i]
					}
					
					const r = await this.$http.post('/schedule/getByIdAndDateAll', {
						userId: this.userInfo.id,
						dateList: this.list
					});
					this.newList = r.data;
					
					uni.setStorageSync('scheduleList', r.data)
					
				},
				immediate: true
			}
		},
		async onLoad() {
			// const res = await this.getScheduleListAction({
			//   userId: this.userInfo.id,
			//   date: this.curDate
			// });
			// this.scheduleList = res.data;
		},
		onReady() {
			console.log(3);
		},
		methods: {
			...mapActions(['getScheduleListAction']),
			bookMeeting(e) {
				let params2 = e;
				// params.startTime = this.$timeFormat(params.startTime, 'HH:mm');
				// params.endTime = this.$timeFormat(params.endTime, 'HH:mm');
				uni.$u.route({
					url: '/subpackage-index/scheduleDetails/scheduleDetails',
					params: {
						...params2
					}
				});
			},
			addSchedule(){
				uni.$u.route({
					url: '/subpackage-index/scheduleDetails/scheduleDetails',
					params: {
						date: this.curDate
					}
				});
			},
			handleChangeTab(item) {

				this.active = item.detail.current ?? item;
				let day = new Date().getDate() + this.active;
				if (day > this.curMonthDayNum) {
					day = day - this.curMonthDayNum;
				}
				this.curDate = this.$timeFormat(this.curYear + '/' + this.curMonth + '/' + day, 'yyyy/MM/dd');
				if (this.listItem.length - this.active < 3) {
					for (let i = 0; i < 5; i++) {
						let start = this.listItem.length
						this.listItem.push(this.newList[i + start])
					}
				}

			},

			chooseDay(index) {
				if (index < this.todayIndex) {
					uni.showToast({
						title: '只能预约未来时间',
						icon: 'none'
					});
					return;
				}
				if (this.active == index) {
					return;
				}
				this.active = index;

				if (index >= this.listItem.length || !this.listItem[index]) {
					this.listItem[index] = this.newList[index]
				}

				let day = new Date().getDate() + index;
				if (day > this.curMonthDayNum) {
					day = day - this.curMonthDayNum;
				}
				// 当前日期
				this.curDate = this.$timeFormat(this.curYear + '/' + this.curMonth + '/' + day, 'yyyy/MM/dd');
				this.$emit('change', this.active);
			}
		}
	};
</script>

<style lang="scss" scoped>
	.calendar {
		.wrapper {
			height: 120rpx;
			overflow: hidden;
			box-shadow: 0px 5px 5px 0px rgba(87, 139, 255, 0.1);
			display: flex;
			align-items: center;

			.calendar-year {
				font-size: 40rpx;
				font-weight: 500;
				color: #232323;
			}

			.month {
				height: 80rpx;
				width: 120rpx;
				text-align: center;
				line-height: 80rpx;
				margin: 20rpx 0;
				font-size: 40rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #000;
			}

			.daylist {
				overflow: auto;
				flex: 1;
				// width: 0;	//华为平板 显示不出
				white-space: nowrap; //横排
				height: 100%;

				.daylist-item {
					height: 100%;
					display: inline-flex; //横排
					flex-direction: column;
					justify-content: center;
					align-items: center;
					padding: 0 22rpx;

					&.disable {
						.daylist-week {
							color: #000;
						}

						.daylist-day {
							color: #000;
						}

						//未选中
						.circle {
							margin-top: -2px;
							width: 4px;
							height: 4px;
							border-radius: 5px;
							background-color: $uni-color-error;
						}
					}

					.daylist-week {
						font-size: 22rpx;
						font-weight: 400;
						color: #000;
					}

					.daylist-day {
						margin-top: 10rpx;
						font-size: 28rpx;
						font-weight: 400;
						color: #000;
						width: 40rpx;
						height: 40rpx;
						text-align: center;
						padding: 2rpx;
						border-radius: 50%;

						&.active {
							//选中
							display: flex;
							align-items: center;
							justify-content: center;
							background: #578bff;
							color: white;
						}
					}

					//选中红点
					.circle {
						margin-top: -5px;
						width: 4px;
						height: 4px;
						border-radius: 5px;
						background-color: $uni-color-error;
					}
				}
			}

			.left {
				height: 0;
				width: 0;
				margin-right: 2px;
				border: 4px;
				border-style: dashed dashed dashed solid;
				border-top-color: transparent;
				border-left-color: transparent;
				border-bottom-color: transparent;
				color: grey;
			}

			.right {
				height: 0;
				width: 0;
				margin-left: 2px;
				border: 4px;
				border-style: dashed dashed dashed solid;
				border-top-color: transparent;
				border-right-color: transparent;
				border-bottom-color: transparent;
				color: grey;
			}
		}
	}

	.add {
		height: 100rpx;
		width: 100rpx;
		background: #005a8a;
		position: fixed;
		right: 20rpx;
		bottom: calc(10%);
		border-radius: 50%;
		z-index: 99;
		box-shadow: 0 0 20rpx #005a8a60;
	}

	.add::before,
	.add::after {
		content: '';
		width: 6rpx;
		height: 50rpx;
		left: calc(50% - 3rpx);
		top: calc(50% - 50rpx / 2);
		border-radius: 6rpx;
		background: #eee;
		position: absolute;
	}

	.add::before {
		transform: rotate(90deg);
	}
</style>
