# 使用指南

`DragSortList`

**注意事项 ‼️**

使用前请先设置禁止页面滚动/避免iOS皮筋效果影响体验

配置： **`pages.json`**  → `style.disableScroll:true`

**嵌套结构**

`scroll-view` → `movable-area` → `movable-view` → `view`

## Slots

支持插槽定义样式。如：

```vue
<DragSortList :data="state.list" ref="myRef">
	<template #content="{item, index}">
		<view class="row"></view>
	</template>
</DragSortList>
```

- `item`：列表项
- `index`：当前项下标

## Props

| #          | 数据类型 | 是否必填 | 描述                                                         |
| ---------- | -------- | -------- | ------------------------------------------------------------ |
| data       | Array    | Y        | 数据源，默认值： 空数组                                      |
| rowHeight  | Number   | N        | 列表项高度，像素单位，默认值：50<br />注意：插槽内容高度必须和<=该值且不要设置元素margin属性值 |
| wrapHeight | String   | N        | 容器高度，像素单位，默认值：600rpx                           |
| bordered   | Boolean  | N        | 是否设置边框，默认值：true                                   |

## APIs

- `nodeRef.value.getList()`：获取排序之后的集合

# 实现思路

## 锲子

参考链接：

- 「1」[Beck.代码片段.语雀.2021年06月02日 >>](https://www.yuque.com/u8016619/pfpge2/gncpvt?)
- 「2」[Beck.小程序实现的列表上下拖拽排序.微信开放社区.2020年11月27日 >>](https://developers.weixin.qq.com/community/develop/article/doc/0004025ef6856005195b1e5fb5bc13)

环境配置：

- Vue3.x - 组合式API

## 思路

1）所用标签

- \<movable-area>：可拖动区域，[查看文档 >>](https://uniapp.dcloud.net.cn/component/movable-area.html)

- \<movable-view> ：可移动的视图容器，[查看文档 >>](https://uniapp.dcloud.net.cn/component/movable-view.html)

- \<scroll-view>：可滚动视图区域，用于区域滚动，[查看文档 >>](https://uniapp.dcloud.net.cn/component/scroll-view.html)

  > **Tips：**
  >
  > - 使用官方支持的标签比自己实现的更加丝滑。
  > - 支持拖拽到上下边界，检查可视区域的位置并自动进行滚动

2）标签重点属性

- movable-view 想要移动就必须作为 movable-area 的直接子元素，且 movable-area 必须设置 width，height 属性。
- movable-view 的 x, y 属性决定了 movable-view 在 movable-area 所处的位置 

3）实现思路

- 列表该如何渲染❓
- 如何使用插槽支持调用者自定义布局 ❓
- 如何控制拖拽元素的跟随❓
- 如何使拖拽中的元素与相交互的元素进行位置调换 ❓
- 如何判断拖拽元素至上下边界滚动屏幕 ❓
- 如何使页面的滚动与拖拽时的滚动互不影响 ❓

## 具体实现

具体实现主要列出关键低吗，后文会贴出完整实现。

### 解决列表渲染问题

上面说到 movable-view 可以通过 x,y 决定它的位置, 且 movable-area 需要设置 widht，height 属性。

配置完这些属性 movable-view 就可以再 movable-area 愉快的拖拽玩耍了。

思路：

- 通过列表项的数量乘以显示列表项的高度得出最终可拖拽区域的总高度，赋值给 movable-area 
- 扩展列表项一些字段，便于后续操作，详见代码

```js
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
	console.log(state.list);
};

```

### 如何控制拖拽元素的跟随

要是通过监听 movable-view 的 touchstart touchmove touchend 三个事件完成拖拽动作的起始、移动、结束。

```js
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
}
```

### 如何使拖拽中的元素与相交互的元素进行位置调换

上述代码解决了当前拖拽元素的位置移动问题, 接下来就需要解决拖拽元素和上下元素交互的问题

```js
/** 2. 拖拽移动 */
const onDragMove = ($event) => {
	// 同上代码一致... 
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
}

```

### 如何判断拖拽元素至上下边界滚动屏幕

将 movable-area 包裹在 scroll-view 标签中, 通过控制 scroll-top 的值来进行滚动

思路: 判断当前拖拽元素的位置信息与当前屏幕可视区域进行比较

```js
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
```

### 如何使页面的滚动与拖拽时的滚动互不影响

事实上我是通过一种取巧的方式, scroll-veiw 有一个 scroll-y 属性可以控制滚动方向

思路：

- 不进行滚动的时候将 scroll-y 置为 true , 使用默认的滚动效果
- 当进入拖拽排序状态时则将 scroll-y 置为 false, 滚动通过拖拽代码比较计算滚动位置﻿﻿

# 完整代码

```vue
<script setup>

	// -- imports
	import { onMounted, reactive, computed, watch, getCurrentInstance, nextTick } from 'vue';

	// -- props
	const props = defineProps({
		/** 数据源 */
		data: { type: Array, default: () => [] },
		/** 列表项高度，像素单位，注意：插槽内容高度必须和<=该值且不要设置元素margin属性值 */
		rowHeight: { type: Number, default: 60 },
		/** 容器高度 */
		wrapHeight: { type: Number, default: 300 },
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
		console.log(state.list);
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
		return;
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
		// 7. 检查元素和上下交互元素的位置
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
		// 8. 检查当前位置是否处于可视区域
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
	<scroll-view id="lg-drag-sort-list-wrap" style="height: 300px;" :scroll-y="state.canScroll" :scroll-top="state.viewTop" :scroll-with-animation="state.scrollWithAnimation" :scroll-anchoring="true" @scroll="onScroll">
		<movable-area class="lg-drag-sort-list" :style="`height: ${props.rowHeight * props.data.length}px`">
			<block v-for="(item, index) in state.list" :key="index">
				<movable-view v-if="isVisible(item)" :x="0" :y="item.y" :style="`height:${props.rowHeight}px`" :class="['lg-drag-sort-list__movabel-item', { 'active': state.activeId === item._id }]" :animation="item.animation" :damping="40" direction="vertical" disabled @touchmove="onDragMove" @touchend="onDragEnd">
					<view class="lg-drag-sort-list__item">
						<view class="contents">
							<slot name="content" :item="item" :index="index"></slot>
						</view>
						<view class="drag" @longpress="onDragStart($event, item)">
							<image class="icon-drag" src="@/static/images/icon_sort.png"></image>
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
```





