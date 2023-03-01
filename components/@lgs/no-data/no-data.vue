<script setup>
	
	import { defineProps } from 'vue';
	// -- props
	const props = defineProps({
		tips: { type: String, default: '' },
		top: { type: Number, default: 50 }
	})
	
</script>

<template>
	<view class="no-data" :style="{paddingTop: top + 'rpx'}">
		<image class="no-data__img" src="./images/no-data__4.png" mode="widthFix"></image>
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
			width: 75%;
		}

		&__tips {
			margin-top: 26rpx;
			font-size: 28rpx;
			color: #999999;
			letter-spacing: 2rpx;
		}
	}
</style>
