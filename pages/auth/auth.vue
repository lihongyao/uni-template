<script setup>
	import { reactive, onMounted } from 'vue';
	import Tools from 'lg-tools';
	import Bus from 'lg-bus';
	import Utils from '@/utils';
	import service from '@/service';
	import { APP_KEY_TOKEN, APP_KEY_LOGIN } from '@/constants';

	// -- state
	const state = reactive({
		key: "GET_USER_PROFILE", // "GET_USER_PROFILE" | "GET_USER_PHONE",
		canIUseGetUserProfile: false
	});

	// -- life circles
	onMounted(() => {
		// 1. 判断设备是否支持 getUserProfile
		wx.getUserProfile && (state.canIUseGetUserProfile = true);
	});

	// -- methods
	const edit = async (data) => {
		Utils.loading("处理中...");
		setTimeout(() => {
			Utils.hideLoading();
			state.key = 'GET_USER_PHONE';
		}, 1000);
		/*
		const resp = await service.user.edit(data);
		if(resp && resp.code === 200) {
			state.key = 'GET_USER_PHONE';
		}*/

	}

	// -- events
	const onGetUserInfo = ({ detail }) => {
		const { errMsg, userInfo: { avatarUrl, nickName } } = detail;
		if (/ok/.test(errMsg)) {
			// -- 更新用户信息
			edit({ avatarUrl, nickName });
		}
	}

	const onGetUserProfile = () => {
		wx.getUserProfile({
			desc: '用于完善用户头像、昵称展示信息',
			success: (res) => {
				const { errMsg, userInfo: { avatarUrl, nickName } } = res;
				if (/ok/.test(errMsg)) {
					// -- 更新用户信息
					edit({ avatarUrl, nickName });
				}
			}
		});
	}

	const onGetPhoneNumber = ({ detail }) => {
		const { errMsg, code } = detail;
		console.log("手机号授权code：", code);
		Utils.loading("处理中...");
		setTimeout(() => {
			Utils.hideLoading();
			Bus.$emit("BINDED_PHONE");
			Utils.pop();
		}, 1000);

		if (/ok/.test(errMsg)) {
			// -- 更新手机号
			// Api.user.bindPhone({ code }).then(r => {
			// uni.setStorageSync(APP_KEY_LOGIN, true);
			// Bus.$emit("BINDED_PHONE");
			// Utils.pop();
			// });
		}
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
		<view class="wrap rounded-24 bg-FFFFFF pt-70 px-48 mx-auto flex-v-center justify-content-start">
			<!-- logo -->
			<image class="icon-160x160" src="@/static/logo.png"></image>
			<!-- 店铺名称 -->
			<view class="f32 f-600 lh-44 mt-20" style="color: #202020;">产品名称</view>
			<!-- 获取用户信息 -->
			<template v-if="state.key === 'GET_USER_PROFILE'">
				<view class="desc">为了我们更好的服务您，【产品名称】小程序需要获取您的基础信息，请点击“授权登录”按钮，打开头像、昵称等信息的授权。</view>
				<button v-if="state.canIUseGetUserProfile" class="button bg-theme" @click="onGetUserProfile">授权登录</button>
				<button v-else class="button bg-theme" open-type="getUserInfo" @getuserinfo="onGetUserInfo">授权登录</button>
			</template>
			<!-- 获取手机号码 -->
			<template v-else>
				<view class="desc">为了我们更好的服务您，请使用微信快捷登录获取您的手机号码</view>
				<button class="button bg-theme" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">
					<image class="icon-44x44 mr-8" src="./icon_weixin.png"></image>
					<text>微信快捷登录</text>
				</button>
			</template>
			<!-- 暂不登录 -->
			<view class="f28 lh-40 mt-40 f-400" style="color:#202020;" @click="onBack">暂不登录</view>
		</view>


	</view>
</template>


<style lang="less" scoped>
	.page {
		background-image: url('https://yinghong-maintenance.oss-cn-chengdu.aliyuncs.com/icons/UMR1646215168771.png');
		background-repeat: no-repeat;
		background-size: 100% auto;
		background-position: top left;
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
