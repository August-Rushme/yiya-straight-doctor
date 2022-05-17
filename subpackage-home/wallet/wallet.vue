<template>
  <view class="page">
    <view class="bgBlock"></view>
    <view class="ellipse px-3">
      <view class="wallet-card px-4 pt-4 pb-1">
        <view class="d-flex a-center">
          <image
            src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/wallet2.png"
            mode="heightFix"
            style="height: 35rpx;"
          ></image>
          <text class=" pl-1" style="color: rgba(2550, 255, 255, .8)">我的余额</text>
        </view>

        <view class="d-flex j-sb a-center">
          <text class="font-weight money">2120</text>
          <view class="set-wallet" @click="waitting">完善钱包</view>
        </view>
      </view>
    </view>

    <view class="d-flex j-sb  mx-3 wallet-operation" style="margin-top: 80rpx;">
      <view class="p-2 recharge">
        <view>
          <view class="font-md font-weight">钱包充值</view>
          <view class="toRecharge" @click="waitting">去充值 ></view>
        </view>
        <image
          src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/wallet3.png"
          mode="heightFix"
          class="img"
        ></image>
      </view>
      <view class="p-2 withdrawal">
        <view>
          <view class="font-md font-weight">钱包提现</view>
          <view class="toWithdrawal" @click="waitting">去提现 ></view>
        </view>
        <image
          src="https://oss-augustrush.oss-cn-shenzhen.aliyuncs.com/yayiImage/money.png"
          mode="heightFix"
          class="img"
        ></image>
      </view>
    </view>

    <view class="mx-3 mt-4 mb-2">
      <uni-card is-full spacing="5px">
        <view class="border-bottom font-md font-weight pb-2">资金明细</view>
        <block v-for="(item, index) in moneyDatail" :key="index">
          <view class="detail d-flex j-sb py-2">
            <view>
              <view class="font-md">{{ item.reason }}</view>
              <view class="text-light-muted" style="padding-top: 5rpx;font-size: 24upx;">{{ item.time }}</view>
            </view>

            <view>
              <view class="font-md font-weight" style="text-align: end;">{{ item.reducedAmount }}</view>
              <view class="text-light-muted" style="padding-top: 5rpx;font-size: 24upx;">
                余额 {{ item.remainingAmount }}
              </view>
            </view>
          </view>
        </block>
      </uni-card>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      moneyDatail: [
        {
          reason: '牙齿美白套餐',
          time: '2022-05-01 17:53:04',
          reducedAmount: '+178.00',
          remainingAmount: '2189.00'
        },
        {
          reason: '牙齿美白套餐',
          time: '2022-05-01 17:53:04',
          reducedAmount: '+178.00',
          remainingAmount: '2189.00'
        },
        {
          reason: '牙齿美白套餐',
          time: '2022-05-01 17:53:04',
          reducedAmount: '+178.00',
          remainingAmount: '2189.00'
        },
        {
          reason: '牙齿美白套餐',
          time: '2022-05-01 17:53:04',
          reducedAmount: '+178.00',
          remainingAmount: '2189.00'
        }
      ]
    };
  },
  methods: {
    waitting() {
      uni.$u.toast('功能待完善');
    }
  }
};
</script>

<style scoped lang="scss">
.page {
  background-color: #f8f8fb;
  min-height: 100vh;
  .bgBlock {
    width: 750rpx;
    height: 220rpx;
    background-color: #55a2ef;
  }
  .ellipse {
    position: relative;
    width: 750rpx;
    height: 120rpx;
    border-radius: 375rpx/60rpx;
    margin-top: -60rpx;
    background-color: #55a2ef;
    .wallet-card {
      position: absolute;
      top: -80rpx;
      background: linear-gradient(
        to right bottom,
        rgba(255, 255, 255, 0.6),
        rgba(255, 255, 255, 0.3),
        rgba(255, 255, 255, 0.2)
      );
      backdrop-filter: blur(11rpx);
      border-top: 1rpx solid rgba(255, 255, 255, 0.8);
      border-left: 1rpx solid rgba(255, 255, 255, 0.8);
      box-shadow: 6rpx 6rpx 20rpx #82bbf3;
      width: 690rpx;
      border-radius: 15rpx;
    }
  }

  .set-wallet {
    width: 200rpx;
    height: 70rpx;
    line-height: 70rpx;
    font-weight: 700;
    letter-spacing: 1rpx;
    text-align: center;
    border-radius: 30rpx;
    // box-shadow: 0 10rpx 10rpx #ffeb9c;
    background: transparent;
    backdrop-filter: blur(3px);
    border-left: 2rpx solid rgba(255, 255, 255, 0.3);
    border-top: 2rpx solid rgba(255, 255, 255, 0.3);
    box-shadow: 2rpx 2rpx 2rpx rgba(0, 0, 0, 0.2);
    text-shadow: 2rpx 2rpx 2rpx rgba(0, 0, 0, 0.2);
    font-family: 'Berlin Sans FB';
    color: white;
  }

  .money {
    font-size: 80upx;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 1px 1px 3px #949393;
  }
  .recharge {
    position: relative;
    width: 320rpx;
    border-radius: 20rpx;
    background: linear-gradient(to right, #88d1f1, #55a2ef);
    box-shadow: 0rpx 0rpx 8rpx 2rpx #77c1f0;
    .toRecharge {
      background-color: #005b7d;
      margin-top: 10rpx;
      height: 60rpx;
      line-height: 50rpx;
      width: 140rpx;
      text-align: center;
      border-radius: 0 30rpx 30rpx 30rpx;
      color: white;
    }
    .img {
      position: absolute;
      height: 120rpx;
      top: 25rpx;
      right: 0rpx;
    }
  }
  .withdrawal {
    position: relative;
    width: 320rpx;
    border-radius: 20rpx;
    background: linear-gradient(to right, #ffd945, #efbc24);
    box-shadow: 0rpx 0rpx 8rpx 2rpx #f3d16f;
    .toWithdrawal {
      background-color: #ff943f;
      margin-top: 10rpx;
      height: 60rpx;
      line-height: 50rpx;
      width: 140rpx;
      text-align: center;
      border-radius: 0 30rpx 30rpx 30rpx;
      color: white;
    }
    .img {
      position: absolute;
      height: 117rpx;
      top: 25rpx;
      right: 10rpx;
    }
  }
  .wallet-operation {
    color: white;
  }
}
</style>
