# 概述
为了提高开发效率，减少在搭建uni-app开发小程序的配置时间，特写此模板。

该模板基于 Vue3.x 实现，使用组合式API方式~

使用流程：

- 下载项目模板
- 执行 `npm install` 安装依赖
- 在HbuilderX中引入项目编译执行即可
> Tips：别忘了更新你的APPID哟~

# 目录结构
```
uni-template
.
├── api
│   ├── index.js              # 整合接口请求，统一导出   
│   └── user.js               # 根据功能划分的独立请求，
├── components                # 全局组件
│   ├── @lgs                  # 自己封装的常用组件
│   └── ....                  # 项目内通用组件
├── constants                 # 常量定义
├── pages                     # 页面组件（下面只列举主要文件）
│   ├── auth                  # 授权页
│   ├── web-page              # webview容器页面
│   └── ....
├── static                    # 静态资源（字体、图标）
├── uni_modules               # 继承的官方UI组件库
├── utils
│   ├── index.js              # 工具函数
│   └── request.js            # 请求封装
└── ....

```