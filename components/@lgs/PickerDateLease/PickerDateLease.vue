<script setup>
	// -- imports 
	import { nextTick, onMounted, reactive, watch } from "vue";
	import {
		getDateMeta,
		getHours,
		format,
		dateFormat,
		getDefaultResult,
		renderColumnItemForDate,
		getLengthOfLease
	} from './helper.js'

	// -- props & emits 
	const props = defineProps({
		/** 营业时间，格式：HH:mm - HH:mm */
		businessHours: { type: String, default: "09:00 - 18:00" },
		/** 限制天数， */
		limit: { type: Number, default: 60 },
		/** 默认值，格式为：{ start: Date, end: Date } */
		defaultValue: Object,
		/** 标签文案，默认：取车时间 - 还车时间 */
		labelText: {
			type: Object,
			default: () => ({
				start: "取车时间",
				end: "还车时间"
			})
		}
	});
	// -- @sure：确认事件，回调值 {length, date }
	const emits = defineEmits(['sure'])

	// -- constants 
	const __curDate = new Date(); // 获取当前时间
	const __hours = getHours(); // 获取小时数数据源（00-23）

	// -- default 
	const __defaultResult = (function() {
		// 1. 计算默认值
		const t = getDefaultResult(__curDate, props.businessHours);
		// 2. 判断是否传入默认值
		if (props.defaultValue) {
			// -- 如果传入默认值则判断默认值开始时间是否已过当前时间
			if (props.defaultValue.start < __curDate) {
				// -- 已过当前时间则弹出提示，将t作为默认值
				uni.showToast({
					icon: "none",
					duration: 3000,
					title: `亲，${props.labelText.start}已过当前时间，已为您修改${props.labelText.start}`
				});
				return t;
			} else {
				// -- 未过当前时间则将传入的defaultValue作为默认值
				return props.defaultValue;
			}
		}
		// 3. 没有传入默认值则将t作为默认值
		return t;
	})();
	console.log('————————————————————————————————————')
	console.log("开始时间(默认)：", __defaultResult.start);
	console.log("结束时间(默认)：", __defaultResult.end);
	console.log('————————————————————————————————————')
	// -- state
	const state = reactive({
		/** 标识当前拾取类型 */
		k: "start", // start / end
		/** 拾取器展示状态 */
		visible: false,
		/** 当前日期 */
		curDate: __curDate,
		/** 拾取器结果 - 响应*/
		result: __defaultResult,
		/** 租赁时长 */
		title: getLengthOfLease(__defaultResult.start, __defaultResult.end),
		/** 拾取器结果 - 内部 */
		value: [0, 0, 0],
		/** 拾取器第1列数据 */
		columns1: [],
		/** 拾取器第2列数据 */
		columns2: [],
		/** 拾取器第3列数据 */
		columns3: [],
	});

	// -- life circle 
	onMounted(() => {
		// 1. 触发「sure」事件，将默认结果回传给调用者
		emits("sure", {
			/** 租赁时长 */
			length: state.title,
			/** 租赁时间 */
			date: { ...state.result }
		});
		// 2. 计算列表数据
		getColumns(state.result.start, state.result.end);
	});

	// -- computed 
	watch(() => state.result, (v) => {
		console.log('————————————————————————————————————');
		console.log("开始时间：", v.start);
		console.log("结束时间：", v.end);
		console.log('————————————————————————————————————');
		// 1. 更新结果值更新，动态计算租赁时长
		state.title = getLengthOfLease(v.start, v.end);
	}, {
		deep: true
	})

	// -- methods 
	// -- 根据value查询选中的列表值
	const getValueMeta = () => {
		const [k1, k2, k3] = state.value;
		const v1 = state.columns1[k1];
		const v2 = state.columns2[k2];
		const v3 = state.columns3[k3];
		return { v1, v2, v3 }
	}

	// -- 获取结果值
	const getResults = () => {
		// 1. 获取列表值
		const { v1, v2, v3 } = getValueMeta();
		// 2. 定义变量(开始时间/结束时间)
		let startDate, endDate;
		// 3. 解构第1列数据
		const { year, month, day } = getDateMeta(v1 === '今日' ? state.curDate : v1);
		// 4. 根据类型处理
		if (state.k === 'start') {
			// 类型：开始时间，
			// -- 计算开始时间：格式 YYYY-MM-DD HH:mm:00
			startDate = new Date(`${year}/${month}/${day} ${v2}:${v3}`);
			// -- 计算结束时间：（在开始时间基础上+2天）
			const t = new Date(startDate.getTime());
			t.setDate(t.getDate() + 2);
			endDate = t;
		} else {
			// 类型：结束时间
			// -- 计算开始时间（直接从结果取值）
			startDate = state.result.start;
			// -- 计算结束时间
			endDate = new Date(`${year}/${month}/${day} ${v2}:${v3}`);
		}
		// 5.响应
		return {
			start: startDate,
			end: endDate
		}
	}
	const getColumns = (startDate, endDate) => {
		let k1 = 0;
		let k2 = 0;
		let k3 = 0;
		// Column1 - 计算第1列数据
		(() => {
			// 1. 根据当前时间计算默认数据源（「开始时间/结束时间」基于此数据源计算）
			const d = new Date(state.curDate.getTime());
			const t = ["今日"];
			for (let i = 0; i < props.limit; i++) {
				t.push(new Date(d.setDate(d.getDate() + 1)))
			}
			// 2. 根据拾取类型处理
			if (state.k === 'start') {
				// -- 开始时间(直接赋值)
				// -- 由于结束时间默认比开始时间多2天
				// -- 为了避免日期溢出，即开始时间选到最大值，修改结束时间时，日期数据为空的问题
				// -- 所以开始日期的截取只需截取到倒数第2项即可
				state.columns1 = t.slice(0, -2);
				// -- 计算下标（根据当前选中的「开始时间」计算）
				k1 = state.columns1.findIndex(item => {
					return (item === '今日' ? state.curDate : item).toDateString() === startDate.toDateString();
				});
			} else {
				// -- 结束时间（动态计算）
				// -- 计算数据源
				const index = t.findIndex(item => {
					return (item === '今日' ? state.curDate : item).toDateString() === startDate.toDateString();
				});
				// -- 判断开始时间是否命中当天23:30分，如果命中，则往后推1天
				const { hours, minutes } = getDateMeta(startDate);
				const shouldDelay1Days = `${hours}:${minutes}` === "23:30";
				state.columns1 = t.slice(shouldDelay1Days ? index + 1 : index);
				// -- 计算下标（根据当前选中的「结束时间」计算）
				k1 = state.columns1.findIndex(item => {
					return (item === '今日' ? state.curDate : item).toDateString() === endDate.toDateString();
				});
			}
		})();
		// # 处理第2列
		(() => {
			if (state.k === 'start') {
				// -- 开始时间
				if (state.columns1[k1] === '今日') {
					// -- 命中今日
					// -- 获取当前时间小时/分钟
					let __h = state.curDate.getHours();
					let __m = state.curDate.getMinutes();
					// -- 如果当前分钟数大于30分，则小时数需+1，比如：
					// -- 09:20，拾取时间可以是 09:30，10:00，10:30...
					// -- 09:40，拾取时间可以是 10:00，10:30，11:00...
					if (__m > 30) {
						__h += 1;
					}
					// -- 格式化小时数，便于查询小标时使用
					__h = format(__h);
					// -- 查询下标
					const index = __hours.findIndex(h => h === __h);
					// -- 截取数据
					state.columns2 = __hours.slice(index);
				} else {
					// -- 如果不是今日，则直接复制数据项（0-23）
					state.columns2 = __hours;
				}
				// 2. 计算下标（根据当前选中的「开始时间」计算）
				const { hours } = getDateMeta(startDate);
				const index = state.columns2.findIndex(item => item === hours)
				k2 = index === -1 ? 0 : index;
			} else {
				// -- 结束时间
				// 1. 处理数据源
				if (state.columns1[k1] === '今日') {
					// -- 命中今日
					const hours = format(startDate.getHours());
					const index = __hours.findIndex(h => h === hours);
					// -- 结束时间在开始时间基础上小时数至少间隔1小时，因此下标+1
					state.columns2 = __hours.slice(index + 1);
				} else if (state.columns1[k1].toDateString() === startDate.toDateString()) {
					// -- 当结束时间何开始时间是同一天时
					const hours = format(startDate.getHours());
					const index = __hours.findIndex(h => h === hours);
					state.columns2 = __hours.slice(index + 1);
				} else {
					state.columns2 = __hours;
				}
				// 2. 计算下标（根据当前选中的「结束时间」计算）
				const { hours } = getDateMeta(endDate);
				const index = state.columns2.findIndex(item => item === hours)
				k2 = index === -1 ? 0 : index;
			}

		})();
		// # 处理第3列
		(() => {
			const v1 = state.columns1[k1];
			const v2 = state.columns2[k2];
			if (state.k === 'start') {
				// -- 开始时间
				const __h = state.curDate.getHours();
				const __m = state.curDate.getMinutes();
				if (v1 === '今日' && +v2 === __h && __m < 30) {
					state.columns3 = ['30'];
				} else {
					state.columns3 = ['00', '30'];
				}
				const { minutes } = getDateMeta(startDate);
				const index = state.columns3.findIndex(item => item === minutes);
				k3 = index === -1 ? 0 : index;
			} else {
				// -- 结束时
				const __h = startDate.getHours();
				const __m = startDate.getMinutes();

				if (v1 === '今日' && +v2 === __h && __m < 30) {
					state.columns3 = ['30'];
				} else {
					state.columns3 = ['00', '30'];
				}
				const { minutes } = getDateMeta(endDate);
				console.log(__h, __m, v1, v2, minutes);
				const index = state.columns3.findIndex(item => item === minutes);
				k3 = index === -1 ? 0 : index;
			}

		})();

		// # 更新
		nextTick(() => {
			state.value = [k1, k2, k3];
			console.log("最新下标：", [k1, k2, k3])
			state.result = { ...getResults() }
		})
	}

	const open = ({ type }) => {
		// 1. 更新当前选中类型
		state.k = type;
		// 2. 更新当前时间
		state.curDate = new Date();
		// 3. 判断结果开始时间是否已过当前时间
		if (state.result.start < state.curDate) {
			// -- 弹出提示用户
			uni.showToast({
				icon: "none",
				duration: 3000,
				title: `亲，${props.labelText.start}已过当前时间，已为您修改${props.labelText.start}`
			});
			// -- 更新结果（默认）
			state.result = getDefaultResult(state.curDate, props.businessHours);
			// -- 更新标题
			state.title = getLengthOfLease(state.result.start, state.result.end);
			// -- 触发更新
			emits("sure", {
				/** 租赁时长 */
				length: state.title,
				/** 租赁时间 */
				date: { ...state.result }
			});
		}
		// 4. 更新数据源
		getColumns(state.result.start, state.result.end);
		// 5. 展示
		state.visible = true;
	}
	const close = () => {
		state.visible = false;
	}

	// -- events 
	// -- 用户点击确认
	const onSure = () => {
		console.log('————————————————————————————————————');
		console.log("租赁时长：", state.title);
		console.log("开始时间：", state.result.start);
		console.log("结束时间：", state.result.end);
		console.log('————————————————————————————————————');
		close();
		emits("sure", {
			/** 租赁时长 */
			length: state.title,
			/** 租赁时间 */
			date: { ...state.result }
		});
	}
	// -- 用户切换类型：开始时间 / 结束时间
	const onSwitchType = (type) => {
		// 1. 切换类型
		state.k = type;
		// 2. 重新计算列表数据
		getColumns(state.result.start, state.result.end);
	}
	// -- 拾取器值改变
	const oPickerChange = ({ detail: { value } }) => {
		console.log("拾取下标：", value)
		// 1. 更新列表值
		state.value = [...value];
	}
	// -- 拾取器停止滚动
	const onPickerEnd = () => {
		// 1. 获取临时时间
		const { start, end } = getResults();
		console.log('————————————————————————————————————')
		console.log("开始时间(临时)：", start);
		console.log("结束时间(临时)：", end);
		console.log('————————————————————————————————————')
		// 2. 重新计算列表数据
		getColumns(start, end);
	}

	// -- exposes
	defineExpose({
		open,
		close
	});
