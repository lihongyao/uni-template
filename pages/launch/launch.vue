<script setup>
	// -- imports
	import { onLoad } from '@dcloudio/uni-app';
	import { reactive } from 'vue';
	import { APP_KEY_TOKEN, APP_KEY_LOGIN } from '@/constants';
	import Utils from '@/utils';
	import TimeDown from '@/components/@lgs/TimeDown/TimeDown.vue';
	import { apiUser } from '@/api/apiServer';
	import PrivacyDialog from '@/components/@lgs/PrivacyDialog/PrivacyDialog.vue';


	// -- state
	const state = reactive({
		q: '',
		count: 2,
		isLogin: false,
		isAgree: false,
	});

	// -- life circles
	// -- 扫描普通二维码链接进入通过q拿到链接并读取 query 参数处理后续逻辑
	// -- 二维码在线生成：https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=123
	onLoad(({ q }) => {
		if (q) {
			const link = decodeURIComponent(q);
			const queryParams = Utils.getQueryParams(link);
			console.log(queryParams);
		}
		login();
	});
	// -- methods
	const login = () => {
		// -- 获取code
		uni.login({
			provider: 'weixin',
			scopes: 'auth_base',
			success: async ({ code }) => {
				// -- 用户登录
				// const resp = await apiUser.login(code)
				// const { token, isBindPhone } = resp.data;
				// uni.setStorageSync(APP_KEY_TOKEN, token);
				// uni.setStorageSync(APP_KEY_LOGIN, isBindPhone);
				console.log('授权码：', code);
				uni.setStorageSync(APP_KEY_LOGIN, false);
				state.isLogin = true;
				jump();
			},
		});
	};
	const jump = () => {
		if (state.count === 0 && state.isLogin && state.isAgree) {
			let jumpPath = '/pages/TabPages/index';
			if (state.q) {
				jumpPath = '/pages/upload/uploadForWeixin?q=app'
			}
			Utils.reLaunch(jumpPath);
		}
	};
	const onTimeDownEnd = () => {
		jump();
	};
	const onAgree = () => {
		state.isAgree = true;
		jump();
	}
</script>

<template>
	<view class="page ff-DIN-Bold">
		<TimeDown v-model="state.count" @end="onTimeDownEnd" />
		<view class="tips"> LAUNCH PAGE </view>
		<PrivacyDialog @agree="onAgree" />
	</view>
</template>

<style lang="less" scoped>
	.page {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;

		.tips {
			font-size: 80rpx;
			letter-spacing: 2rpx;
			color: #88888860;
		}
	}
</style>