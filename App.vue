<script setup>
	import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
	// import uma from 'umtrack-wx';

	// -- life circles 
	onLaunch(() => {
		console.log('__onLaunch__');
		// 1.是否遵循静音开关，设置为 false 之后，即使是在静音模式下，也能播放声音（iOS）
		if (/ios/i.test(uni.getSystemInfoSync().platform)) {
			uni.setInnerAudioOption({
				obeyMuteSwitch: false
			});
		}
		// 2.集成友盟
		/*uma.init({
			// 由友盟分配的APP_KEY
			appKey: '642e74c1ba6a5259c430b0d5',
			// 使用Openid进行统计，此项为false时将使用友盟+uuid进行用户统计。
			// 使用Openid来统计微信小程序的用户，会使统计的指标更为准确，对系统准确性要求高的应用推荐使用Openid。
			useOpenid: true,
			// 使用openid进行统计时，是否授权友盟自动获取Openid，
			// 如若需要，请到友盟后台"设置管理-应用信息"(https://mp.umeng.com/setting/appset)中设置appId及secret
			autoGetOpenid: true,
			// 是否打开调试模式
			debug: true,
			// 自动上传用户信息，设为false取消上传，默认为false
			uploadUserInfo: true,
		});*/
	});
	onShow(() => {
		console.log('__onShow__');
	});
	onHide(() => {
		console.log('__onHide__');
	})
</script>


<style lang="less">
	@import url("./global.css");


	/* 修改富文本编辑器的placeholder的默认颜色：字体 */
	.ql-container /deep/ .ql-blank::before {
		/* 此处设置 placeholder 样式 */
		color: #33333330;
		font-style: normal;
	}

	.action-button {
		width: 600rpx;
		height: 88rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 44rpx;
		background-color: #42b983;
		font-size: 32rpx;
		color: #FFFFFF;

	}
</style>