<script setup>
	// -- props 
	const props = defineProps({
		tips: { type: String, default: "———— End ————" },
		showTips: { type: Boolean, default: true },
		hasMore: { type: Boolean, default: false }
	})
</script>


<template>
	<view class="lg-load-more">
		<text v-if="hasMore">数据加载中 ···</text>
		<text v-if="showTips && !hasMore">{{ tips }}</text>
	</view>
</template>


<style lang="less" scoped>
	.lg-load-more {
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
		padding: 40rpx 0 100rpx;
		font-size: 28rpx;
		line-height: 32rpx;
		color: #E3E6EB;
		text-align: center;
	}
</style>
