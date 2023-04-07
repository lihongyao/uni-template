<!-- 温馨提示：MessageBox存展示组件，所有的状态显示需调用者控制 -->
<!-- 关于属性 -->
<!-- @meta：元数据，为了方便操作，建议至少包含如下属性 -->
<!-- { readStatus, isPlaying, duration } -->
<script setup>
	// -- imports 
	import { onMounted, reactive } from "vue";

	// -- props 
	const props = defineProps({
		/** 消息内容，仅支持音频/文本格式（必传） */
		message: String,
		/** 用户头像（必传） */
		avatar: String,
		/** 源数据，事件触发时作为事件参数回传给调用者（必传） */
		meta: Object,
		/** 消息框位置：L（左侧）/R（右侧），默认值：R */
		align: { type: String, default: "R" },
		/** 音频时设置：阅读状态，0-未读，1-已读 */
		readStatus: { type: Number, default: 1 },
		/** 音频时设置：播放状态 */
		isPlaying: Boolean,
		/** 音频时设置：持续时间，单位秒 */
		duration: { type: Number, default: 0 },
		/** 音频时设置：最长时间，单位秒，用于动态计算语音消息框的宽度 */
		maxDuration: { type: Number, default: 60 },
		/** 聊天框(左侧)颜色 */
		LBgColor: { type: String, default: "#FFFFFF" },
		/** 聊天框(右侧)颜色 */
		RBgColor: { type: String, default: "#A594FF" },
		/** 前景色(左侧) */
		LTintColor: { type: String, default: '#1A1A1A' },
		/** 前景色(右侧) */
		RTintColor: { type: String, default: '#FFFFFF' },
		/** 展示Loading动画，只针对消息内容为文本且只显示一行时时有效（显示正常） */
		showLoading: Boolean,
		/** 展示icon，只针对消息内容为文本且只显示一行时时有效（显示正常）*/
		showIcon: Boolean,
		/** 展示跳过按钮 */
		showSkip: Boolean,
		/** 是否启用工具栏（只在align=R时有效） */
		showToolbar: Boolean
	});
	// -- emits
	// -- @play：音频播放（调用者需自行通过Audio实例对象播放）
	// -- @stop：音频停止（调用者需自行通过Audio实例对象停止）
	// -- @undo：点击撤销时触发（返回源数据）
	// -- @skip：点击跳过时触发
	// -- @openTools：打开工具栏时触发，调用者需保存回调函数（closeTools），并在点击页面时调用回调函数关闭工具栏
	const emits = defineEmits(['play', 'stop', 'undo', 'skip', 'openTools'])

	// -- state 
	const state = reactive({
		/* 消息类型 AUDIO(音频)/TEXT(普通文本) */
		messageType: '',
		/* 容器宽度：消息为音频时动态计算 */
		wrapWidth: 'auto',
		/* 工具栏展示状态 */
		openTools: false,
		/* 标识是否未读（语音）*/
		isUnRead: !props.readStatus,
	});

	// -- styles 
	const varStyles = {
		'--bg-color': props.align === 'L' ? props.LBgColor : props.RBgColor,
		'--tint-color': props.align === 'L' ? props.LTintColor : props.RTintColor,
	}
	const avatarLStyles = {
		visibility: props.align === 'L' ? 'visible' : 'hidden'
	}
	const avatarRStyles = {
		visibility: props.align === 'R' ? 'visible' : 'hidden'
	}
	const caseStyles = {
		justifyContent: props.align === 'L' ? 'flex-start' : 'flex-end'
	}
	const wrapStyles = {
		justifyContent: props.align === 'L' ? 'flex-start' : 'flex-end'
	}

	// -- life circles
	onMounted(() => {
		// 1. 获取消息类型（AUDIO/TEXT/IMAGE）
		state.messageType = getMessageType(props.message);
		// 2. 动态计算消息对话框的宽度(只针对音频计算)
		if (state.messageType === "AUDIO") {
			let percent = props.duration / props.maxDuration * 100;
			if (percent < 35) {
				percent = 35;
			} else if (percent > 100) {
				percent = 100;
			}
			state.wrapWidth = percent + '%';
		}
	});

	// -- methods 
	const getMessageType = (message) => {
		if (/\.(mp3|wav|ogg|aac)$/i.test(message)) {
			return "AUDIO";
		} else if (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(message)) {
			return "IMAGE";
		} else {
			return "TEXT"
		}
	}

	const closeTools = () => {
		state.openTools = false;
	}

	// -- events 
	const onAudioTap = () => {
		// 取消未阅读状态
		state.isUnRead = false;
		if (props.isPlaying) {
			// 如果当前音频正在播放，则触发stop事件
			emits("stop", props.meta);
		} else {
			// 如果当前音频停止播放，则触发play事件
			emits("play", props.meta)
		}
	}
	const onLongPress = () => {
		// -- 长按自己发送的消息时，显示工具栏
		if (props.align === 'R' && props.showToolbar) {
			emits("openTools", closeTools);
			state.openTools = true;
		}
	}
	const onToolItemTap = (eventName) => {
		state.openTools = false;
		emits(eventName, props.meta);
	}
