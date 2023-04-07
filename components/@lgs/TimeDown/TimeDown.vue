<script setup>
	import { onMounted, reactive } from "vue";
	// -- props
	const props = defineProps({
		modelValue: { type: Number, default: 5 }
	});

	// -- emits 
	const emits = defineEmits(["update:modelValue", "end"]);
	// -- state 
	const state = reactive({
		v: props.modelValue,
		statusBarHeight: 0,
		titleBarHeight: 0,
		countHeight: 0,
		countPaddingLeft: 0,
	});

	// -- life circles
	onMounted(() => {
		// -- 获取状态栏高度
		const { statusBarHeight, screenWidth } = uni.getWindowInfo();
		// -- 获取拇指位置信息
		const { height, top, right } = uni.getMenuButtonBoundingClientRect();
		// -- 计算标题栏高度
		state.titleBarHeight = (top - statusBarHeight) * 2 + height;
		// -- 赋值
		state.statusBarHeight = statusBarHeight;
		state.countHeight = height;
		state.countPaddingLeft = screenWidth - right;
		// -- 开始倒计时
		const timer = setInterval(() => {
			state.v--;
			emits("update:modelValue", state.v);
			if (state.v === 0) {
				// -- 清除定时器
				clearInterval(timer);
				// -- 触发end事件
				emits("end");
			}
		}, 1000);
	});
</script>

<template>
	<view class="time-down" :style="`top:${state.statusBarHeight}px; height: ${state.titleBarHeight}px;padding-left: ${state.countPaddingLeft}px`">
		<view class="count" :style="`height:${state.countHeight}px`">
			{{state.v}}&nbsp;s
		</view>
	</view>
</template>


<style lang="less" scoped>
	.time-down {
		width: 750rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		box-sizing: border-box;
		position: absolute;
		left: 0;

		.count {
			width: 130rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #999999;
			opacity: .5;
			font-size: 32rpx;
			color: #FFFFFF;
			border-radius: 30rpx;
		}

	}
</style>