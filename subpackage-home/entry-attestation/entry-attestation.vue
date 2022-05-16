<template>
  <view>
    <view class="header mx-3 mt-1 d-flex j-center font-weight" style="font-size: 36rpx;">个人信息认证</view>

    <view class="form mx-3">
      <u--form labelPosition="left" :model="attestationInfo" :rules="rules" ref="formRef">
        <u-form-item label="姓名:" prop="userName" borderBottom>
          <u--input v-model="attestationInfo.userName" placeholder="请输入姓名" border="none"></u--input>
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
            v-model="attestationInfo.gender"
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
            v-model="attestationInfo.birthday"
            disabled
            disabledColor="#ffffff"
            placeholder="请选择生日"
            border="none"
          ></u--input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
        <u-form-item label="手机号码:" labelWidth="150rpx" prop="phone" borderBottom>
          <u--input v-model="attestationInfo.phone" placeholder="请输入手机号" border="none"></u--input>
        </u-form-item>
        <u-form-item label="执业时长:" labelWidth="150rpx" prop="practiceDuration" borderBottom>
          <u--input v-model="attestationInfo.practiceDuration" placeholder="请输入执业时长" border="none"></u--input>
        </u-form-item>
        <u-form-item label="身份证号:" labelWidth="150rpx" prop="idNumber" borderBottom>
          <u--input v-model="attestationInfo.idNumber" placeholder="请输入身份证号" border="none"></u--input>
        </u-form-item>
        <u-form-item label="操作项目:" labelWidth="150rpx" prop="skills" borderBottom>
          <u-checkbox-group v-model="attestationInfo.skills" shape="square" @change="change">
            <view class="d-flex flex-wrap mt-1">
              <u-checkbox
                :customStyle="{ marginRight: '20rpx', marginBottom: '12rpx' }"
                v-for="(item, index) in checkboxList"
                :key="index"
                :label="item.name"
                :name="item.label"
              ></u-checkbox>
            </view>
          </u-checkbox-group>
        </u-form-item>
      </u--form>
      <view class="" style="margin-left: 100rpx; margin-top: 50rpx;">
        <u-upload
          :fileList="fileList6"
          @afterRead="afterRead"
          @delete="deletePic"
          name="6"
          multiple
          :maxCount="1"
          width="250"
          height="150"
          :previewFullImage="true"
        >
          <image
            src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/idCard.png"
            mode="widthFix"
            style="width: 250px;height: 150px;"
          ></image>
        </u-upload>
      </view>
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
  onLoad(option) {
    this.attestationInfo.clinic = option.clinic;
  },
  async onShow() {
    const { data: res } = await this.$http.get('/qualification/getDoctorLabels');
    this.checkboxList = res.map(item => {
      return {
        name: item.label,
        disabled: false,
        label: item.id
      };
    });
  },
  data() {
    return {
      attestationInfo: {
        userName: '',
        age: '',
        gender: '',
        birthday: '',
        practiceDuration: '',
        idNumber: '',
        skills: [],
        certificate: '',
        phone: '',
        clinic: '',
        userId: uni.getStorageSync('userInfo').id
      },
      showSex: false,
      showBirthday: false,
      birthday: Number(new Date()),
      checkboxList: [],
      fileList6: [],
      rules: {
        userName: [
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
        practiceDuration: {
          type: 'string',
          required: true,
          message: '请输入执业时长',
          trigger: ['change', 'blur']
        },
        idNumber: [
          {
            type: 'string',
            required: true,
            message: '请输入身份证号',
            trigger: ['blur']
          },
          {
            // 此为同步验证，可以直接返回true或者false
            validator: (rule, value, callback) => {
              return uni.$u.test.idCard(value);
            },
            message: '身份证号码不正确',
            // 触发器可以同时用blur和change，二者之间用英文逗号隔开
            trigger: ['change', 'blur']
          }
        ],
        skills: {
          type: 'array',
          min: 2,
          required: true,
          message: '至少选两项',
          trigger: ['change']
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
    // 计算年龄
    getAge(birthday) {
      var today = new Date();
      var birthDate = new Date(birthday);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
    // 选择性别
    sexSelect(e) {
      this.attestationInfo.gender = e.name;
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
      const birthday = uni.$u.timeFormat(e.value, 'yyyy-mm-dd');
      this.attestationInfo.birthday = birthday;
      this.attestationInfo.age = this.getAge(birthday);
      this.$refs.formRef.validateField('birthday');
    },
    // 选择
    change(e) {
      console.log(e);
    },
    // 新增图片
    async afterRead(event) {
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      let lists = [].concat(event.file);
      let fileListLen = this[`fileList${event.name}`].length;
      lists.map(item => {
        this[`fileList${event.name}`].push({
          ...item,
          status: 'uploading',
          message: '上传中'
        });
      });
      for (let i = 0; i < lists.length; i++) {
        const result = await this.uploadFilePromise(lists[i].url);
        let item = this[`fileList${event.name}`][fileListLen];
        this[`fileList${event.name}`].splice(
          fileListLen,
          1,
          Object.assign(item, {
            status: 'success',
            message: '',
            url: result
          })
        );
        fileListLen++;
      }
    },
    // 删除图片
    deletePic(event) {
      this[`fileList${event.name}`].splice(event.index, 1);
    },
    uploadFilePromise(url) {
      let _this = this;
      return new Promise((resolve, reject) => {
        let a = uni.uploadFile({
          url: 'http://127.0.0.1:8081/qualification/upload',
          filePath: url,
          name: 'file',
          formData: {
            token: uni.getStorageSync('token')
          },
          success: res => {
            console.log(JSON.parse(res.data));
            let data = JSON.parse(res.data);
            _this.attestationInfo.certificate = data.data;
            console.log(_this.attestationInfo);
            console.log(_this);
            console.log(_this.attestationInfo.certificate);
            setTimeout(() => {
              resolve(res.data.data);
            }, 1000);
          }
        });
      });
    },
    submit() {
      // 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true

      this.$refs.formRef
        .validate()
        .then(async res => {
          if (this.fileList6.length == 0) {
            return uni.$u.toast('请上传医师资格证');
          }
          console.log(this.attestationInfo);
          const data = await this.$http.post('/qualification/authentication', this.attestationInfo);
          if (data.code !== 200) {
            return uni.$u.toast('上传信息失败，请稍后再试');
          }
          uni.$u.toast('上传信息成功，请等待审核');
          setTimeout(() => {
            uni.$u.route({
              url: '/subpackage-home/hospitalized/hospitalized',
              type: 'redirect'
            });
          }, 400);
        })
        .catch(errors => {
          uni.$u.toast('校验失败');
        });
    },
    reset() {
      const validateList = ['name', 'gender', 'birthday', 'practiceDuration', 'idNumber', 'skills'];
      this.$refs.formRef.resetFields();
      // 清空表单
      for (let key in this.attestationInfo) {
        this.attestationInfo[key] = '';
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
