<script setup>
	// -- imports 
	import { onLoad } from '@dcloudio/uni-app';
	import { getCurrentInstance, reactive } from "vue";
	import CircleProgress from '@/components/@lgs/CircleProgress/CircleProgress.vue';
	import Utils from '@/utils';
	import { APP_UPLOAD_IMAGE_URI } from '@/constants';
	// -- state 
	const state = reactive({
		q: '',
		percent: 0,
		file: null
	});
	// -- life circles 
	onLoad(({ q }) => {
		state.q = q;
		const { proxy } = getCurrentInstance();
		const eventChannel = proxy.getOpenerEventChannel();
		eventChannel.on("acceptTempFilePaths", ({ tempFilePaths }) => {
			upload(tempFilePaths[0])
		})
	})
	// -- methods 
	const upload = (file) => {
		/*Utils.uploadFileOnServer({
			uri: APP_UPLOAD_IMAGE_URI,
			filePath: file.path || file.tempFilePath,
			formData: { category: 'test' },
			success(uri) {
				console.log(uri)
			},
			fail(error) {
				Utils.toast(error.message);
			},
			onProgressUpdate(progress) {
				state.percent = progress;
			}
		});*/
		const t = setInterval(() => {
			state.percent += 1;
			if (state.percent >= 100) {
				state.percent = 100;
				clearInterval(t)
			}
		}, 30);
		console.log(file);
	}
	// -- events
	const onLaunchAppError = (error) => {
		Utils.toast("返回失败，请选择「留在小程序」！");
		console.log(error);
	}
	const onLaunchAppSuccess = () => {
		console.log('__onLaunchAppSuccess__');
	}
	const onJumpToHome = () => {
		Utils.reLaunch('/pages/TabPages/index')
	}
</script>



<template>
	<view class="page ">
		<!-- 进度条 -->
		<view class="flex-h-center">
			<circle-progress :percent="state.percent"></circle-progress>
		</view>
		<!-- 进度提示 -->
		<view class="text-28 leading-32 text-222222 mt-40 text-center">
			{{state.percent === 100 ? "本地简历上传成功" : "本地简历上传中"}}
		</view>
		<!-- 操作按钮 -->
		<template v-if="state.percent === 100">
			<view class="safe-area-bottom fixed-bottom actions flex-h-center">
				<template v-if="state.q">
					<button class="btn flex-h-center" open-type="launchApp" @launchapp="onLaunchAppSuccess" @error="onLaunchAppError">返回APP</button>
					<button class="btn flex-h-center text-white ml-34" @click="onJumpToHome">留在小程序</button>
				</template>
				<template v-else>
					<button class="btn flex-h-center" @click="Utils.pop()">重新上传</button>
					<button class="btn flex-h-center text-white ml-34" @click="onJumpToHome">返回首页</button>
				</template>
			</view>
		</template>
	</view>
</template>

<style lang="less" scoped>
	.page {
		background: #F0F1F5;
		padding-top: 400rpx;
	}

	.actions {
		height: 120rpx;
		box-sizing: content-box;

		.btn {
			width: 326rpx;
			height: 96rpx;
			background: #FEFFFE;
			border-radius: 16rpx;
			font-size: 32rpx;

			&:last-child {
				background: linear-gradient(90deg, #7650FF 0%, #8872FF 100%);
			}
		}
	}
</style>