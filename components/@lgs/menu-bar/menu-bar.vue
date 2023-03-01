<script setup>
	import { defineProps, defineEmits, reactive, onMounted, getCurrentInstance } from 'vue';
	// -- props & emits
	const props = defineProps({
		modelValue: [String, Number],
		showBorder: { type: Boolean, default: true },
		data: { type: Array, default: [] }, // -- {label, value}
		themeColor: { type: String, default: "#1946BB" }
	});
	const emits = defineEmits(["update:modelValue", "change"]);
	// -- state
	const state = reactive({
		q: [],
		contentScrollW: 0,
		scrollLeft: 0
	})
	// -- life circles
	onMounted(() => {
		init();
	})
	// -- methods
	const init = async () => {
		// 1. 容器宽度
		const query = uni.createSelectorQuery().in(getCurrentInstance());
		query.select('.v-menu-bar').boundingClientRect(({ width }) => {
			state.contentScrollW = width;
		}).exec();
		// 2. 子元素宽度和距离左侧距离
		query.selectAll('.v-menu-bar__item').boundingClientRect(data => {
			let len = data.length;
			let arr = [];
			for (let i = 0; i < len; i++) {
				arr.push({
					left: data[i].left,
					width: data[i].width
				});
			}
			state.q = arr;
			// 3. 处理默认选中
			const index = props.data.findIndex(item => item.value === props.modelValue);
			if (index !== -1) {
				state.scrollLeft = state.q[index].left - state.contentScrollW / 2 + state.q[index].width / 2;
			}
		}).exec();
	}
	// -- events
	const onMenuItemTap = ({ value }, index) => {
		state.scrollLeft = state.q[index].left - state.contentScrollW / 2 + state.q[index].width / 2;
		emits("update:modelValue", value);
	}
</script>


<template>
	<scroll-view ref="vWrap" class="v-menu-bar" :class="{border: showBorder}" scroll-x scroll-with-animation :scroll-left="state.scrollLeft">
		<block v-for="(item, index) in data" :key="index">
			<view 
			class="v-menu-bar__item" 
			:class="{selected: item.value === modelValue}" 
			:style="'--theme-color:'+ themeColor"
			@click="onMenuItemTap(item, index)" >
				{{item.label}}
			</view>
		</block>
	</scroll-view>
</template>


<style lang="less" scoped>
	.v-menu-bar {
		width: 100%;
		white-space: nowrap;
		background: #FFFFFF;
		box-sizing: border-box;

		&.border {
			border-bottom: 2rpx solid #EEEEEE;
		}

		&__item {
			height: inherit;
			font-size: 28rpx;
			color: #999999;
			display: inline-block;
			line-height: 80rpx;
			margin: 0 38rpx;
			position: relative;

			&::before {
				content: '';
				display: block;
				width: 0;
				height: 8rpx;
				background: var(--theme-color);
				border-radius: 4rpx;
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				transition: all .75s linear;
				transition: width .25s linear;
			}

			&.selected {
				color: var(--theme-color);
				font-weight: bold;
			}

			&.selected::before {
				width: 56rpx;
			}
		}
	}
</style>
