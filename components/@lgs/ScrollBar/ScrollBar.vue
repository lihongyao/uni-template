<!-- 支持自定义样式，调用示例： -->
<!-- 
<ScrollBar :data="state.templates" id="templates" @change="onTemplatesChange">
	<template #content="{item}">
		<view class="templates-item " :class="{selected: state.selectedTemplateId === item.id}">
			<view class="inner">{{item.id}}</view>
		</view>
	</template>
</ScrollBar>
-->

<script setup>
	// -- imports 
	import { getCurrentInstance, onMounted, reactive, nextTick, watch } from "vue";
	// -- props 
	const props = defineProps({
		/** 加载数据项 */
		data: { type: Array, default: () => [] },
		/** ID */
		id: String,
		/** 默认选中元素的id */
		defauldSelected: { type: [String, Number], default: '' },
		/** 元素与元素之间的间距，单位rpx，默认6 */
		spacing: { type: Number, default: 6 },
		/** 容器左右两侧的内间距，单位rpx，默认24 */
		wrapSpacing: { type: Number, default: 24 }
	});
	// -- emits 
	const emits = defineEmits(['change']);

	// -- state 
	const state = reactive({
		screenWidth: 0, // 屏幕宽度
		instance: null, // 当前实例
		offset: 0, // 当前偏移位置
		scrollLeft: 0, // 实时滚动距离
	});

	// -- life circles 
	onMounted(() => {
		console.log("「ScrollBar」：mounted");
		// 1. 获取当前实例
		state.instance = getCurrentInstance();
		// 2. 获取屏幕宽度
		state.screenWidth = uni.getSystemInfoSync().screenWidth;
		// 3. 判断当前是否选中默认
		nextTick(() => {
			if (props.defauldSelected) {
				const sel = `#${props.id}-item__${props.defauldSelected}`;
				calc(sel);
			}
			// setTimeout(() => {
			// ...
			// }, 1000)
		})
	})

	// -- methods 
	const calc = (sel) => {
		console.log("「ScrollBar」：", sel);
		// -- 计算偏移
		uni.createSelectorQuery().in(state.instance).select(sel).boundingClientRect(resp => {
			if (resp) {
				// 1. 获取屏幕宽度的一半
				const halfScreenWidth = state.screenWidth / 2;
				// 2. 获取点击元素左侧距离
				const left = resp.left;
				// 3. 获取点击元素宽度的一半
				const halfWidth = resp.width / 2;
				// 4. 计算滚动的距离
				const offset = left - halfScreenWidth + halfWidth;
				state.offset = state.scrollLeft + offset;
			}
		}).exec();
	}

	// -- events
	const onItemTap = ($event, item) => {
		emits("change", { ...item });
		const { id } = $event.currentTarget;
		const sel = `#${id}`;
		calc(sel);
	}
	const onScroll = ({ detail: { scrollLeft } }) => {
		state.scrollLeft = scrollLeft;
	}

	// -- watch 
	watch(() => props.data, () => {
		state.offset = 0;
	}, { immediate: true, deep: true })
</script>

<template>
	<scroll-view scroll-x class="lg-scroll-bar" :scroll-left="state.offset" scroll-with-animation @scroll="onScroll">
		<block v-for="(item, index) in data" :key="index">
			<view class="lg-scroll-bar__item" :id="`${id}-item__${item.id}`" @click="onItemTap($event, item)" :style="{'--spacing': spacing + 'rpx','--wrap-spacing': wrapSpacing + 'rpx'}">
				<slot name="content" :item="item"></slot>
			</view>
		</block>
	</scroll-view>
</template>

<style lang="less" scoped>
	.lg-scroll-bar {
		white-space: nowrap;

		&__item {
			display: inline-block;

			&:first-child {
				margin-left: var(--wrap-spacing);
			}

			&:last-child {
				margin-right: var(--wrap-spacing);
			}

			&:not(:last-child) {
				margin-right: var(--spacing);
			}
		}
	}
</style>