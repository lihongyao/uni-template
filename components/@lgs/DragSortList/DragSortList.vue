<script setup>
	// -- imports
	import { onMounted, reactive, computed, watch, getCurrentInstance, nextTick } from 'vue';

	// -- props
	const props = defineProps({
		/** 数据源 */
		data: { type: Array, default: () => [] },
		/** 列表项高度，像素单位，注意：插槽内容高度必须和<=该值且不要设置元素margin属性值 */
		rowHeight: { type: Number, default: 50 },
		/** 容器高度 */
		wrapHeight: { type: String, default: "600rpx" },
		/** 是否设置边框 */
		bordered: { type: Boolean, default: true }
	});

	// -- state 
	const state = reactive({
		list: [], // 本地数据列表
		areaHeight: 0, // 移动区域高度
		activeId: '', // 激活ID
		activeItem: null, // 激活项
		offsetY: 0, // 偏移量
		// —————————————————————— Scroll Props ——————————————————————
		viewTop: 0, // 指定滚动高度
		scrollTop: 0, // 容器实时滚动高度
		canScroll: true, // 是否支持纵向滚动
		scrollWithAnimation: false, // 设置滚动高度是否使用动画过渡
		wrap: { // 包裹容器信息
			top: 0, // 每项距离顶部的位置
			height: 618, // 默认iphon6.7的高度，避免第一个空白
		}
	});

	// -- life circles 
	onMounted(() => {
		const instance = getCurrentInstance();
		const query = uni.createSelectorQuery().in(instance);
		query.select("#lg-drag-sort-list-wrap").boundingClientRect((data) => {
			if (data) {
				state.wrap = {
					top: data.top,
					height: data.height
				}
			}
		}).exec();
	})

	// -- methods
	/** 1. 初始化列表项的位置 */
	const initList = (data) => {
		// 1. 计算可拖拽区域总高度
		state.areaHeight = data.length * props.rowHeight;
		// 2. 扩展列表项字段，便于后续操作
		state.list = data.map((item, index) => ({
			...item,
			y: index * props.rowHeight, // movable-view 当前项所处的高度
			index, // 当前项所处于列表的下标，用于比较
			animation: true, // 主要用于控制拖拽的元素要关闭动画, 其他的元素可以保留动画
			_id: "K" + Math.random()
		}))
		console.log(deepClone(state.list));
	};
	/** 2. 获取列表 */
	const getList = () => {
		// 1. 根据下标排序
		const t = deepClone(state.list).sort((o1, o2) => o1.index - o2.index);
		// 2. 返回数据
		return t.map(item => {
			// 删除扩展的列表项字段
			delete item.y;
			delete item._id;
			delete item.index;
			delete item.animation;
			return item;
		});
	}

	/** 3. 深拷贝 */
	const deepClone = (obj) => {
		let objClone = Array.isArray(obj) ? [] : {};
		if (obj && typeof obj === "object") {
			for (const key in obj) {
				if (obj.hasOwnProperty(key)) {
					//判断 obj 子元素是否为对象，如果是，递归复制
					if (obj[key] && typeof obj[key] === "object") {
						objClone[key] = deepClone(obj[key]);
					} else {
						// 如果不是，简单复制
						objClone[key] = obj[key];
					}
				}
			}
		}
		return objClone;
	}


	/** 4. 滚动至可视区域 */
	const scrollIntoView = () => {
		const { rowHeight } = props;
		const { activeItem, scrollTop, wrap } = state;
		if ((activeItem.index + 1) * rowHeight + rowHeight / 2 > scrollTop + wrap.height) {
			state.canScroll = true;
			activeItem.y = activeItem.index * rowHeight;
			nextTick(() => {
				state.viewTop = scrollTop + rowHeight;
			})
		} else if (activeItem.index * rowHeight - rowHeight / 2 < scrollTop) {
			state.canScroll = true;
			activeItem.y = activeItem.index * rowHeight;
			nextTick(() => {
				state.viewTop = scrollTop - rowHeight;
			})
		}
	}

	/** 5. 是否显示 */
	const isVisible = (item) => {
		// 上下预加载一屏
		const scrollTop = state.scrollTop;
		const wrapH = state.wrap.height;
		if (item.y > scrollTop + wrapH * 2) {
			return false;
		} else if (scrollTop >= wrapH && item.y < scrollTop - wrapH * 2) {
			return false;
		}
		return true;
	}



	// -- events
	/** 1. 拖拽开始 */
	const onDragStart = ($event, item) => {
		console.log('[DragSortList]：onDragStart');
		// 1. 激活震动效果
		uni.vibrateShort({ type: "medium" });
		// 2. 计算偏移量
		const { clientX, clientY } = $event.changedTouches[0];
		state.offsetY = (clientY - state.wrap.top) % props.rowHeight;
		// 3. 更新数据
		state.activeId = item._id;
		state.activeItem = item;
		state.activeItem.animation = false; // 关闭当前拖拽元素的动画属性
		state.canScroll = false; // 开始触摸时禁止Scroll滚动
		state.scrollWithAnimation = true;

	}
	/** 2. 拖拽移动 */
	const onDragMove = ($event) => {
		// 1. 异常处理
		if (!state.activeItem) return;
		// 2. 获取触摸位置
		const { clientX, clientY } = $event.changedTouches[0];
		// 3. 计算移动的距离 → 因为只支持上下拖拽，所以只计算y值
		const y = clientY - state.wrap.top - state.offsetY + state.scrollTop;
		// 4. 边界值处理
		if (y <= 0 || y + props.rowHeight >= state.areaHeight) return;
		// 5. 更新位置
		state.activeItem.y = y;
		// 6. 检查元素和上下交互元素的位置
		for (const item of state.list) {
			if (item.index !== state.activeItem.index) {
				if (item.index > state.activeItem.index) {
					// 如果当前元素下标大于拖拽元素下标，则检查当前拖拽位置是否大于当前元素中心点
					if (y > item.index * props.rowHeight - props.rowHeight / 2) {
						[state.activeItem.index, item.index] = [item.index, state.activeItem.index]; // 对调位置
						item.y = item.index * props.rowHeight; // 更新位置
						uni.vibrateShort({ type: "medium" }); // 激活震动效果
						break;
					}
				} else {
					// 如果当前元素下标小于拖拽元素下标，则检查当前拖拽位置是否小于当前元素中心点
					if (y < item.index * props.rowHeight + props.rowHeight / 2) {
						[state.activeItem.index, item.index] = [item.index, state.activeItem.index]; // 对调位置
						item.y = item.index * props.rowHeight; // 更新位置
						uni.vibrateShort({ type: "medium" }); // 激活震动效果
						break;
					}
				}
			}
		}
		// 7. 检查当前位置是否处于可视区域
		scrollIntoView();

	}
	/** 3. 拖拽结束 */
	const onDragEnd = () => {
		// 1. 异常处理
		if (!state.activeItem) return;
		// 2. 处理拖拽结束时当前激活元素的位置
		state.activeItem.animation = true;
		state.activeItem.y = state.activeItem.index * props.rowHeight;
		// 3. 恢复默认数据
		state.activeId = '';
		state.activeItem = null;
		state.canScroll = true;
		state.scrollWithAnimation = false;
	}


	/** 4. 监听Scroll滚动 */
	const onScroll = ($event) => {
		state.scrollTop = $event.detail.scrollTop;
	}

	// -- watch 
	// -- 监听props.data值变化
	watch(() => props.data, (data) => { initList(data) }, { immediate: true, deep: true })

	defineExpose({
		getList
	})