</script>



<template>
	<view class="lg-picker-date-lease">
		<!-- 内容 -->
		<view class="__contents">
			<slot></slot>
		</view>
		<!-- 遮罩 -->
		<view class="__mask" :class="{visible: state.visible}">
			<view class="__mask-contents">
				<!-- 顶栏 -->
				<view class="__head">
					<view class="__close" @click="close"></view>
					<view class="__title">{{state.title}}</view>
					<view class="__sure" @click="onSure">确认</view>
				</view>
				<!-- 日期 -->
				<view class="__result">
					<view class="__item __start" :class="{selected: state.k === 'start'}" @click="onSwitchType('start')">
						<view class="__t">{{props.labelText.start}}</view>
						<view class="__v">{{dateFormat(state.result['start'])}}</view>
					</view>
					<view class="__item __end" :class="{selected: state.k === 'end'}" @click="onSwitchType('end')">
						<view class="__t">{{props.labelText.end}}</view>
						<view class="__v">{{dateFormat(state.result['end'])}}</view>
					</view>
				</view>
				<!-- pickers -->
				<picker-view class="__picker" :value="state.value" indicator-class="__indicator" immediate-change @pickend="onPickerEnd" @change="oPickerChange">
					<picker-view-column>
						<view class="column" v-for="(item,index) in state.columns1" :key="index">
							{{renderColumnItemForDate(item)}}
						</view>
					</picker-view-column>
					<picker-view-column>
						<view class="column" v-for="(item,index) in state.columns2" :key="index">{{item}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="column" v-for="(item,index) in state.columns3" :key="index">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>

	</view>

</template>


<style lang="less" scoped>
	.lg-picker-date-lease {

		.__mask {
			width: 100vw;
			height: 100vh;
			background-color: rgba(0, 0, 0, .5);
			position: fixed;
			top: 0;
			left: 0;
			transition: all .25s linear;
			z-index: -1;
			opacity: 0;

			&.visible {
				z-index: 10;
				opacity: 1;
			}
		}

		.__mask-contents {
			width: 750rpx;
			background: #FFF;
			border-radius: 26rpx 26rpx 0 0;
			position: absolute;
			left: 0;
			bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.__head {
				height: 120rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;

				.__close,
				.__sure {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
				}

				.__close {
					left: 0;
					width: 80rpx;
					height: 60rpx;

					&::before,
					&::after {
						content: "";
						width: 6rpx;
						height: 34rpx;
						background: #202020;
						position: absolute;
						top: 50%;
						left: 50%;
					}

					&::before {
						transform: translate(-50%, -50%) rotateZ(45deg);
					}

					&::after {
						transform: translate(-50%, -50%) rotateZ(-45deg);
					}
				}

				.__title {
					font-size: 36rpx;
					font-weight: 500;
					font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
					color: #202020;
				}

				.__sure {
					right: 0;
					width: 110rpx;
					height: 60rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 32rpx;
					font-weight: 400;
					color: #4988EF;
				}
			}

			.__result {
				height: 130rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				.__item {
					flex: 1;
					height: inherit;
					background: #F4F4F4;
					color: #202020;
					display: flex;
					flex-direction: column;
					justify-content: center;
					padding: 0 20rpx;

					.__t {
						font-size: 24rpx;
						margin-bottom: 6rpx;
					}

					.__v {
						font-size: 30rpx;
					}

					&.selected {
						color: #FFF;

						&.__start {
							background: linear-gradient(to right, #4988EF 20%, #F4F4F4 100%);
						}

						&.__end {
							background: linear-gradient(to left, #4988EF 20%, #F4F4F4 100%);
						}
					}
				}

				.__end {
					align-items: flex-end;
				}
			}


			.__picker {
				height: 400rpx;

				:deep(.__indicator) {
					height: 80rpx;
				}

				.column {
					font-size: 28rpx;
					color: #202020;
					text-align: center;
					line-height: 80rpx;

				}
			}
		}
	}
</style>