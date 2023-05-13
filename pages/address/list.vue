<script setup>
	import { reactive, onMounted, getCurrentInstance } from 'vue';
	import { onLoad, onShow } from "@dcloudio/uni-app";
	import Loadings from '@/components/@lgs/Loadings/Loadings.vue';
	import NoData from '@/components/@lgs/NoData/NoData.vue';
	import Tools from 'lg-tools';
	import Utils from '@/utils';
	// -- state
	const state = reactive({
		eventChannel: null,
		list: null,
		q: ''
	});

	// -- life circles
	onLoad(({ q }) => {
		// -- 接收参数
		state.q = q;
		// -- 获取eventChannel
		const { proxy } = getCurrentInstance();
		state.eventChannel = proxy.getOpenerEventChannel();
	});

	onShow(() => {
		getList();
	});

	// -- methods
	const getList = () => {

		state.list = [{
			id: "1",
			name: "李鸿耀",
			phone: "17398888669",
			area: {
				address: "四川省成都市双流区雅和南四路",
				name: "龙湖九里晴川-东门",
				latitude: "30.507535",
				longitude: "104.078405",
			},
			doorplate: "1-1-2904",
			isDefault: 1
		}, {
			id: "2",
			name: "张三",
			phone: "19938060716",
			area: {
				address: "四川省自贡市荣县荣州大道三段418号",
				name: "远达荣州上城A区",
				latitude: "29.454973",
				longitude: "104.403791",
			},
			doorplate: "14-1-2904",
			isDefault: 0
		}]
	}
	// -- events
	const onEdit = (item) => {
		uni.navigateTo({
			url: '/pages/address/action',
			success({ eventChannel }) {
				// -- 将选中的地址信息传递到地址编辑页
				eventChannel.emit("ADDRESS_INFO", { ...item, area: { ...item.area } });
			}
		});
	}
	const onAddressItemTap = (item) => {
		/************************************************
		// -- 确认订单页面选择地址时通过如下方法跳转
		// -- 用户选择地址后即可回传选择的地址信息
		uni.navigateTo({
			url: "/pages/address/list?q=choose-address",
			events: {
				"CHOOSED_ADDRESS": (data) => {
					console.log(data);
				}
			}
		});
		*************************************************/
		if (!state.q) return;
		state.eventChannel.emit('CHOOSED_ADDRESS', { ...item, area: { ...item.area } });
		Utils.pop();
	}
</script>

<template>
	<view class="page px-20">
		<!-- 描述 -->
		<view class="pt-28 f28 color-999999 lh-40 mb-28">已添加地址</view>
		<!-- 列表 -->
		<view class="list">
			<template v-if="state.list">
				<template v-if="state.list.length > 0">
					<block v-for="(item, index) in state.list" :key="index">
						<view class="list-item bg-secondary flex-h-center px-30 mb-20" @click="onAddressItemTap(item)">
							<view class="flex-1 flex-shrink">
								<view class="flex-h-start mb-20">
									<text class="f32 color-secondary lh-44 f-600">{{item.name}}</text>
									<text class="f24 color-999999 lh-34 ml-20">{{Tools.phoneFormatter(item.phone, "$1 $2 $3")}}</text>
								</view>
								<view class="address f26 color-secondary lh-36" :class="{'default': !!item.isDefault}">
									{{`${item.area.address}-${item.area.name}·${item.doorplate}`}}
								</view>
							</view>
							<view class="line ml-28"></view>
							<button class="f24 color-999999" @click.stop="onEdit(item)">编辑</button>
						</view>
					</block>
				</template>
				<NoData v-else tips="您当前还没有添加地址哟~" />
			</template>
			<Loadings v-else />
		</view>
		<!-- 添加地址按钮 -->
		<template v-if="state.list !== null">
			<button class="action-button mt-80" @click="Utils.push('/pages/address/action')">添加地址</button>
		</template>
	</view>
</template>

<style scoped lang="less">
	.list-item {
		width: 100%;
		height: 194rpx;

		.line {
			width: 2rpx;
			height: 80rpx;
			border: 2rpx solid #F5F5F5;
		}

		.default::before {
			content: '默认地址';
			width: 100rpx;
			height: 32rpx;
			font-size: 20rpx;
			line-height: 35rpx;
			color: #CE5B78;
			background-color: #FFD4CE;
			margin-right: 20rpx;
			padding: 0 10rpx;
			border-radius: 4rpx;
		}
	}
</style>
