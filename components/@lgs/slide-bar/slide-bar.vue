<!-- 需要在调用的页面样式文件中指定容器高度 -->
<!-- 如：:deep(.lg-slide-bar) { height: 500px } -->

<script setup>
	import { reactive, onMounted, nextTick } from 'vue';
	import Loading from '@/components/@lgs/loading/loading.vue';
	import NoData from '@/components/@lgs/no-data/no-data.vue';
	import LoadMore from '@/components/@lgs/load-more/load-more.vue';
	import service from '@/service';

	// -- props & emits
	const props = defineProps({
		//** 默认值 */
		defaultValue: { type: [Number, String], default: '' }
	});

	// -- state 
	const state = reactive({
		/** 默认值下标位置 */
		defaultIndex: 0,
		/** 左侧菜单数据列表 */
		categories: [],
		/** 当前选中的菜单项的value值 */
		value: 0,
		/** 游标的位置 */
		cursorTop: 0,
		/** 游标高度 */
		cursorHeight: 34,
		/** 菜单栏高度 */
		slideItemHeight: 50,
		/** 数据列表 */
		list: null,
		/** 请求数据的页码 */
		page: 1,
		/** 是否还有更多，决定是否执行上拉加载 */
		hasMore: false,
	});

	// -- life circles
	onMounted(() => {
		// -- 获取左侧分类栏的数据
		getCategories();
	});

	// -- methods
	// -- 获取左侧菜单栏数据
	const getCategories = async () => {
		// const resp = await service.goods.categories();
		// -- 模拟分类数据
		const resp = {
			code: 200,
			data: [
				{ "name": "浆果类", "id": "63fd88d211eff45d5b846a8d" },
				{ "name": "瓜果类", "id": "63fd88d811eff45d5b846a90" },
				{ "name": "柑橘属", "id": "63fd88dd11eff45d5b846a93" },
				{ "name": "坚果类", "id": "63fd88e311eff45d5b846a96" },
				{ "name": "核果类", "id": "63fd88e811eff45d5b846a99" }
			]
		}
		if (resp && resp.code === 200) {
			// -- 处理默认选中项
			const index = resp.data.findIndex(item => item.id == props.defaultValue);
			if (index === -1) {
				state.value = resp.data[0].id;
			} else {
				state.defaultIndex = index;
				state.value = resp.data[index].id;
			}
			state.categories = resp.data;
			// -- 请求数据
			query();
			// -- 计算游标初始位置
			nextTick(() => {
				state.cursorTop = state.defaultIndex * state.slideItemHeight + (state.slideItemHeight / 2 - state.cursorHeight / 2)
			});
		}
	}

	const query = async () => {
		console.log(`
			请求页码：${state.page}
			请求数据：ID → ${state.value}
		`)
		/*const resp = await service.goods.list({
			state: 1,
			categoryId: state.value,
			page: state.page,
			pageSize: 8
		});*/
		// -- 模拟列表数据
		setTimeout(() => {
			const resp = {
				code: 200,
				data: [{}, {}, {}],
				page: { pages: 0 }
			}
			if (resp && resp.code === 200) {
				if (state.page === 1) {
					state.list = resp.data;
				} else {
					state.list = state.list.concat(resp.data);
				}
				state.hasMore = state.page < resp.page.pages;
			}
		}, 1000)
	}
	// -- events
	// -- 点击左侧菜单栏
	const onSlideItemTap = (v, i) => {
		state.value = v;
		state.cursorTop = i * state.slideItemHeight + (state.slideItemHeight / 2 - state.cursorHeight / 2)
		state.list = null;
		state.page = 1;
		query();
	}
	// -- 上拉加载更多
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
				<view class="slide-item" :style="{height: state.slideItemHeight + 'px' }" :class="{selected: item.id === state.value}" @click="onSlideItemTap(item.id, index)">{{item.name}}</view>
			</block>
			<view class="cursor" :style="{top: state.cursorTop + 'px', height: state.cursorHeight + 'px'}"></view>
		</scroll-view>
		<!-- 内容区域 -->
		<scroll-view class="lg-slide-bar__contents " scroll-y @scrolltolower="onLoadMore" :lower-threshold="20">
			<template v-if="state.list">
				<template v-if="state.list.length > 0">
					<block v-for="(item, index) in state.list" :key="index">
						<view class="px-30">
							<view class="slide-bar-item">

							</view>
						</view>
					</block>
					<load-more :hasMore="state.hasMore" />
				</template>
				<no-data v-else tips="当前分类为空~" :top="200" />
			</template>
			<loading v-else :top="200" />
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
				background-color: #42b983;
				/** 游标颜色 */
				position: absolute;
				left: 2rpx;
				transition: top .25s ease-in-out;
			}

			.slide-item {
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
			box-sizing: border-box;
			padding-top: 20rpx;
			flex: 1;
			height: 100%;
			background-color: #FFFFFF;

		}
	}

	.slide-bar-item {
		height: 200rpx;
		background-color: #eee;
		margin-bottom: 20rpx;
		border-radius: 12rpx;
		opacity: .75;
	}
</style>
