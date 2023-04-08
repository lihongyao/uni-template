<script setup>
	// -- props
	const props = defineProps({
		/** 选中状态  */
		modelValue: Boolean,
		/** 选中时的颜色 */
		checkedColor: { type: String, default: "#6495ED" },
		/** 未选中时的颜色 */
		defaultColor: { type: String, default: "#D0D0D0" }
	});
	// -- emits
	const emits = defineEmits(["update:modelValue", "change"]);
	// -- events 
	const onToggle = () => {
		emits("update:modelValue", !props.modelValue);
		emits("change", !props.modelValue);
	}
</script>

<template>
	<view class="lg-icon-check">
		<view class="__wrap" :class="{checked: modelValue}" @click="onToggle" :style="{'--color': defaultColor, '--checked-color': checkedColor}">
			<view class="__inner"></view>
		</view>
	</view>

</template>


<style lang="less" scoped>
	.lg-icon-check {
		.__wrap {
			width: 32rpx;
			height: 32rpx;
			border-radius: 50%;
			position: relative;
			box-sizing: border-box;
			border: 2rpx solid var(--color);

			.__inner {
				width: 16rpx;
				height: 16rpx;
				background-color: var(--checked-color);
				border-radius: 50%;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				opacity: 0;
			}

			&.checked {
				border-color: var(--checked-color);

				.__inner {
					opacity: 1;
				}
			}
		}
	}
</style>