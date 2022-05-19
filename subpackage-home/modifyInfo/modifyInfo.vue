<template>
	<view>
		<view class="form mx-2">
			<u--form labelPosition="left" :model="setInfo" :rules="rules" ref="formRef">
				<u-form-item label="姓名:" borderBottom>
					<u--input v-model="setInfo.name" placeholder="请输入姓名" :disabled="true"></u--input>
				</u-form-item>
				<u-form-item label="诊所:" prop="clnic" borderBottom>
					<u--input v-model="setInfo.doctor.clinicName" :disabled="true"></u--input>
				</u-form-item>
				<u-form-item label="性别:" prop="gender" borderBottom @click="
            showSex = true;
            hideKeyboard();
          " ref="item1">
					<u--input v-model="setInfo.sex" disabled disabledColor="#ffffff" placeholder="请选择性别" border="none">
					</u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="年龄:" prop="age" borderBottom>
					<u--input v-model="setInfo.age" placeholder="请输入年龄"></u--input>
				</u-form-item>
				<u-form-item label="手机号:" labelWidth="120rpx" borderBottom>
					<u--input v-model="setInfo.tel" placeholder="请输入手机号" :disabled="true"></u--input>
				</u-form-item>
				<u-form-item label="邮箱:" prop="email" borderBottom>
					<u--input v-model="setInfo.email" placeholder="请输入邮箱"></u--input>
				</u-form-item>
			</u--form>
			<u-button type="primary" text="提交" customStyle="margin-top: 50px" @click="submit"></u-button>
			<u-action-sheet :show="showSex" :actions="actions" title="请选择性别" @close="showSex = false"
				@select="sexSelect"></u-action-sheet>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userId: uni.getStorageSync('userInfo').id,
				setInfo: {
					name: '',
					doctor: {},
					age: '',
					tel: '',
					email: '',
					sex: ''
				},
				showSex: false,
				actions: [{
						name: '男'
					},
					{
						name: '女'
					}
				],
				rules: {
					userName: [{
							type: 'string',
							message: '请填写姓名',
							trigger: ['blur', 'change']
						},
						{
							// 此为同步验证，可以直接返回true或者false
							validator: (rule, value, callback) => {
								return uni.$u.test.chinese(value);
							},
							message: '姓名必须为中文',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change', 'blur']
						}
					],
					gender: {
						type: 'string',
						max: 1,
						message: '请选择男或女',
						trigger: ['blur', 'change']
					},
					phone: [{
							type: 'number',
							message: '请输入手机号',
							trigger: ['blur']
						},
						{
							validator: (rule, value, callback) => {
								return uni.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['change', 'blur']
						}
					]
				}
			};
		},
		onReady() {
			// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
			this.$refs.formRef.setRules(this.rules);
		},
		onShow() {
			this.getUserInfo()
		},
		methods: {
			// 获取用户信息
			async getUserInfo() {
				const {
					user: res
				} = await this.$http.get('/user/' + this.userId)
				this.setInfo = res
				console.log(this.setInfo)
			},
			hideKeyboard() {
				uni.hideKeyboard();
			},
			// 选择性别
			sexSelect(e) {
				this.setInfo.sex = e.name;
				this.$refs.formRef.validateField('gender');
			},
			submit() {
				// 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
				this.$refs.formRef
					.validate()
					.then(async res => {
						uni.$u.toast('修改成功');
						this.$http.put('/doctor/updateInfo', this.setInfo)
						setTimeout(() => {
							uni.$u.route({
								type: 'redirect',
								url: '/subpackage-home/setInfo/setInfo'
							});
						}, 300);
					})
					.catch(errors => {
						uni.$u.toast('校验失败');
					});
			}
		}
	};
</script>

<style></style>
