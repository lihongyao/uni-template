# Intro

自定义录音栏

# Properties

| 属性名    | 类型    | 默认值       | 描述                                                         |
| --------- | ------- | ------------ | ------------------------------------------------------------ |
| id        | String  | K+Date.now() | 组件ID值                                                     |
| userTips  | String  | N            | 新手指引                                                     |
| guide     | String  | N            | 录音引导提示信息                                             |
| intercept | Boolean | N            | 是否启用拦截器拦截录音触发<br />使用场景：当使用插槽定义「按住说话」按钮时，需求大概率会自定义按钮的行为，启用拦截器，即可拦截触发录音 |
| collapse  | Boolean | false        | 抽屉状态                                                     |
| scopeTips | Object  | N            | 授权提示信息                                                 |

# Events

| 事件名         | 参数类型 | 描述                                                         |
| -------------- | -------- | ------------------------------------------------------------ |
| @start         | Function | 开始录音<br />1.需在事件函数中调用 `recorder.start({ ... })` 触发录音<br />2.为避免录音时出现重音，可在事件函数中停止音频播放<br />3.必须调用 `next` 回调函数触发后续逻辑<br />4.触发录音时，添加 [震动效果](https://uniapp.dcloud.net.cn/api/system/vibrate.html#vibrateshort) （非必须）提升用户体验 |
| @stop          | Object   | 停止录音<br />Object.type: CANCEL（取消） \| SEND（发送）<br />Object.next：Function<br />1.需在时间函数中调用 `recorder.stop()` 停止录音<br />2.必须调用 `next` 回调函数触发后续逻辑 |
| @closeUserTips | N        | 关闭引导提示时触发                                           |

# Slots

| 插槽     | 描述         |
| -------- | ------------ |
| #default | 按钮插槽     |
| #left    | 按钮左侧插槽 |
| #right   | 按钮右侧插槽 |