</script>


<template>
	<!-- 外层容器 -->
	<view class="lg-message-box" :style="varStyles" :id="Date.now()">
		<!-- 内层框容器（考虑到后期拓展/比如消息框底部添加其他数据展示，所以这里套了一层容器） -->
		<view class="lg-message-box__ct">
			<!-- 头像（左侧） -->
			<image class="__avatar" :src="avatar" mode="aspectFill" :style="avatarLStyles"></image>
			<!-- 消息框容器（限制消息框最大宽度） -->
			<view class="__case" :style="caseStyles">
				<!-- 1.图片 -->
				<view v-if="state.messageType === 'IMAGE'" class="__wrap IMAGE">
					<image :src="message" mode="widthFix" @longpress="onLongPress"></image>
					<!-- 工具 -->
					<view class="__tools" :class="{visible: state.openTools}">
						<view class="item" @click.stop="onToolItemTap('undo')">撤回</view>
					</view>
				</view>
				<!-- 2.语音消息 -->
				<view v-if="state.messageType === 'AUDIO'" :class="`__wrap AUDIO ${align} ${readStatus  ? '' : 'unread'}`" :style="{...wrapStyles, width: state.wrapWidth}" @click="onAudioTap" @longpress="onLongPress">
					<!-- 消息内容 -->
					<template>
						<view v-if="align === 'R'" class="__seconds" style="margin-right: 15rpx;">{{duration}}''</view>
						<view class="__ani" :class="{running: isPlaying}">
							<view class="item"></view>
							<view class="item"></view>
							<view class="item"></view>
							<view class="item"></view>
						</view>
						<view v-if="align === 'L'" class="__seconds" style="margin-left: 15rpx;">{{duration}}''</view>
					</template>
					<!-- 角标提示 -->
					<view :class="`angle ${align}`"></view>
					<!-- 工具 -->
					<view class="__tools" :class="{visible: state.openTools}">
						<view class="item" @click.stop="onToolItemTap('undo')">撤回</view>
					</view>
				</view>
				<!-- 3.文字消息 -->
				<view v-if="state.messageType === 'TEXT'" :class="`__wrap TEXT ${align}`" :style="{...wrapStyles}" @longpress="onLongPress">
					<template>
						<!-- 消息内容 -->
						<text user-select>{{message}}</text>
						<!-- 展示Loading -->
						<view v-if="showLoading" class="__loading">
							<view class="item"></view>
							<view class="item"></view>
							<view class="item"></view>
						</view>
						<!-- 展示Icon -->
						<image v-if="showIcon" class="__icon" src="./images/icon_complete.png"></image>
					</template>
					<!-- 角标提示 -->
					<view :class="`angle ${align}`"></view>
					<!-- 工具 -->
					<view class="__tools" :class="{visible: state.openTools}">
						<view class="item" @click.stop="onToolItemTap('undo')">撤回</view>
					</view>
				</view>
			</view>
			<!-- 头像（右侧） -->
			<image class="__avatar" :src="avatar" mode="aspectFill" :style="avatarRStyles"></image>
			<!-- 跳过按钮 -->
			<template v-if="align === 'L' && showSkip">
				<view class="__skip" @click.stop="emits('skip')">跳过</view>
			</template>
		</view>
	</view>
</template>


