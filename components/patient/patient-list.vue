<template>
  <view>
    <view class="medicalRecord  mt-2">
      <uni-section title="我的预约" type="line">
        <block v-for="(item, index) in medicalRecordData" :key="index">
          <uni-card @click="handlePatientClick(item.id, item.appointmentId)">
            <view class="content">
              <view class="user_img position-absolute ">
                <u--image
                  v-if="item.gender === '男'"
                  src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/man.png"
                  width="50"
                  height="50"
                  shape="circle"
                ></u--image>
                <u--image
                  v-if="item.gender === '女'"
                  src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/woman.png"
                  width="50"
                  height="50"
                  shape="circle"
                ></u--image>
              </view>
              <view class="patient-content">
                <view class="d-flex j-sb ">
                  <view class="a-center d-flex j-start">
                    <view class="name font-weight mr-3 font-md">{{ item.userName }}</view>

                    <text class="mr-2 font-sm" v-if="item.gender === '男'" style="color: #1f86f7;">男</text>
                    <text class="mr-2 font-sm" v-if="item.gender === '女'" style="color: #d45a8f;">女</text>
                    <text class="font-sm font-weight">{{ item.age }}岁</text>
                  </view>
                  <view class="a-center d-flex j-start">
                    <view class="label mr-2">医生:</view>
                    <view>{{ item.doctor }}</view>
                  </view>
                </view>
                <view class="d-flex j-sb mt-1">
                  <view class="a-center d-flex j-start">
                    <view class="label mr-2">入诊:</view>
                    <view class="" style="color: #999999;">{{ item.time }}</view>
                  </view>
                  <view class="content  a-center d-flex j-end">
                    <u-button
                      type="primary"
                      size="mini"
                      @click.native.stop="handleRemind(item.time)"
                      :disabled="item.time == '未入诊' ? false : true"
                    >
                      提醒看诊
                    </u-button>
                  </view>
                </view>
              </view>
            </view>
          </uni-card>
        </block>
      </uni-section>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    medicalRecordData: Array
  },
  data() {
    return {
      disabled: false,
      recordData: []
    };
  },

  methods: {
    handlePatientClick(id, appointmentId) {
      uni.$u.route({
        url: '/subpackage-patient/patient-detail/patient-detail',
        params: {
          id,
          appointmentId
        }
      });
    },
    handleRemind(time) {
      if (time !== '未入诊') {
        return;
      }
      uni.$u.toast('提醒成功');
    }
  }
};
</script>

<style scoped lang="scss">
.user_img {
  margin-left: -25rpx;
}
.patient-content {
  margin-left: 90rpx;
}
</style>
