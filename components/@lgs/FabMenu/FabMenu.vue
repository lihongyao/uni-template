<script setup>
	// -- imports 
	import { getCurrentInstance, onMounted, reactive } from "vue";


	// -- props 
	const props = defineProps({
		/** 菜单项：格式 → Array<{label: string, icon: string }> */
		menus: { type: Object, default: () => ([]) }
	});

	// -- emits 
	const emits = defineEmits(["openMenu", "itemTap"]);

	// -- state 
	const state = reactive({
		/** 菜单状态 */
		openMenu: false,
		/** 菜单栏高度 */
		menuHeight: 0,
		/** 可使用窗口高度 */
		windowHeight: 0,
		/** 展示位置 */
		position: 'bottom'
	});

	// -- life circles 
	onMounted(() => {
		// 1. 获取组件实例
		state.instance = getCurrentInstance();
		// 2. 获取可使用窗口高度
		state.windowHeight = uni.getSystemInfoSync().windowHeight;
		// 3. 获取菜单栏高度
		uni.createSelectorQuery().in(getCurrentInstance()).select(".__menu").boundingClientRect(rect => {
			if (rect) {
				state.menuHeight = rect.height;
			}
		}).exec()
	});

	// -- methods 
	const closeMenu = () => {
		state.openMenu = false;
	}

	// -- events 
	const onTap = ($event) => {
		if (state.openMenu) {
			state.openMenu = false;
		} else {
			// 1. 获取触摸位置
			const { clientY } = $event.changedTouches[0];
			// 2. 判断在上方展示还是在下方展示
			if (state.windowHeight - clientY < (state.menuHeight + 50)) {
				state.position = 'bottom';
			} else {
				state.position = 'top';
			}
			// 3. 控制菜单状态
			state.openMenu = true;
			// 4. 触发显示菜单事件
			emits("openMenu", closeMenu);
		}

	}
	const onItemTap = (menu) => {
		emits('itemTap', menu);
		state.openMenu = false;
	}
</script>

<template>
	<view class="lg-fab-menu">
		<view class="__ct" @click.stop="onTap">
			<slot>
				<view class="dot"></view>
				<view class="dot"></view>
				<view class="dot"></view>
			</slot>
		</view>
		<view class="__menu" :class="{open: state.openMenu}" :style="{[state.position]: '100%'}">
			<block v-for="(menu, index) in menus" :key="index">
				<view class="__item" @click.stop="onItemTap(menu)">
					<image class="__icon" :src="menu.icon"></image>
					<text class="__label">{{menu.label}}</text>
				</view>
			</block>
		</view>
	</view>
</template>



<style lang="less" scoped>
	.lg-fab-menu {
		position: relative;

		.__ct {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 50rpx;
			height: 80rpx;

			.dot {
				width: 8rpx;
				height: 8rpx;
				background: #666666;
				border-radius: 50%;

				&:not(:last-child) {
					margin-right: 6rpx;
				}
			}
		}

		.__menu {
			width: 230rpx;
			background: #FFFFFF;
			box-shadow: 0 0 22rpx 0 rgba(176, 176, 176, 0.42);
			border-radius: 16rpx;
			position: absolute;
			right: 0;
			padding: 24rpx 0;
			z-index: -1;
			opacity: 0;

			&.open {
				z-index: 1;
				opacity: 1;
			}


			.__item {
				height: 70rpx;
				display: flex;
				align-items: center;
				padding: 0 42rpx;

				&:active {
					opacity: .35;
				}
			}

			.__icon {
				width: 40rpx;
				height: 40rpx;
				margin-right: 18rpx;
			}

			.__label {
				font-size: 28rpx;
				color: #222222;
			}
		}
	}
</style>