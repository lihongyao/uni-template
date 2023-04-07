<!-- 
 注意：使用时需固定高度
 :deep(.lg-scroll-list) {
		height: calc(100vh - 50px);
 }
-->

<script setup>
	// -- imports
	import { computed, getCurrentInstance, onMounted, reactive } from "vue";
	// -- props 
	const props = defineProps({
		/** 动态设置容器class */
		classNames: { type: [String, Object], default: '' },
		/** 是否启用下拉刷新，默认：false */
		refresherEnabled: Boolean,
		/** 刷新区域背景颜色 */
		refresherBackground: { type: String, default: "#F3F5F9" },
		/** 距底部多远时（单位px），触发 load 事件 */
		lowerThreshold: { type: Number, default: 10 }
	});

	// -- emits 
	// -- @refresh：触发下拉刷新，调用者需回调next函数处理后续逻辑
	// -- @load：触发上拉加载
	const emits = defineEmits(['refresh', "load"]);

	// -- state 
	const state = reactive({
		/** 下拉刷新状态 */
		triggered: false,
		/** 标识当前是否处于抓心状态 */
		isRefresh: false,
		/** 触发松手立即刷新的阈值 */
		threshold: 60,
		/** 下拉刷新状态 0-下拉刷新 1-松手立即刷新 2-正在刷新··· 3-刷新成功 */
		status: 0,
		/** 滚动距离（在滚动至底部时用） */
		scrollTop: 0,
		/** 滚动至指定元素的ID值 */
		scrollId: '',
		/** 当前组件实例，用于调用query API */
		instance: null,
		
	});

	// -- life circles
	onMounted(() => {
		state.instance = getCurrentInstance();
	});

	// -- computes
	const cls = computed(() => {
		return getCls(props.classNames);
	});
	// -- methods 
	/**
	 * 获取classString
	 */
	const getCls = (classNames) => {
		const type = Object.prototype.toString.call(classNames).slice(8, -1).toLowerCase();
		switch (type) {
			case "string":
				return classNames;
			case "array":
				let r = "";
				classNames.forEach(item => {
					r += getCls(item) + ' ';
				});
				return r.trim().replace(/\s+/g, ' ');
			case "object":
				const t = [];
				for (const k in classNames) {
					if (classNames[k]) {
						t.push(k)
					}
				};
				return t.join(" ");
			default:
				return ""
		}
	}

	/**
	 * 渲染下拉刷新文案
	 */
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
	
	/**
	 * 滚动至指定元素/位置
	 * @param {String|Number} v 
	 */
	const scrollTo = (v) => {
		if(typeof v === 'number') {
			state.scrollTop = v;
		}else if(typeof v === "string") {
			state.scrollId = v;
		}	
	}

	/**
	 * 滚动至底部
	 * 调用者需要使用nextTick延时调用，否则没有效果
	 */
	const scrollToBottom = () => {
		// 获取滚动视图高度
		uni.createSelectorQuery().in(state.instance).selectAll(".lg-scroll-list, .lg-scroll-list__wrap").boundingClientRect(rect => {
			if (rect) {
				const wrapHeight = rect[0].height;
				const contentHeight = rect[1].height;
				// 如果内容高度大于容器高度（显示高度）
				if (contentHeight > wrapHeight) {
					// 计算出二者的差值就是需要滚动的距离
					state.scrollTop = contentHeight - wrapHeight;
					console.log(`wrapHeight=${wrapHeight}，contentHeight=${contentHeight}，scrollTop=${contentHeight - wrapHeight}`);
				}
			}
		}).exec();
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

	// -- exposes
	defineExpose({
		scrollTo,
		scrollToBottom
	})
</script>


<template>
	<scroll-view 
		scroll-y 
		scroll-with-animation 
		refresher-default-style="none" 
		:class="`lg-scroll-list ${cls}`" 
		:scroll-top="state.scrollTop" 
		:lower-threshold="lowerThreshold" 
		:refresher-enabled="refresherEnabled" 
		:refresher-threshold="state.threshold" 
		:refresher-triggered="state.triggered" 
		@scrolltolower="onLoad" 
		@refresherrefresh="onRefresh" 
		@refresherrestore="onRestore" 
		@refresherpulling="onPulling" 
		@refresherabort="onAbort"
	>
		<view class="lg-scroll-list__refresh-bar" :style="{'--refresher-bg-color': props.refresherBackground, '--refresher-top': `-${state.threshold}px`, '--refresher-height':`${state.threshold}px`}">{{renderRefreshText()}}</view>
		<view class="lg-scroll-list__wrap">
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