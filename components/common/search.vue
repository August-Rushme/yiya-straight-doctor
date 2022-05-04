<template>
  <view>
    <view class="search-area p-2">
      <u-search
        :placeholder="placeholder"
        v-model="keyword"
        :clearabled="true"
        :showAction="false"
        @clickIcon="clickIcon"
        @change="handleInputChange"
        @clear="handleClear"
      ></u-search>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '请输入关键词'
    },
    pageName: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      keyword: ''
    };
  },
  methods: {
    // 处理输入框输入
    handleInputChange(value) {
      this.keyword = value;
    },
    async clickIcon() {
      let pageUrl = '';
      switch (this.$props.pageName) {
        case 'patient':
          pageUrl = '/doctor/getPatients';
          break;
        case 'index':
          pageUrl = '/patient/searchPatient';
          break;
      }

      const { data: res } = await this.$http.post(pageUrl, { doctorId: 1, name: this.keyword, project: this.keyword });
      this.$emit('searchHandle', res);
      uni.$u.toast('搜索');
    },

    // 清空搜索
    async handleClear() {
      let pageUrl = '';
      switch (this.$props.pageName) {
        case 'patient':
          pageUrl = '/doctor/getPatients';
          break;
        case 'index':
          pageUrl = '/patient/getPatient';
          break;
      }
      const { data: res } = await this.$http.post(pageUrl, { pageNum: 1, pageSize: 15, doctorId: 1 });
      this.$emit('clearHandler', res);
    }
  }
};
</script>

<style></style>
