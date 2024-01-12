<script setup>
	import { onLoad } from '@dcloudio/uni-app';
	import { reactive } from "vue";
	import Utils from "@/utils";
	import SearchBar from '@/components/@lgs/SearchBar/SearchBar.vue';
	import LoadMore from '@/components/@lgs/LoadMore/LoadMore.vue';
	import defaultBanners from "@/static/images/default_banners.png";
	// -- constants
	const searchTexts = ["苹果", "香蕉"];
	const dotsStyles = { selectedBackgroundColor: '#FFFFFF', backgroundColor: 'rgba(255,255,255,.72)', bottom: '10', width: '6' };

	// -- state
	const state = reactive({
		swiperCurrentIndex: 0,
		banners: [
			{ bannerPic: defaultBanners },
			{ bannerPic: defaultBanners },
			{ bannerPic: defaultBanners },
		]
	})
	// -- life circles
	onLoad(() => {

	});
	// -- events
	const onSwiperChange = ({ detail }) => {
		state.swiperCurrentIndex = detail.current;
	}
	const onSwiperItemTap = ({ jumpUrl }) => {
		console.log(jumpUrl);
	}
</script>


<template>
	<view class="page">

		<!-- Search-bar Start -->
		<SearchBar :contents="searchTexts" @tap="Utils.push('/pages/search/search')" />
		<!-- Search-bar End -->

		<!-- Swiper Start -->
		<view class="swipers">
			<template v-if="state.banners && state.banners.length > 0">
				<uni-swiper-dot :info="state.banners" :current="state.swiperCurrentIndex" mode="default" :dotsStyles="dotsStyles">
					<swiper class="swiper-box" :autoplay="true" :interval="4000" :duration="1000" :circular="true" @change="onSwiperChange">
						<block v-for="(item, index) in state.banners" :key="index">
							<swiper-item>
								<view class="swiper-item" @click="onSwiperItemTap(item)">
									<image :src="item.bannerPic" class="rounded-32"></image>
								</view>
							</swiper-item>
						</block>
					</swiper>
				</uni-swiper-dot>
			</template>
			<image class="skeleton-banners d-block mx-auto rounded-32" v-else :src="defaultBanner"></image>
		</view>
		<!-- Swiper End -->

		<!-- HotSale Start -->
		<view class="hot-sale mt-80">
			<view class="title-bar">
				<div class="line" />
				<div class="title">热销商品</div>
				<div class="line" />
			</view>
			<view class="goods-list mt-40 px-30">
				<block v-for="item in 10" :key="item">
					<view class="goods-item"></view>
				</block>
			</view>
		</view>
		<!-- HotSale End -->
		<LoadMore :hasMore="false" />
	</view>
</template>

<style lang="less" scoped>
	.page {
		padding-top: 120rpx;
	}

	.search-bar-wrap {
		width: 750rpx;
		height: 90rpx;
		display: flex;
		align-items: center;
		position: fixed;
		z-index: 1;
	}

	.swipers {
		.swiper-box {
			width: 750rpx;
			height: 280rpx;

			.swiper-item {
				display: flex;
				justify-content: center;
			}

			image {
				width: 670rpx;
				height: 280rpx;
				border-radius: 12px;
			}
		}

		.skeleton-banners {
			width: 670rpx;
			height: 280rpx;
			border-radius: 12px;
		}
	}

	.hot-sale {
		.title-bar {
			display: flex;
			justify-content: center;
			align-items: center;

			.title {
				font-size: 32rpx;
				line-height: 44rpx;
				color: #666666;
				margin: 0 30rpx;
			}

			.line {
				width: 107rpx;
				height: 2rpx;
				background-color: #888888;
				position: relative;
			}
		}
	}

	.goods-item {
		height: 200rpx;
		background-color: #eee;
		margin-bottom: 20rpx;
		border-radius: 12rpx;
		opacity: .75;
	}
</style>
