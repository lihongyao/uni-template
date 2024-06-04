<script setup>
	import { reactive, onMounted } from 'vue';


	// -- emits
	const emits = defineEmits(['agree', 'reject']);

	// -- state
	const state = reactive({
		visible: false,
		appName: '国韵蜀艺',
		privacyContractName: '',
		resolvePrivacyAuthorization: null,
	});


	// -- life circles
	onMounted(() => {
		if (uni.onNeedPrivacyAuthorization) {
			uni.onNeedPrivacyAuthorization((resolve, eventInfo) => {
				state.visible = true;
				state.resolvePrivacyAuthorization = resolve;
			});
		}
		if (uni.getPrivacySetting) {
			uni.getPrivacySetting({
				success: (res) => {
					console.log('隐私引导信息：', res)
					if (res.needAuthorization) {
						state.privacyContractName = res.privacyContractName;
						state.visible = true;
					} else {
						emits('agree');
					}
				},
			});
		}
	})

	// -- methods
	const open = () => {
		state.visible = true;
	}
	const close = () => {
		state.visible = false;
	}
	// -- events
	const openPrivacyContract = () => {
		if (uni.openPrivacyContract) {
			uni.openPrivacyContract({
				success: () => {},
				fail: () => {
					uni.showToast({
						title: '遇到错误',
						icon: 'error',
					});
				},
			});
		}

	}
	const onReject = () => {
		emits('reject');
		uni.showModal({
			content: '您确定要拒绝吗?',
			success: res => {
				if (res.confirm) uni.exitMiniProgram();
			}
		});

	}
	const onAgree = () => {
		state.visible = false;
		if (typeof state.resolvePrivacyAuthorization === 'function') {
			state.resolvePrivacyAuthorization({ buttonId: 'agree-btn', event: 'agree' });
		}
		emits('agree');
		
	}

	// -- exposes
	defineExpose({
		open,
		close
	});
</script>
<template>
	<view class="lg-privacy-dialog" catchtouchmove :class="{visible: state.visible}">
		<view class="__content">
			<view class="__title">用户隐私保护指引</view>
			<view class="__desc">
				感谢您选择使用{{state.appName}}小程序，我们非常重视您的个人信息安全和隐私保护。使用我们的产品前，请您仔细阅读：<text class="__link"
					@tap="openPrivacyContract">{{state.privacyContractName}}</text>如果您同意此隐私保护指引，请点击同意按钮，开始使用此小程序，我们将尽全力保护你你的个人信息及合法权益，感谢您的信任。
			</view>
			<view class="__buttons">
				<button class="item reject" @tap="onReject">拒绝</button>
				<button class="item agree" id="agree-btn" open-type="agreePrivacyAuthorization"
					@agreeprivacyauthorization="onAgree">同意</button>
			</view>
		</view>
	</view>
</template>


<style scoped lang="less">
	.lg-privacy-dialog {
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, .75);
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
		transition: all .25s linear;

		z-index: -1;
		opacity: 0;

		&.visible {
			z-index: 999;
			opacity: 1;

			.lg-popup__content {
				transform: translateY(0%);
			}
		}
	}


	.__content {
		width: 632rpx;
		background-color: #fff;
		padding: 48rpx;
		box-sizing: border-box;
		border-radius: 16rpx;

		.__title {
			text-align: center;
			color: #333;
			font-weight: bold;
			font-size: 32rpx;
		}

		.__desc {
			margin-top: 40rpx;
			font-size: 26rpx;
			color: #666;
			line-height: 1.6;

			.__link {
				display: inline;
				color: #1989ff;
			}
		}

		.__buttons {
			margin-top: 48rpx;
			display: flex;

			.item {
				width: 200rpx;
				height: 72rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				&.reject {
					background: #edf5fe;
					color: #1989ff;
					font-size: 14px;
					font-weight: 300;
					margin-right: 16rpx;
				}

				&.agree {
					background: #1989ff;
					color: #fff;
					font-size: 16px
				}
			}
		}
	}
</style>