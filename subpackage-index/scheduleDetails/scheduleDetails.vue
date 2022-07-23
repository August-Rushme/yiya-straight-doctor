<template>
	<view class="scheduleDetails">
		<divider></divider>
		<view class="px-2 d-flex j-sb a-center py-3">
			<u-avatar :src="avatar" size="50" v-if="isShowDefaultAvatar"></u-avatar>
			<u--image v-if="gender === '男'" src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/man.png" width="50"
				height="50" shape="circle"></u--image>
			<u--image v-if="gender === '女'" src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/woman.png"
				width="50" height="50" shape="circle"></u--image>
			<view class="patient-content" v-if="!isShowDefaultAvatar">
				<view class="d-flex j-sb ">
					<view class="a-center d-flex j-start">
						<view class="name font-weight mr-3 font-md">{{ patientInfo.userName }}</view>

						<text class="mr-2 font-sm" v-if="gender === '男'" style="color: #1f86f7;">男</text>
						<text class="mr-2 font-sm" v-if="gender === '女'" style="color: #d45a8f;">女</text>
						<text class="font-sm font-weight">{{ patientInfo.age }}岁</text>
					</view>
					<view class="ml-3 a-center d-flex j-start">
						<view class="label mr-2">医生:</view>
						<view>{{ patientInfo.doctor }}</view>
					</view>
				</view>
				<view class="d-flex j-sb mt-1">
					<view class="a-center d-flex j-start">
						<view class="label mr-2">入诊:</view>
						<view class="" style="color: #999999;">{{ patientInfo.time }}</view>
					</view>
					<view class="content  a-center d-flex j-end"></view>
				</view>
			</view>
			<view class="choose line-h" style="color: #999999;font-size: 22rpx;" @click="choosePatient">
				{{ textInfo }} >
			</view>
		</view>
		<divider></divider>
		<view class="info px-2 mb-2">
			<view class="name d-flex j-sb a-center pb-1 mt-1 pr-2 border-bottom">
				<view class="label">诊所:</view>
				<text>{{ doctorInfo.doctor.clinicName }}</text>
			</view>
			<view class="name d-flex j-sb a-center pb-1 mt-1 pr-2 border-bottom">
				<view class="label">医生:</view>
				<text>{{ doctorInfo.name }}</text>
			</view>
			<view class="name d-flex j-sb a-center pb-1 mt-1 pr-2 border-bottom" @click="showProject = true">
				<view class="label">预约项目:</view>

				<text>{{projectName}}<text class="ml-1" style="color: #999999;">></text></text>
			</view>
		</view>
		<divider></divider>
		<view class="timeInfo px-2">
			<view class="name d-flex j-sb a-center pb-1 mt-1 pr-2 border-bottom" @click="handleShowPicker(1)">
				<view class="label">开始时间:</view>
				<text>{{ startTime }} <text class="ml-1" style="color: #999999;">></text></text>

			</view>
			<view class="name d-flex j-sb a-center pb-1 mt-1 pr-2 border-bottom" @click="handleShowPicker(2)">
				<view class="label">结束时间:</view>
				<text>{{ endTime }}<text class="ml-1" style="color: #999999;">></text></text>
			</view>
		</view>

		<view class="btns px-2 mt-5">
			<u-button type="primary" text="完成" @click="handleConfim"></u-button>
		</view>
		<u-datetime-picker :show="showPicker" :filter="filter" :minHour="minHour" v-model="time" mode="time"
			closeOnClickOverlay @confirm="confirm" @cancel="cancel" @change="change" @close="close"></u-datetime-picker>
		<u-picker ref="uPicker" :show="showProject" @change="reservedChange" @cancel="cancel" :columns="reservedItems"
			@confirm="reservedItemsSelect"></u-picker>
	</view>
</template>

