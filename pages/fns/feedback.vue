<script setup>
	import { reactive, ref } from 'vue';
	import { onLoad } from "@dcloudio/uni-app";
	import Utils from "@/utils";
	import service from "@/service";
	import Dialog from '@/components/@lgs/Dialog/Dialog.vue';

	// -- constants
	const placeholderStyle = "font-size: 32rpx; color: #888888"
	// -- refs
	const dialog = ref();
	const feedback = ref('');

	// -- events
	const onSureButtonTap = () => {
		if (!feedback.value) {
			Utils.toast("请填写您的意见反馈~");
			return;
		}
		Utils.loading('处理中...');
		setTimeout(() => {
			Utils.hideLoading();
			dialog.value.open({
				content: "我们已收到您的反馈~",
				confirmText: "知道了",
				confirmBgColor: "#42b983",
				showCancel: false,
				onConfirm: () => {
					Utils.pop();
				}
			})
		}, 1000);
	}
</script>


<template>

	<view class="page pt-20 px-20">
		<view class="wrap bg-FFFFFF px-30 py-30 rounded-24">
			<uni-easyinput type="textarea" v-model="feedback" placeholder="请填写您的意见和反馈,便于更好的服务您~" :clearable="true" :auto-height="true" :placeholder-style="placeholderStyle" :input-border="false" />
		</view>
		<button class="action-button mt-80" @click="onSureButtonTap">确认提交</button>
		<Dialog ref="dialog" />
	</view>
</template>

<style scoped lang="less">
	.wrap {
		:deep(.uni-easyinput__content) {
			textarea {
				padding: 0;
				margin: 0;
				font-size: 32rpx;
				color: #202020;
			}
		}
	}
</style>
