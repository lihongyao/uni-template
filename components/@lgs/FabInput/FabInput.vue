<!-- 
1. 调用示例
const onItemTap = (item) => {
	fabInput.value.open({
		meta: item,
		defaultValue: "成都，一座你来了走不脱的城市。",
		onConfirm: ({ text, next, meta }) => {
			console.log(text, meta);
			Utils.loading("处理中...");
			setTimeout(() => {
				Utils.hideLoading();
				next();
			}, 1000);
		}
	});
}
 -->

<script setup>
	// -- imports 
	import Tools from "@likg/tools";
import { nextTick, reactive } from "vue";

	// -- defaultOptions 
	const defaultOptions = {
		meta: null, // 元数据，触发 onConfirm 事件时将作为参数回传给调用者
		placeholder: "等待输入内容", // 占位符
		placeholderStyle: "font-size: 30rpx; color: #19191960", // 占位符样式
		defaultValue: '', // 默认值
		onConfirm: ({ text, meta, next }) => {} // 用户点击确认按钮
	}

	// --  state
	const state = reactive({
		options: defaultOptions, // 配置项
		visible: false, // 标识可见性
		message: '', // 文本消息
		keyboardHeight: 0, // 键盘高度
		isSafeArea: true, // 是否展示安全区域
		focus: false // 是否获取焦点
	});
	// -- methods 
	const open = (options = defaultOptions) => {
		state.options = Object.assign({}, defaultOptions, options);
		state.message = state.options.defaultValue;
		state.visible = true;
		state.focus = true;
	}
	const close = () => {
		state.visible = false;
		state.message = '';
	}
	// -- events 
	const onFocus = () => {
		state.focus = true;
		console.log("__onFocus__");
		if (state.keyboardHeight > 0) {
			state.isSafeArea = false;
		}
	}
	const onBlur = () => {
		state.focus = false;
		console.log("__onBlur__");
		state.isSafeArea = true;
		state.keyboardHeight = 0;
	}
	const onKeyboardHeightChange = ({ detail: { height } }) => {
		console.log("__onKeyboardHeightChange__");
		console.log(`键盘高度：${height}px`);
		state.keyboardHeight = height;
	}
	const onConfirm = () => {
		state.options.onConfirm && state.options.onConfirm({
			text: state.message,
			meta: state.options.meta,
			next: () => {
				close();
			}
		});
	}
	const onClearMsg = () => {
		state.message = '';
	}

	


	// -- exposes
	defineExpose({
		open
	});
</script>



<template>
	<view class="lg-fab-input" :class="{visible: state.visible}" @click="close" catchtouchmove>
		<view class="__ct" @click.stop>
			<view class="__wrap">
				<view class="__textArea" @click="onFocus">
					<textarea 
						class="__input" 
						confirm-type="done" 
						v-model="state.message" 
						:focus="state.focus" 
						:fixed="true" 
						:maxlength="-1" 
						:auto-height="true" 
						:adjust-position="false" 
						:show-confirm-bar="false" 
						:disable-default-padding="true" 
						:placeholder="state.options.placeholder" 
						@keyboardheightchange="onKeyboardHeightChange" 
						@focus="onFocus" 
						@blur="onBlur" 
						@confirm="onConfirm" 
					/>
					<image v-if="state.message.length" class="__icon" @click.stop="onClearMsg" src="./images/icon_clear.png"></image>
				</view>
				<view class="__actionBtn" @click.stop="onConfirm">
					<text>确定</text>
				</view>
			</view>
			<view class="__space" :class="{safeArea: state.isSafeArea}" :style="{height: state.keyboardHeight + 'px'}"></view>
		</view>
	</view>
</template>


<style lang="less" scoped>
	.lg-fab-input {
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0);
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;

		&.visible {
			z-index: 999;
		}

		.__ct {
			width: 750rpx;
			background: #FFFFFF;
			box-shadow: 6rpx -14rpx 14rpx 0 rgba(192, 192, 192, 0.17);
			border-radius: 32rpx 32rpx 0 0;
			position: absolute;
			left: 0;
			bottom: 0;
		}

		.__wrap {
			padding: 32rpx 24rpx;
			display: flex;
			justify-content: space-between;
			align-items: flex-end;

			.__textArea {
				flex: 1;
				min-height: 80rpx;
				box-sizing: border-box;
				padding: 20rpx 0;
				background: #F0F1F5;
				border-radius: 16rpx;
				overflow: hidden;
				position: relative;

				.__input {
					width: 100%;
					max-height: 200rpx;
					/** rows * lineHeight */
					box-sizing: border-box;
					padding: 0 80rpx 0 20rpx;
					color: #444444;
					font-size: 30rpx;
					line-height: 40rpx;
				}

				.__icon {
					width: 40rpx;
					height: 40rpx;
					position: absolute;
					top: 50%;
					right: 20rpx;
					transform: translateY(-50%);
				}
			}

			.__actionBtn {
				height: 80rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 32rpx;
				color: #8169FF;
				margin-left: 40rpx;
			}
		}

		.__space.safeArea {
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
		}
	}
</style>