<script setup>
	import { onLoad, onShow } from "@dcloudio/uni-app";
	import { reactive, getCurrentInstance } from "vue";
	import Utils from '@/utils/index.js';
	import Validator from 'lg-validator';

	// -- constants
	const placeholderStyle = "color:#999999; font-size: 28rpx"
	// -- state
	const state = reactive({
		q: '',
		formData: {
			id: '',
			name: '',
			phone: '',
			isDefault: 0,
			area: null,
			doorplate: ''
		}
	})
	// -- life circles
	onLoad(() => {
		// -- 接收参数
		const { proxy } = getCurrentInstance();
		const eventChannel = proxy.getOpenerEventChannel();
		eventChannel.on("ADDRESS_INFO", data => {
			state.formData = {
				...data
			};
		});

	});
	// -- methods
	const check = () => {
		const { name, phone, area, doorplate } = state.formData;
		if (!name) {
			Utils.toast("请填写联系人姓名");
			return;
		}
		if (!Validator.username(name)) {
			Utils.toast('联系人只能输入2~6个中文字符')
			return;
		}
		if (!phone) {
			Utils.toast("请填写联系电话");
			return;
		}
		if (!Validator.tel(phone)) {
			Utils.toast("联系电话格式不正确");
			return;
		}
		if (!area) {
			Utils.toast("请选择区域");
			return;
		}

		if (!doorplate) {
			Utils.toast("请填写门牌号");
			return;
		}
		return true;
	}
	// -- events
	const onSwitchChange = ({ detail: { value } }) => {
		state.formData.isDefault = +value;
	}

	const onDelete = (addressId) => {
		uni.showModal({
			content: "您确定要删除该地址么？",
			showCancel: true,
			cancelText: '点错了',
			success: function(res) {
				if (res.confirm) {
					Utils.loading('处理中...');
					setTimeout(() => {
						uni.hideLoading();
						Utils.pop();
					}, 1000)
					// Api.address.remove(addressId).then(() => {
					// 	uni.hideLoading();
					// 	Utils.pop();
					// });
				}
			}
		});
	}
	const onSubmit = () => {
		if (check()) {
			Utils.loading('处理中...');
			setTimeout(() => {
				uni.hideLoading();
				Utils.pop();
			}, 1000);
			// Api.address.addOrUpdate(state.formData).then(() => {
			// 	uni.hideLoading();
			// 	Utils.pop();
			// });
		}
	}
	const onChooseLocation = () => {
		Utils.chooseLocation().then(res => {
			state.formData.area = res;
		})
	}
</script>

<template>
	<view class="page px-20 pt-20">
		<!-- 表单 -->
		<view class="bg-FFFFFF rounded-24 pl-30 ">
			<!-- 联系人 -->
			<view class="form-item flex-h-between border-bottom py-30">
				<view class="label text-justify  mr-60">联系人</view>
				<uni-easyinput class="flex-1" type="text" v-model="state.formData.name" :inputBorder="false" :placeholderStyle="placeholderStyle" placeholder="请填写人联系人姓名" />
			</view>
			<!-- 联系电话 -->
			<view class="form-item flex-h-between border-bottom py-30">
				<view class="label text-justify  mr-60">联系电话</view>
				<uni-easyinput class="flex-1" type="digit" v-model="state.formData.phone" :inputBorder="false" :placeholderStyle="placeholderStyle" placeholder="请填写人联系电话" maxlength="11" />
			</view>
			<!-- 所在地区 -->
			<view class="form-item flex-h-between border-bottom py-30 align-items-start">
				<view class="label text-justify  mr-60">所在地区</view>
				<view class="pr-40 color-202020 flex-1 flex-h-between" @click="onChooseLocation">
					<view v-if="state.formData.area" class="flex-1 flex-shrink">{{state.formData.area.name}}</view>
					<view v-else class="flex-1 flex-shrink color-999999 f28">请选择</view>
					<image class="icon-right ml-20" src="./images/icon_right.png" />
				</view>
			</view>
			<!-- 门牌号 -->
			<view class="form-item flex-h-between border-bottom py-30">
				<view class="label text-justify  mr-60">门牌号</view>
				<uni-easyinput class="flex-1" type="text" v-model="state.formData.doorplate" :inputBorder="false" :placeholderStyle="placeholderStyle" placeholder="详细地址，例1层101室" />
			</view>
			<!-- 设为默认 -->
			<view class="form-item flex-h-between border-bottom py-30">
				<view class="label text-justify  mr-60">设为默认</view>
				<view class="flex-1 flex-shrink flex-h-end pr-40">
					<switch :checked="!!state.formData.isDefault" color="#42b983" @change="onSwitchChange"></switch>
				</view>
			</view>
			<!-- 删除地址 -->
			<template v-if="state.formData.id">
				<view class="py-30 f28 lh-40" style="color:#FF2359;" @click="onDelete(state.formData.id)">删除地址</view>
			</template>
		</view>
		<!-- 提交按钮 -->
		<button class="submit-button color-FFFFFF f32 flex-h-center mt-80 rounded-48 bg-theme" @click="onSubmit">保存地址</button>
		<view class="space-200" />
	</view>
</template>

<style scoped lang="less">
	.page {
		:deep(.uni-easyinput__content) {
			input {
				padding: 0;
				margin: 0;
				font-size: 28rpx;
				color: #202020;
			}
		}

		.icon-right {
			width: 20rpx;
			height: 24rpx;
		}


		.label {
			width: 112rpx;
			font-size: 28rpx;
			color: #202020;
		}

		.submit-button {
			width: 600rpx;
			height: 88rpx;
		}
	}
</style>
