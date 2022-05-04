<template>
  <view>
    <!-- 头部 -->
    <index-header></index-header>
    <!--  <view class="font-lg ml-2" style="color: #666;">预约大厅</view> -->
    <!-- 搜索区 -->
    <index-search
      pageName="index"
      @searchHandle="handleSearch"
      @clearHandler="handleClear"
      placeholder="项目名称"
    ></index-search>
    <!-- 订单列表区域 -->
    <index-list :appointmentList="appointmentList" @reGetAppointment="reGetAppointment"></index-list>
  </view>
</template>

<script>
import indexHeader from '@/components/index/index-header.vue';
import indexSearch from '@/components/common/search.vue';
import indexList from '@/components/index/index-list.vue';
export default {
  components: { indexHeader, indexSearch, indexList },
  data() {
    return {
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        query: ''
      },
      appointmentList: []
    };
  },
  onLoad() {
    this.getAppointmentList();
  },
  async onPullDownRefresh() {
    this.pageInfo = {
      pageNum: 1,
      pageSize: 5,
      query: ''
    };
    const res = await this.$http.post('/patient/getPatient', this.pageInfo);
    this.appointmentList = res.data.list;
    if (res.code == 200) {
      uni.stopPullDownRefresh();
    }
  },
  onShow() {
    this.pageInfo = {
      pageNum: 1,
      pageSize: 5,
      query: ''
    };
    this.getAppointmentList();
  },
  async onReachBottom() {
    this.pageInfo.pageNum++;
    uni.showLoading({
      title: '加载中'
    });
    const { data: res } = await this.$http.post('/patient/getPatient', this.pageInfo);
    if (res.list.length > 0) {
      uni.hideLoading();
      this.appointmentList.push(...res.list);
    } else {
      uni.hideLoading();
      uni.showToast({
        title: '没有更多数据了',
        icon: 'none'
      });
    }
  },
  methods: {
    // 获取预约订单列表
    async getAppointmentList() {
      const { data: res } = await this.$http.post('/patient/getPatient', this.pageInfo);
      this.appointmentList = res.list;
    },
    // 处理搜索
    handleSearch(res) {
      this.appointmentList = res.list;
    },
    // 处理清空搜索
    handleClear(res) {
      this.appointmentList = res.list;
    },
    // 接单成功后刷新数据
    reGetAppointment() {
      this.pageInfo = { pageNum: 1, pageSize: 4, query: '' };
      this.getAppointmentList();
    }
  }
};
</script>

<style scoped lang="scss"></style>
