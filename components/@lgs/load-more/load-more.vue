<script setup>
	// -- props 
	const props = defineProps({
		title: { type: String, default: "———— 我是有底线的 ————" },
		hasMore: { type: Boolean, default: false }
	})
</script>


<template>
	<view class="lg-load-more">
		<text v-if="props.hasMore">数据加载中 ···</text>
		<text v-else>{{ title }}</text>
	</view>
</template>


<style lang="less" scoped>
	.lg-load-more {
		padding: 40rpx 0 100rpx;
		font-size: 28rpx;
		line-height: 32rpx;
		color: #A5A5A5;
		text-align: center;
	}
</style>
