<script setup>
	import { nextTick, reactive } from "vue";
	import { getYears, getMonths, getDays, getDateMeta, isLeapYear } from "./helper.js";

	// -- props 
	const props = defineProps({
		/** 最小日期，默认：1970/01/01 */
		min: { type: Date, default: () => new Date("1970/01/01") },
		/** 最大日期，默认：当前日期 */
		max: { type: Date, default: () => new Date() },
		/** 细粒度，有效值 YEAR/MONTH/DAY，默认为DAY */
		fields: { type: String, default: "DAY" },
		/** 是否展示至今项 */
		showNow: { type: Boolean, default: false },
		/** 日期格式 */
		format: { type: String, default: 'YYYY-MM-DD' }
	})
	// -- emits 
	const emits = defineEmits(["change"]);

	// -- constants
	const { year: currentYear, month: currentMonth, day: currentDay } = getDateMeta(new Date()); // 获取当前日期
	const __years = getYears(props.min, props.max, props.showNow); // 获取年份集合
	const __month = getMonths(); // 获取月份集合
	const __days = getDays(parseInt(currentYear), parseInt(currentMonth)); // 获取日期集合

	// -- defaults
	const __defaultYear = (() => {
		// 1. 判断是否存在至今
		const i = __years.findIndex(year => year === "至今")
		if (i >= 0) return i;
		// 2. 判断是否存在当前年
		const j = __years.findIndex(year => year === currentYear);
		return j >= 0 ? j : i;
	})();
	const __defaultMonth = (() => {
		const index = __month.findIndex(month => month === currentMonth);
		return index >= 0 ? index : 0;
	})();
	const __defaultDay = (() => {
		const index = __days.findIndex(day => day === currentDay);
		return index >= 0 ? index : 0;
	})();


	// -- state 
	const state = reactive({
		value: [__defaultYear, __defaultMonth, __defaultDay], // 当前选中值
		oldValue: [__defaultYear, __defaultMonth, __defaultDay], // 历史选中值/用于优化计算
		years: __years, // 年份集合
		months: props.showNow ? [] : __month, // 月份集合
		days: props.showNow ? [] : __days, // 日期集合
		visible: false // 是否显示
	});


	// -- methods
	// 1. 获取当前选中的日期
	const getValueMeta = (type = "CURRENT_VALUE") => {
		const [k1, k2, k3] = type === "CURRENT_VALUE" ? state.value : state.oldValue;
		const year = state.years[k1];
		const month = state.months[k2];
		const day = state.days[k3];
		return { year, month, day }
	}
	// 2. 生成change载体
	const generateValue = (value) => ({ detail: { value } });
	// 3. 检查是否超出设置范围

	const checkLimit = () => {
		return new Promise((resolve) => {
			const { year: minYear, month: minMonth, day: minDay } = getDateMeta(props.min);
			const { year: maxYear, month: maxMonth, day: maxDay } = getDateMeta(props.max);
			const { year: curYear, month: curMonth, day: curDay } = getValueMeta("CURRENT_VALUE");

			const minMonthIndex = state.months.findIndex(month => month === minMonth);
			const minDayIndex = state.days.findIndex(day => day === minDay);
			const maxMonthIndex = state.months.findIndex(month => month === maxMonth);
			const maxDayIndex = state.days.findIndex(day => day === maxDay);

			// -- 值为最小年份时
			if (curYear === minYear && (curMonth < minMonth || curDay < minDay)) {
				nextTick(() => {
					state.value = [state.value[0], minMonthIndex, minDayIndex];
				})
				return;
			}
			// -- 值为最大年份时
			if (curYear === maxYear && (curMonth > maxMonth || curDay > maxDay)) {
				nextTick(() => {
					state.value = [state.value[0], maxMonthIndex, maxDayIndex];
				})
				return;
			}
			resolve();
		});
	}

	// -- events 
	const onSure = () => {
		const { year, month = '01', day = '01' } = getValueMeta();
		if (year === "至今") {
			emits("change", generateValue("至今"));
		} else {
			// 根据细粒度返回值
			const v = props.format.replace(/YYYY/, year).replace(/MM/, month).replace(/DD/, day);
			emits("change", generateValue(v));
			/*switch (props.fields) {
				case "YEAR":
					emits("change", generateValue(year))
					break;
				case "MONTH":
					emits("change", generateValue(`${year}-${month}`));
					break;
				case "DAY":
					emits("change", generateValue(`${year}-${month}-${day}`))
					break;
				default:
					emits("change", "——————");
			}*/
		}
		state.visible = false;
	}
	const onCancel = () => {
		state.visible = false;
	}
	const onPickerEnd = () => {
		checkLimit().then(() => {
			state.oldValue = [...state.value];
		})
	}
	const onPickerChange = ({ detail: { value } }) => {
		state.value = [...value];
		const { year, month, day } = getValueMeta();
		if (year === "至今") {
			// 1. 如果当前选中至今，置空月份/日期集合
			state.months = [];
			state.days = [];
		} else {
			if (!month) {
				// 2. 如果月份集合不存在，则赋值月份集合，并判断是否需要显示日期，如果需要，则计算日期集合。
				state.months = [...__month];
				if (props.fields === "DAY") {
					state.days = getDays({ year: parseInt(year), month: parseInt(state.months[value[1]]) });
				}
			} else {
				// 3. 判断是否加载日期
				if (props.fields === "DAY") {
					// -- 优化算法/避免每次更新就计算一次日期
					// -- 如果年份/月份不变，则无需计算日期
					const { year: oldYear, month: oldMonth, day: oldDay } = getValueMeta("OLD_VALUE")
					if (year !== oldYear || month !== oldMonth) {
						state.days = getDays({ year: parseInt(year), month: parseInt(month) });
					}
				}
			}
		}
	}
