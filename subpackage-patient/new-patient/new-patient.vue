<template>
  <view>
    <view class="header mx-3 mt-1 d-flex j-center font-weight" style="font-size: 36rpx;">新建患者</view>

    <view class="form mx-3">
      <u--form labelPosition="left" :model="patientInfo" :rules="rules" ref="formRef">
        <u-form-item label="姓名:" prop="name" borderBottom>
          <u--input v-model="patientInfo.name" placeholder="请输入患者姓名" border="none"></u--input>
        </u-form-item>
        <u-form-item
          label="性别:"
          prop="gender"
          borderBottom
          @click="
            showSex = true;
            hideKeyboard();
          "
          ref="item1"
        >
          <u--input
            v-model="patientInfo.gender"
            disabled
            disabledColor="#ffffff"
            placeholder="请选择性别"
            border="none"
          ></u--input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
        <u-form-item
          label="出生日期:"
          labelWidth="150rpx"
          prop="birthday"
          borderBottom
          @click="
            showBirthday = true;
            hideKeyboard();
          "
          ref="item1"
        >
          <u--input
            v-model="patientInfo.birthday"
            disabled
            disabledColor="#ffffff"
            placeholder="请选择生日"
            border="none"
          ></u--input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
        <u-form-item label="手机号码:" labelWidth="150rpx" prop="phone" borderBottom>
          <u--input v-model="patientInfo.phone" placeholder="请输入手机号" border="none"></u--input>
        </u-form-item>
        <u-form-item label="预约单号:" labelWidth="150rpx" prop="orderNumber" borderBottom>
          <u--input v-model="patientInfo.orderNumber" placeholder="请输入预约单号" border="none"></u--input>
        </u-form-item>
      </u--form>
      <u-button type="primary" text="提交" customStyle="margin-top: 50px" @click="submit"></u-button>
      <u-button type="error" text="重置" customStyle="margin-top: 10px" @click="reset"></u-button>
      <u-action-sheet
        :show="showSex"
        :actions="actions"
        title="请选择性别"
        @close="showSex = false"
        @select="sexSelect"
      ></u-action-sheet>
      <u-datetime-picker
        :minDate="-946770632000"
        :show="showBirthday"
        :value="birthday"
        mode="date"
        closeOnClickOverlay
        @confirm="birthdayConfirm"
        @cancel="birthdayClose"
        @close="birthdayClose"
      ></u-datetime-picker>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      patientInfo: {
        name: '',
        age: '',
        gender: '',
        birthday: '',
        phone: '',
        orderNumber: '',
        doctorId: uni.getStorageSync('userInfo').doctor.id
      },
      showSex: false,
      showBirthday: false,
      showCalendar: false,
      birthday: Number(new Date()),
      appointmentTime: Number(new Date()),
      rules: {
        name: [
          {
            type: 'string',
            required: true,
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
        gender: { type: 'string', max: 1, required: true, message: '请选择男或女', trigger: ['blur', 'change'] },
        birthday: {
          type: 'string',
          required: true,
          message: '请选择生日',
          trigger: ['change']
        },
        phone: [
          {
            type: 'number',
            required: true,
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
        ],
        orderNumber: {
          type: 'string',
          required: true,
          message: '请选输入预约单号',
          trigger: ['change', 'blur']
        }
      },
      actions: [
        {
          name: '男'
        },
        {
          name: '女'
        }
      ]
    };
  },
  onReady() {
    // 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
    this.$refs.formRef.setRules(this.rules);
  },
  methods: {
    // 选择性别
    sexSelect(e) {
      this.patientInfo.gender = e.name;
      this.$refs.formRef.validateField('gender');
    },
    hideKeyboard() {
      uni.hideKeyboard();
    },
    birthdayClose() {
      this.showBirthday = false;
      this.$refs.formRef.validateField('birthday');
    },
    birthdayConfirm(e) {
      this.showBirthday = false;
      this.patientInfo.birthday = uni.$u.timeFormat(e.value, 'yyyy-mm-dd');
      this.$refs.formRef.validateField('birthday');
    },
    // 确认预约时间
    appointmentConfirm(e) {
      this.showCalendar = false;
      this.patientInfo.appointmentTime = uni.$u.timeFormat(e.value, 'yyyy-mm-dd hh:MM');
    },
    // 处理关闭
    appointmentClose() {
      this.showCalendar = false;
    },
    filter(mode, options) {
      if (mode === 'minute') {
        // return options.filter(option => option % 15 == 0);
      }
      return options;
    },
    // 选择
    change(e) {
      console.log(e);
    },

    submit() {
      // 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true

      this.$refs.formRef
        .validate()
        .then(async res => {
          const data = await this.$http.post('/patient/addPatient', this.patientInfo);
          if (data.code !== 200) {
            return uni.$u.toast('添加失败，请稍后再试');
          }
          uni.$u.toast('添加成功');
        })
        .catch(errors => {
          uni.$u.toast('校验失败');
        });
    },
    reset() {
      const validateList = ['name', 'gender', 'birthday', 'workTime', 'idNumber', 'project'];
      this.$refs.formRef.resetFields();
      // 清空表单
      for (let key in this.patientInfo) {
        this.patientInfo[key] = '';
      }
      this.$refs.formRef.clearValidate();
      setTimeout(() => {
        this.$refs.formRef.clearValidate(validateList);
      }, 10);
    }
  }
};
</script>

<style></style>