<style lang="less" scoped>
	@keyframes line-scale-pulse-out {
		0% {
			transform: scaleY(1);
		}

		50% {
			transform: scaleY(0.3);
		}

		100% {
			transform: scaleY(1);
		}
	}

	@keyframes ani-loading {

		0%,
		40%,
		100% {
			transform: scaleY(.4);
		}

		20% {
			transform: scaleY(1);
		}
	}

	.lg-message-box {
		padding: 15rpx 16rpx;
		font-size: 30rpx;
		color: var(--tint-color);

		&__ct {
			display: flex;
			justify-content: flex-end;
			align-items: flex-start;
			position: relative;

			/** 用户头像 */
			.__avatar {
				width: 80rpx;
				height: 80rpx;
				box-sizing: border-box;
				background: #EEEEEE;
				border-radius: 12rpx;
				flex-shrink: 0;
			}

			/** 消息框容器 */
			.__case {
				flex: 1;
				margin: 0 18rpx;
				display: flex;
				/** 程序中通过脚本控制居左还是居右对齐（这里默认居左） */
				justify-content: flex-start;
				align-items: center;


				/** 工具栏 */
				.__tools {
					padding: 0 20rpx;
					height: 64rpx;
					background: #606062;
					border-radius: 16rpx;
					display: none;
					justify-content: center;
					align-items: center;
					position: absolute;
					top: calc(-64rpx - 18rpx);
					left: 0;
					font-size: 26rpx;
					color: #FFFFFF;

					&.visible {
						display: flex;
					}

					&::before {
						content: "";
						position: absolute;
						top: calc(100% - 1px);
						left: 50%;
						transform: translateX(-50%);
						border-width: 14rpx 14rpx 0 14rpx;
						border-style: solid;
						border-color: #606062 transparent transparent transparent;
					}
				}


				/** 语音/文本/图片/视频内容容器公共样式 */
				.__wrap {
					display: flex;
					align-items: center;
					position: relative;
				}

				/** 图片样式 */
				.IMAGE {
					width: 60%;

					image {
						width: 100%;
					}
				}

				/** 语音/文本公共样式 */
				.AUDIO,
				.TEXT {
					min-height: 80rpx;
					background: var(--bg-color);
					border-radius: 12rpx;
					padding: 0 30rpx;

					.angle {
						width: 0;
						height: 0;
						border-style: solid;
						border-width: 10rpx;
						position: absolute;
						top: 28rpx;

						&.L {
							border-color: transparent var(--bg-color) transparent transparent;
							right: 100%;
						}

						&.R {
							border-color: transparent transparent transparent var(--bg-color);
							left: 100%;
						}
					}
				}

				/** 语音样式 */
				.AUDIO {
					.__ani {
						display: flex;
						justify-content: center;
						align-items: center;

						.item {
							width: 4rpx;
							height: 28rpx;
							background-color: var(--tint-color);

							&:not(:last-child) {
								margin-right: 6rpx;
							}

							&:nth-child(1) {
								transform: scaleY(.5);
							}

							&:nth-child(2) {
								transform: scaleY(1);
							}

							&:nth-child(3) {
								transform: scaleY(.6);
							}

							&:nth-child(4) {
								transform: scaleY(.35);
							}

						}

						&.running .item {
							animation: line-scale-pulse-out 1s infinite;

							&:nth-child(1) {
								animation-delay: -.5s;
							}

							&:nth-child(2) {
								animation-delay: -.7s;
							}

							&:nth-child(3) {
								animation-delay: -.9s;
							}

							&:nth-child(4) {
								animation-delay: -.7s;
							}
						}
					}

					&.L.unread::before {
						content: '';
						width: 20rpx;
						height: 20rpx;
						border-radius: 50%;
						background: red;
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						right: -40rpx;
					}
				}

				/** 文本样式 */
				.TEXT {
					padding: 18rpx 28rpx;
					word-break: break-all;

					.__icon {
						width: 34rpx;
						height: 34rpx;
						margin-left: 15rpx;
					}

					.__loading {
						display: flex;
						justify-content: center;
						align-items: center;
						margin-left: 15rpx;

						.item {
							display: inline-block;
							width: 6rpx;
							height: 20rpx;
							background-color: #A594FF;
							margin-right: 8rpx;
							animation: ani-loading 1s linear infinite;
							border-radius: 3rpx;

							&:nth-child(2) {
								animation-delay: -0.8s;
							}

							&:nth-child(3) {
								animation-delay: -0.6s;
							}
						}
					}
				}
			}


			/** 跳过按钮 */
			.__skip {
				font-size: 32rpx;
				line-height: 44rpx;
				color: #A594FF;
				position: absolute;
				right: 10rpx;
				bottom: 0;
			}
		}
	}
</style>