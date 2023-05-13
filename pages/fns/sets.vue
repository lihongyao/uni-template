<script setup>
	import Utils from '@/utils';
	import { reactive } from "vue";
	// -- constants 
	const list = [
		{ label: "关于我们", path: "/pages/fns/about-us" },
		{ label: "用户协议", path: "/pages/web-page/web-page?q=1" },
		{ label: "隐私政策", path: "/pages/web-page/web-page?q=2" },
	];
	// -- events 
	const onFnItemTap = ({ path }) => {
		if (path) {
			Utils.push(path);
		}
	}
</script>


<template>
	<view class="page pt-24">
		<block v-for="(item, index) in list" :key="index">
			<view class="item flex-h-between  px-30 bg-secondary" @click="onFnItemTap(item)">
				<view class="f28 color-333333 f-400 lh-40">{{item.label}}</view>
				<view class="flex-1 flex-h-end">
					<image class="icon-40x40" src="@/static/images/icon_right.png"></image>
				</view>
			</view>
		</block>
	</view>
</template>


<style lang="less" scoped>
	.item {
		height: 100rpx;
		margin-bottom: 1rpx;
	}
</style>