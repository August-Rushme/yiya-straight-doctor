<template>
  <view class="parient">
    <u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png" title="数据为空" v-if="isEmpty"></u-empty>
    <view class="content-patient" v-if="!isEmpty">
      <patient-search
        placeholder="姓名"
        pageName="patient"
        @searchHandle="handleSearch"
        @clearHandler="handleClear"
      ></patient-search>
      <!-- 标签区域 -->
      <view class="d-flex mt-2 j-sb">
        <view class="d-flex j-start">
          <block v-for="(item, index) in radios" :key="index">
            <view class="px-2">
              <u-tag
                :text="item.text"
                :plain="!item.checked"
                borderColor="#f5f5f5"
                color="#333333"
                :name="index"
                @click="radioClick"
              ></u-tag>
            </view>
          </block>
        </view>
        <view class="mr-3">
          <u-button type="primary" size="mini" icon="plus" @click="handleNewPatient">新建患者</u-button>
        </view>
      </view>
      <!-- 病历区域 -->
      <patient-list :medicalRecordData="medicalRecordData"></patient-list>
    </view>
  </view>
</template>

<script>
import patientSearch from '@/components/common/search.vue';
import patientList from '@/components/patient/patient-list.vue';
export default {
  components: {
    patientSearch,
    patientList
  },
  data() {
    return {
      token: '',
      radios: [{ text: '全部', checked: true }, { text: '待看诊', checked: false }, { text: '时间', checked: false }],
      medicalRecordData: [],
      isEmpty: true,
      pageInfo: {
        pageNum: 1,
        pageSize: 6,
        doctorId: 1
      }
    };
  },
  onLoad() {
    this.getPatientList();
    // this.token = uni.getStorageSync('token');
  },
  async onPullDownRefresh() {
    this.pageInfo = {
      pageNum: 1,
      pageSize: 6,
      doctorId: 1
    };
    const res = await this.$http.post('/doctor/getPatients', this.pageInfo);
    res.data.list.forEach(item => {
      if (item.time == '0') {
        item.time = '未入诊';
      }
    });

    this.medicalRecordData = res.data.list;
    if (res.code == 200) {
      uni.stopPullDownRefresh();
    }
    if (res.data.list.length > 0) {
      this.isEmpty = false;
    }
  },
  async onReachBottom() {
    this.pageInfo.pageNum++;
    uni.showLoading({
      title: '加载中'
    });
    const { data: res } = await this.$http.post('/doctor/getPatients', this.pageInfo);
    if (res.list.length > 0) {
      this.isEmpty = false;
    }
    res.list.forEach(item => {
      if (item.time == '0') {
        item.time = '未入诊';
      }
    });
    if (res.list.length > 0) {
      uni.hideLoading();
      this.medicalRecordData.push(...res.list);
    } else {
      uni.hideLoading();
      uni.showToast({
        title: '没有更多数据了',
        icon: 'none'
      });
    }
  },
  onShow() {
    this.pageInfo = {
      pageNum: 1,
      pageSize: 6,
      doctorId: 1
    };
    this.getPatientList();
    this.radios = [
      { text: '全部', checked: true },
      { text: '待看诊', checked: false },
      { text: '时间', checked: false }
    ];
  },
  methods: {
    async radioClick(name) {
      this.radios.map((item, index) => {
        item.checked = index === name ? true : false;
      });
      this.pageInfo = {
        pageNum: 1,
        pageSize: 6,
        doctorId: 1
      };
      const { data: res } = await this.$http.post('/doctor/getPatientsByTagId', { ...this.pageInfo, tagId: name });
      res.list.forEach(item => {
        if (item.time == '0') {
          item.time = '未入诊';
        }
      });
      if (res.list.length > 0) {
        this.isEmpty = false;
      }
      this.medicalRecordData = res.list;
    },
    // 获取患者病历列表
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
    // 新建患者
    handleNewPatient() {
      uni.$u.route('/subpackage-patient/new-patient/new-patient');
    },
    // 处理搜索
    handleSearch(res) {
      res.list.forEach(item => {
        if (item.time == '0') {
          item.time = '未入诊';
        }
      });
      this.medicalRecordData = res.list;
    },
    // 处理清空搜索
    handleClear(res) {
      res.list.forEach(item => {
        if (item.time == '0') {
          item.time = '未入诊';
        }
      });
      this.medicalRecordData = res.list;
    }
  }
};
</script>

<style></style>
