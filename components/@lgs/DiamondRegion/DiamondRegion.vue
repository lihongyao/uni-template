<script setup>
	// -- imports 
	import { reactive, ref } from 'vue';

	// -- props
	const props = defineProps({
		/** 数据结构：Array<{icon, label}> */
		data: { type: Array, default: [] },
		/** 显示最大个数 */
		max: { type: Number, default: 4 },
		/** 拇指宽度，单位：rpx */
		thumbWidth: { type: [String, Number], default: 60 },
		/** 拇指背景色 */
		thumbBgColor: { type: String, default: "#B5B5B5" },
		/** 游标宽度，单位：rpx  */
		cursorWidth: { type: [String, Number], default: 24 },
		/** 游标背景色 */
		cursorBgColor: { type: String, default: "#FFFFFF" },
	});
	// -- emits
	const emits = defineEmits(["itemTap"]);

	// -- refs 
	const progressRef = ref();
	// -- state 
	const state = reactive({
		thumbWidth: uni.upx2px(props.thumbWidth),
		cursorWidth: uni.upx2px(props.cursorWidth),
		windowWidth: uni.getSystemInfoSync().windowWidth,
		cursorLeft: 0,
		showProgress: true,
	});
	// -- styles 
	const styles = {
		'--thumb-width': state.thumbWidth + 'px',
		'--cursor-width': state.cursorWidth + 'px',
		'--thumb-bg-color': props.thumbBgColor,
		'--cursor-bg-color': props.cursorBgColor,
	}
	// -- events
	const onScroll = ({ detail }) => {
		const { scrollWidth, scrollLeft } = detail;
		if (scrollWidth - state.windowWidth > 0) {
			/*
				scrollLeft         scrollWidth  
				——————————     =   ——————————        → left = (scrollLeft * thumbWidth) / scrollWidth
				left(未知)          thumbWidth
			 */
			state.cursorLeft = scrollLeft * (state.thumbWidth - state.cursorWidth) / (scrollWidth - state.windowWidth);
		}

	}
</script>




<template>
	<view class="lg-diamond-region" :style="styles">
		<!-- Items Start -->
		<scroll-view scroll-x class="__scroll-bar" @scroll="onScroll" id="sg-view">
			<block v-for="(item, index) in props.data" :key="index">
				<view class="__scroll-bar-item" @click="emits('itemTap', { ...item })">
					<image class="icon" :src="item.icon"></image>
					<view class="label">{{item.label || '————'}}</view>
				</view>
			</block>
		</scroll-view>
		<!-- Items End -->

		<!-- Scroll Bar Start -->
		<view v-if="props.data.length > props.max" class="__thumb" ref="progressRef">
			<view class="cursor" id="__scroll-cursor" :style="{left: state.cursorLeft + 'px'}"></view>
		</view>
		<!-- Scroll Bar End -->
	</view>
</template>


<style lang="less" scoped>
	.lg-diamond-region {
		.__scroll-bar {
			white-space: nowrap;
			font-size: 0;

			.__scroll-bar-item {
				width: 100rpx;
				display: inline-block;
				text-align: center;
				margin-right: 48rpx;

				&:first-child {
					margin-left: 44rpx;
				}
			}

			.icon {
				width: 72rpx;
				height: 72rpx;
			}

			.label {
				margin-top: 16rpx;
				font-size: 26rpx;
				font-family: PingFang SC-Regular, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 26px;
			}
		}

		.__thumb {
			width: var(--thumb-width);
			height: 12rpx;
			border-radius: 6rpx;
			background: var(--thumb-bg-color);
			margin: 20rpx auto 0;
			position: relative;

			.cursor {
				width: var(--cursor-width);
				height: 12rpx;
				border-radius: 6rpx;
				background: var(--cursor-bg-color);
				position: absolute;
				top: 0;
			}
		}
	}
</style>