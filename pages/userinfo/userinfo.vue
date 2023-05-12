<script setup>
	import Utils from '@/utils';
	import Tools from 'lg-tools';
	import { reactive, ref } from "vue";
	import { onLoad } from '@dcloudio/uni-app';
	import Bus from 'lg-bus';
	// -- constants 
	const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
	// -- refs
	const popupNickName = ref();
	// -- state 
	const state = reactive({
		disabled: true,
		user: {
			avatarUrl: defaultAvatarUrl,
			nickName: 'LiHONGYAO__',
			mobile: "17398888669"
		}
	})
	// -- life circles 
	onLoad(() => {
		Bus.$on("UPDATED_NICKNAME", (nickName) => {
			state.user.nickName = nickName;
		});
		Bus.$on("UPDATED_MOBILE", (mobile) => {
			state.user.mobile = mobile;
		});
	});

	// -- events 
	// 1. 修改头像
	const onChooseAvatar = ($event) => {
		const avatarUrl = $event.detail.avatarUrl;
		state.user.avatarUrl = avatarUrl;
		console.log(`avatarUrl：${avatarUrl}`);
	}
</script>

<template>
	<view class="page pt-24">
		<!-- 头像 -->
		<view class="row">
			<view class="label">头像</view>
			<button class="value chooseAvatar" hover-class="none" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
				<image class="icon-112x112 bg-B8BDC8 rounded-14" :src="state.user.avatarUrl"></image>
				<image class="icon-40x40" src="@/static/images/icon_right.png"></image>
			</button>
		</view>
		<!-- 名字 -->
		<view class="row">
			<view class="label">名字</view>
			<view class="value" @click="Utils.push(`/pages/userinfo/nickname?nickName=${state.user.nickName}`)">
				<text>{{state.user.nickName}}</text>
				<image class="icon-40x40" src="@/static/images/icon_right.png"></image>
			</view>
		</view>
		<!-- 手机号 -->
		<view class="row">
			<view class="label">手机号</view>
			<view class="value" @click="Utils.push(`/pages/userinfo/mobile?mobile=${state.user.mobile}`)">
				<text>{{state.user.mobile}}</text>
				<image class="icon-40x40" src="@/static/images/icon_right.png"></image>
			</view>
		</view>
	</view>
</template>


<style lang="less" scoped>
	.row {
		min-height: 120rpx;
		margin-bottom: 1rpx;
		background: #FFFFFF;
		padding: 0 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 30rpx;

		.label {
			color: #333333;
		}

		.value {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			color: #888888;
			text-align: right;
		}

		.chooseAvatar {
			height: 150rpx;
			padding: 0;
		}
	}
</style>