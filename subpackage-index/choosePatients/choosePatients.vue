<template>
  <view>
    <u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png" title="数据为空" v-if="isEmpty"></u-empty>
    <view class="content" v-if="!isEmpty">
      <patient-search
        placeholder="姓名"
        pageName="patient"
        @searchHandle="handleSearch"
        @clearHandler="handleClear"
      ></patient-search>
      <!-- 标签区域 -->
      <view class="d-flex j-start mt-2">
        <view v-for="(item, index) in radios" :key="index" class="px-2">
          <u-tag
            :text="item.text"
            :plain="!item.checked"
            borderColor="#f5f5f5"
            color="#333333"
            :name="index"
            @click="radioClick"
          ></u-tag>
        </view>
      </view>
      <!-- 病历区域 -->
      <view class="medicalRecord border mt-2">
        <uni-section title="我的预约" type="line">
          <block v-for="(item, index) in medicalRecordData" :key="index">
            <uni-card @click="handlePatientClick(item)">
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
                    <view class="content  a-center d-flex j-end"></view>
                  </view>
                </view>
              </view>
            </uni-card>
          </block>
        </uni-section>
      </view>
    </view>
  </view>
</template>

<script>
import patientSearch from '@/components/common/search.vue';
export default {
  components: {
    patientSearch
  },
  data() {
    return {
      radios: [{ text: '全部', checked: true }, { text: '待看诊', checked: false }, { text: '时间', checked: false }],
      medicalRecordData: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        doctorId: 1
      },
      isEmpty: true,
      params: {},
      startTime: '',
      endTime: '',
      date: ''
    };
  },
  onShow() {
    this.getPatientList();
    this.radios = [
      { text: '全部', checked: true },
      { text: '待看诊', checked: false },
      { text: '时间', checked: false }
    ];
  },
  onLoad(option) {
    this.startTime = option.startTime;
    this.endTime = option.endTime;
    this.date = option.date;
    console.log(option);
  },
  methods: {
    handlePatientClick(item) {
      this.params = {
        gender: item.gender,
        age: item.age,
        userName: item.userName,
        doctor: item.doctor,
        time: item.time,
        startTime: this.startTime,
        endTime: this.endTime,
        date: this.date,
        id: item.id
      };
      uni.$u.route({
        type: 'redirect',
        url: '/subpackage-index/scheduleDetails/scheduleDetails',
        params: {
          ...this.params
        }
      });
      console.log(item);
    },
    async radioClick(name) {
      this.radios.map((item, index) => {
        item.checked = index === name ? true : false;
      });
      console.log(name);
      const { data: res } = await this.$http.post('/doctor/getPatientsByTagId', { ...this.pageInfo, tagId: name });
      res.list.forEach(item => {
        if (item.time == '0') {
          item.time = '未入诊';
        }
      });
      this.medicalRecordData = res.list;
    },
    // 获取患者列表
    async getPatientList() {
      const { data: res } = await this.$http.post('/doctor/getPatients', this.pageInfo);
      res.list.forEach(item => {
        if (item.time == '0') {
          item.time = '未入诊';
        }
      });

      this.medicalRecordData = res.list;
      if (res.list.length > 0) {
        this.isEmpty = false;
      }
    },
    // 处理搜索
    handleSearch(res) {
      this.medicalRecordData = res.list;
    },
    // 处理清空搜索
    handleClear(res) {
      this.medicalRecordData = res.list;
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
