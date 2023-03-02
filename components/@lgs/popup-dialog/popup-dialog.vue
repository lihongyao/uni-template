<script setup>
	import { defineProps } from 'vue';

	const props = defineProps({
		message: String,
		showCancelButton: { type: Boolean, default: true },
		cancelButtonText: { type: String, default: '取消' },
		sureButtonText: { type: String, default: '确定' },
		cancelButtonBgColor: { type: String, default: "#D0D0D0"},
		sureButtonBgColor: { type: String, default: "#1946BB"},
	});

	const emits = defineEmits(["cancel", "sure"])
	
</script>


<template>
	<view class="popup-wrap">
		<view class="message">{{message}}</view>
		<view class="actions">
			<template v-if="showCancelButton">
				<view class="button cancel" @click="emits('cancel')" :style="'--cancel-bg-color:'+ cancelButtonBgColor" >{{cancelButtonText}}</view>
			</template>
			<view class="button sure" :class="{alone: !showCancelButton}" @click="emits('sure')" :style="'--sure-bg-color:'+ sureButtonBgColor" >{{sureButtonText}}</view>
		</view>
	</view>
</template>



<style lang="less">
	.popup-wrap {
		width: 654rpx;
		height: 364rpx;
		background-color: #FFFFFF;
		border-radius: 24rpx;
		padding-top: 80rpx;

		.message {
			font-size: 40rpx;
			line-height: 56rpx;
			color: #444444;
			font-family: 'DIN-Bold';
			text-align: center;
		}

		.actions {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 60rpx;

			.button {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 240rpx;
				height: 88rpx;
				border-radius: 48rpx;

				color: #FFFFFF;
				font-size: 32rpx;

				&.alone {
					width: 400rpx;
				}

				&.cancel {
					background: var(--cancel-bg-color);
					margin-right: 60rpx;
				}

				&.sure {
					background: var(--sure-bg-color);
				}
			}
		}
	}
</style>