</script>

<template>
	<scroll-view id="lg-drag-sort-list-wrap" :style="{height: props.wrapHeight}" :scroll-y="state.canScroll" :scroll-top="state.viewTop" :scroll-with-animation="state.scrollWithAnimation" :scroll-anchoring="true" @scroll="onScroll">
		<movable-area class="lg-drag-sort-list" :style="`height: ${props.rowHeight * props.data.length}px`">
			<block v-for="(item, index) in state.list" :key="index">
				<movable-view v-if="isVisible(item)" :x="0" :y="item.y" :style="`height:${props.rowHeight}px`" :class="['lg-drag-sort-list__movabel-item', { 'active': state.activeId === item._id }]" :animation="item.animation" :damping="40" direction="vertical" disabled @touchmove="onDragMove" @touchend="onDragEnd">
					<view class="lg-drag-sort-list__item">
						<view class="contents">
							<slot name="content" :item="item" :index="index"></slot>
						</view>
						<view class="drag" @longpress="onDragStart($event, item)">
							<image class="icon-drag" src="./images/icon_sort.png"></image>
						</view>
					</view>
				</movable-view>
			</block>
		</movable-area>
	</scroll-view>
</template>



<style lang="less" scoped>
	.lg-drag-sort-list {
		width: 100%;

		&__movabel-item {
			width: 100%;

			&.active {
				z-index: 10;
			}
		}

		&__item {
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 2rpx solid #EEEEEE;
			background: #FFFFFF;

			.contents {
				flex: 1;
				height: inherit;
			}

			.drag {
				width: 100rpx;
				height: 100rpx;
				flex-shrink: 0;
				display: flex;
				justify-content: center;
				align-items: center;

				image {
					width: 32rpx;
					height: 32rpx;
				}
			}

		}
	}
</style>
