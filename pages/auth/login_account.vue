<script setup>
	import { reactive } from 'vue';
	import Utils from '../../utils';

	// -- constants 
	const placeholderStyle = "font-size: 30rpx; color: #ccc;"
	// -- state 
	const state = reactive({
		formData: {
			username: '',
			password: ''
		}
	})
	// -- events
	const onLogin = () => {
		if (!state.formData.username) {
			return Utils.toast("请输入手机号");
		}

		if (!state.formData.password) {
			return Utils.toast('请输入登录密码');
		}
	}
</script>

<template>
	<view class="page">
		<image class="absolute-top" src="./images/bg1.png" mode="widthFix"></image>
		<view
			class="wrap relative z-10 rounded-24 bg-secondary pt-70 px-48 mx-auto flex-v-center justify-start">
			<image class="icon-120x120" src="../../static/logo.png" mode="widthFix"></image>
			<view class="text-center mt-16 font-semibold">项目名称</view>
			<view class="form mt-100 w-100">
				<view class="form-item w-100 mb-24">
					<uni-easyinput v-model="state.formData.username" :inputBorder="false" placeholder="手机号" type="digit"
						:placeholderStyle="placeholderStyle" maxlength="11"></uni-easyinput>
				</view>
				<view class="form-item w-100">
					<uni-easyinput v-model="state.formData.password" :inputBorder="false" placeholder="登录密码"
						type="password" :placeholderStyle="placeholderStyle" maxlength="20"></uni-easyinput>
				</view>
				<view class="text-24 mt-12 text-999999">
					忘记密码？请联系管理员重置密码
				</view>
				<view class="w-100 leading-80 text-center bg-primary text-white rounded-12 mt-60" @click="onLogin">
					立即登录
				</view>
			</view>
		</view>
	</view>
</template>

<style lang="less">
	.page {
		padding-top: 200rpx;

		.wrap {
			width: 670rpx;
			height: 884rpx;

		}


		:deep(.uni-easyinput) {
			.uni-easyinput__content {
				height: 100rpx;
				font-family: 'Courier New', Courier, monospace;
				border-radius: 0;
				border-bottom: 2rpx solid #ccc;
				font-size: 30rpx;

				input {
					padding-left: 30rpx;
					font-size: 30rpx;
				}

				.uni-icons.uniui-clear {
					font-size: 44rpx !important;
				}
			}
		}

	}
</style>