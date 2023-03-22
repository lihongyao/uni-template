<script setup>
	import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
	// -- life circles 
	onLaunch(() => {
		console.log('__onLaunch__');
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
