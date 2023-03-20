<!-- 
 注意：使用时需固定高度
 :deep(.lg-scroll-list) {
		height: calc(100vh - 50px);
 }
-->
<script setup>
	import { getCurrentInstance, onMounted, reactive } from "vue";
	// -- props 
	const props = defineProps({
		/** 是否启用下拉刷新 */
		refresherEnabled: { type: Boolean, default: true },
		/** 新区域背景颜色 */
		refresherBackground: { type: String, default: "#F3F5F9" },
		/** 距底部/右边多远时（单位px），触发 load 事件 */
		lowerThreshold: { type: Number, default: 10 }
	})

	// -- emits 
	const emits = defineEmits(['refresh', "load"]);

	// -- state 
	const state = reactive({
		triggered: false,
		isRefresh: false,
		threshold: 60,
		status: 0,
	});

	// -- methods 
	const renderRefreshText = () => {
		switch (state.status) {
			case 0:
				return "下拉刷新";
			case 1:
				return "松手立即刷新";
			case 2:
				return "正在刷新···";
			case 3:
				return "刷新成功";
		}
	}
	// -- events 
	// 1. 开始下拉
	const onPulling = (e) => {
		if (!state.triggered) {
			state.triggered = true;
		}
		const dy = e.detail.dy;
		if (dy > state.threshold) {
			state.status = 1;
		}
	}
	// 2. 下拉更新
	const onRefresh = () => {
		if (state.isRefresh) return;
		state.isRefresh = true;
		state.status = 2;
		emits("refresh", () => {
			state.status = 3;
			setTimeout(() => {
				state.triggered = false;
			}, 500)
		});
	}
	// 3. 下拉刷新复位时触发
	const onRestore = () => {
		state.status = 0;
		state.isRefresh = false;
		state.triggered = "restore";

	}
	// 4. 取消下拉
	const onAbort = () => {
		state.status = 0;
	}

	// 5. 触底
	const onLoad = () => {
		emits("load");
	}
</script>


<template>
	<scroll-view class="lg-scroll-list" scroll-y :lower-threshold="lowerThreshold" :refresher-enabled="refresherEnabled" refresher-default-style="none" :refresher-threshold="state.threshold" :refresher-triggered="state.triggered" @scrolltolower="onLoad" @refresherrefresh="onRefresh" @refresherrestore="onRestore" @refresherpulling="onPulling" @refresherabort="onAbort">
		<view class="lg-scroll-list__refresh-bar" :style="{'--refresher-bg-color': props.refresherBackground, '--refresher-top': `-${state.threshold}px`, '--refresher-height':`${state.threshold}px`}">{{renderRefreshText()}}</view>
		<view class="lg-scroll-list__wrap" id="sss">
			<slot></slot>
		</view>
	</scroll-view>
</template>





<style lang="less" scoped>
	.lg-scroll-list {
		position: relative;

		&__refresh-bar {
			width: 100%;
			height: var(--refresher-height);
			background: var(--refresher-bg-color);
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			color: rgba(0, 0, 0, .3);
			position: absolute;
			top: var(--refresher-top);
			left: 0;
		}

		&__wrap {
			min-height: 100%;
		}
	}
</style>
