<script setup>
	import Utils from '@/utils';
	// -- constants 
	const list = [
		{ label: "关于我们", path: "/pages/fns/about-us" },
		{ label: "用户协议", path: "/pages/web-page/web-page?q=1" },
		{ label: "隐私政策", path: "/pages/web-page/web-page?q=2" },
	]
	// -- events 
	const onFnItemTap = ({ path }) => {
		Utils.push(path);
	}
</script>


<template>
	<view class="page pt-24">
		<block v-for="(item, index) in list" :key="index">
			<view class="item flex-h-between py-34 px-30 bg-FFFFFF" style="margin-bottom: 1rpx;" @click="onFnItemTap(item)">
				<view class="flex-1 f28 color-333333 f-400 lh-40">{{item.label}}</view>
				<image class="icon-40x40 flex-shrink" src="@/static/images/icon_right.png"></image>
			</view>
		</block>
	</view>
</template>


<style lang="less" scoped></style>
