<!-- 处理iOS兼容性问题： -->
<!-- 模拟器/安卓机型无论是富文本还是普通文本，均兼容「-webkit-line-clamp」属性 -->
<!-- 但是在iOS真机模式下，无法正常显示，因此iOS需做特殊处理 -->
<!-- 即判断设备类型为iOS机型时，设置容器最小高度+手动添加“···” -->
<!-- 最小高度 = lineHeight * maxLine -->


<script setup>
	import { getCurrentInstance, nextTick, onMounted, reactive, watch } from "vue";
	// -- props 
	const props = defineProps({
		/** 展示文本类型，可选值：richText / text，默认为text */
		type: { type: String, default: "text" },
		/** 显示行数，超过指定行数则触发「展开/收起」效果 */
		maxLine: { type: Number, default: 4 },
		/** 行高，单位rpx */
		lineHeight: { type: Number, default: 40 },
		/** 展示文本内容 */
		content: String,
		/** 收起时显示的文本*/
		onFoldText: { type: String, default: "展开" },
		/** 展开时显示的文本*/
		unFoldText: { type: String, default: "收起" },
	});

	// -- state 
	const state = reactive({
		// 标识是否触发「展开/收起」效果
		isTrigger: false,
		// 标识是否收起
		ellipsis: true,
		// 标识是否展示「展开/收起」按钮
		showActionButton: false,
		// 标识当前组件实例
		instance: null,
		// 兼容性处理(iOS)：内容高度
		minHeight: 0,
		// 兼容性处理(iOS)：标识用户设备类型是否为iOS
		isiOS: true
	});

	// -- life circles 
	onMounted(() => {
		// 1. 获取组件实例
		state.instance = getCurrentInstance();
		// 2. 判断设备类型是否是iOS
		state.isiOS = /ios/i.test(uni.getSystemInfoSync().platform);
		// 3. 检查
		check();
	});

	// -- watchs 
	watch(() => props.content, (v) => {
		nextTick(() => {
			check();
		});
	});

	// -- methods 
	const rpx2px = (rpxInteger) => {
		return uni.getSystemInfoSync().windowWidth / 750 * rpxInteger;
	}
	const check = () => {
		const query = uni.createSelectorQuery().in(state.instance);
		query.selectAll(".showArea, .hideArea").boundingClientRect(rect => {
			// 1. 处理数据更新时，恢复默认状态
			state.isTrigger = false;
			state.showActionButton = false;
			state.ellipsis = true;
			// 2. 获取显示区域（可能会被截取的可见文本）/隐藏区域（完整文本）高度以及触发「展开/收起」效果的阈值高度（thresholdHeight）
			const showAreaHeight = rect[0].height;
			const hideAreaHeight = rect[1].height;
			const thresholdHeight = rpx2px(props.lineHeight) * props.maxLine;
			console.log(`「CollapseText」：showAreaHeight=${showAreaHeight}，hideAreaHeight=${hideAreaHeight}，thresholdHeight=${thresholdHeight}`)
			// 3. 判断是否达到触发「展开/收起」效果阈值
			if (showAreaHeight > thresholdHeight) {
				// -- 标识「展开/收起」效果已触发
				state.isTrigger = true;
				// -- 显示「展开/收起」按钮
				state.showActionButton = true;
			}
			// 4. 兼容iOS：计算最小高度
			if (state.isiOS) {
				state.minHeight = Math.min(showAreaHeight, hideAreaHeight, thresholdHeight);
			}
		}).exec();
	}
	// -- events 
	const onToggle = () => {
		state.ellipsis = !state.ellipsis;
	}
</script>
<template>
	<view class="lg-collapse-text" :style="{'--rows': maxLine, '--line-height': lineHeight + 'rpx'}">
		<!-- 富文本 -->
		<template v-if="type === 'richText'">
			<view class="__content showArea richText" :class="{ellipsis: state.ellipsis && state.isTrigger}" :style="{minHeight: state.minHeight + 'px'}" v-html="content" />
			<view class="__content hideArea richText" v-html="content" />
			<view class="__ios-ellipsis" v-if="state.isiOS && state.ellipsis && state.isTrigger">···</view>
		</template>
		<!-- 普通文本 -->
		<template v-else>
			<view class="__content showArea text" :class="{ellipsis: state.ellipsis && state.isTrigger}">
				{{content}}
			</view>
			<view class="__content hideArea text">
				{{content}}
			</view>
		</template>
		<!-- 展开收起 -->
		<view class="__action-btn" v-if="state.showActionButton">
			<view @click="onToggle">
				<text>{{ state.ellipsis ? onFoldText : unFoldText }}</text>
				<image :class="{'un-ellipsis': !state.ellipsis}" src="./images/icon_collapse.png"></image>
			</view>
		</view>
	</view>
</template>


<style lang="less" scoped>
	.lg-collapse-text {
		width: 100%;
		overflow: hidden;
		position: relative;

		.__ios-ellipsis {
			color: #19191960;
			opacity: .75;
		}

		.__content {
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 0;
			overflow: hidden;

			font-size: 28rpx;
			line-height: var(--line-height);
			color: #19191960;
			word-break: break-all;

			&.text {
				white-space: pre-line;
			}

			&.ellipsis {
				-webkit-line-clamp: var(--rows);
				opacity: .75
			}

			&.hideArea {
				position: absolute;
				width: 100%;
				top: 0;
				left: 0;
				z-index: -1;
			}
		}



		.__action-btn {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin-top: 20rpx;
			font-size: 30rpx;
			color: #A594FF;


			image {
				width: 32rpx;
				height: 32rpx;
				margin-left: 6rpx;

				&.un-ellipsis {
					transform: rotateZ(180deg);
				}
			}
		}

	}
</style>