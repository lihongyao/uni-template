<script setup>
	import Tools from 'lg-tools';
	const props = defineProps({
		data: Object
	})
	const emits = defineEmits(['pay', "receive", "cancel", "afterSale", "evaluate"])
</script>

<template>
	<view class="list-item px-30 pt-20 pb-30 bg-FFFFFF rounded-12 mt-20">
		<view class="flex-h-between f20 pb-20 border-bottom mb-20 ">
			<view class="" style="color: #686868;">
				<text>订单号&nbsp;</text>
				<text>UHAHV05271677647582944</text>
			</view>
			<!-- 状态 -->
			<view class="status unpay flex-h-center f20 rounded-16">待支付</view>
			<!-- <view v-if="data.orderState === 0" class="status unpay flex-h-center f20 rounded-16">待支付</view>
			<view v-if="data.orderState === 1" class="status unsure flex-h-center f20 rounded-16">待发货</view>
			<view v-if="data.orderState === 2" class="status unvisit flex-h-center f20 rounded-16">待收货</view>
			<view v-if="data.orderState === 3" class="status completed flex-h-center f20 rounded-16">已完成</view>
			<view v-if="data.orderState === 4" class="status cancel flex-h-center f20 rounded-16">已取消</view> -->
		</view>
		<view class="flex-h-end">
			<view class="order-button rounded-28 flex-h-center f26 color-202020 v" @click.stop="emits('cancel', '订单编号')">取消订单</view>
			<view class="order-button rounded-28 flex-h-center f26 color-202020 v ml-20" @click.stop="emits('evaluate', '订单编号')">立即评价</view>
			<view class="order-button rounded-28 flex-h-center f26 color-FFFFFF bg-theme ml-20" @click.stop="emits('pay', '订单编号')">立即支付</view>
			<view class="order-button rounded-28 flex-h-center f26 color-FFFFFF bg-theme ml-20" @click.stop="emits('afterSale', '订单编号')">申请售后</view>
			<view class="order-button rounded-28 flex-h-center f26 color-FFFFFF bg-theme ml-20" @click.stop="emits('receive', '订单编号')">确认收货</view>
		</view>
	</view>

</template>


<style lang="less" scoped>
	.status {
		width: 92rpx;
		height: 32rpx;

		&.unpay {
			background: #FFD4CE;
			color: #CE5B78;
		}

		&.unsure {
			background: #FCECC0;
			color: #FFAA00;
		}

		&.unvisit {
			background: #D9FFCE;
			color: #3EBB19;
		}

		&.completed,
		&.cancel {
			background: #F5F5F5;
			color: #999999;
		}

		&.processing {
			background: #F5F5F5;
			color: #1946BB;
		}
	}

	.order-button {
		width: 184rpx;
		height: 56rpx;
		margin-top: 20rpx;

		&.v {
			border: 2rpx solid #D0D0D0;
		}
	}
</style>
