<template>
	<view class="app-header" :style="{color: tintColor}">
		<!-- 占位 -->
		<view v-if="!gradientColor" class="app-header__place" :style="{height: `${navHeight}px` }"></view>
		<!-- 内容 -->
		<view class="app-header__wrap" :style="{height:  `${navHeight}px`, backgroundColor}">
			<view class="status-bar" :style="{height: `${statusBarHeight}px`}"></view>
			<view class="title-bar" :style="{height: `${titleBarHeight}px`}">
				<view class="left-btns">
					<view class="back-button" @click="onBackButtonTap"></view>
				</view>
				<view class="title">
					{{title}}
				</view>
			</view>
			<view v-if="gradientColor" class="mask" :style="{backgroundColor: gradientColor, opacity}"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "app-header",
		props: {
			title: {
				type: String,
				default: 'uni-app'
			},
			tintColor: {
				type: String,
				default: '#FFFFFF'
			},
			backgroundColor: {
				type: String,
				default: 'transparent'
			},
			gradientColor: String,
			showBack: Boolean
		},
		data() {
			return {
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
				titleBarHeight: 0,
				navHeight: 0,
				opacity: 0
			};
		},
		mounted() {
			this.cals();
		},
		methods: {
			// 计算
			cals() {
				// #ifdef MP-WEIXIN
				const {
					height,
					top
				} = uni.getMenuButtonBoundingClientRect();
				this.titleBarHeight = (top - this.statusBarHeight) * 2 + height;
				// #endif
				// #ifdef MP-ALIPAY
				this.titleBarHeight = 40;
				// #endif 
				this.navHeight = this.statusBarHeight + this.titleBarHeight;
			},
			// 渐变导航
			setOpacity(offset) {
				const target = 100;
				if (offset < target) {
					this.opacity = offset / target;
				} else {
					this.opacity = 1;
				}
			},
			onBackButtonTap() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.app-header {
		width: 100vw;

		&__place {
			width: 100vw;
		}

		&__wrap {
			width: 100vw;
			position: fixed;
			top: 0;
			left: 0;

			.title-bar {
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;

				.left-btns {
					position: absolute;
					left: 26rpx;
					top: 50%;
					transform: translateY(-50%);

					.back-button {
						width: 60rpx;
						height: 60rpx;
						background-image: url(https://qn.d-dou.com/dcep/dbean/efe34239653b4804b3e6632ac296de450kvshd.png);
						background-size: 36rpx 36rpx;
						background-position: left center;
						background-repeat: no-repeat;
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
