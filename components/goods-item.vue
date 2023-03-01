<script setup></script>


<template>
	<view class="goods-item flex-h-center px-20 rounded-12 align-items-start pt-30 pl-20 pr-30 pb-32">
		<image class="icon-190x190 bg-F9F9F9 flex-shrink rounded-12" />
		<view class="flex-1 ml-20">
			<view class="f28 flex-h-between">
				<view>苹果</view>
				<view class="categories">浆果类</view>
			</view>
			<view class="line-clamp-2 f24 color-555555 mt-16 mb-26">描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息</view>
			<view class="flex-h-between f24 ff-DIN-Bold color-A5A5A5">
				<view class="">销售价格：<label class="color-FF004C f-900">￥123</label>/斤</view>
				<view class="">销售笔数：12321</view>
			</view>
		</view>
	</view>
</template>


<style lang="less" scoped>

	.goods-item {
		background-color: #ffffff;
		margin-bottom: 10px;
		.categories {
			padding: 0 12rpx;
			font-size: 20rpx;
			background-color: #42b983;
			color: #F9F9F9;
			border-radius: 20rpx;
		}
	}
</style>
