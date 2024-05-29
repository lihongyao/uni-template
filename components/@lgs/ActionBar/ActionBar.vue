<script setup>
	const props = defineProps({
		buttonText: { type: String, required: true },
		disabled: { type: Boolean, default: false }
	})
	const emits = defineEmits(['buttonTap']);
	const onTap = () => {
		if(!props.disabled) {
			emits('buttonTap');
		}
		
	}
</script>


<template>
	<view class="lg-action-bar">
		<view class="__wrap">
			<view class="__button" :class="{disabled: props.disabled}" @tap="onTap">{{props.buttonText}}
			</view>
		</view>
	</view>
</template>


<style lang="less" scoped>
	.lg-action-bar {
		width: 750rpx;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		padding-bottom: constant(safe-area-inset-bottom) !important;
		padding-bottom: env(safe-area-inset-bottom) !important;
		box-shadow: 0px -2 0px 0px rgba(0, 0, 0, 0.05);
		z-index: 10;

		.__wrap {
			padding: 10rpx 0;
			display: flex;
			justify-content: center;
			align-items: center;

			.__button {
				width: 622rpx;
				height: 80rpx;
				background: linear-gradient(90deg, #CA2929 0%, #A21717 100%);
				border-radius: 80rpx;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 32rpx;
				font-weight: 500;

				&.disabled {
					opacity: .5;
				}
			}
		}
	}
</style>