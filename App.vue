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


<style>
	@import url("./global.css");
</style>
