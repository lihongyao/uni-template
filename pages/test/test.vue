<script setup>
	// -- imports 
	import { reactive, ref } from "vue";
	import { onLoad } from '@dcloudio/uni-app';
	import { useStore } from '@/stores';
	import service from '@/service/index.js';
	import Utils from '@/utils/index.js';
	import PickerDateLease from '@/components/@lgs/PickerDateLease/PickerDateLease.vue';
	import Tools from 'lg-tools';

	// -- constants 
	// -- refs 
	const picker = ref();
	// -- store
	const store = useStore();
	// -- state 
	const state = reactive({
		pickerRes: {
			start: new Date("2023/05/20 09:00:00"),
			end: new Date("2023/07/10 09:00:00")
		}
	});
	// -- life circles 
	onLoad(() => {

	});
	// -- methods 
	// -- events
	const openPicker = (type) => {
		picker.value.open({
			type
		})
	}
	const onPicked = (value) => {
		state.pickerRes = value;
	}
</script>


<template>
	<view class="page">
		<picker-date-lease ref="picker" @sure="onPicked" :defaultValue="state.pickerRes">
			<view class="flex-h-center">
				<view @click="openPicker('start')">{{ state.pickerRes ? Tools.dateFormat(state.pickerRes.start, 'MM-DD HH:mm') : "开始时间"}}</view>
				<view class="mx-30">————</view>
				<view @click="openPicker('end')">{{state.pickerRes ? Tools.dateFormat(state.pickerRes.end, 'MM-DD HH:mm') : "结束时间"}}</view>
			</view>
		</picker-date-lease>
	</view>
</template>

<style lang="less" scoped>
	.page {
		padding-top: 200rpx;
	}
</style>