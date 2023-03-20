<script setup>
	import { reactive, toRefs } from "vue";

	// -- state
	const state = reactive({
		visible: false,
		options: {
			title: '温馨提示',
			message: '',
			showCancelButton: true,
			cancelButtonText: "取消",
			sureButtonText: "确定",
			cancelButtonBgColor: "#D0D0D0",
			sureButtonBgColor: "#1946BB"
		}
	});

	// -- methods
	const open = (options) => {
		state.options = Object.assign({}, state.options, options);
		state.visible = true;
	}

	// -- events 
	const onSure = () => {
		state.visible = false;
		state.options.onSure && state.options.onSure();
	}
	const onCancel = () => {
		state.visible = false;
		state.options.onCancel && state.options.onCancel();
	}
	defineExpose({
		open
	});
</script>

<template>
	<view class="lg-dialog" :class="{visible: state.visible}">
		<view class="lg-dialog__wrap">
			<view class="title">{{state.options.title}}</view>
			<view class="message">{{state.options.message}}</view>
			<view class="actions">
				<template v-if="state.options.showCancelButton">
					<view class="button cancel" @click="onCancel" :style="'--cancel-bg-color:'+ state.options.cancelButtonBgColor">{{state.options.cancelButtonText}}</view>
				</template>
				<view class="button sure" :class="{alone: !state.options.showCancelButton}" @click="onSure" :style="'--sure-bg-color:'+ state.options.sureButtonBgColor">{{state.options.sureButtonText}}</view>
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
		transition: all .25s linear;
		user-select: none;

		display: flex;
		justify-content: center;
		align-items: center;

		color: #444444;
		font-family: 'DIN-Bold';
		text-align: center;

		&.visible {
			z-index: 1000;
			opacity: 1;
		}

		&__wrap {
			width: 620rpx;
			height: auto;
			padding: 50rpx 30rpx 80rpx;
			background-color: #FFFFFF;
			border-radius: 18rpx;


			.title {
				font-size: 28rpx;
				line-height: 36rpx;
				font-weight: 600;
			}

			.message {
				font-size: 32rpx;
				line-height: 40rpx;
				margin-top: 30rpx;
			}

			.actions {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 50rpx;

				.button {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 240rpx;
					height: 80rpx;
					border-radius: 48rpx;

					color: #FFFFFF;
					font-size: 32rpx;

					&.alone {
						width: 400rpx;
					}

					&.cancel {
						background: var(--cancel-bg-color);
						margin-right: 60rpx;
					}

					&.sure {
						background: var(--sure-bg-color);
					}
				}
			}
		}
	}
</style>
