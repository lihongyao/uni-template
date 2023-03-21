<!-- 参考：https://juejin.cn/post/7166139934036721694#heading-3 -->
<!-- 1. 使用时 pages.json/tabBar 正常配置 -->
<!-- 2. 在需要使用的地方引入TabBarStrange，并在onShow中调用 uni.hideTabBar 隐藏原生标签栏 -->
<!-- 3. 监听 change 事件，可实现跳转拦截 -->
<script setup>
	// -- imports 
	import { onMounted, reactive } from 'vue';
	import TAB1 from '@/static/images/icon_resume.png';
	import TAB2 from '@/static/images/icon_ai_mid.png';
	import TAB3 from '@/static/images/icon_mine.png';
	import TAB1_SEL from '@/static/images/icon_resume_sel.png';
	import TAB3_SEL from '@/static/images/icon_mine_sel.png';
	import TAB_MID from '@/static/images/icon_ai_mid.png';


	// -- constants 
	const tabBar = {
		color: "#BFBFBF",
		selectedColor: "#8176F6",
		list: [{
			text: "模板",
			path: "/pages/TabPages/templates",
			iconPath: TAB1,
			selectedIconPath: TAB1_SEL,
		}, {
			text: "AI简历",
			path: "/pages/TabPages/ai",
			iconPath: TAB2,
			isMidButton: true
		}, {
			text: "我的",
			path: "/pages/TabPages/mine",
			iconPath: TAB3,
			selectedIconPath: TAB3_SEL,
		}]
	}

	// -- props 
	const props = defineProps({
		/** 当前选中的下标 */
		selected: { type: Number, default: 0 }
	});

	// -- emits
	const emits = defineEmits(['change']);

	// -- events 
	const switchTab = (item, index) => {
		if (props.selected === index) {
			return;
		}
		emits("change", () => {
			uni.switchTab({ url: item.path });
		});
	}
</script>


<template>
	<!-- 外层容器：固定定位/设置安全区域 -->
	<view class="lg-tabBar">
		<!-- 内层容器：设置高度（凸起）/UI出图设置背景 -->
		<view class="lg-tabBar__wrap">
			<!-- 内容容器-->
			<view class="lg-tabBar__ct">
				<block v-for="(item, index) in tabBar.list" :key="item.path">
					<view class="lg-tabBar__item" :class="{mid: !!item.isMidButton}" @click="switchTab(item, index)">
						<!-- 中间项 -->
						<template v-if="item.isMidButton">
							<image class="tab_icon_mid" :src="item.iconPath"></image>
							<image class="tab_icon" :src="item.iconPath"></image>
						</template>
						<!-- 正常项 -->
						<template v-else>
							<image class="tab_icon" :src="selected === index ? item.selectedIconPath : item.iconPath"></image>
						</template>
						<!-- 文本项 -->
						<view class="tab_label" :style="{color: selected === index ? tabBar.selectedColor : tabBar.color}">{{item.text}}</view>
					</view>
				</block>
			</view>
		</view>
		<!-- 安全区域 -->
		<view class="lg-tabBar__safe"></view>
	</view>
</template>


<style lang="less" scoped>
	.lg-tabBar {
		width: 750rpx;
		box-sizing: content-box;
		position: fixed;
		left: 0;
		bottom: 0;

		&__wrap {
			width: inherit;
			height: 147rpx;
			display: flex;
			align-items: flex-end;
			position: relative;
			background-image: url('https://ai-resume.oss-cn-shenzhen.aliyuncs.com/resume/images/icon/20230314/1678757606682/tabBar.png');
			background-size: 100% 100%;
		}

		&__safe {
			width: inherit;
			height: constant(safe-area-inset-bottom);
			height: env(safe-area-inset-bottom);
			background-color: #FFFFFF;
		}

		&__ct {
			width: inherit;
			height: 100rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		&__item {
			flex: 1;
			text-align: center;

			.tab_icon {
				width: 48rpx;
				height: 48rpx;
			}

			.tab_icon_mid {
				width: 98rpx;
				height: 104rpx;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				top: 10rpx;
			}

			.tab_label {
				font-size: 20rpx;
				margin-top: 9rpx;
			}

			/** 处理中间项 */
			&.mid .tab_icon {
				opacity: 0;
			}

		}
	}
</style>
