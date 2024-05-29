<script setup>
	import Bus from '@likg/bus';
	import Utils from '@/utils';
	import { apiUser } from '@/api/apiServer/index.js'
	import { APP_KEY_LOGIN } from '@/constants';


	// -- events
	const onGetPhoneNumber = async ({ detail }) => {
		const { errMsg, code } = detail;
		console.log("手机号授权code：", code);
		Utils.loading("处理中...");
		setTimeout(() => {
			Utils.hideLoading();
			uni.setStorageSync(APP_KEY_LOGIN, true);
			Bus.$emit("LOGGED");
			Utils.pop();
		}, 1000);

		// if (/ok/.test(errMsg)) {
		// 	// -- 更新手机号
		// 	Utils.loading("处理中...");
		// 	const resp = await apiUser.bindPhone(code);
		// 	Utils.hideLoading();
		// 	uni.setStorageSync(APP_KEY_LOGIN, true);
		// 	Bus.$emit("LOGGED");
		// 	Utils.pop();
		// }
	}
	const onBack = () => {
		const pages = getCurrentPages();
		if (pages.length > 1) {
			Utils.pop();
		} else {
			Utils.reLaunch("/pages/TabPages/index")
		}
	}
</script>


<template>
	<view class="page">
		<image class="absolute-top" src="./images/bg1.png" mode="widthFix"></image>
		<view
			class="wrap position-relative zIndex-1 rounded-24 bg-secondary pt-70 px-48 mx-auto flex-v-center justify-content-start">
			<!-- logo -->
			<image class="icon-160x160" src="@/static/logo.png"></image>
			<!-- 店铺名称 -->
			<view class="f32 f-600 lh-44 mt-20" style="color: #202020;">产品名称</view>
			<!-- 获取手机号码 -->
			<view class="desc">为了我们更好的服务您，请使用微信快捷登录获取您的手机号码</view>
			<button class="button bg-primary" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">
				<image class="icon-44x44 mr-8" src="./images/icon_weixin.png"></image>
				<text>微信快捷登录</text>
			</button>
			<!-- 暂不登录 -->
			<view class="f28 lh-40 mt-40 f-400" style="color:#202020;" @click="onBack">暂不登录</view>
		</view>
	</view>
</template>


<style lang="less" scoped>
	.page {
		padding-top: 180rpx;

		.wrap {
			width: 670rpx;
			height: 884rpx;
		}

		.desc {
			height: 108rpx;
			margin-top: 40rpx;
			font-size: 26rpx;
			color: #999999;
		}

		.button {
			width: 400rpx;
			height: 88rpx;
			color: #FFFFFF;
			font-size: 32rpx;
			border-radius: 48rpx;
			margin-top: 100rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>