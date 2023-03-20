<script setup>
	import { defineProps } from 'vue';

	// -- props
	const props = defineProps({
		checked: { type: Boolean, default: false }
	})
</script>


<template>
	<view class="icon-check" :class="{checked}">
		<view class="icon-check__inner"></view>
	</view>
</template>


<style lang="less" scoped>
	.icon-check {
		width: 32rpx;
		height: 32rpx;
		border-radius: 50%;
		position: relative;
		box-sizing: border-box;
		border: 2rpx solid #D0D0D0;

		&__inner {
			width: 16rpx;
			height: 16rpx;
			background-color: #1946BB;
			border-radius: 50%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			opacity: 0;
		}

		&.checked {
			border-color: #1946BB;

			.icon-check__inner {
				opacity: 1;
			}
		}
	}
</style>
