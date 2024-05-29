<script setup>
	import { reactive } from "vue";

	// -- props 
	const props = defineProps({
		/** 内容圆角 */
		radius: { type: String, default: "64rpx 64rpx 0 0" },
		/** 是否适配底部安全区，默认：true */
		safeArea: { type: Boolean, default: true },
		/** 蒙版点击是否关闭弹窗，默认：true */
		isMaskClick: { type: Boolean, default: true },
		/** 主窗口背景色 */
		backgroundColor: { type: String, default: "transparent" }
	});
	// -- state 
	const state = reactive({
		visible: false
	});


	// -- methods 
	const open = () => {
		state.visible = true;
	}
	const close = () => {
		state.visible = false;
	}

	// -- events 
	const onMaskTap = () => {
		if (props.isMaskClick) {
			state.visible = false
		}
	}

	// -- exposes
	defineExpose({
		open,
		close
	});
</script>



<template>
	<view class="lg-popup" catchtouchmove :class="{visible: state.visible}" :style="{'--bg-color': backgroundColor, '--radius': radius }" @click="onMaskTap">
		<view class="lg-popup__content" :class="{__safe: safeArea}" @click.stop="">
			<slot></slot>
		</view>
	</view>
</template>



<style lang="less" scoped>
	.lg-popup {
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, .75);
		position: fixed;
		top: 0;
		left: 0;
		transition: all .25s linear;
		z-index: -1;
		opacity: 0;


		&__content {
			width: 750rpx;
			background-color: var(--bg-color);
			border-radius: var(--radius);
			overflow: hidden;
			position: absolute;
			left: 0;
			bottom: 0;
			transform: translateY(100%);
			transition: all .25s linear;

			&.__safe {
				padding-bottom: constant(safe-area-inset-bottom);
				padding-bottom: env(safe-area-inset-bottom);
			}
		}

		&.visible {
			z-index: 20;
			opacity: 1;

			.lg-popup__content {
				transform: translateY(0%);
			}
		}
	}
</style>