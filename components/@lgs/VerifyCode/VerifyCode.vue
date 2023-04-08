<script setup>
	// -- imports 
	import { computed, nextTick, onMounted, reactive, ref } from 'vue';
	// -- refs 
	const inputR = ref();
	// -- props 
	const props = defineProps({
		/** 验证码 */
		modelValue: String,
		/** 验证码长度 */
		length: { type: Number, default: 4 },
		/** 对齐方式，可选值：left/right/center，默认：center */
		align: { type: String, default: "center" },
		/** 边框颜色 */
		borderColor: { type: String, default: '#555555' },
		/** 光标颜色 */
		cursorColor: { type: String, default: "#6495ED" },
		/** 是否自动获取焦点 */
		autoFocus: { type: Boolean, default: false },
	});
	// -- emits
	const emits = defineEmits(["update:modelValue", "validate"]);

	// -- state 
	const state = reactive({
		isFocus: props.autoFocus,
	});

	// -- computed
	const __align = computed(() => {
		switch (props.align) {
			case "left":
				return "flex-start";
			case 'center':
				return "center";
			case "right":
				return "flex-end";
		}
	})
	// -- events 
	const onInput = ({ detail: { value } }) => {
		console.log("__onInput__");
		emits("update:modelValue", value);
		if (value.length === props.length) {
			state.isFocus = false;
			emits("validate");
		}
	}
	const onBlur = () => {
		console.log('__onBlur__');
		state.isFocus = false;
	}
	const onTap = () => {
		state.isFocus = true;
	}
</script>


<template>
	<view class="lg-verify-code" :style="{'--border-color': borderColor, '--cursor-color': cursorColor}">
		<!-- 验证码·伪输入框 -->
		<view class="__rows" :style="{'justify-content': __align}">
			<block v-for="(item, index) in length" :key="index">
				<view class="__code" :id="index" :class="{'is-input': state.isFocus && modelValue.length === index}" @click.stop="onTap">
					{{modelValue[index] || ''}}
				</view>
			</block>
		</view>
		<!-- 验证码·真输入框 -->
		<input class="__input" :value="modelValue" :auto-focus="autoFocus" :focus="state.isFocus" placeholder="请输入验证码" type="digit" :maxlength="length" @input="onInput" @blur="onBlur" />
	</view>
</template>


<style lang="less" scoped>
	@keyframes ani-cursor {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	.lg-verify-code {
		margin-top: 60rpx;

		.__rows {
			display: flex;
			align-items: center;

			.__code {
				width: 80rpx;
				height: 80rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-bottom: 2rpx solid var(--border-color);
				text-align: center;
				font-family: 'Courier New', Courier, monospace;
				font-size: 48rpx;
				font-weight: 600;
				position: relative;

				&:not(:last-child) {
					margin-right: 30rpx;
				}

				&::before {
					content: '';
					display: block;
					width: 4rpx;
					height: 40rpx;
					background: transparent;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					animation: ani-cursor 1s linear infinite;
				}

				&.is-input::before {
					background: var(--cursor-color);
				}
			}
		}

		.__input {
			width: 0;
			height: 0;
			min-height: 0;
		}
	}
</style>