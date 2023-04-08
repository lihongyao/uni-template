<script setup>
	// -- imports
	import { reactive, onMounted } from 'vue';
	import { APP_KEY_TOKEN, APP_KEY_LOGIN } from '@/constants';
	import Utils from '@/utils';
	import service from '@/service';
	import TimeDown from '@/components/@lgs/TimeDown/TimeDown.vue';

	// -- state
	const state = reactive({
		count: 2,
		canJump: null,
	});

	// -- life circles
	onMounted(() => {
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
				// const resp = await service.user.login(code)
				// const { token, isBindPhone } = resp.data;
				// uni.setStorageSync(APP_KEY_TOKEN, token);
				// uni.setStorageSync(APP_KEY_LOGIN, isBindPhone);
				uni.setStorageSync(APP_KEY_LOGIN, false);
				state.canJump = true;
				if (state.count === 0) {
					jump();
				}
			},
		});
	};
	const onTimeDownEnd = () => {
		if (state.canJump) {
			jump();
		}
	};
	const jump = () => {
		Utils.reLaunch('/pages/TabPages/index');
	};
</script>

<template>
	<view class="page ff-DIN-Bold">
		<TimeDown v-model="state.count" @end="onTimeDownEnd" />
		<view class="tips"> LAUNCH PAGE </view>
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