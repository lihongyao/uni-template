<script setup>
	import {
		defineProps,
		defineEmits
	} from 'vue';
	// -- props
	const props = defineProps({
		modelValue: Number,
		max: {
			type: Number,
			default: Number.MAX_SAFE_INTEGER
		}
	});
	// -- emits
	const emits = defineEmits(["update:modelValue", "change"]);
	// -- events
	const onMinusTap = () => {
		emits("update:modelValue", props.modelValue - 1);
		emits("change", props.modelValue - 1);
	}
	const onPlusTap = () => {
		if(props.modelValue < props.max) {
			emits("update:modelValue", props.modelValue + 1);
			emits("change", props.modelValue + 1);
		}
	}
</script>

<template>
	<view class="v-stepper">
		<template v-if="!!modelValue">
			<view class="v-stepper__item minus" @click="onMinusTap">
				<view class="line"></view>
			</view>
			<view class="v-stepper__item value">{{modelValue}}</view>
		</template>
		<view class="v-stepper__item plus" :class="{none: !modelValue, disabled:modelValue >= max }" @click="onPlusTap">
			<view class="line"></view>
			<view class="line"></view>
		</view>
	</view>
</template>

<style scoped lang="less">
	.v-stepper {
		display: flex;
		justify-content: center;
		align-items: center;

		&__item {
			width: 58rpx;
			height: 36rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #1946BB;

			.line {
				width: 16rpx;
				height: 4rpx;
				background: #FFFFFF;
			}

			&.disabled {
				background: #B6CAFF;
			}

			&.minus {
				border-radius: 10rpx 0 0 10rpx;
			}

			&.value {
				background: #EFEFEF;
				font-size: 24rpx;
				color: #202020;
				font-weight: bold;
			}

			&.plus {
				border-radius: 0 10rpx 10rpx 0;
				position: relative;

				&.none {
					border-radius: 10rpx;
				}

				.line:first-child {
					transform: rotateZ(90deg);
					position: absolute;
				}
			}
		}
	}
</style>
