<script setup>
	// -- imports 
	import { defineProps } from 'vue';
	import defaultImage from './images/no-data__7.png'
	// -- props
	const props = defineProps({
		src: { type: String, default: defaultImage },
		tips: { type: String, default: '' },
		top: { type: Number, default: 50 },
	});
</script>

<template>
	<view class="no-data" :style="{paddingTop: top + 'rpx'}">
		<image class="no-data__img" :src="src" mode="widthFix"></image>
		<view class="no-data__tips">
			{{tips}}
		</view>
	</view>
</template>



<style lang="less" scoped>
	.no-data {
		text-align: center;
		padding: 50rpx;

		&__img {
			width: 406rpx;
		}

		&__tips {
			margin-top: 26rpx;
			font-size: 28rpx;
			color: rgba(0, 0, 0, .36);
			letter-spacing: 2rpx;
		}
	}
</style>