<template>
  <view>
    <view class="header">
      <view class="onPatient m-2" :style="{ background: patientBackground }">
        <text
          class="font-big p-status"
          @click="handlePatient"
          :style="{ color: fontColor, 'margin-top': top, 'margin-left': left, 'font-size': size }"
        >
          {{ patitentStatus }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      patitentStatus: '开诊',
      statusForm: {
        id: uni.getStorageSync('userInfo').id || 17,
        status: 0
      },
      patientBackground:
        '#378bf9 url(https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/img/10.png) no-repeat center',
      fontColor: '',
      top: '110rpx',
      left: '260rpx',
      size: '80rpx'
    };
  },
  methods: {
    // 节流
    handlePatient() {
      // uni.setStorageSync(
      //   'token',
      //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTE0ODk3NDQsInVzZXJJZCI6MTd9.iTx6IrrZhLBNep4PHhqurO52yhLcUN-znuVsC3MK9us'
      // );
      uni.$u.throttle(
        async () => {
          if (this.patitentStatus === '开诊') {
            this.statusForm.status = 1;

            const res = await this.$http.post('/doctor/updateDoctorStatus', this.statusForm);
            if (res.code !== 200) {
              return this.$u.toast('状态切换失败，请稍后再试试！');
            }
            this.$u.toast('状态切换成功！');
            uni.setStorageSync('patientStatus', 1);
            this.patitentStatus = '下诊';
            this.patientBackground =
              '#b24d4b url(https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/img/11.png) no-repeat center';
            this.fontColor = '#ffffff';
            this.top = '220rpx';
            this.left = '540rpx';
            this.size = '60rpx';
          } else {
            this.statusForm.status = 0;
            const res = await this.$http.post('/doctor/updateDoctorStatus', this.statusForm);
            if (res.code !== 200) {
              return this.$u.toast('状态切换失败，请稍后再试试！');
            }
            this.$u.toast('状态切换成功！');
            uni.setStorageSync('patientStatus', 0);

            this.patitentStatus = '开诊';
            this.patientBackground =
              '#378bf9 url(https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/img/10.png) no-repeat center';
            this.fontColor = '#f2feff';
            this.top = '110rpx';
            this.left = '260rpx';
            this.size = '80rpx';
          }
        },
        1000,
        true
      );
    }
  }
};
</script>

<style scoped lang="scss">
.onPatient {
  width: 710rpx;
  height: 350rpx;
  display: flex;
  border-radius: 20rpx;
}
.p-status {
  color: #f2feff;
  font-weight: 500;
}
</style>
