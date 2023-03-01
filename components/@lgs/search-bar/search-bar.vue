<script setup>
	// -- props 
	const props = defineProps({
		height: { type: Number, default: 120 },
		interval: { type: Number, default: 4000 },
		contents: { type: Array, required: true },
	});

	// -- emits
	const emits = defineEmits(["tap"]);
</script>


<template>
	<view class="lg-search-bar" :style="`height: ${height}rpx`" @click="emits('tap')">
		<view class="lg-notice-bar">
			<image class="lg-notice-bar__icon" src="./images/icon_search.png"></image>
			<view class="lg-notice-bar__contents">
				<swiper class="lg-notice-bar__swiper" vertical circular autoplay :interval="props.interval">
					<block v-for="(content, index) in props.contents" :key="index">
						<swiper-item>
							<view class="swiper-item uni-bg-red">大家都在搜：{{content}}</view>
						</swiper-item>
					</block>
				</swiper>
			</view>
		</view>
	</view>
</template>


<style lang="less" scoped>
	.lg-search-bar {
		width: 750rpx;
		padding: 0 30rpx;
		background-color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.lg-notice-bar {
		width: 100%;
		height: 80rpx;
		background: #F7F7F7;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 0 24rpx;
		border-radius: 36rpx;

		&__icon {
			width: 36rpx;
			height: 36rpx;
			margin-right: 20rpx;
		}

		&__contents {
			flex: 1;
			height: inherit;
		}

		&__swiper {
			height: inherit;

			.swiper-item {
				display: flex;
				align-items: center;
				height: inherit;
				font-size: 28rpx;
				color: #BFBFBF;
			}
		}
	}
</style>
