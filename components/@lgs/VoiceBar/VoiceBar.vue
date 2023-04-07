<script setup>
	import { onMounted, reactive, onBeforeUnmount } from "vue";
	import Utils from '@/utils/index.js';
	// -- props 
	const props = defineProps({
		/** ID */
		id: { type: String, default: 'K' + Date.now() },
		/** 新用户引导提示 */
		userTips: String,
		/** 引导语 */
		guide: String,
		/** 是否启用拦截器拦截录音触发 */
		/** 使用场景：当使用插槽定义「按住说话」按钮时，需求大概率会自定义按钮的行为，启用拦截器，即可拦截触发录音 */
		intercept: Boolean,
		/** 抽屉状态 */
		collapse: { type: Boolean, default: false },
		/** 授权提示信息 */
		scopeTips: {
			type: Object,
			default: () => ({
				title: "AI简历管家 申请",
				content: "使用您的麦克风与AI小简交互"
			})
		}
	});
	// -- emits 
	const emits = defineEmits(['start', 'stop', 'closeUserTips'])

	// -- state 
	const state = reactive({
		k: "SEND", // 标识是发送消息还是取消发送，可选值：SEND(发送) | CANCEL(取消)
		innerUserTips: props.userTips,
		/** 新用户引导提示 */
		maskOpen: false, // 录音遮罩效果展示状态
		arcHeight: 140, // 底部圆弧高度
		threshold: 0, // 触发取消发送的阈值（onMounted生命周期函数中动态计算）
		timer: null, // 定时器（标识长按定时器，基于touch事件，所以用定时器判断）
		isTrigger: false, // 标识是否触发录音
		duration: 0, // 记录当前录制时长（只用于组件中展示，真实的持续时间在recorder.onStop函数中有返回）
		durationTimer: null, // 记录当前录制时长定时器
	});
	// -- life circles 
	onMounted(() => {
		// 1. 计算阈值(用于判断是触发发送还是取消)
		const windowHeight = uni.getSystemInfoSync().windowHeight;
		state.threshold = windowHeight - state.arcHeight;
	});

	// -- events
	const onTouchStart = () => {
		console.log("「TouchRecorder」：开始触摸")
		// -- 如果当前底部抽屉处于展开状态或者启用了拦截器，则不做任何操作
		if (props.collapse || props.intercept) {
			return;
		}
		// -- 启动定时器（实现用户长按监听）
		state.timer = setTimeout(() => {
			// 1. 校验权限
			Utils.checkAuthorizeWithScope("scope.record", {
				title: props.scopeTips.title,
				content: props.scopeTips.content
			}).then((granted) => {
				// 2. 已授权（未触发重新授权或首次授权）时则执行后续逻辑
				if (granted) {
					console.log("「TouchRecorder」：__准备录制__");
					// 3. 触发开始录制音频事件（调用者需在事件函数中调用 recorder.start({ ... }) 触发录音），并必须调用next回调函数以触发后续逻辑
					emits("start", () => {
						console.log("「TouchRecorder」：__开始录制__");
						state.isTrigger = true; // 标识录音已触发
						state.maskOpen = true; // 显示遮罩
						state.durationTimer = setInterval(() => { // 启用定时器记录持续时间
							state.duration += 1000;
						}, 1000);
					});
				}
			});
		}, 500);
	}
	const onTouchMove = ($event) => {
		// -- 只在录音被触发的情况下才处理后续逻辑
		if (state.isTrigger) {
			// -- 获取触摸Y值
			const clientY = $event.changedTouches[0].clientY;
			// -- 根据阈值判断触发取消/恢复录音
			if (clientY < state.threshold) {
				if (state.k !== 'CANCEL') {
					state.k = "CANCEL";
				}
			} else {
				if (state.k !== "SEND") {
					state.k = 'SEND';
				}
			}
		}
	}
	const onTouchEnd = () => {
		console.log("「TouchRecorder」：停止触摸")
		// 1. 如果当前底部抽屉处于展开状态或者启用了拦截器，则不做任何操作
		if (props.collapse || props.intercept) {
			return;
		}
		// 2. 清除定时器
		clearTimeout(state.timer);
		state.timer = null;

		// 3. 判断是否触发，调用者必须调用next回调函数触发后续逻辑
		if (state.isTrigger) {
			// 4. 触发停止录制事件
			emits("stop", {
				type: state.k,
				next: () => {
					console.log("「TouchRecorder」：", state.k === 'CANCEL' ? '取消发送' : '立即发送');
					// -- 停止记录持续时间的定时器
					clearInterval(state.durationTimer);
					state.durationTimer = null;
					// -- 复位初始值
					state.maskOpen = false;
					state.k = 'SEND';
					state.duration = 0;
					state.isTrigger = false;
				}
			});
		}
	}
	const onTouchCancel = () => {
		// -- 如果当前底部抽屉处于展开状态或者启用了拦截器，则不做任何操作
		if (props.collapse || props.intercept) {
			return;
		}
		// 2. 清除定时器
		clearTimeout(state.timer);
		state.timer = null;
	}

	const onCloseUserTips = () => {
		state.innerUserTips = '';
		emits("closeUserTips");
	}
