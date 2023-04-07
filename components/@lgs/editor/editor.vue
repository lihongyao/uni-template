<!-- 字体颜色插件：https://ext.dcloud.net.cn/plugin?id=412 -->
<!-- 使用 <v-editor @ready="" toolbarKeys="" /> -->
<!-- 取值 -->
<script setup>
	// -- imports 
	import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
	import source from './toolbar.js';
	// -- props 
	const props = defineProps({
		/** ID */
		id: { type: String, default: 'editor' },
		/** 默认值 */
		defaultValue: { type: String, default: '' },
		/** 编辑区域高度 */
		height: { type: Number, default: 300 },
		/** 占位符 */
		placeholder: { type: String, default: "点击输入详细描述" },
		/** 工具栏 */
		toolbarKeys: {
			type: Array,
			default: () => ([
				"bold", "italic", "underline", "strike", "alignLeft", "alignCenter", "alignRight", "alignJustify", "lineHeight",
				"letterSpacing", "removeFormat", "fontSize", "color", "backgroundColor", "sub", "sup",
				"ol", "ul", "todos", "date", "undo", "redo", 'indent', "outdent", "divider",
				"insertImage", "clear"
			])
		}
	})
	const emits = defineEmits(['insertImage', "ready", "change"])
	// -- state 
	const state = reactive({
		editor: null,
		formats: {}
	})
	// -- life circles
	onMounted(() => {
		const instance = getCurrentInstance();
		uni.createSelectorQuery().in(instance).select(`#${props.id}`).context(res => {
			// 1. 获取编辑器上下文
			state.editor = res.context;
			// 2. 触发ready事件
			emits("ready", res.context);
			// 3. 判断是否设置默认值
			if (props.defaultValue) {
				state.editor.setContents({
					html: props.defaultValue
				});
				// -- 获取字符长度，触发change事件
				state.editor.getContents().then(({ html, text }) => {
					emits("change", { html, text: text.trim() });
				});
			}
		}).exec();
	})
	// -- methods 
	/** 1. 格式处理 */
	const format = (v) => v > 9 ? v : `0${v}`;
	/** 2. 插入日期 */
	const insertDate = () => {
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const dateString = `${year}/${format(month.toString())}/${format(day.toString())}`
		state.editor.insertText({ text: dateString });
	}
	/** 3. 插入图片 */
	const insertImage = () => {
		emits("insertImage", (url) => {
			state.editor.insertImage({
				src: url,
				alt: "IMAGE_ALT"
			})
		});
	}
	/** 3. 清空输入内容 */
	const clear = () => {
		uni.showModal({
			title: "清空编辑器",
			content: "确定清空编辑器全部内容？",
			cancelText: "点错了",
			success: (res) => {
				if (res.confirm) {
					state.editor.clear();
				}
			}
		})
	}
	/** 4. 获取内容 */
	const getContents = async () => {
		const { html, text } = await state.editor.getContents();
		return { html, text: text.trim() }
	}
	/** 5. 判断是否处于激活状态 */
	const activeCls = (k, v) => {
		// -- 排除无需展示激活的keys
		if (['indent'].includes(k)) {
			return;
		};
		// -- 设置激活样式
		if (v) {
			return state.formats[k] == v ? 'active' : '';
		}
		return !!state.formats[k] ? 'active' : '';
	};
	// -- events 
	/** 1. 点击工具栏 */
	const onTap = ($event) => {
		const { name, value } = $event.target.dataset;
		console.log(`${name} —— ${value}`)
		switch (name) {
			case "removeFormat":
				state.editor.removeFormat();
				break;
			case 'undo':
				state.editor.undo();
				break;
			case 'redo':
				state.editor.redo();
				break;
			case 'divider':
				state.editor.insertDivider();
				break;
			case 'insertImage':
				insertImage();
				break;
			case 'date':
				insertDate();
				break;
			case 'clear':
				clear();
				break;
			default:
				state.editor.format(name, value ?? '');
		}
	}
	/** 2. 插入图片 */
	const onInsertImage = async () => {
		console.log("插入图片");
		console.log(await state.editor.getContents());
	}
	/** 3. 状态变更 */
	const onStatusChange = ($event) => {
		state.formats = $event.detail;
		console.log(state.formats);
	}
	/** 4. 监听输入内容，触发change事件 */
	const onInput = ($event) => {
		const { html, text } = $event.detail;
		emits("change", { html, text: text.trim() });
	}

	// -- exposes 
	defineExpose({
		getContents
	});
</script>

<template>
	<view class="lg-editor">
		<!-- 工具栏 Start -->
		<view class="toolbar">
			<block v-for="(k, index) in toolbarKeys" :key="index">
				<template v-if="source[k]">
					<i :class="`${source[k].iconfont} ${activeCls(source[k].name, source[k].value)}`" :data-name="source[k].name" :data-value="source[k].value" @click="onTap" />
				</template>
			</block>
		</view>
		<!-- 工具栏 End -->

		<!-- 编辑器 Start -->
		<view class="editor-wrap">
			<editor :id="id" :style="`height: ${height}rpx; min-height: 100rpx;`" :placeholder="placeholder" show-img-size show-img-toolbar show-img-resize @statuschange="onStatusChange" @input="onInput" />
		</view>
		<!-- 编辑器 End -->

	</view>
</template>


<style lang="less" scoped>
	@import url('./iconfont.css');

	/* 修改富文本编辑器的placeholder的默认颜色：字体 */
	/* 注意：此段代码需拷贝至App.vue才会生效 */
	.ql-container /deep/ .ql-blank::before {
		/* 此处设置 placeholder 样式 */
		color: #C1CBE2;
		font-style: normal;
	}

	.lg-editor {
		flex: 1;
		width: 100%;
		box-sizing: border-box;

		.toolbar {
			width: 100%;
			padding: 20rpx 0;
			border-bottom: 2rpx solid #EEEEEE;
			display: flex;
			flex-wrap: wrap;

			.iconfont {
				font-size: 40rpx;
				line-height: 50rpx;
				margin-right: 30rpx;

				&.active {
					color: #497749;
				}
			}
		}

		.editor-wrap {
			padding: 20rpx 0;
		}
	}
</style>