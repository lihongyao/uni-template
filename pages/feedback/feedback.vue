<script setup>
	import { reactive, ref } from 'vue';
	import { onLoad } from "@dcloudio/uni-app";
	import Utils from "@/utils";
	import service from "@/service";
	import vPopupDialog from '@/components/@lgs/popup-dialog/popup-dialog.vue';

	// -- constants
	const placeholderStyle = "font-size: 32rpx; color: #888888"
	// -- refs
	const popup = ref();
	const feedback = ref('');

	// -- events
	const onPopupSure = () => {
		Utils.pop();
	}
	const onSureButtonTap = () => {
		if (!feedback.value) {
			Utils.toast("请填写您的意见反馈~");
			return;
		}
		Utils.loading('处理中...');
		setTimeout(() => {
			uni.hideLoading();
			popup.value.open();
		}, 1000);
	}
</script>


<template>

	<view class="page pt-20 px-20">
		<view class="wrap bg-FFFFFF px-30 py-30 rounded-24">
			<uni-easyinput type="textarea" v-model="feedback" placeholder="请填写您的意见和反馈,便于更好的服务您~" :clearable="true" :auto-height="true" :placeholder-style="placeholderStyle" :input-border="false" />
		</view>
		<button class="sure-button flex-h-center f32 color-FFFFFF rounded-48 mx-auto mt-80 bg-theme" @click="onSureButtonTap">确认提交</button>
		<uni-popup ref="popup" type="center" :is-mask-click="false">
			<v-popup-dialog message="我们已收到您的反馈~" sureButtonText="知道了" :showCancelButton="false" @sure="onPopupSure" sureButtonBgColor="#42b983"></v-popup-dialog>
		</uni-popup>
	</view>
</template>

<style scoped lang="less">
	.wrap {
		:deep(.uni-easyinput__content) {
			textarea {
				padding: 0;
				margin: 0;
				// background: #F8F8F8;
				// border-radius: 20rpx;
				font-size: 32rpx;
				color: #202020;
			}
		}
	}

	.sure-button {
		width: 600rpx;
		height: 88rpx;
	}
</style>
