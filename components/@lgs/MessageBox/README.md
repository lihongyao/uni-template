# Intro

消息框

# Properties

| 属性名           | 类型         | 默认值 | 描述                                                         |
| ---------------- | ------------ | ------ | ------------------------------------------------------------ |
| message          | String       | N      | 消息内容，仅支持音频/文本/图片格式（必传）                   |
| avatar           | String       | N      | 用户头像（必传）                                             |
| meta             | Object       | N      | 源数据，事件触发时作为事件参数回传给调用者（必传）           |
| align            | String       | R      | 消息框位置：L（左侧-好友）/R（右侧-自己）                    |
| readStatus       | Number       | 1      | 音频时设置：阅读状态，0-未读，1-已读                         |
| isPlaying        | Boolean      | false  | 音频时设置：播放状态<br />标识音频消息当前是否处于播放中（用于控制音频消息动效） |
| duration         | Number       | 0      | 音频时设置：持续时间，单位秒                                 |
| maxDuration      | Number       | 60     | 音频时设置：最长时间，单位秒，用于动态计算语音消息框的宽度   |
| aniType          | String       | horn   | 音频时设置： 音频播放状态动画类型<br />可选值：line-线条 horn-喇叭 |
| colorOptions     | ColorOptions | N      | 颜色配置项                                                   |
| showLoading      | Boolean      | N      | 是否展示Loading动画（文本消息时有效）                        |
| showIconComplete | Boolean      | N      | 是否展示完成图标（文本消息时有效）                           |
| showIconText     | Boolean      | N      | 是否展示文本图标（文本消息时有效）                           |
| showSkip         | Boolean      | N      | 展示跳过按钮                                                 |
| showTools        | Boolean      | N      | 是否启用工具栏（只在align=R时有效）                          |
| progress         | Number       | -1     | 进度展示，当该值>=0时，触发进度效果                          |

## ColorOptions

| 属性名       | 类型   | 默认值  | 描述                            |
| ------------ | ------ | ------- | ------------------------------- |
| primaryColor | String | #A594FF | 主色，控制跳过/进度等内容的颜色 |
| LBgColor     | String | #FFFFFF | 聊天框(左侧)颜色                |
| RBgColor     | String | #A594FF | 聊天框(右侧)颜色                |
| LTextColor   | String | #1A1A1A | 文本颜色(左侧)                  |
| RTextColor   | String | #FFFFFF | 文本颜色(右侧)                  |
| LAniBgColor  | String | #A594FF | 语音动效元素背景颜色（左侧）    |
| RAniBgColor  | String | #FFFFFF | 语音动效元素背景颜色（右侧）    |



# Events

| 事件名     | 参数类型 | 描述                                                         |
| ---------- | -------- | ------------------------------------------------------------ |
| @play      | Object   | 音频播放（调用者需自行通过Audio实例对象播放）                |
| @stop      | Object   | 音频停止（调用者需自行通过Audio实例对象停止）                |
| @undo      | N        | 点击撤销时触发（返回源数据）                                 |
| @skip      | N        | 点击跳过时触发                                               |
| @openTools | String   | 打开工具栏时触发<br />调用者需保存回调函数（closeTools）<br />并在点击页面时调用回调函数关闭工具栏 |

# Slots

| 插槽    | 描述                                  |
| ------- | ------------------------------------- |
| #suffix | 后缀（文本消息时有效）                |
| #bottom | 消息框底部插槽（语音/文本消息时有效） |
| #extra  | 消息框底部插槽                        |