<script>
	import {
		getTimeDiff
	} from '../calendar/util.js'
	export default {
		watch: {
			reservedItems1: {
				// 获取预约项目
				async handler(newValue, oldValue) {
					const {
						data: res
					} = await this.$http.post('/schedule/getReservedItems', {
						clinicId: 1
					})
					for (let i = 0; i < res.length; i++) {
						this.arr.push(res[i].name)
					}
					this.reservedItems.push(this.arr)
				},
				immediate: true
			}
		},
		data() {
			return {
				projectName: '牙齿美白',
				showProject: false,
				curIndex: 1,
				time: '',
				minHour: '',
				minMinute: '',
				doctorInfo: uni.getStorageSync('userInfo'),
				avatar: '',
				gender: '',
				textInfo: '请选择患者',
				patientInfo: {},
				isShowDefaultAvatar: true,
				startTime: '',
				endTime: '',
				date: '',
				curTime: new Date(),
				showPicker: false,
				scheduleList: [],
				isConflict: false,
				reservedItems: [],
				arr: []
			};
		},
		onLoad(option) {
			console.log(option);
			this.startTime = option.startTime;
			this.endTime = option.endTime;
			this.date = option.date;
			this.patientInfo = option;
			if (this.patientInfo.gender) {
				this.gender = this.patientInfo.gender;
				this.isShowDefaultAvatar = false;
				this.textInfo = '重新选择患者';
			}

			// this.filterTime()

		},
		onShow() {
			const nowDate = this.$timeFormat(this.curTime, 'yyyy/MM/dd')
			console.log(nowDate);
			if (nowDate == this.date) {
				this.minHour = this.curTime.getHours()
				this.minMinute = this.curTime.getMinutes()
			}
			this.scheduleList = uni.getStorageSync('scheduleList')

		},
		onUnload() {
			// uni.$u.route({
			// 	url:'/subpackage-index/calendar/calendar',
			// 	// type:'reLaunch'
			// })
		},
		methods: {
			choosePatient() {
				uni.$u.route({
					type: 'redirect',
					url: '/subpackage-index/choosePatients/choosePatients',
					params: {
						startTime: this.startTime,
						endTime: this.endTime,
						date: this.date
					}
				});
			},
			handleShowPicker(index) {
				this.showPicker = true
				this.curIndex = index
			},
			cancel() {
				this.showPicker = false
				this.showProject = false
			},
			confirm(e) {
				this.showPicker = false
				const nowTime = this.date + ' ' + e.value + ':' + '00'

				if (nowTime >= this.endTime && this.curIndex === 1) {
					uni.$u.toast('开始时间不能晚于结束时间')
					return
				} else if (nowTime <= this.startTime && this.curIndex === 2) {
					uni.$u.toast('结束时间不能早于结束时间')
					return
				} else if (this.curIndex === 1) {
					this.startTime = this.date + ' ' + e.value + ':' + '00'
				} else {
					this.endTime = this.date + ' ' + e.value + ':' + '00'
				}
			},
			change(e) {
				let timeArray = e.value.split(':')
				let hour = timeArray[0]
				if (hour != new Date().getHours()) {
					this.minMinute = ''
				} else {
					this.minMinute = this.curTime.getMinutes()
				}
			},
			close() {
				this.showPicker = false
				this.showProject = false
			},
			filter(mode, options) {
				if (mode === 'minute') {
					return options.filter((option) => option % 15 == 0);
				}

				return options;
			},
			async handleConfim() {
				let _this = this
				let diff = getTimeDiff(this.startTime, this.endTime)
				this.isConflict = false
				this.scheduleList.forEach(item => {
					if (item.scheduleList.length > 0) {
						item.scheduleList.forEach(value => {
							if (value.startTime < _this.endTime && value.endTime > _this.startTime) {
								this.isConflict = true
							}
						})
					}
				})

				if (diff < 45) {
					uni.$u.toast('时间间隔最少为30分钟')
				} else if (this.isShowDefaultAvatar == true) {
					return this.$u.toast('请选择患者');
				} else if (this.isConflict) {
					uni.$u.toast('日程安排冲突')
				} else {
					const res = await this.$http.post('/schedule/save', {
						recordId: this.patientInfo.id,
						userName: this.patientInfo.userName,
						projectName: '牙齿美白',
						startTime: this.startTime,
						endTime: this.endTime,
						date: this.date,
						userId: this.doctorInfo.id,
						doctorName: this.doctorInfo.name
					});
					if (res.code !== 200) {
						return this.$u.toast('新建日程失败！');
					}
					this.$u.toast('新建日程失败成功');
					uni.$u.route({
						type: 'redirect',
						url: '/subpackage-index/calendar/calendar',
					});
				}
			},

			// 项目选择
			reservedItemsSelect(e) {
				this.projectName = e.value[0]
				this.showProject = false
			},
			reservedChange(e) {
				const {
					columnIndex,
					value,
					values,
					index,
					// 微信小程序无法将picker实例传出来，只能通过ref操作
					picker = this.$refs.uPicker
				} = e

			}
		}
	};
</script>

<style></style>
