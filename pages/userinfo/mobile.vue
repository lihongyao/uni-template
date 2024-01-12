<script setup>
	// -- imports 
	import { reactive, ref, computed } from "vue";
	import { onLoad } from '@dcloudio/uni-app';
	import Utils from "@/utils";
	import VerifyCode from '@/components/@lgs/VerifyCode/VerifyCode.vue';
	import Tools from "@likg/tools";
	import Bus from "@likg/bus";

	// -- constants
	const MAX_COUNT = 60;
	// -- refs 
	const popup = ref();
	// -- constants
	const placeholderStyles = "font-size: 30rpx; color: #999999";
	// -- state 
	const state = reactive({
		/** 收集用户输入的昵称 */
		mobile: '',
		/** 用户原始手机号 */
		mobileBack: '',
		/** 是否激活保存按钮 */
		enable: false,
		/** 验证码 */
		code: '',
		/** 倒计时 */
		count: 0,
		/** 定时器 */
		timer: null,
	});

	// -- life circles 
	onLoad(({ mobile = '17398888669' }) => {
		state.mobile = mobile;
		state.mobileBack = mobile;
	});

	// -- computeds
	const timeString = computed(() => {
		return state.count.toString().padStart(2, '0');
	});

	// -- methods
	const runTimer = () => {
		state.count = MAX_COUNT;
		state.timer = setInterval(() => {
			state.count--;
			if (state.count === 0) {
				clearInterval(state.timer);
			}
		}, 1000)
	}
	// -- events 
	const onInput = (mobile) => {
		state.enable = mobile !== state.mobileBack && /^1[3456789]\d{9}$/.test(mobile);
	}
	const onGetPhoneNumber = ({ detail }) => {
		const { errMsg, code } = detail;
		console.log("手机号授权code：", code);
		Utils.loading("处理中...");
		setTimeout(() => {
			Utils.hideLoading();
			Bus.$emit("UPDATED_MOBILE", "17398888669");
			Utils.pop();
		}, 1000);
		if (/ok/.test(errMsg)) {
			// -- 更新手机号
			// Api.user.bindPhone({ code }).then(r => {
			// uni.setStorageSync(APP_KEY_LOGIN, true);
			// Bus.$emit("UPDATED_MOBILE");
			// Utils.pop();
			// });
		}
	}
	const onSendCode = () => {
		if (!state.enable) {
			return;
		}
		Utils.loading("处理中...");
		// 模拟发送验证码
		setTimeout(() => {
			Utils.hideLoading();
			popup.value.open();
			runTimer();
		}, 1000);
	}
	const onModifyMobile = () => {
		popup.value.close();
		clearInterval(state.timer);
		state.code = "";
		state.timer = null;
		state.count = 0;
	}
	const onValidate = () => {
		console.log("验证码：", state.code)
		Utils.loading("处理中...");
		setTimeout(() => {
			Utils.hideLoading();
			if (state.code === "1234") {
				Utils.toast("手机号码已更新");
				Bus.$emit("UPDATED_MOBILE", state.mobile);
				Utils.pop();
			} else {
				Utils.toast("验证码错误");
				state.code = '';
			}
		}, 1000);
	}
</script>

<template>
	<view class="page pt-24">
		<!-- 输入框：真机调试 -->
		<uni-easyinput v-model="state.mobile" placeholder="请填写您的手机号" :placeholderStyle="placeholderStyles" :maxlength="11" :inputBorder="false" @input="onInput" />
		<!-- 重新获取 -->
		<button class="color-secondary f28 mt-20" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">重新获取</button>
		<!-- 确认按钮 -->
		<button class="save-button" :class="{'enable': state.enable}" @click="onSendCode">获取验证码</button>
		<!-- 验证码弹框 -->
		<uni-popup ref="popup" type="center" :safe-area="false" :is-mask-click="false">
			<view class="popup-ct">
				<!-- 标题 -->
				<view class="f56 color-555555">更换手机号</view>
				<!-- 提示信息 -->
				<view class="tips f28 mt-10">
					<text>验证码已发送至</text>
					<text class="mx-10">{{Tools.phoneFormatter(state.mobile, "$1 **** $3")}}</text>
					<text class="link" @click="onModifyMobile">修改</text>
				</view>
				<!-- 验证码输入框 -->
				<VerifyCode v-model="state.code" :length="4" align="left" @validate="onValidate" borderColor="rgba(0, 0, 0, .36)" />
				<!-- 发送验证码 -->
				<view class="flex-h-end mt-80">
					<view v-if="state.count" class="action-button disabled bg-theme flex-h-center color-FFFFFF rounded-45 f26">{{timeString}}s</view>
					<view v-else class="action-button bg-theme flex-h-center color-FFFFFF rounded-45 f26" @click="onSendCode">重新获取</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>


<style lang="less" scoped>
	:deep(.uni-easyinput) {
		.uni-easyinput__content {
			height: 100rpx;
			font-family: 'Courier New', Courier, monospace;

			input {
				padding-left: 30rpx;
				font-size: 30rpx;
			}

			.uni-icons.uniui-clear {
				font-size: 44rpx !important;
			}
		}
	}

	.save-button {
		width: 400rpx;
		height: 90rpx;
		border-radius: 16rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 50rpx auto 0;

		background: #E1E1E1;
		color: #BCBCBC;

		&.enable {
			color: #FFFFFF;
			background: #42b983;
		}
	}

	.popup-ct {
		width: 680rpx;
		padding: 50rpx 30rpx 100rpx;
		border-radius: 16rpx;
		background: #FFFFFF;

		.tips {
			color: rgba(0, 0, 0, .36);
		}

		.link {
			color: #6495ED;
		}

		.action-button {
			width: 280rpx;
			height: 90rpx;

			&.disabled {
				background: #F7F7F7;
				color: #AFAFAF;
			}
		}
	}
</style>