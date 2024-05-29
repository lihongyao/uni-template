<script setup>
	// -- imports 
	import { reactive } from "vue";
	import { onLoad } from '@dcloudio/uni-app';
	import Utils from "@/utils";
	import Bus from "@likg/bus";
	import { apiUser } from "@/api/apiServer";


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
	onLoad(({ nickName }) => {
		console.log(nickName);
		state.nickName = nickName;
		state.nickNameBack = nickName;
	});

	// -- events 
	const onInput = ({ detail: { value } }) => {
		state.nickName = value;
		state.saveEnable = state.nickNameBack !== value && value !== '';
	}

	const onNickNameReview = ({ detail: { pass } }) => {
		if (!pass) {
			console.log('__昵称拦截__');
			state.nickName = '';
			state.saveEnable = false;

		} else {
			console.log('__昵称通过__');
			Bus.$emit("UPDATED_NICKNAME", state.nickName); // -- 临时代码
			Utils.pop(); // -- 临时代码
			return;
			// -- 更新用户昵称
			Utils.loading("处理中...");
			apiUser.edit({ nickName: state.nickName }).then(() => {
				Utils.hideLoading();
				Bus.$emit("UPDATED_NICKNAME", state.nickName);
				Utils.pop();
			}).catch(() => {
				Utils.hideLoading();
			})
		}
	}
</script>

<template>
	<view class="page pt-24">
		<form>
			<!-- 输入框：真机调试 -->
			<input type="nickname" :value="state.nickName" placeholder="请填写您的昵称" :placeholderStyle="placeholderStyles"
				@input="onInput" @nicknamereview="onNickNameReview" maxlength="30" />
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