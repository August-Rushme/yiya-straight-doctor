<template>
  <view>
    我的申请{{ status }}
    <view class="aaa">
   

      <!--   <sl-period :schedule="item"></sl-period> -->
      <!--     <sl-periodpicker :schedule="item" /> -->
    </view>
  </view>
</template>

<script>

export default {
 
  data() {
    return {
      status: '',
      startTime: '2022-05-05 08:00:00',
      endTime: '2022-05-05 10:00:00',
      item: {
        start: '2021-11-30 2021-11-30 08:50:00',
        end: '2021-11-30 2021-11-30 10:30:00',
        user: '产品技术部-某某某',
        length: 13.33,
        x: 6.67,
        remark: 1
      }
    };
  },
  onLoad(option) {
    this.status = option.status;
  },
  methods: {}
};
</script>

<style></style>
