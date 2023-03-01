<!-- 需要在调用的地方指定容器高度 -->
<script setup>
	import { reactive, onMounted, nextTick } from 'vue';
	import Loading from '@/components/@lgs/loading/loading.vue';
	import NoData from '@/components/@lgs/no-data/no-data.vue';
	import CategoriesItem from '@/components/categories-item/categories-item.vue';
	import LoadMore from '@/components/@lgs/load-more/load-more.vue';
	import Api from '@/api/index.js';
	// -- props & emits
	const props = defineProps({
		defaultValue: { type: [Number, String] }
	});

	// -- state 
	const state = reactive({
		defaultIndex: 0,
		categories: [],
		value: 0,
		cursorTop: 0,
		cursorHeight: 0,
		slideItemHeight: 0,
		list: null,
		page: 1,
		hasMore: false,
	});

	// -- life circles
	onMounted(() => {
		getCategories();
	});

	// -- methods
	const calc = () => {
		const query = uni.createSelectorQuery();
		query.select(".lg-slide-bar .cursor").boundingClientRect();
		query.select(".lg-slide-bar .slide-item").boundingClientRect();
		query.exec(([cursor, slideItem]) => {
			state.cursorHeight = cursor.height;
			state.slideItemHeight = slideItem.height;
			state.cursorTop = state.defaultIndex * state.slideItemHeight + (state.slideItemHeight / 2 - state.cursorHeight / 2)
		});
	}
	const getCategories = async () => {
		const resp = await Api.course.category();
		if (resp && resp.code === 0) {
			// -- 处理默认选中项
			const index = resp.data.findIndex(item => item.value == props.defaultValue);
			if (index === -1) {
				state.value = resp.data[0].value;
			} else {
				state.defaultIndex = index;
				state.value = resp.data[index].value;
			}
			state.categories = resp.data;
			query();
			// -- 计算
			nextTick(() => {
				calc();
			});
		}
	}
	const query =  async () => {
		const resp = await Api.course.categoryItems({
			categoryId: state.value,
			page: state.page,
			pageSize: 8
		});
		if(resp && resp.code === 0) {
			if(state.page === 1) {
				state.list = resp.data;
			}else {
				state.list = state.list.concat(resp.data);
			}
			state.hasMore = state.page < resp.page.pages;
		}
	}
	// -- events
	const onSlideItemTap = (v, i) => {
		state.value = v;
		state.cursorTop = i * state.slideItemHeight + (state.slideItemHeight / 2 - state.cursorHeight / 2)
		state.list = null;
		state.page = 1;
		query();
	}
	const onLoadMore = () => {
		if (state.hasMore) {
			state.page++;
			query();
		}
	}
</script>

<template>
	<view class="lg-slide-bar">
		<!-- 侧边栏 -->
		<scroll-view class="lg-slide-bar__slide" scroll-y>
			<block v-for="(item, index) in state.categories" :key="index">
				<view class="slide-item" :class="{selected: item.value === state.value}" @click="onSlideItemTap(item.value, index)">{{item.label}}</view>
				<view class="cursor" :style="{top: state.cursorTop + 'px'}"></view>
			</block>
		</scroll-view>
		<!-- 内容区域 -->
		<scroll-view class="lg-slide-bar__contents" scroll-y @scrolltolower="onLoadMore" :lower-threshold="20">
			<template v-if="state.list">
				<template v-if="state.list.length > 0">
					<block v-for="(item, index) in state.list" :key="index">
						<categories-item :data="item"></categories-item>
					</block>
					<load-more :hasMore="state.hasMore"></load-more>
				</template>
				<no-data v-else :top="200"></no-data>
			</template>
			<loading v-else :top="200"></loading>
		</scroll-view>
	</view>
</template>


<style lang="less" scoped>
	.lg-slide-bar {
		border-top: 2rpx solid #F7F7F7;
		height: 100%;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;

		&__slide {
			width: 208rpx;
			height: 100%;
			background-color: #F8F8F8;
			position: relative;

			.cursor {
				width: 6rpx;
				height: 68rpx;
				background-color: #2600FF;
				position: absolute;
				left: 2rpx;
				transition: top .25s ease-in-out;
			}

			.slide-item {
				height: 100rpx;
				display: flex;
				align-items: center;
				padding-left: 40rpx;
				font-size: 28rpx;
				color: #A5A5A5;
				position: relative;
				transition: background-color .25s linear;

				&.selected {
					background-color: #FFFFFF;
				}
			}
		}

		&__contents {
			flex: 1;
			height: 100%;
			background-color: #FFFFFF;

		}
	}
</style>
