<script setup>
	// -- props 
	const props = defineProps({
		/** 标题 */
		title: { type: String, default: 'END' },
		/** 前景色 */
		color: { type: String, default: '#999999' }
	})
</script>


<template>
	<view class="lg-divider" :style="{'--tint-color': color}">
		<view class="__line">————</view>
		<view class="__title">{{title}}</view>
		<view class="__line">————</view>
	</view>
</template>

<style lang="less" scoped>
	.lg-divider {
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: content-box;
		padding-top: 20rpx;
		padding-bottom: 50rpx;
		font-size: 28rpx;
		color: var(--tint-color);
		.__title {
			margin: 0 10rpx;
		}
	}
</style>