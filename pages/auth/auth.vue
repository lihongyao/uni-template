<script setup>
	import Bus from '@likg/bus';
	import Utils from '@/utils';
	import { apiUser } from '@/api/apiServer/index.js'
	import { APP_KEY_LOGIN } from '@/constants';
	import IconCheck from '@/components/@lgs/IconCheck/IconCheck.vue';
	import { reactive } from 'vue';

	// -- state
	const state = reactive({
		checked: false
	})
	


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
	const onCheckboxChange = (checked) => {
		state.checked = checked;
	}
	const onShowTips = () => {
		return Utils.toast("请阅读并同意用户协议和隐私政策");
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
			<view class="desc f26 mt-40 color-666666">为了我们更好的服务您，请使用手机号快捷登录获取您的手机号码。</view>
			<button v-if="state.checked" class="button rounded-48 flex-h-center bg-primary color-FFFFFF f32 "
				open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">
				手机号快捷登录
			</button>
			<button v-else class="button rounded-48 flex-h-center bg-primary color-FFFFFF f32"
				@tap="onShowTips">手机号快捷登录</button>
			<!-- 暂不登录 -->
			<view class="f28 lh-40 mt-40 f-400" style="color:#202020;" @click="onBack">暂不登录</view>
			<!-- 用户协议 & 隐私政策 -->
			<view class="protocol flex-h-start f26 mt-20">
				<icon-check v-model="state.checked" @change="onCheckboxChange" class="mr-10"></icon-check>
				<text>我已阅读并同意</text>
				<text class="link mx-10">用户协议</text>
				<text>及</text>
				<text class="link mx-10">隐私政策</text>
			</view>
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
		}

		.button {
			width: 400rpx;
			height: 88rpx;
		}

		.protocol {
			color: rgba(0, 0, 0, .36);
		}

		.link {
			color: #6495ED;
		}
	}
</style>