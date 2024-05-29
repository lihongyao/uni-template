<script setup>
	// -- imports 
	import { reactive, onMounted } from 'vue';
	// -- props 
	const props = defineProps({
		/** 标题文本 */
		title: { type: String, default: 'uni-app' },
		/** 标题颜色 */
		tintColor: { type: String, default: "#212121" },
		/** 背景颜色 */
		backgroundColor: { type: String, default: "#FFFFFF" },
		/** 背景图片 */
		bgImgSrc: { type: String, default: '' },
		/** 渐变颜色 */
		gradientColor: String,
		/** 是否显示返回按钮 */
		showBack: Boolean,
		/** 占位 */
		showPlace: Boolean,
	})
	// -- state 
	const state = reactive({
		/** 状态栏高度 */
		statusBarHeight: 0,
		/** 标题栏高度 */
		titleBarHeight: 0,
		/** 导航栏高度 = 状态栏高度 + 标题栏高度 */
		navHeight: 0,
		/** 透明度 */
		opacity: 0,
		/** 左侧间距 */
		leftSpacing: 0,
		/** 导航栏右侧胶囊高度 */
		capsuleHeight: 0,
	});
	// -- life circles 
	onMounted(() => {
		// -- 获取窗口信息
		const { statusBarHeight, screenWidth } = uni.getWindowInfo();

		// -- 计算标题栏高度
		// #ifdef MP-WEIXIN 
		const { height, top, right } = uni.getMenuButtonBoundingClientRect();
		state.titleBarHeight = (top - statusBarHeight) * 2 + height;
		// #endif

		// #ifdef MP-ALIPAY 
		state.titleBarHeight = 40;
		// #endif 

		// -- 计算状态栏高度
		state.statusBarHeight = statusBarHeight;
		// -- 计算导航栏高度
		state.navHeight = statusBarHeight + state.titleBarHeight;
		// -- 计算左侧偏移间距
		state.leftSpacing = right ? screenWidth - right : 15;
	});

	// -- methods
	/** 渐变导航 → 调用者需传递当前的offset，用于计算不透明度 */
	const setOpacity = (offset) => {
		const target = 100;
		if (offset < target) {
			state.opacity = offset / target;
		} else {
			state.opacity = 1;
		}
	};

	const getHeight = () => {
		return state.navHeight;
	}


	// -- events 
	/** 监听点击返回上一页 */
	const onBackButtonTap = () => {
		uni.navigateBack({
			delta: 1
		})
	};

	defineExpose({
		setOpacity,
		getHeight
	});
</script>

<template>
	<view class="app-header" :style="{color: tintColor}">
		<!-- 占位 -->
		<view v-if="showPlace" class="__place" :style="{height: `${state.navHeight}px` }"></view>
		<!-- 内容 -->
		<view class="__wrap" :style="{height:  `${state.navHeight}px`, backgroundColor}">
			<!-- 状态栏 -->
			<view class="__statusBar" :style="{height: `${state.statusBarHeight}px`}"></view>
			<!-- 标题栏 -->
			<view class="__titleBar" :style="{height: `${state.titleBarHeight}px`}">
				<view class="__btns" :style="{left: `${state.leftSpacing}px`}">
					<view v-if="showBack" class="back-button" @click="onBackButtonTap">
						<image mode="widthFix" src="./images/icon_back_arrow.png"></image>
					</view>
					<slot name="left"></slot>
				</view>
				<view class="title">
					{{title}}
				</view>
			</view>
			<!-- 遮罩（渐变标题背景） -->
			<image v-if="props.bgImgSrc" class="__mask-bg" :style="{width: '750rpx', height: `${state.navHeight}px`}"
				mode="aspectFill" :src="props.bgImgSrc"></image>
			<!-- 遮罩（渐变标题背景） -->
			<view v-if="props.gradientColor" class="__mask"
				:style="{backgroundColor: props.gradientColor, opacity: state.opacity}"></view>
		</view>
	</view>
</template>

<style lang="less" scoped>
	.app-header {
		width: 100vw;

		.__place {
			width: 100vw;
			background-color: transparent;
		}

		.__wrap {
			width: 100vw;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 999;

			.__titleBar {
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;

				.title {
					font-size: 32rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
				}

				.__btns {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);

					.back-button {
						width: 64rpx;
						height: 64rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						image {
							width: 24rpx;
							// width: inherit;
							// height: inherit;
						}
					}
				}
			}

			.__mask {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				z-index: -1;
				opacity: 0;
			}

			.__mask-bg {
				position: absolute;
				top: 0;
				left: 0;
				z-index: -1;
			}
		}
	}
</style>