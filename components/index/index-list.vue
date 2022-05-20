<template>
	<view class="">
		<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png" v-if="appointmentList.length==0" marginTop="30">
		</u-empty>
		<block v-for="appointment in appointmentList" :key="appointment.id">
			<uni-section title="订单大厅" type="line">
				<uni-card v-if="appointment.status == 0">
					<view class="title d-flex flex-row j-sb px-1 a-center border-bottom pb-1">
						<view>{{ appointment.appointmentTime }}</view>
						<u-tag v-if="appointment.status == 0" text="接单" plain shape="circle"
							@click="handleOrderTake(appointment.id)"></u-tag>
					</view>
					<view class="contentAppointment">
						<view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
							<view class="label">姓名:</view>
							<text class="font-weight">{{ appointment.name }}</text>
						</view>
						<view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
							<view class="label">性别:</view>
							<text>{{ appointment.gender }}</text>
						</view>
						<view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
							<view class="label">出生日期:</view>
							<text>{{ appointment.birthday }}</text>
						</view>
						<view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
							<view class="label">手机号:</view>
							<text>{{ appointment.phone }}</text>
						</view>
						<view class="name d-flex j-sb a-center border-bottom pb-1 mt-2 pr-2">
							<view class="label">预约项目:</view>
							<text>{{ appointment.project }}</text>
						</view>
					</view>
				</uni-card>
			</uni-section>
		</block>
	</view>
</template>

<script>
	export default {
		props: {
			appointmentList: Array
		},
		data() {
			return {};
		},
		onLoad() {},
		methods: {
			async handleOrderTake(id) {
				console.log(uni.getStorageSync('patientStatus'));
				if (uni.getStorageSync('patientStatus') === 0) {
					return this.$u.toast('请先开诊再进行接单！');
				}
				const res = await this.$http.post('/doctor/receiveAppointment', {
					appointmentId: id,
					clinic: uni.getStorageSync('userInfo').doctor.clinicName,
					clinicId: uni.getStorageSync('userInfo').doctor.clinicId,
					doctor: uni.getStorageSync('userInfo').name,
					userId: uni.getStorageSync('userInfo').id
				});
				if (res.code !== 200) {
					return this.$u.toast('接单失败请稍后再试！');
				}
				this.$u.toast('接单成功');

				this.$emit('reGetAppointment');
			}
		}
	};
</script>

<style></style>
