<script setup>
	// -- imports 
	import { reactive, computed } from "vue";
	import Utils from '@/utils/index.js';
	import IconCheck from '@/components/@lgs/IconCheck/IconCheck.vue';
	import VerifyCode from '@/components/@lgs/VerifyCode/VerifyCode.vue';
	import Validator from 'lg-validator';
	import Tools from 'lg-tools';
	import Bus from "lg-bus";

	// -- constants
	const MAX_COUNT = 60;
	const placeholderStyles = "font-size: 32rpx; color: rgba(0, 0, 0, .36)"
	// -- state 
	const state = reactive({
		k: 0, // 0-微信快捷登录 1-手机号验证码登录 2-接收验证码
		mobile: '', // 手机号
		code: '', // 验证码
		canSendCode: false, // 是否激活发送验证码
		checkedForAuth: false, // 微信授权登录
		checkedForMobile: false, // 手机号验证码登录
		count: 0, // 倒计时
		timer: null, // 定时器
	});

	// -- computeds
	const timeString = computed(() => {
		return state.count.toString().padStart(2, '0');
	});

	// -- methods 
	// 1. 执行倒计时
	const runTimer = () => {
		state.count = MAX_COUNT;
		state.timer = setInterval(() => {
			state.count--;
			if (state.count === 0) {
				clearInterval(state.timer);
			}
		}, 1000)
	}
	// 2. 提示用户阅读并同意用户协议和隐私政策"
	const showTips = () => {
		Utils.toast("请阅读并同意用户协议和隐私政策");
	}

	// -- events 
	// 1. 获取手机号
	const onGetPhoneNumber = ({ detail }) => {
		const { errMsg, code } = detail;
		console.log("手机号授权code：", code);
		Utils.loading("处理中...");
		setTimeout(() => {
			Utils.hideLoading();
			Bus.$emit("LOGGED");
			Utils.pop();
		}, 1000);
		if (/ok/.test(errMsg)) {
			// -- 更新手机号
			// Api.user.bindPhone({ code }).then(r => {
			// uni.setStorageSync(APP_KEY_LOGIN, true);
			// Bus.$emit("LOGGED");
			// Utils.pop();
			// });
		}
	}
	// 2. 监听用户输入手机号
	const onInput = ({ detail: { value } }) => {
		state.mobile = value;
		state.canSendCode = Validator.tel(value);
	}
	// 3. 发送验证码
	const onSendCode = () => {
		if (!state.canSendCode) {
			return;
		}
		if (!state.checkedForMobile) {
			return showTips();
		}
		Utils.loading("处理中...");
		// 模拟发送验证码
		setTimeout(() => {
			state.k = 2;
			Utils.hideLoading();
			runTimer();
		}, 1000);
	}
	// 4. 修改手机号
	const onModifyMobile = () => {
		state.mobile = '';
		state.k = 1;
	}
	// 5. 校验验证码
	const onValidate = () => {
		console.log("验证码：", state.code)
		Utils.loading("处理中...");
		setTimeout(() => {
			Utils.hideLoading();
			if (state.code === "1234") {
				Bus.$emit("LOGGED");
				Utils.pop();
			} else {
				Utils.toast("验证码错误");
				state.code = '';
			}
		}, 1000);
	}
</script>



