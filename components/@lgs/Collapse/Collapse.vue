<script setup>
	// -- imports 
	import { getCurrentInstance, onMounted, reactive } from "vue";


	// -- props 
	const props = defineProps({
		/** 展开搜索按钮样式 */
		thumbStyle: { type: String, default: '' }
	})
	// -- state 
	const state = reactive({
		id: `lg_${Math.ceil(Math.random() * 10e5).toString(36)}`,
		isOpen: true,
		instance: null,
		contentHeight: 0
	});


	// -- life circles 
	onMounted(() => {
		state.instance = getCurrentInstance();
		getContentHeight();
	});

	// -- methods 
	const getContentHeight = () => {
		const query = uni.createSelectorQuery().in(state.instance);
		query.select('.__wrap').boundingClientRect(rect => {
			if (rect) {
				console.log(`内容高度：${rect.height}px`);
				state.contentHeight = rect.height;
				state.isOpen = false;
			}
		}).exec();
	}

	// -- events 
	const onToggle = () => {
		state.isOpen = !state.isOpen;
	}
</script>


<template>
	<view class="lg-collapse" :id="state.id">
		<!-- 标题 -->
		<slot name="title"></slot>
		<!-- 内容 -->
		<view class="__contents" :style="{height: state.isOpen ? state.contentHeight + 'px' : 0}">
			<view class="__wrap">
				<slot name="contents"></slot>
			</view>
		</view>
		<!-- 操作按钮 -->
		<view class="__action-btn" :style="thumbStyle">
			<view class="btn" @click="onToggle">
				<text>{{state.isOpen ? '收起' : '展开'}}</text>
				<image class="__arrows" :class="{opened: state.isOpen}" src="./images/icon_arrows.png"></image>
			</view>
		</view>
	</view>
</template>


<style lang="less" scoped>
	.lg-collapse {
		width: 100%;
		position: relative;

		.__contents {
			width: 100%;
			overflow: hidden;
			/** 动画 */
			transition: height .3s ease;
		}

		.__action-btn {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			box-sizing: border-box;

			.btn {
				width: 148rpx;
				height: 64rpx;
				background: #F0F1F5;
				border-radius: 34rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #262626;
			}

			.__arrows {
				width: 26rpx;
				height: 30rpx;
				margin-left: 10rpx;
				transition: transform .3s ease;

				&.opened {
					transform: rotateZ(-180deg);
				}
			}
		}
	}
</style>