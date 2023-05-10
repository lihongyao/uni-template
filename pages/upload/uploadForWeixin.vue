<script setup>
	// -- imports 
	import { onLoad } from '@dcloudio/uni-app';
	import Utils from '@/utils/index.js';
	import { reactive } from "vue";

	// -- state 
	const state = reactive({
		q: ''
	})
	// -- life circles
	onLoad(({ q }) => {
		state.q = q;
	});
	// -- events 
	const onUpload = () => {
		uni.chooseMessageFile({
			count: 1,
			type: 'all',
			success(res) {
				const tempFilePaths = res.tempFiles;
				uni.navigateTo({
					url: "/pages/upload/uploading" + state.q ? '?q=app' : '',
					success(res) {
						res.eventChannel.emit("acceptTempFilePaths", { tempFilePaths })
					}
				})
			}
		})
	}
</script>


<template>
	<view class="px-32 pt-40">
		<!-- 标题描述 -->
		<view class="f36 lh-40" style="color: #171717;">轻松上传文件</view>
		<view class="f24 lh-34 mt-20 color-666666">将文件发送微信（文件传输助手、自己或好友），在本页面点击“立即上传”，选择刚才发送文件的聊天对象，选择文件，点击确认即可上传成功</view>
		<!-- Tips -->
		<view class="tips flex-h-center">
			<image src="./images/tips.gif" mode="widthFix"></image>
		</view>
		<!-- 上传按钮 -->
		<view class="upload-btn flex-h-center" @click="onUpload">立即上传</view>
	</view>
</template>


<style lang="less" scoped>
	.tips {
		min-height: 500rpx;
		margin-top: 32rpx;
		background: #E6E8F2;
	}

	.upload-btn {
		height: 96rpx;
		margin-top: 48rpx;
		background: linear-gradient(90deg, #7650FF 0%, #8872FF 100%);
		border-radius: 16rpx;
		color: #FFFFFF;
		font-family: PingFangSC-Medium, PingFang SC;
		font-size: 28rpx;
		font-weight: 500;
	}
</style>