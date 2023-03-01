<script setup>
	import { onLoad } from "@dcloudio/uni-app";
	import { ref } from 'vue';

	// -- constants
	const WEBPAGEs = {
		1: { url: 'https://www.baidu.com/' },
		2: { url: 'https://news.qq.com/' }
	}
	const webviewStyles = {
		progress: { color: '#1946BB' }
	}

	// -- state
	const url = ref('');
	// -- life circles
	onLoad(({ q }) => {
		url.value = WEBPAGEs[q].url;
	});
</script>

<template>
	<web-view :webview-styles="webviewStyles" :src="url"></web-view>
</template>
