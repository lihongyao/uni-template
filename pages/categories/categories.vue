<script setup>
	import Utils from '@/utils';
	import SearchBar from '@/components/@lgs/search-bar/search-bar.vue';
	import SlideBar from '@/components/@lgs/slide-bar/slide-bar.vue';

	const searchTexts = ["苹果", "香蕉"];
</script>


<template>
	<view class="page h-100">
		<!-- SearchBar Start -->
		<search-bar :contents="searchTexts" @tap="Utils.push('/pages/search/search')" />
		<!-- SearchBar End -->

		<!-- SlideBar Start -->
		<slide-bar />
		<!-- SlideBar End -->
	</view>
</template>


<style lang="less" scoped>
	.page {
		padding-top: 120rpx;
	}

	/** 注意：必须设置「.lg-slide-bar」的高度，否则上拉加载出现异常 */
	:deep(.lg-slide-bar) {
		height: 100%;
	}
</style>
