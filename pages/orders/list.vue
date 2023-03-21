<script setup>
	import { onLoad, onShow } from "@dcloudio/uni-app";
	import { reactive, watch } from 'vue';
	import service from '@/service';
	import Utils from '@/utils';
	import vLoading from '@/components/@lgs/Loadings/Loadings.vue';
	import vNoData from '@/components/@lgs/NoData/NoData.vue';
	import vMenuBar from '@/components/@lgs/MenuBar/MenuBar.vue';
	import vScrollList from '@/components/@lgs/ScrollList/ScrollList.vue';
	import vLoadMore from '@/components/@lgs/LoadMore/LoadMore.vue';
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
		current: 1,
		hasMore: false,
		isLoading: false,
		isRefresh: false,
	});
	// -- life circles
	onLoad(({ q = -1 }) => {
		state.key = +q;
	})

	//  -- watchs
	watch(() => state.key, (newValue, oldValue) => {
		state.list = null;
		onRefresh();
	})
	// -- methods
	const getOrders = (next) => {
		state.isLoading = true;
		const orderState = state.key === -1 ? undefined : state.key;
		// -- 模拟请求
		setTimeout(() => {
			next && next();
			const data = [{ status: 0 }, { status: 1 }, { status: 2 }, { status: 3 }, { status: 4 }, { status: 0 }, { status: 3 }];
			if (state.isRefresh) {
				state.list = data;
			} else {
				state.list = state.list.concat(data);
			}
			state.isLoading = false;
			state.hasMore = state.current < 3;
		}, 500);

	}
	// -- events
	const onRefresh = (next) => {
		console.log("__下拉刷新__");
		state.current = 1;
		state.isRefresh = true;
		getOrders(next);
	}
	const onLoadMore = () => {
		if (state.hasMore && !state.isLoading) {
			console.log("__上拉加载__");
			state.current++;
			state.isRefresh = false;
			getOrders();
		}
	}
	const onCancel = (orderNo) => {
		console.log("取消订单：", orderNo);

	}
	const onReceive = (orderNo) => {
		console.log("确认收货：", orderNo);

	}
	const onAfterSale = (orderNo) => {
		console.log("申请收货：", orderNo);

	}
	const onEvaluate = (orderNo) => {
		console.log("立即评价：", orderNo);
	}
	const onPay = ({ payCost, id }) => {
		Utils.loading('处理中...');
		setTimeout(() => {
			uni.hideLoading();
			Utils.push('/pages/orders/pay-res');
		}, 1000);
		/*service.order.getPayParams({
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
		})*/
	}
</script>


<template>

	<view class="page">
		<!-- MenuBar Start -->
		<v-menu-bar :data="menus" v-model="state.key" :showBorder="false" themeColor="#42b983" />
		<!-- MenuBar End -->

		<!-- List Start -->
		<v-scroll-list @refresh="onRefresh" @load="onLoadMore">
			<template v-if="state.list">
				<template v-if="state.list.length > 0">
					<view class="px-20">
						<block v-for="(item, index) in state.list" :key="index">
							<v-list-item :data="item" @pay="onPay" @receive="onReceive" @cancel="onCancel" @afterSale="onAfterSale" @evaluate="onEvaluate" />
						</block>
					</view>
					<v-load-more v-show="state.list" :hasMore="state.hasMore" />
					<view class="space-100"></view>
				</template>
				<v-no-data v-else tips="暂无数据~"></v-no-data>
			</template>
			<v-loading v-else />
		</v-scroll-list>
		<!-- List End -->
	</view>
</template>

<style scoped lang="less">
	:deep(.lg-scroll-list) {
		height: calc(100vh - 80rpx);
	}
</style>
