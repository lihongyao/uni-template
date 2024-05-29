<script setup>
	// -- imports 
	import { reactive, ref } from "vue";
	import { onLoad } from '@dcloudio/uni-app';
	import { useStore } from '@/stores';
	import Utils from '@/utils/index.js';
	import PickerDateLease from '@/components/@lgs/PickerDateLease/PickerDateLease.vue';
	import Tools from '@likg/tools';

	// -- constants 
	// -- refs 
	const picker = ref();
	// -- store
	const store = useStore();
	// -- state 
	const state = reactive({
		pickerRes: {
			start: {
				v: "05月29日 17:30",
				dateTimeString: "2023-05-29 17:30:00",
				weeks: "今日"
			},
			end: {
				v: "05月31日 17:30",
				dateTimeString: "2023-05-31 17:30:00",
				weeks: "周三"
			},
			durations: {
				day: 2,
				hours: 0,
				description: "2天"
			}
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
		console.log(JSON.stringify(value))
		state.pickerRes = value;
	}
</script>


<template>
	<view class="page">
		<!-- :defaultValue="state.pickerRes" -->
		<picker-date-lease ref="picker" @sure="onPicked" :fixedDateForStart="new Date('2023/05/29 23:30:00')">
			<view class="flex-h-center">
				<view @click="openPicker('start')">{{ state.pickerRes ? state.pickerRes.start.v: "开始时间"}}</view>
				<view class="mx-30">————</view>
				<view @click="openPicker('end')">{{state.pickerRes ? state.pickerRes.end.v : "结束时间"}}</view>
			</view>
		</picker-date-lease>
	</view>
</template>

<style lang="less" scoped>
	.page {
		padding-top: 200rpx;
	}
</style>