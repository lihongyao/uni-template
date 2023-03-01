<template>
	<view :class="['count-to', customCls]">
		{{v}}
	</view>
</template>
<script>
	import Big from 'lg-big';
	export default {
		props: {
			customCls: {
				type: String,
				default:''
			},
			value: {
				type: Number,
				default: 0
			},
			interval: {
				type: Number, 
				default: 60
			},
		},
		watch: {
			value(v, o) {
				this.numberGrow();
			} 
		},
		data() {
			return {
				v: 0
			}
		},
		methods: {
			numberGrow() {
				let step = (+new Big(this.value).dividedBy(20).parse()).toFixed(2) ;
				let current = 0;
				let start = 0;
				let t = setInterval(() => {
					start  = +new Big(start).plus(step).parse();
					if (start > this.value) {
						clearInterval(t);
						start = this.value;
						t = null;
					}
					if (start == 0) {
						start = this.value;
						clearInterval(t)
					}
					// 当前值等于开始值，那就结束
					if (this.value === 0) {
						return;
					}
					current = start
					// 正则
					const v = current.toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,')
					this.v = v;
				}, this.interval)

			}
		},
	}
</script>
<style lang="less" scoped>
	.count-to {
		
	}
</style>
