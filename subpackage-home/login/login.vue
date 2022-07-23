<template>
	<view class="login">
		<view class="ml-3 font-weight headerText" style="margin-top: 120rpx">欢迎使用神州牙都会医生端</view>
		<view class="ml-3" style="color: #7fa0df;margin-top: 100rpx;">手机号登录</view>
		<view class="phone-input mx-3 mt-1">
			<u-input placeholder="测试号码18976329982" v-model="codeForm.phone" @change="changeColor" @blur="checkPhone">
				<u-text text="+86" slot="prefix" margin="0 20rpx 0 0"></u-text>
			</u-input>
		</view>

		<view ref="getCodeRef" class="getCode text-center border-radius-sm mx-3"
			:style="{ 'background-color': getCodeBtnColor }" @click="handleGetCode">
			<text class="font-md" :style="{ color: getCodeColor }">获取短信验证码</text>
		</view>

		<view class="mt-3 font-sm w-100" style="color: #d2d1d6;">
			<view class="d-flex j-center">未注册的手机号验证通过后将自动注册</view>
		</view>
		<view class="d-flex j-sb ml-3 mt-4">
			<label class="checkbox d-flex a-center" @click="check = !check">
				<checkbox :checked="check" size="15rpx" />
				<text class="text-light-muted font">已阅读并同意神州牙都会协议</text>
			</label>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				codeForm: {
					phone: '13787007172'
				},
				getCodeColor: '#bec0cc',
				getCodeBtnColor: '#e8eaf6',
				checkNum: false,
				// 检查协议同意
				check: false
			};
		},
		onShow() {
			this.checkPhone()
			this.changeColor()
			this.handleGetCode()

		},
		methods: {
			checkPhone(event) {
				event = 13787007172
				this.checkNum = uni.$u.test.mobile(event);

				if (!this.checkNum) {
					uni.$u.toast('您输入的号码有误');
				}
			},
			changeColor(event) {
				event = 13787007172
				let check = uni.$u.test.mobile(event);
				if (check) {
					this.codeForm.phone = event;
					this.getCodeBtnColor = '#4d81e6';
					this.getCodeColor = '#ffffff';
				} else {
					this.getCodeBtnColor = '#e8eaf6';
					this.getCodeColor = '#bec0cc';
				}
			},
			handleGetCode() {
				if (!this.checkNum) {
					return uni.$u.toast('请输入手机号');
				} else if (!this.check) {
					uni.$u.toast('请勾选协议');
				} else {
					uni.$u.route('/subpackage-home/loginByCode/loginByCode', {
						phone: this.codeForm.phone
					});
				}
			}
		}
	};
</script>

<style scoped lang="scss">
	.headerText {
		color: #5583de;
		font-size: 40rpx;
	}

	.getCode {
		margin-top: 100rpx;
		height: 80rpx;
		line-height: 80rpx;
	}
</style>
