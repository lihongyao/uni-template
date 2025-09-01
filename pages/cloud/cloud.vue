<script setup>
	// -- imports 
	import { onLoad } from '@dcloudio/uni-app';
	import { useStore } from '@/stores';
	import Utils from '@/utils/index.js';
	import { reactive } from "vue";
	
	
	const db = wx.cloud.database();

	// -- constants 

	// -- refs 

	// -- store
	const store = useStore();

	// -- state 
	const state = reactive({

	});

	// -- life circles 
	onLoad(() => {

	});

	// -- methods 
	const query = async () => {
		const results = await db.collection('users').get();
		console.log((results))
	}
	// -- events
</script>


<template>
	<view class="page">
		<button type="default" @tap="query">获取数据</button>
	</view>
</template>

<style lang="less" scoped></style>