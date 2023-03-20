<script setup>
	// -- imports 
	import { getCurrentInstance, reactive, watch } from 'vue';

	// -- props 
	const props = defineProps({
		customCls: { type: String, default: '' },
		value: { type: Number, default: 0 },
		interval: { type: Number, default: 60 }
	})

	const { proxy } = getCurrentInstance();

	// -- state 
	const state = reactive({
		v: 0,
	})

	// -- effects
	watch(() => props.value, (newValue, oldValue) => {
		numberGrow(newValue, oldValue);
	});

	// -- methods 
	const numberGrow = (target /* 目标值 */ , current /** 当前值 */ ) => {
		// -- 异常处理
		if (target === current) {
			return;
		}
		// -- 判断目标值是否包含小数
		const isDecimals = /\./.test(target.toString());
		// -- 计算步长
		const times = 30;
		let step = (target - current) / times;
		step = isDecimals ? +isDecimals.toFixed(2) : Math.floor(step); // 判断是否存在小数点
		console.log(step);
		// -- 累计值
		let reduce = current;
		// -- 定时器
		let t = setInterval(() => {
			reduce = isDecimals ? +(reduce + step).toFixed(2) : Math.floor(reduce + step);
			// 判断：满足如下条件终止定时器
			// 1. 增加（即targt > current）：累计值大于目标值时
			// 2. 减少（即targt < current）：累计值小于目标值时
			// 3. 当目标值与当前值相等时
			if ((target > current && reduce > target) || (target < current && reduce < target)) {
				clearInterval(t);
				t = null;
				reduce = target;
			}
			// 正则处理数字格式并赋值给状态v
			state.v = reduce.toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,');
			// -- 强制刷新
			proxy.$forceUpdate();
		}, props.interval)
	}
</script>


<template>
	<view :class="['count-to', customCls]">
		{{state.v}}
	</view>
</template>

<style lang="less" scoped>
	.count-to {}
</style>
