<script setup>
	import { onLoad, onShow } from "@dcloudio/uni-app";
	import { reactive, watch } from 'vue';
	import service from '@/service';
	import Utils from '@/utils';
	import vLoading from '@/components/@lgs/loading/loading.vue';
	import vNoData from '@/components/@lgs/no-data/no-data.vue';
	import vMenuBar from '@/components/@lgs/menu-bar/menu-bar.vue';
	import vListItem from './list-item.vue';

	// -- constants
	const menus = [
		{ label: '全部', value: -1 },
		{ label: '待支付', value: 0 },
		{ label: '待发货', value: 1 },
		{ label: '待收货', value: 2 },
		{ label: '已完成', value: 3 },
		{ label: '已取消', value: 4 },
	];
	// -- state
	const state = reactive({
		key: undefined,
		list: null,
		hasMore: false,
		page: 1,
		isFirstIn: true,
	});
	// -- life circles
	onLoad(({ q = -1 }) => {
		state.key = +q;
	})
	onShow(() => {
		if (!state.isFirstIn) {
			reloadList();
		}
		state.isFirstIn = false;
	});
	//  -- watchs
	watch(() => state.key, (newValue, oldValue) => {
		reloadList();
	})
	// -- methods
	const reloadList = () => {
		state.list = null;
		state.page = 1;
		getOrders();
	}
	const getOrders = () => {
		const orderState = state.key === -1 ? undefined : state.key;
		setTimeout(() => {
			state.list = [{}, {}, {}];
			state.hasMore = false;
		}, 1000)
		// Api.order.listByUser({ orderState, pageIndex: state.page, pageSize: 20 }).then(r => {
		// 	if (state.list === null) {
		// 		state.list = r.data;
		// 	} else {
		// 		state.list = state.list.concat(r.data);
		// 	}
		// 	state.hasMore = state.page < r.pageInfo.pages;
		// })
	}
	// -- events
	const onLoadMore = () => {
		if (state.hasMore) {
			state.page++;
			getOrders();
		}
	}
	const onCancel = (id) => {
		uni.showModal({
			title: '温馨提示',
			content: "您确定要取消订单么？",
			showCancel: true,
			cancelText: '点错了',
			success: async function(res) {
				if (res.confirm) {
					Utils.loading('处理中...');
					const r = await Api.order.cancel(id);
					console.log(r);
					if (r) {
						// --- 重载数据
						reloadList();
					}
				}
			}
		})
	}
	const onPay = ({ payCost, id }) => {
		Utils.loading('处理中...');
		Api.order.getPayParams({
			id,
			type: 1,
			money: payCost
		}).then(r => {
			uni.requestPayment({
				provider: 'wxpay',
				timeStamp: r.data.timeStamp,
				nonceStr: r.data.nonceStr,
				package: r.data.package,
				signType: 'MD5',
				paySign: r.data.paySign,
				success: function(res) {
					console.log('success:' + JSON.stringify(res));
					Utils.push('/pages/orders/pay-res');
				},
				fail: function(err) {
					Utils.toast('支付失败~')
					console.log('fail:' + JSON.stringify(err));
				}
			});
		})
	}
</script>


<template>

	<view class="page">
		<!-- 过滤 -->
		<v-menu-bar :data="menus" v-model="state.key" :showBorder="false" themeColor="#42b983"></v-menu-bar>
		<view class="list-wrap px-20">
			<scroll-view class="list" :scroll-y="true" :lower-threshold="20" @scrolltolower="onLoadMore">
				<template v-if="state.list">
					<template v-if="state.list.length > 0">
						<block v-for="(item, index) in state.list" :key="index">
							<v-list-item :data="item" />
						</block>
						<view class="f28 text-center color-999999 py-40">{{state.hasMore ? '数据加载中...' : '没有更多啦~'}}</view>
						<view class="space-100"></view>
					</template>
					<v-no-data v-else tips="暂无数据~"></v-no-data>
				</template>
				<v-loading v-else logo="https://qn.d-dou.com/dcep/dbean/ea6b99dd3aff434f88461cab092a80fezk35n0.png"></v-loading>
			</scroll-view>
		</view>
	</view>
</template>

<style scoped lang="less">
	.page {
		height: 100%;

		.list-wrap {
			height: calc(100% - 80rpx);

			.list {
				height: 100%;
			}
		}
	}
</style>
