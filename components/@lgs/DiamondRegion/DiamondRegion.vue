<script setup>
	/**
	 * 金刚区滚动栏
	 */
	// -- imports 
	import { getCurrentInstance, onMounted, reactive, ref } from 'vue';

	// -- props
	const props = defineProps({
		data: { type: Array, default: [] },
		max: { type: Number, default: 4 }
	});
	// -- emits
	const emits = defineEmits(["itemTap"]);

	// -- refs 
	const progressRef = ref();
	// -- state 
	const state = reactive({
		windowWidth: 0,
		progressWidth: 0,
		cursorWidth: 0,
		cursorLeft: 0,
		showProgress: true,
	});
	// -- life circles
	onMounted(() => {

		state.windowWidth = uni.getSystemInfoSync().windowWidth;
		const instance = getCurrentInstance();
		const query = uni.createSelectorQuery().in(instance);
		query.select("#lg-scroll-progress").boundingClientRect(resp => {
			console.log(resp);
			state.progressWidth = resp ? resp.width : 0;
		});
		query.select("#lg-scroll-cursor").boundingClientRect(resp => {
			state.cursorWidth = resp ? resp.width : 0;
		});
		query.exec();
	});
	// -- events
	const onScroll = ({ detail }) => {
		const { scrollWidth, scrollLeft } = detail;
		if (scrollWidth - state.windowWidth > 0) {
			/*
				scrollLeft         scrollWidth  
				——————————     =   ——————————        → left = (scrollLeft * progressWidth) / scrollWidth
				left(未知)         progressWidth
			 */
			state.cursorLeft = scrollLeft * (state.progressWidth - state.cursorWidth) / (scrollWidth - state.windowWidth);
		}

	}
</script>




<template>
	<view class="scroll-bar-wrap">
		<!-- Items Start -->
		<scroll-view scroll-x class="scroll-bar" @scroll="onScroll" id="sg-view">
			<block v-for="(item, index) in props.data" :key="index">
				<view class="scroll-bar-item" @click="emits('itemTap', { ...item })">
					<image class="icon" :src="item.iconUrl"></image>
					<view class="label" :class="{empty: !item.name}">{{item.name || '————'}}</view>
				</view>
			</block>
		</scroll-view>
		<!-- Items End -->
		<!-- Scroll Bar Start -->
		<view v-if="props.data.length > props.max" class="scroll-progress" id="lg-scroll-progress" ref="progressRef">
			<view class="cursor" id="lg-scroll-cursor" :style="{left: state.cursorLeft + 'px'}"></view>
		</view>
		<!-- Scroll Bar End -->
	</view>
</template>


<style lang="less" scoped>
	.scroll-bar-wrap {

		.scroll-bar {
			white-space: nowrap;
			font-size: 0;

			.scroll-bar-item {
				width: 100rpx;
				display: inline-block;
				text-align: center;
				margin-right: 70rpx;

				&:first-child {
					margin-left: 70rpx;
				}
			}

			.icon {
				width: 100rpx;
				height: 100rpx;
				background: #E2E2E2;
				border-radius: 20rpx;
			}

			.label {
				margin-top: 26rpx;
				font-size: 24rpx;
				color: #333333;
				line-height: 34rpx;

				&.empty {
					color: #888888;
				}
			}
		}

		.scroll-progress {
			width: 84rpx;
			height: 6rpx;
			background: #E0E0E0;
			margin: 20rpx auto 0;
			position: relative;

			.cursor {
				width: 24rpx;
				height: 6rpx;
				background: #2600FF;
				position: absolute;
				top: 0;
			}
		}
	}
</style>
