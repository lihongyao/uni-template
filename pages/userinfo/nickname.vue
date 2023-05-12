<script setup>
	// -- imports 
	import { reactive } from "vue";
	import { onLoad } from '@dcloudio/uni-app';
	import Utils from "@/utils";
	import Bus from "lg-bus";


	// -- constants
	const placeholderStyles = "font-size: 30rpx; color: #999999";
	// -- state 
	const state = reactive({
		/** 收集用户输入的昵称 */
		nickName: '',
		/** 用户原始昵称 */
		nickNameBack: '',
		/** 是否激活保存按钮 */
		saveEnable: false,
	});

	// -- life circles 
	onLoad(({ nickName = 'LiKG' }) => {
		state.nickName = nickName;
		state.nickNameBack = nickName;
	});

	// -- events 
	const onInput = ({ detail: { value } }) => {
		state.nickName = value;
		state.saveEnable = state.nickNameBack !== value && value !== '';
	}

	const onNickNameReview = ({ detail: { pass } }) => {
		console.log(state.nickName);
		if (!pass) {
			state.nickName = '';
			state.saveEnable = false;
			console.log('__昵称拦截__');
		} else {
			console.log('__昵称通过__');
			Utils.loading("处理中...");
			setTimeout(() => {
				Utils.hideLoading();
				Bus.$emit("UPDATED_NICKNAME", state.nickName);
				Utils.pop();
			}, 1000);
		}
	}
</script>

<template>
	<view class="page pt-24">
		<form>
			<!-- 输入框：真机调试 -->
			<input type="nickname" :value="state.nickName" placeholder="请填写您的昵称" :placeholderStyle="placeholderStyles" @input="onInput" @nicknamereview="onNickNameReview" />
			<!-- 确认按钮 -->
			<button class="save-button" :class="{'enable': state.saveEnable}">保存</button>
		</form>
	</view>
</template>


<style lang="less" scoped>
	input {
		height: 100rpx;
		padding-left: 30rpx;
		background: #FFF;
		font-family: 'Courier New', Courier, monospace;
		font-size: 30rpx;
	}

	.save-button {
		width: 400rpx;
		height: 90rpx;
		border-radius: 16rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 50rpx auto 0;

		background: #E1E1E1;
		color: #BCBCBC;

		&.enable {
			color: #FFFFFF;
			background: #42b983;
		}
	}
</style>