</script>



<template>
	<view class="lg-picker-date">
		<!-- 内容 -->
		<view class="lg-picker-date__v" @click="state.visible = true">
			<slot></slot>
		</view>
		<!-- 选择框 -->
		<view class="lg-picker-date__ct" :class="{visible: state.visible}" @click="state.visible = false">
			<view class="lg-picker-date__wrap" @click.stop="">
				<view class="action-btns">
					<view class="action-btns__wrap">
						<view class="btn cancel" @click="onCancel">取消</view>
						<view class="btn sure" @click="onSure">确定</view>
					</view>
				</view>
				<view class="picker">
					<template v-if="state.years">
						<picker-view :value="state.value" indicator-class="lg-picker-date__indicator" mask-class="lg-picker-date__mask" immediate-change @pickend="onPickerEnd" @change="onPickerChange">
							<picker-view-column>
								<view class="column" v-for="(item,index) in state.years" :key="index">
									{{item}}{{item === '至今'? '':'年'}}
								</view>
							</picker-view-column>
							<picker-view-column v-if="['DAY', 'MONTH'].includes(props.fields)">
								<view class="column" v-for="(item,index) in state.months" :key="index">
									{{item}}月
								</view>
							</picker-view-column>
							<picker-view-column v-if="['DAY'].includes(props.fields)">
								<view class="column" v-for="(item,index) in state.days" :key="index">
									{{item}}日
								</view>
							</picker-view-column>
						</picker-view>
					</template>
				</view>
			</view>
		</view>
	</view>
</template>



<style lang="less" scoped>
	.lg-picker-date {
		&__ct {
			width: 100vw;
			height: 100vh;
			background-color: rgba(0, 0, 0, .35);
			position: fixed;
			top: 0;
			left: 0;
			z-index: -1;
			opacity: 0;
			transition: all 0.25s linear;
			user-select: none;
		}

		&__wrap {
			width: 100vw;
			background-color: #FFFFFF;
			border-radius: 24rpx 24rpx 0 0;
			padding-bottom: env(safe-area-inset-bottom);
			padding-bottom: constant(safe-area-inset-bottom);
			position: absolute;
			left: 0;
			bottom: 0;
			overflow: hidden;
			transform: translateY(100%);
			transition: transform 0.25s linear;

			.action-btns {
				width: 100vw;
				height: 120rpx;
				padding: 0 50rpx;
				font-size: 28rpx;

				&__wrap {
					height: inherit;
					border-bottom: 1rpx solid #EEEEEE;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.cancel {
					color: #888888;
				}

				.sure {
					color: cornflowerblue;
				}
			}

			.picker {
				margin-top: 24rpx;
				height: 500rpx;
			}

			picker-view {
				height: 500rpx;

				picker-view-column:first-child {
					padding-left: 30rpx;
				}

				picker-view-column:last-child {
					padding-right: 30rpx;
				}
			}

			.column {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				color: #333333;
			}
		}

		:deep(&__indicator) {
			height: 50px;
		}

		:deep(&__mask) {
			background-color: rgba(0, 0, 0, .05);
		}

		&__ct.visible {
			z-index: 999;
			opacity: 1;
		}

		&__ct.visible &__wrap {
			transform: translateY(0);
		}


	}
</style>