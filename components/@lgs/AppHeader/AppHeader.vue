<script setup>
	// -- imports 
	import { reactive, onMounted } from 'vue';
	// -- props 
	const props = defineProps({
		/** 标题文本 */
		title: { type: String, default: 'uni-app' },
		/** 标题颜色 */
		tintColor: { type: String, default: "#444444" },
		/** 背景颜色 */
		backgroundColor: { type: String, default: "#FFFFFF" },
		/** 渐变颜色 */
		gradientColor: String,
		/** 是否显示返回按钮 */
		showBack: Boolean
	})
	// -- state 
	const state = reactive({
		statusBarHeight: 0,
		titleBarHeight: 0,
		navHeight: 0,
		opacity: 0,
		leftSpacing: 0,
		capsuleHeight: 0, // 导航栏右侧胶囊高度

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
		<view v-if="!gradientColor" class="app-header__place" :style="{height: `${state.navHeight}px` }"></view>
		<!-- 内容 -->
		<view class="app-header__wrap" :style="{height:  `${state.navHeight}px`, backgroundColor}">
			<!-- 状态栏 -->
			<view class="__statusBar" :style="{height: `${state.statusBarHeight}px`}"></view>
			<!-- 标题栏 -->
			<view class="__titleBar" :style="{height: `${state.titleBarHeight}px`}">
				<view class="__btns" :style="{left: `${state.leftSpacing}px`}">
					<view v-if="showBack" class="back-button" @click="onBackButtonTap">
						<image src="./images/icon_back.png"></image>
					</view>
					<slot name="left"></slot>
				</view>
				<view class="title">
					{{title}}
				</view>
			</view>
			<!-- 遮罩（渐变标题背景） -->
			<view v-if="props.gradientColor" class="mask" :style="{backgroundColor: props.gradientColor, opacity: state.opacity}"></view>
		</view>
	</view>
</template>

<style lang="less" scoped>
	.app-header {
		width: 100vw;

		&__place {
			width: 100vw;
			background-color: transparent;
		}

		&__wrap {
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
					color: #171717;
				}

				.__btns {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);

					.back-button {
						width: 64rpx;
						height: 64rpx;

						image {
							width: inherit;
							height: inherit;
						}
					}
				}
			}

			.mask {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				z-index: -1;
				opacity: 0;
			}
		}
	}
</style>