<script setup>
	import { getCurrentInstance, nextTick, onMounted, reactive } from "vue";
	// -- props 
	const props = defineProps({
		/** 图片链接 */
		uri: String,
		/** 是否展示工具栏*/
		showTools: { type: Boolean, default: false },
		/** 所占区域 */
		size: {
			type: Object,
			default: () => ({ width: "100%", height: '100%' })
		}
	});

	// -- state 
	const state = reactive({
		/** 记录当前实例 */
		instance: null,
		/** 拖拽视图尺寸 */
		size: { width: 0, height: 0 },
		/** 拖拽视图原始尺寸 */
		originSize: { width: 0, height: 0 },
		/** 缩放值 */
		x: 0,
		y: 0,
		scale: 1,
		old: {
			x: 0,
			y: 0,
			scale: 1
		}
	});

	// -- life circles 
	onMounted(() => {
		state.instance = getCurrentInstance();
	});

	// -- events 
	const onLoadImage = ($event) => {
		console.log("__onLoadImage__")
		// 1. 读取图片尺寸
		const { width, height } = $event.detail;
		// 2. 获取容器尺寸
		const query = uni.createSelectorQuery().in(state.instance);
		query.select(".lg-drag-area__wrap").boundingClientRect(resp => {
			if (!resp) return;
			// -- 比例计算
			const ratio = resp.width / width;
			state.size = { width: resp.width, height: height * ratio };
			// -- 还原缩放/位置
			// -- 解决view层不同步的问题
			state.scale = state.old.scale;
			state.x = state.old.x;
			state.y = state.old.y;
			nextTick(() => {
				state.scale = 1;
				state.x = 0;
				state.y = 0;
			})
		}).exec();
	}

	const onScale = ($event) => {
		const { x, y, scale } = $event.detail;
		state.old = { x, y, scale };
	}
	const onPreview = () => {
		uni.previewImage({
			urls: [props.uri],
			current: 0,
			indicator: "none"
		})
	}
	const onReset = () => {
		
	}
</script>


<template>
	<view class="lg-drag-area" :style="{...size}">
		<!-- 操作栏 -->
		<view v-if="showTools" class="lg-drag-area__action">
			<view class="btn" @click="onPreview">预览</view>
			<view class="btn" @click="onReset">重置</view>
		</view>
		<!-- 拖拽区 -->
		<!-- 背景高斯模糊：:style="{backgroundImage: `url(${uri})`}" -->
		<movable-area class="lg-drag-area__wrap" scale-area>
			<movable-view class="lg-drag-area__view" out-of-bounds @scale="onScale" :x="state.x" :y="state.y" scale scale-min="0.5" scale-max="2" :scale-value="state.scale" direction="all" :style="{width: `${state.size.width}px`, height: `${state.size.height}px`}">
				<image mode="widthFix" :src="uri" @load="onLoadImage"></image>
			</movable-view>
		</movable-area>
	</view>
</template>


<style lang="less" scoped>
	.lg-drag-area {
		margin: 0 auto;
		overflow: hidden;
		border: 1rpx solid #EEEEEE;
		display: flex;
		flex-direction: column;

		&__action {
			width: 100%;
			height: 80rpx;
			background-color: #333333;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			padding-right: 24rpx;

			.btn {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100rpx;
				height: 42rpx;
				border-radius: 10rpx;
				background: #8176F6;
				color: #FFFFFF;
				font-size: 24rpx;

				&:first-child {
					margin-right: 24rpx;
				}
			}
		}

		&__wrap {
			/** 背景图高斯模糊效果 */
			/*background-size: cover !important;

			&::before {
				content: "";
				position: absolute;
				width: 100%;
				height: 100%;
				backdrop-filter: blur(10px);
			}*/

			width: 100%;
			flex: 1;
			background: #ffffff;
			overflow: hidden;
		}

		&__view {
			// background-color: orange;
		}
	}
</style>
