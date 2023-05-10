<script setup>
	// -- imports 
	import { onLoad } from '@dcloudio/uni-app';
	import Utils from '@/utils/index.js';

	// -- life circles 
	onLoad(() => {
		uni.hideHomeButton();
	})
	// -- events 
	const onChooseImage = () => {
		uni.chooseMedia({
			count: 1,
			mediaType: ['image'],
			sourceType: ["album"],
			sizeType: ['original', 'compressed'],
			success(res) {
				const tempFilePaths = res.tempFiles;
				console.log(tempFilePaths);
				uni.navigateTo({
					url: "/pages/upload/uploading",
					success(res) {
						res.eventChannel.emit("acceptTempFilePaths", { tempFilePaths })
					}
				})
			}
		})
	}
</script>



<template>
	<view class="page px-32 pt-40">
		<!-- 标题描述 -->
		<view class="f36 lh-40" style="color: #171717;">选择一种上传方式</view>
		<view class="f24 lh-34 mt-20 color-666666">简历建议使用PDF文件，同时支持DOC、DOCX、JPG、PNG格式，大小不超过20M</view>
		<!-- 上传选择 -->
		<view class="list">
			<!-- 微信上传 -->
			<view class="item flex-h-between" @click="Utils.push('/pages/upload/uploadForWeixin')">
				<view class="flex-h-start flex-1">
					<image class="icon-72x72" src="./images/icon_weixin.png"></image>
					<view class="flex-h-start ml-20">
						<text class="f32 color-222222">微信上传</text>
						<view class="tag flex-h-center">推荐</view>
					</view>
				</view>
				<image class="icon-32x32" src="./images/icon_right.png"></image>
			</view>
			<!-- 手机文件上传 -->
			<view class="item flex-h-between" @click="onChooseImage">
				<view class="flex-h-start flex-1">
					<image class="icon-72x72" src="./images/icon_local.png"></image>
					<view class="flex-h-start ml-20">
						<text class="f32 color-222222">手机文件上传</text>
					</view>
				</view>
				<image class="icon-32x32" src="./images/icon_right.png"></image>
			</view>
		</view>
	</view>
</template>


<style lang="less" scoped>
	.list {
		margin-top: 32rpx;

		.item {
			height: 136rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
			margin-bottom: 24rpx;
			padding: 0 32rpx;

			.tag {
				width: 64rpx;
				height: 36rpx;
				margin-left: 12rpx;
				background: rgba(255, 175, 4, 0.1);
				border-radius: 8rpx;
				border: 2rpx solid #FFDD96;
				font-size: 22rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #F67F00;
			}
		}
	}
</style>