</script>


<template>
	<view class="lg-voice-bar" :id="id">
		<!-- 调用呈现视图 -->
		<view class="lg-voice-bar__container">
			<!-- 左侧插槽 -->
			<slot name="left"></slot>
			<!-- 语音按钮 -->
			<view class="__button">
				<view class="__btn" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd" @touchcancel="onTouchCancel">
					<slot>
						<image src="./images/icon_microphone_dark.png"></image>
						<text>按住说话</text>
					</slot>
				</view>
				<!-- 新手提示 -->
				<view v-if="state.innerUserTips" class="__user-tips" @click="onCloseUserTips">
					<view class="__inner">
						<text>{{state.innerUserTips}}</text>
						<image src="./images/icon_close.png"></image>
					</view>
				</view>
			</view>
			<!-- 右侧插槽 -->
			<slot name="right"></slot>
		</view>
		<!-- 抽屉 -->
		<view class="lg-voice-bar__drawer" :class="{ collapse }">
			<slot name="drawer"></slot>
		</view>
		<!-- 遮罩层 -->
		<view class="lg-voice-bar__mask" :class="{visible: state.maskOpen, 'cancel-status': state.k === 'CANCEL'}">
			<!-- 引导语 -->
			<view v-if="guide" class="__guide">
				<view class="__title">请按以下格式录入</view>
				<view class="__content">{{guide}}</view>
			</view>
			<!-- 动态加载 -->
			<view class="__loading">
				<view class="__item" v-for="item in 18" :key="item"></view>
				<view class="__duration">{{state.duration / 1000}}s</view>
			</view>
			<!-- 文案提示：取消 -->
			<view class="__tips cancel-txt" :class="{hidden_: state.k === 'SEND'}">松开取消</view>
			<!-- 取消按钮 -->
			<view class="__cancel" />
			<!-- 文案提示：发送 -->
			<view class="__tips" :class="{hidden_: state.k === 'CANCEL'}">松开发送</view>
			<!-- 底部触摸区域 -->
			<view class="__arc" :style="{height: state.arcHeight + 'px'}">
				<image class="__microphone" src="./images/icon_microphone.png"></image>
			</view>
		</view>
	</view>
</template>



