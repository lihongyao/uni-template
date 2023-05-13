<script setup>
	import Utils from '@/utils/index.js';
	const onGoHome = () => {
		Utils.reLaunch("/pages/TabPages/index");
	}
</script>
<template>

	<view class="page">
		<view class=" text-center mb-30">
			<image class="icon-80x80" src="@/static/images/pay_success.png"></image>
		</view>
		<view class=" text-center ff-DIN-Bold f64 color-primary ls-2">
			支付成功
		</view>

		<view class="action-button flex-h-center color-FFFFFF f-900 " @click="onGoHome">
			返回首页
		</view>
	</view>
</template>

<style lang="less" scoped>
	.page {
		padding-top: 100rpx;
	}

	.action-button {
		width: 500rpx;
		height: 88rpx;
		background-color: #42b983;
		margin: 40rpx auto;
		border-radius: 40rpx;
	}
</style>