<template>
	<view class="page">
		<!-- 导航栏 -->
		<!-- 1.微信快捷登录 -->
		<view v-if="state.k === 0" class="loginForAuth">
			<!-- 产品图 -->
			<view class="intro flex-h-center color-FFFFFF">产品介绍图</view>
			<!-- 授权按钮 -->
			<button v-if="state.checkedForAuth" class="auth-button bg-theme flex-h-center f28 color-FFFFFF" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">微信快捷登录</button>
			<button v-else class="auth-button bg-theme flex-h-center f28 color-FFFFFF" @click="showTips">微信快捷登录</button>
			<!-- 手机号验证码登录 -->
			<view class="login-mobile f24 text-center color-555555" @click="state.k = 1">手机号验证码登录</view>
			<!-- 用户协议 & 隐私正常 -->
			<view class="protocol flex-h-center flex-h-center f26 mt-80">
				<icon-check v-model="state.checkedForAuth" class="mr-10"></icon-check>
				<text>我已阅读并同意</text>
				<text class="link mx-10">用户协议</text>
				<text>及</text>
				<text class="link mx-10">隐私政策</text>
			</view>
		</view>
		<!-- 2.手机号验证码登录 -->
		<view v-if="state.k === 1" class="loginForMobile px-30 pt-60">
			<!-- logo -->
			<image class="icon-92x92 mb-40" src="@/static/logo.png"></image>
			<!-- 标题 -->
			<view class="f56 color-555555">手机号快捷登录</view>
			<!-- 提示信息 -->
			<view class="tips f28 mt-10">新用户登录将自动注册</view>
			<!-- 输入框 -->
			<view class="input-wrap pb-30 mt-96">
				<input :value="state.mobile" class="f32 f-600 ff-DIN-Bold" type="number" @input="onInput" auto-focus :placeholder-style="placeholderStyles" placeholder="请输入手机号码" maxlength="11" />
			</view>
			<!-- 用户协议 & 隐私正常 -->
			<view class="protocol flex-h-start f26 mt-20">
				<icon-check v-model="state.checkedForMobile" class="mr-10"></icon-check>
				<text>我已阅读并同意</text>
				<text class="link mx-10">用户协议</text>
				<text>及</text>
				<text class="link mx-10">隐私政策</text>
			</view>
			<!-- 发送验证码 -->
			<view class="flex-h-end mt-60">
				<view :class="{disabled: !state.canSendCode}" class="action-button bg-theme flex-h-center color-FFFFFF rounded-45 f26" @click="onSendCode">发送验证码</view>
			</view>
		</view>
		<!-- 3.接收验证码 -->
		<view v-if="state.k === 2" class="loginForReciveCode px-30 pt-60">
			<!-- 标题 -->
			<view class="f56 color-555555">手机号快捷登录</view>
			<!-- 提示信息 -->
			<view class="tips f28 mt-10">
				<text>验证码已发送至</text>
				<text class="mx-10">{{Tools.phoneFormatter(state.mobile, "$1 **** $3")}}</text>
				<text class="link" @click="onModifyMobile">修改</text>
			</view>
			<!-- 验证码输入框 -->
			<VerifyCode v-model="state.code" :length="4" autoFocus align="left" @validate="onValidate" />

			<!-- 发送验证码 -->
			<view class="flex-h-end mt-60">
				<view v-if="state.count" class="action-button disabled bg-theme flex-h-center color-FFFFFF rounded-45 f26">{{timeString}}s</view>
				<view v-else class="action-button bg-theme flex-h-center color-FFFFFF rounded-45 f26" @click="onSendCode">重新获取</view>
			</view>
		</view>
	</view>
</template>

<style lang="less" scoped>
	.page {
		background: #FFFFFF;
	}

	/** 公共样式 */
	.protocol {
		color: rgba(0, 0, 0, .36);
	}

	.link {
		color: #6495ED;
	}

	.tips {
		color: rgba(0, 0, 0, .36);
	}

	.action-button {
		width: 280rpx;
		height: 90rpx;

		&.disabled {
			background: #F7F7F7;
			color: #AFAFAF;
		}
	}

	/** 微信快捷登录 */
	.loginForAuth {
		.intro {
			width: 750rpx;
			height: calc(100vh - 300px);
			background: linear-gradient(to bottom, #40ECC8, #01CA99);
		}

		.auth-button {
			width: 500rpx;
			height: 90rpx;
			margin: 50rpx auto 30rpx;
			border-radius: 45rpx;
		}
	}

	/** 手机号验证码登录 */
	.loginForMobile {
		.input-wrap {
			border-bottom: 2rpx solid #EEEEEE;
		}
	}
</style>