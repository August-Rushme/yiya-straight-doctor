<template>
	<view class="page">
		<!-- 标题 -->
		<view class="p-2" style="background-color: white;">
			<view class="d-flex j-sb py-1 border-bottom">
				<text>医生</text>
				<text>{{medicalDetail.doctor}}</text>
			</view>
			<view class="d-flex j-sb py-1">
				<text>就诊时间</text>
				<text>{{medicalDetail.time}}</text>
			</view>
		</view>
		<!-- 病例详情 -->
		<view class="mt-2 p-2" style="background-color: white;">
			<view class="border-bottom">
				<view class="py-2">诊断</view>
				<view class="imgCard mb-2">
					<view class="img mt-5">
						<view class="left text-end">{{medicalDetail.handleImageScore}}</view>
						<view class="right"></view>
					</view>
					<view class="text-light-muted p-2">
						牙纵裂
					</view>
				</view>
			</view>
		<view class="border-bottom">
			<view class="py-2">处置</view>
			<view class="imgCard mb-2">
				<view class="img mt-5">
					<view class="left text-end">5</view>
					<view class="right"></view>
				</view>
				<view class="text-light-muted p-2">
				 {{medicalDetail.handle}}
				</view>
			</view>
		</view>
		<view class="mt-2">
			<view >备注</view>
			<view class="text-muted">
				{{medicalDetail.advice}}
			</view>
		</view>
		</view>
	</view>
</template>

<script>
	import { mapActions } from 'vuex'
export default {
	data() {
		return {
			medicalDetail: {
				
			}
		};
	},
 async onLoad(options) {
		const id = parseInt(options.id)
	   const res = await this.getMedicalDetailAction(id);
	   this.medicalDetail = res;
	},
	methods: {
		...mapActions(['getMedicalDetailAction'])
	}
};
</script>

<style scoped lang="scss">
.page {
	min-height: 100vh;
	background-color: #f4f4f4;
	.imgCard {
		border: 2rpx solid #f4f4f4;
		border-radius: 15rpx;
		.img {
			position: relative;
			height: 152rpx;
			background-color: #f4f4f4;
			color:#22b1ac;
			.left {
				width: 50%;
				height: 50%;
				line-height: 76rpx;
				border-right: 2rpx solid #22b1ac;
				border-bottom: 2rpx solid #22b1ac;
			}
			.right {
				position: absolute;
				width: calc(50% + 1px);
				height: calc(50% + 1px);
				right: 0;
				bottom: 0;
				border-left: 2rpx solid #22b1ac;
				border-top: 2rpx solid #22b1ac;
			}
		}
	}
}
</style>
