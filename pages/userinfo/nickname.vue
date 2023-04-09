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
	const onInput = (value) => {
		state.nickName = value;
		state.saveEnable = state.nickNameBack !== value && value !== '';
	}

	const onNickNameReview = ({ detail: { pass } }) => {
		if (!pass) {
			state.nickName = '';
			state.saveEnable = false;
		}
	}
	const onSubmit = () => {
		// 是否合法交由后端处理
		console.log('----', state.nickName);
		Bus.$emit("UPDATED_NICKNAME", state.nickName);
		Utils.pop();
	}
</script>

<template>
	<view class="page pt-24">
		<form @submit="onSubmit">
			<!-- 输入框：真机调试 -->
			<uni-easyinput type="nickname" placeholder="请填写您的昵称" :placeholderStyle="placeholderStyles" v-model="state.nickName" :inputBorder="false" @input="onInput" @nicknamereview="onNickNameReview" />
			<!-- 确认按钮 -->
			<button class="save-button" :class="{'enable': state.saveEnable}" form-type="submit">保存</button>
		</form>
	</view>
</template>


<style lang="less" scoped>
	:deep(.uni-easyinput) {
		.uni-easyinput__content {
			height: 100rpx;
			font-family: 'Courier New', Courier, monospace;

			input {
				padding-left: 30rpx;
				font-size: 30rpx;
			}

			.uni-icons.uniui-clear {
				font-size: 44rpx !important;
			}
		}
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