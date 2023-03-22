<script setup>
	import { reactive, onMounted } from 'vue';
	import { APP_KEY_TOKEN, APP_KEY_PHONE } from '@/constants';
	import Utils from '@/utils';
	import service from '@/service';
	// -- state 
	const state = reactive({
		count: 2,
		statusBarHeight: 0,
		titleBarHeight: 0,
		countHeight: 0,
		countPaddingLeft: 0,
		canJump: null
	});

	// -- life circles
	onMounted(() => {
		login();
		calcs();
		timedown();
	});
	// -- methods

	const calcs = () => {
		// -- 获取状态栏高度
		const { statusBarHeight, screenWidth } = uni.getWindowInfo();
		// -- 获取拇指位置信息
		const { height, top, right } = uni.getMenuButtonBoundingClientRect();
		// -- 计算标题栏高度
		state.titleBarHeight = (top - statusBarHeight) * 2 + height;
		// -- 赋值
		state.statusBarHeight = statusBarHeight;
		state.countHeight = height;
		state.countPaddingLeft = screenWidth - right;

	}
	const login = () => {
		// -- 获取code
		uni.login({
			provider: "weixin",
			scopes: 'auth_base',
			success: async ({ code }) => {
				// -- 用户登录
				// const resp = await service.user.login(code)
				// const { token, isBindPhone } = resp.data;
				// uni.setStorageSync(APP_KEY_TOKEN, token);
				// uni.setStorageSync(APP_KEY_PHONE, isBindPhone);
				state.canJump = true;
				if (state.count === 0) {
					jump();
				}
			}
		})
	}
	const timedown = () => {
		const timer = setInterval(() => {
			state.count--;
			if (state.count === 0) {
				// -- 清除定时器
				clearInterval(timer);
				// -- 判断是否已处理用户登录态
				if (state.canJump) {
					jump();
				}
			}
		}, 1000);
	}
	const jump = () => {
		Utils.reLaunch("/pages/TabPages/index");
	}
</script>



<template>
	<view class="page ff-DIN-Bold">
		<view class="count-wrap" :style="`top:${state.statusBarHeight}px; height: ${state.titleBarHeight}px;padding-left: ${state.countPaddingLeft}px`">
			<view class="count" :style="`height:${state.countHeight}px`">
				{{state.count}}&nbsp;s
			</view>
		</view>
		<view class="tips">
			LAUNCH PAGE
		</view>
	</view>
</template>


<style lang="less" scoped>
	.page {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;

		.count-wrap {
			width: 750rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			box-sizing: border-box;
			position: absolute;
			left: 0;

			.count {
				width: 130rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background: #999999;
				opacity: .5;
				font-size: 32rpx;
				color: #FFFFFF;
				border-radius: 30rpx;
			}

		}

		.tips {
			font-size: 80rpx;
			letter-spacing: 2rpx;
			color: #88888860;
		}
	}
</style>
