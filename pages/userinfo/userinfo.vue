<script setup>
	import { reactive, ref } from "vue";
	import { onLoad, onUnload } from '@dcloudio/uni-app';
	import { APP_OSS_HOST } from "@/constants";
	import Utils from '@/utils';
	import Tools from '@likg/tools';
	import Bus from '@likg/bus';
	import { apiUser, apiCommon } from "@/api/apiServer/index.js";

	// -- constants 
	const defaultAvatarUrl =
		'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';

	// -- state 
	const state = reactive({
		/** OSS配置相关 */
		ossConfigs: null,
		/** 用户信息 */
		user: {
			avatar: defaultAvatarUrl,
			nickName: '',
			mobile: ""
		}
	})
	// -- life circles 
	onLoad(() => {

		// 1. 获取用户信息
		// apiUser.info().then(resp => {
		// 	state.user = resp.data;
		// });


		// 2. 获取阿里云OSS配置
		// apiCommon.getOSSConfigs().then(resp => {
		// 	state.ossConfigs = resp.data.credentials;
		// });


		// 3. 监听用户昵称/手机号更新
		Bus.$on("UPDATED_NICKNAME", (nickName) => {
			state.user.nickName = nickName;
			Bus.$emit("REFRESH_USERINFO");
		});
		Bus.$on("UPDATED_MOBILE", (mobile) => {
			state.user.mobile = mobile;
			Bus.$emit("REFRESH_USERINFO");
		});
	});

	onUnload(() => {
		Bus.$off("UPDATED_NICKNAME");
		Bus.$off("UPDATED_MOBILE");
	})

	// -- events 
	const onChooseAvatar = ($event) => {
		// -- 获取头像临时路径
		const tempFilePath = $event.detail.avatarUrl;
		state.user = { ...state.user, avatar: tempFilePath }; // 临时代码
		return;

		// -- 构造上传路径
		const suffix = tempFilePath.substring(tempFilePath.lastIndexOf("."));
		const date = new Date();
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');
		const key = `avatars/${year}${month}${day}/${date.getTime()}${suffix}`;
		// -- 上传头像
		Utils.uploadFile({
			uri: APP_OSS_HOST,
			key,
			filePath: tempFilePath,
			ossConfigs: state.ossConfigs,
			success: async (url) => {
				// -- 更新用户头像
				const resp = await apiUser.edit({ avatar: url });
				if (resp && resp.code === 200) {
					Utils.toast("上传成功");
					Bus.$emit("REFRESH_USERINFO");
					state.user = { ...state.user, avatar: url };
				}
			},
			fail: () => {
				Utils.toast("上传失败，请重试！");
			}
		})
	}
</script>

<template>
	<view class="page pt-24">
		<!-- 头像 -->
		<view class="row bg-primary">
			<view class="label">头像</view>
			<button class="value chooseAvatar" hover-class="none" open-type="chooseAvatar"
				@chooseavatar="onChooseAvatar">
				<image class="icon-112x112 bg-secondary rounded-14" :src="state.user.avatar"></image>
				<image class="icon-40x40" src="@/static/images/icon_right.png"></image>
			</button>
		</view>
		<!-- 名字 -->
		<view class="row bg-primary"
			@click="Utils.push(`/pages/userinfo/nickname?nickName=${state.user.nickName || ''}`)">
			<view class="label">名字</view>
			<view class="value">
				<text>{{state.user.nickName || "————"}}</text>
				<image class="icon-40x40" src="@/static/images/icon_right.png"></image>
			</view>
		</view>
		<!-- 手机号 -->
		<view class="row bg-primary" @click="Utils.push(`/pages/userinfo/mobile?mobile=${state.user.mobile}`)">
			<view class="label">手机号</view>
			<view class="value">
				<text>{{state.user.mobile || '——————'}} </text>
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