<!-- 横幅提示 -->
<!-- 使用指南： -->
<!-- 1. 页面中导入组件：<message-prompt ref="message" /> -->
<!-- 2. 需要调用的地方：message.value.open({ content, duration }) -->
<script setup>
	import { reactive } from "vue";

	// -- state 
	const state = reactive({
		list: []
	});

	// -- methods
	const open = ({ content, duration = 3000 }) => {
		// -- 构造数据
		const data = {
			message: content,
			id: Date.now(),
			visible: true
		}
		// -- 加入数组
		state.list.unshift(data);
		// -- 指定时间后设置消失的效果，在动画结束之后再移除消息
		setTimeout(() => {
			const index = state.list.findIndex((item) => item.id === data.id);
			state.list[index].visible = false;
		}, duration);
	}

	// -- events
	const onTransitionEnd = (id) => {
		// -- 移除消息
		const index = state.list.findIndex((item) => item.id === id);
		state.list.splice(index, 1);
	}

	// -- exposes
	defineExpose({
		open
	})
</script>

<template>
	<view class="lg-message-prompt" :class="{visible: state.list.length > 0}" :style="{'--top': state.top + 'px'}">
		<block v-for="(item, index) in state.list" :key="item.id">
			<view class="lg-message-prompt__msg" @transitionend="onTransitionEnd(item.id)" :class="{'ani-out': !item.visible}">{{item.message}}</view>
		</block>
	</view>
</template>


<style lang="less" scoped>
	@keyframes ani-message-in {
		from {
			opacity: 0;
			transform: translateY(-38px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.lg-message-prompt {
		width: 750rpx;
		box-sizing: content-box;
		padding-top: 190rpx;
		text-align: center;
		position: fixed;
		top: -100%;
		left: 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;


		&.visible {
			top: 0;
		}

		&__msg {
			max-width: 700rpx;
			background: rgba(0, 0, 0, .7);
			margin-bottom: 10rpx;
			color: #FFFFFF;
			font-size: 28rpx;
			padding: 8rpx 20rpx;
			border-radius: 12rpx;
			animation: ani-message-in 0.35s ease-in;
			transition: all .25s ease-out;

			&.ani-out {
				opacity: 0;
			}
		}
	}
</style>