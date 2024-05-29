<script setup>
	import { reactive, toRefs } from "vue";

	// -- constants
	const placeholderStyle = 'font-size: 30rpx; color: #17171730;'
	const defaultOptions = {
		title: '温馨提示', // 标题
		content: '', // 提示信息
		showCancel: true, // 是否显示取消按钮
		cancelText: "取消", // 取消按钮文本
		confirmText: "确定", // 确认按钮文本内容
		cancelTextColor: "#222222", // 取消按钮文本颜色
		confirmTextColor: "#FFFFFF", // 确认按钮文本颜色
		cancelBgColor: "#EAEAEA", // 取消按钮背景色
		confirmBgColor: "linear-gradient(90deg, #7650FF 0%, #8872FF 100%);", // 确认按钮背景色
	}
	// -- state
	const state = reactive({
		visible: false,
		options: defaultOptions
	});

	// -- methods
	const open = (options = defaultOptions) => {
		state.options = Object.assign({}, defaultOptions, options);
		state.visible = true;
	}

	// -- events 
	const onSure = () => {
		state.visible = false;
		state.options.onConfirm && state.options.onConfirm();
	}
	const onCancel = () => {
		state.visible = false;
		state.options.onCancel && state.options.onCancel();
	}
	// -- expose
	defineExpose({
		open
	});
</script>

<template>
	<view class="lg-dialog" :class="{visible: state.visible}" catchtouchmove>
		<view class="__wrap">
			<!-- 标题 -->
			<view class="__title">{{state.options.title}}</view>
			<!-- 提示信息 -->
			<view class="__content">{{state.options.content}}</view>
			<!-- 操作按钮 -->
			<view class="__actions">
				<template v-if="state.options.showCancel">
					<view class="button cancel" @click="onCancel" :style="{
						'--cancel-bg-color': state.options.cancelBgColor,
						'--cancel-text-color': state.options.cancelTextColor
					}">{{state.options.cancelText}}</view>
				</template>
				<view class="button sure" :class="{alone: !state.options.showCancel}" @click="onSure" :style="{
					'--sure-bg-color':state.options.confirmBgColor,
					'--sure-text-color': state.options.confirmTextColor
			   }">{{state.options.confirmText}}</view>
			</view>
		</view>
	</view>
</template>

<style lang="less">
	.lg-dialog {
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, .3);
		position: fixed;
		top: 0;
		left: 0;

		z-index: -1;
		opacity: 0;
		transition: opacity .25s linear;
		user-select: none;

		display: flex;
		justify-content: center;
		align-items: center;

		color: #222222;
		font-family: 'DIN-Bold';
		text-align: center;

		&.visible {
			z-index: 1000;
			opacity: 1;
		}

		.__wrap {
			width: 620rpx;
			height: auto;
			padding: 60rpx 32rpx 50rpx;
			background-color: #FFFFFF;
			border-radius: 26rpx;
		}

		.__title {
			font-size: 36rpx;
			line-height: 40rpx;
			font-weight: 500;
			margin-bottom: 60rpx;
		}


		.__content {
			font-size: 28rpx;
			line-height: 40rpx;
			color: #666666;
			white-space: pre-line;
		}

		.__actions {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 60rpx;

			.button {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 256rpx;
				height: 80rpx;
				border-radius: 16rpx;

				color: #FFFFFF;
				font-size: 28rpx;

				&.alone {
					width: 400rpx;
				}

				&.cancel {
					background: var(--cancel-bg-color);
					color: var(--cancel-text-color);
					margin-right: 60rpx;
				}

				&.sure {
					background: var(--sure-bg-color);
					color: var(--sure-text-color);
				}
			}
		}
	}
</style>