<style lang="less" scoped>
	@keyframes line-scale-pulse-out {
		0% {
			transform: scaley(1);
		}

		50% {
			transform: scaley(0.3);
		}

		100% {
			transform: scaley(1);
		}
	}

	.lg-voice-bar {
		box-sizing: content-box;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		background: #F7F8FA;

		&__container {
			height: 130rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #F7F8FA;
			box-sizing: border-box;
			padding: 0 30rpx;
			border-top: 2rpx solid #60606210;
			

			.__button {
				flex: 1;
				height: 80rpx;
				position: relative;

				.__btn {
					width: inherit;
					height: inherit;
					background: #FEFFFE;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 16rpx;
					color: #000000;
					font-size: 34rpx;

					image {
						width: 40rpx;
						height: 40rpx;
						margin-right: 10rpx;
					}

					&:active {
						opacity: .35;
					}
				}

				.__user-tips {
					width: 750rpx;
					text-align: center;
					position: absolute;
					top: -110rpx;
					left: 50%;
					transform: translateX(-50%);

					.__inner {
						display: inline-block;
						padding: 0 80rpx 0 24rpx;
						line-height: 76rpx;
						background: #000000;
						color: #FFFFFF;
						font-size: 26rpx;
						border-radius: 24rpx;
						position: relative;

						&::before {
							content: "";
							position: absolute;
							top: 100%;
							left: 50%;
							transform: translateX(-50%);
							border-width: 16rpx 16rpx 0 16rpx;
							border-style: solid;
							border-color: #000000 transparent transparent transparent;
						}

						image {
							width: 40rpx;
							height: 40rpx;
							position: absolute;
							top: 50%;
							transform: translateY(-50%);
							right: 10rpx;
						}
					}
				}
			}
		}


		&__drawer {
			height: 0;
			transition: all .25s linear;
			box-sizing: border-box;
			overflow: hidden;

			&.collapse {
				border-top: 2rpx solid #60606210;
				height: 450rpx;
			}
		}

		&__mask {
			display: none;
			width: 100vw;
			height: 100vh;
			background: rgba(0, 0, 0, .8);
			position: fixed;
			top: 0;
			left: 0;
			z-index: 10000;

			.__guide {
				width: 619rpx;
				border-radius: 36rpx;
				overflow: hidden;
				position: absolute;
				top: 230rpx;
				left: 50%;
				transform: translateX(-50%);
				font-size: 32rpx;

				.__title {
					height: 88rpx;
					background: #A594FF;
					padding: 0 30rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;

					color: #FFFFFF;
				}

				.__content {
					padding: 20rpx 30rpx 30rpx;
					background-color: #FFFFFF;
					color: #1A1A1A;
					word-break: break-all;
				}
			}

			.__loading {
				width: 560rpx;
				height: 120rpx;
				border-radius: 16rpx;
				background: #A594FF;
				display: flex;
				justify-content: center;
				align-items: center;
				transition: all .25s linear;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: 680rpx;

				.__duration {
					font-size: 30rpx;
					color: #FFFFFF;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					left: 30rpx;
				}

				.__item {
					width: 4rpx;
					height: 36rpx;
					background-color: #FFFFFF;
					animation: line-scale-pulse-out 1s infinite;

					&:not(:last-child) {
						margin-right: 8rpx;
					}

					// 16
					&:nth-child(1),
					&:nth-child(13) {
						transform: scaleY(.28);
						animation-delay: -.2s;
					}

					// 32
					&:nth-child(2),
					&:nth-child(14) {
						transform: scaleY(.57);
						animation-delay: -.4s;
					}

					// 24
					&:nth-child(3),
					&:nth-child(5),
					&:nth-child(10),
					&:nth-child(15),
					&:nth-child(17) {
						transform: scaleY(.42);
						animation-delay: -.6s;
					}

					// 12
					&:nth-child(4),
					&:nth-child(6),
					&:nth-child(11),
					&:nth-child(12),
					&:nth-child(16),
					&:nth-child(18) {
						transform: scaleY(.21);
						animation-delay: -.8s;
					}

					// 36
					&:nth-child(7) {
						transform: scaleY(.64);
						animation-delay: -1s;
					}

					&:nth-child(8) {
						transform: scaleY(1);
						animation-delay: -.8s;
					}

					// 42
					&:nth-child(9) {
						transform: scaleY(.75);
						animation-delay: -6s;
					}
				}
			}

			.__cancel {
				width: 80rpx;
				height: 80rpx;
				background: #393939;
				border-radius: 50%;
				transition: all .25s linear;
				margin-bottom: 30rpx;
				position: relative;

				&::before,
				&::after {
					content: "";
					width: 30rpx;
					height: 4rpx;
					background: #9E9E9E;
					transition: all .25s linear;
					position: absolute;
					top: 50%;
					left: 50%;
				}

				&::before {
					transform: translate(-50%, -50%) rotateZ(45deg);
				}

				&::after {
					transform: translate(-50%, -50%) rotateZ(-45deg);
				}
			}

			.__tips {
				color: #FEFFFE80;
				margin-bottom: 36rpx;

				&.cancel-txt {
					margin-bottom: 30rpx;
				}

				&.hidden_ {
					opacity: 0;
				}
			}

			.__arc {
				width: 800rpx;
				background: #5454A9;
				border-radius: 50% 50% 0 0;
				box-sizing: border-box;
				padding-bottom: constant(safe-area-inset-bottom);
				padding-bottom: env(safe-area-inset-bottom);
				display: flex;
				justify-content: center;
				align-items: center;

				.__microphone {
					width: 80rpx;
					height: 80rpx;
				}
			}

			&.visible {
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
				align-items: center;
			}

			&.cancel-status {

				.__loading {
					width: 450rpx;
					background: #E75D58;
				}

				.__cancel {
					width: 90rpx;
					height: 90rpx;
					background: #E3E3E3;

					&::before,
					&::after {
						background: #191919;
					}
				}

				.__arc {
					background: #393939;
					border-color: #393939;
				}
			}
		}
	}
</style>