<script setup>
	import { onLoad } from '@dcloudio/uni-app';
	import Utils from '@/utils';
	import SearchBar from '@/components/@lgs/SearchBar/SearchBar.vue';
	import SideBar from '@/components/@lgs/SideBar/SideBar.vue';
	import Loading from '@/components/@lgs/Loadings/Loadings.vue';
	import NoData from '@/components/@lgs/NoData/NoData.vue';
	import LoadMore from '@/components/@lgs/LoadMore/LoadMore.vue';
	import { reactive } from "vue";
	// -- constants 
	const searchTexts = ["苹果", "香蕉"];


	// -- state 
	const state = reactive({
		list: null,
		page: 1,
		hasMore: false,
		value: '',
		categories: [
			{ "name": "浆果类", "id": "63fd88d211eff45d5b846a8d" },
			{ "name": "瓜果类", "id": "63fd88d811eff45d5b846a90" },
			{ "name": "柑橘属", "id": "63fd88dd11eff45d5b846a93" },
			{ "name": "坚果类", "id": "63fd88e311eff45d5b846a96" },
			{ "name": "核果类", "id": "63fd88e811eff45d5b846a99" }
		]
	});

	// -- methods
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
				data: new Array(20).fill({}),
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
	const onRefresh = ({ value }) => {
		console.log("__刷新__");
		state.list = null;
		state.page = 1;
		state.value = value;
		query();
	}
	const onLoadMore = () => {
		if (state.hasMore) {
			console.log("__加载__");
			state.page++;
			query();
		}

	}
</script>


<template>
	<view class="page h-100">
		<!-- SearchBar Start -->
		<SearchBar :contents="searchTexts" @tap="Utils.push('/pages/search/search')" />
		<!-- SearchBar End -->
		<!-- SlideBar Start -->
		<side-bar class="side-wrap" :categories="state.categories" @refresh="onRefresh" @load="onLoadMore">
			<view class="pt-20">
				<template v-if="state.list">
					<template v-if="state.list.length > 0">
						<block v-for="(item, index) in state.list" :key="index">
							<view class="px-30">
								<view class="side-bar-item"></view>
							</view>
						</block>
						<LoadMore :hasMore="state.hasMore" />
					</template>
					<NoData v-else tips="当前分类为空~" :top="200" />
				</template>
				<Loading v-else :top="200" />
			</view>
		</side-bar>
		<!-- SlideBar End -->
	</view>
</template>


<style lang="less" scoped>
	.page {
		padding-top: 120rpx;
		display: flex;
		flex-direction: column;
	}

	.side-wrap {
		flex: 1;
		/** 此属性必须设置 */
		position: relative;
	}

	.side-bar-item {
		height: 200rpx;
		background-color: #eee;
		margin-bottom: 20rpx;
		border-radius: 12rpx;
		opacity: .75;
	}
</style>