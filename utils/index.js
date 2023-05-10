// -- 引入常量配置
import {
	APP_OSS_HOST,
	APP_KEY_LOGIN,
	APP_KEY_TOKEN,
} from '@/constants/index.js';
// -- 友盟统计
import uma from 'umtrack-wx';
// -- 加密
import crypto from 'crypto-js';
import { Base64 } from 'js-base64';

export default class Utils {
	/**
	 * 预览：长按识别关注微信公众号
	 */
	static subscribeOfficialAccounts() {
		uni.previewImage({
			urls: [
				'https://qn.d-dou.com/dcep/dbean/4278855d38954d89a5095b9f6e637071ri1m0p.png',
			],
			indicator: 'none',
		});
	}

	/**
	 *  预览：长按识别添加企业微信
	 */
	static joinEnterpriseWechat() {
		uni.previewImage({
			urls: [
				'https://qn.d-dou.com/dcep/dbean/4068932c9f9f4b4bafabe34c43f6fb833zlvce.png',
			],
			indicator: 'none',
		});
	}

	/**
	 * 播放音频
	 * 测试音频地址：https://qn.d-dou.com/dpoint/media/aigei_com.mp3
	 * @param {string} src 音频地址
	 * @param {boolean} loop 是否循環播放
	 * @return  ctx上下文
	 */
	static playAudio(src, loop = false) {
		const ctx = uni.createInnerAudioContext();
		ctx.src = src;
		ctx.autoplay = true;
		ctx.loop = loop;
		ctx.onEnded(() => {
			ctx.offError();
			ctx.offEnded();
			if (!loop) {
				ctx.destroy();
			}
		});
		ctx.onError((res) => {
			console.log(res.errMsg);
			console.log(res.errCode);
		});
		return ctx;
	}

	/**
	 * 轻提示
	 * @param {Object} title
	 */
	static toast(title) {
		uni.showToast({
			title,
			icon: 'none',
		});
	}

	/**
	 * 加载动画
	 * @param {Object} title
	 */
	static loading(title) {
		uni.showLoading({
			title,
			duration: 60 * 1000,
			mask: true,
		});
	}
	/**
	 * 隐藏加载动画
	 */
	static hideLoading() {
		uni.hideLoading();
	}

	/**
	 * 页面入栈
	 * @param {Object} url
	 */
	static push(url) {
		uni.navigateTo({
			url,
		});
	}

	/**
	 * 页面重载
	 * @param {Object} url
	 */
	static reLaunch(url) {
		uni.reLaunch({
			url,
		});
	}

	/**
	 * 页面出栈
	 */
	static pop(delta = 1) {
		uni.navigateBack({
			delta,
		});
	}

	/**
	 * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页
	 * @param {Object} url
	 */
	static switchTab(url) {
		uni.switchTab({
			url,
		});
	}

	/**
	 * 微信登录
	 * @param {Object} loginFn
	 * @param {Object} shareCode
	 */
	static login(loginFn, shareCode) {
		return new Promise((resolve, reject) => {
			uni.login({
				provider: 'weixin',
				scopes: 'auth_base',
				withCredentials: true,
				success({ code }) {
					console.log('登录授权code：', code);
					loginFn &&
						loginFn({ code, shareCode }).then((resp) => {
							const { isBindPhone, token } = resp.data;
							uni.setStorageSync(APP_KEY_TOKEN, token);
							uni.setStorageSync(APP_KEY_LOGIN, isBindPhone);
							resolve(null);
						});
				},
				fail(err) {
					console.log('wx.login error：', err);
					reject(err);
				},
			});
		});
	}

	/**
	 * 检查是否绑定手机号
	 */
	static checkLogin() {
		return new Promise((resolve, reject) => {
			if (uni.getStorageSync(APP_KEY_LOGIN)) {
				resolve();
			} else {
				uni.navigateTo({
					url: '/pages/auth/login',
				});
			}
		});
	}

	/**
	 * 统计上报
	 */
	static trackEs(event_name, data = {}) {
		// #ifdef MP-WEIXIN
		wx.reportAnalytics(event_name, data);
		// #endif
	}

	/**
	 * 订阅授权
	 */
	static checkSubscriptions() {
		uni.getSetting({
			withSubscriptions: true,
			success(res) {
				console.log(res);
				uni.showModal({
					title: '授权获取你的订阅',
					content: '用于定位当前位置和商家的距离',
					success(r) {
						if (r.confirm) {
							uni.openSetting({
								withSubscriptions: true,
								success(res) {
									console.log(res);
								},
							});
						}
					},
				});
			},
		});
	}

	/**
	 * 文件上传 - 服务器上传
	 * @param {Object} options
	 * @param {String} options.uri 上传URI // → `${APP_HOST}/mall-admin/aliyun/oss/upload`
	 * @param {String} options.filePath 文件路径
	 * @param {Object} options.formData 其他数据
	 * @param {Function} options.success 上传成功回调
	 * @param {Function} options.fail 上传失败回调
	 * @param {Function} options.onProgressUpdate 进度更新
	 */
	static uploadFileOnServer(options) {
		// 1. 解构参数
		const { uri, filePath, formData, success, fail, onProgressUpdate } = options;
		// 2. 获取上传Token
		const token = uni.getStorageSync(APP_KEY_TOKEN);
		// 3. 创建上传任务
		const uploadTask = uni.uploadFile({
			/** 替换成自己服务器的请求地址 */
			url: uri,
			filePath,
			name: 'file',
			formData,
			timeout: 60 * 1000,
			header: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
			success: (res) => {
				if ([200, 204].includes(res.statusCode)) {
					const { code, data, message } = JSON.parse(res.data);
					if (code === 200) {
						success && success(data)
					} else {
						fail && fail(new Error(message));
					}
				}
			},
			fail: (error) => {
				fail && fail(error);
			},
		});
		// 4. 监听上传进度
		uploadTask.onProgressUpdate((res) => {
			onProgressUpdate && onProgressUpdate(res.progress)
		});
		return uploadTask;
	}

	/**
	 * 文件上传 - OSS直传
	 * @param {Object} uploadFile 配置信息
	 */
	static uploadFile({
		key,
		filePath,
		accessKeySecret,
		accessKeyId,
		securityToken,
	}) {
		return new Promise((resolve, reject) => {
			// 1. 客户端获取签名
			// -- 构造policy
			const date = new Date();
			date.setHours(date.getHours() + 1);
			const policyText = {
				expiration: date.toISOString(),
				conditions: [
					['content-length-range', 0, 1024 * 1024 * 1024]
				],
			};
			const policy = Base64.encode(JSON.stringify(policyText));
			// -- 获取签名
			const signature = crypto.enc.Base64.stringify(
				crypto.HmacSHA1(policy, accessKeySecret)
			);
			// 2.构造formData
			const formData = {
				key,
				policy,
				signature,
				OSSAccessKeyId: accessKeyId,
				'x-oss-security-token': securityToken, // 使用STS签名时必传。
			};
			// 3. 执行上传
			uni.uploadFile({
				url: APP_OSS_HOST,
				filePath,
				name: 'file',
				formData,
				timeout: 60 * 1000,
				header: {
					'Content-Type': 'application/json',
				},
				success: (res) => {
					if (res.statusCode === 204) {
						resolve(`${APP_OSS_HOST}/${key}`);
					}
				},
				fail: (err) => {
					reject(err);
				},
			});
		});
	}

	/**
	 * 权限校验
	 * @param {Object} scope 需要校验权限的 scope，详见 → https://uniapp.dcloud.net.cn/api/other/authorize.html#scope-%E5%88%97%E8%A1%A8
	 * @param {Object} options 配置项
	 * @param {String} options.title  提示框标题
	 * @param {String} options.content 提示框内容
	 */
	static checkAuthorizeWithScope(scope, options = {}) {
		const { title = '授权申请', content = `请求授权：${scope}` } = options;
		return new Promise((resolve) => {
			uni.getSetting({
				success: (res) => {
					if (res.authSetting.hasOwnProperty(scope)) {
						if (res.authSetting[scope]) {
							resolve();
						} else {
							uni.showModal({
								title,
								content,
								success(res) {
									if (res.confirm) {
										uni.openSetting({
											withSubscriptions: true,
											success(res) {
												if (res.authSetting[scope]) {
													resolve();
												} else {
													console.log(
														'「checkAuthorizeWithScope」：用户拒绝授权'
													);
												}
											},
											fail: (error) => {
												console.log('「checkAuthorizeWithScope」：', error);
											},
										});
									}
								},
							});
						}
					} else {
						// -- 初次授权
						console.log(scope);
						uni.authorize({
							scope,
							success: () => {
								resolve();
							},
							fail: (error) => {
								console.log('「checkAuthorizeWithScope」：', error);
							},
						});
					}
				},
				fail: (error) => {
					console.log('「checkAuthorizeWithScope」：', error);
				},
			});
		});
	}

	/**
	 * 文件预览/下载
	 * 支持PDF/DOC格式
	 * @param {Object} uri
	 */
	static downloadFile(uri) {
		return new Promise((resolve) => {
			Utils.loading('处理中...');
			// 1. 下载文件
			uni.downloadFile({
				url: uri,
				success: (res) => {
					const filePath = res.tempFilePath;
					// 2. 预览文件
					uni.openDocument({
						filePath,
						showMenu: true,
						success: () => {
							Utils.hideLoading();
							resolve();
						},
						fail: (error) => {
							console.log(error);
							Utils.hideLoading();
							Utils.toast('文档打开失败');
						},
					});
				},
				fail: (error) => {
					console.log(error);
					Utils.hideLoading();
					Utils.toast('文档下载失败');
				},
			});
		});
	}

	/**
	 * 保存图片至相册
	 * @param {Object} uri
	 */
	static downloadImage(uri) {
		return new Promise((resolve) => {
			// 1. 检查权限
			Utils.checkAuthorizeWithScope('scope.writePhotosAlbum', {
				content: '保存图片至相册',
			}).then(() => {
				// 2. 下载文件
				Utils.loading('处理中...');
				uni.downloadFile({
					url: uri,
					success: (res) => {
						const filePath = res.tempFilePath;
						// 3. 保存图片
						uni.saveImageToPhotosAlbum({
							filePath,
							success: () => {
								Utils.hideLoading();
								resolve();
							},
							fail: (error) => {
								console.log(error);
								Utils.hideLoading();
								Utils.toast('图片保存失败');
							},
						});
						console.log(filePath);
					},
					fail: (error) => {
						console.log(error);
						Utils.hideLoading();
						Utils.toast('图片下载失败');
					},
				});
			});
		});
	}

	/**
	 * 打开地图选址
	 * 注意：使用chooseLocation需在mainfest.json文件（切换至源码视图）中添加如下配置
	 * "mp-weixin": {
	 *   "permission": { "scope.userLocation": { "desc": "用于定位选择位置" }},
	 *   "requiredPrivateInfos": [ "getLocation", "chooseLocation"]
	 * }
	 */
	static chooseLocation() {
		return new Promise((resolve) => {
			Utils.checkAuthorizeWithScope('scope.userLocation', {
				content: '需要获取你的地理位置，用于定位选择位置',
			}).then(() => {
				uni.chooseLocation({
					success: (resp) => {
						const { errMsg, ...fileds } = resp;
						if (/ok/.test(errMsg) && fileds.name) {
							resolve(fileds);
						} else {
							Utils.toast('请先选择地址再点击确定');
						}
					},
				});
			});
		});
	}

	/**
	 * 获取用户定位信息
	 * 注意：使用chooseLocation需在mainfest.json文件（切换至源码视图）中添加如下配置
	 * "mp-weixin": {
	 *   "permission": { "scope.userLocation": { "desc": "用于定位选择位置" }},
	 *   "requiredPrivateInfos": [ "getLocation", "chooseLocation"]
	 * }
	 */
	static getLocation() {
		return new Promise((resolve) => {
			Utils.checkAuthorizeWithScope('scope.userLocation', {
				content: '需要获取你的地理位置，用于定位选择位置',
			}).then(() => {
				uni.getLocation({
					success({ errMsg, latitude, longitude }) {
						if (/ok/.test(errMsg)) {
							resolve({ lat: latitude, lng: longitude });
						}
					},
				});
			});
		});
	}

	/**
	 * 友盟+统计
	 * @param {String} eventId 事件ID需在官网申请，长度在128个字符内
	 * @param {Object} params 附加参数
	 */
	static umaTrackEvent(eventId, params) {
		console.log('-------------------------------------------------');
		console.log('友盟统计');
		console.log('eventId：', eventId);
		console.log('params：', JSON.stringify(params));
		console.log('-------------------------------------------------');
		uma.trackEvent(eventId, params);
	}

	/**
	 * 拾取头像
	 * 1. 从本地相册拾取/摄像头拍照
	 * 2. 支持裁剪 → 1:1
	 */
	static chooseAvatar() {
		return new Promise((resolve, reject) => {
			// 1. 选择图片
			uni.chooseMedia({
				count: 1,
				mediaType: ['image'],
				sourceType: ['album', 'camera'],
				camera: 'front',
				success({ errMsg, tempFiles }) {
					if (/ok/.test(errMsg)) {
						const { tempFilePath } = tempFiles[0];
						// 2. 裁剪图片
						uni.cropImage({
							src: tempFilePath,
							cropScale: '1:1',
							success({ errMsg, tempFilePath }) {
								if (/ok/.test(errMsg)) {
									resolve(tempFilePath);
								} else {
									console.log(errMsg);
								}
							},
							fail(error) {
								console.log(error);
							},
						});
					} else {
						console.log(errMsg);
					}
				},
				fail(error) {
					console.log(error);
				},
			});
		});
	}
	/**
	 * 伪进度条：渲染进度
	 * @param {Object} options 可选项
	 * @param {String} options.id  用于构造存储键（当有多个伪进度条时可区分）
	 * @param {Function} options.pending  进度变化时触发 (progress) => void
	 * @param {Function} options.ended  进度停止更新时触发 (progress) => void
	 * @param {Function} options.complete 加载完成时触发 () => void
	 * 
	 * @returns { clearTimers: Function,  complete: Function }
	 * 1. clearTimers：清除定时器，使用者在页面或组件销毁时调用该函数
	 * 2. done：当实际加载完成时调用该函数可触发从当前值-过渡到100%
	 * 
	 * 📒 请求持续时间和进度条之间渲染公式（区间单位-秒）：
	 * [1-20] ：百分比从 0%匀速(10秒内)增长至40%，请求成功，匀速加载到100%。
	 * [20-40]：百分比从40%匀速(10秒内)增长至60%，请求成功，匀速加载到100%。
	 * [40-60]：百分比从60%匀速(10秒内)增长至80%，请求成功，匀速加载到100%。
	 * [60-90]：百分比从80%匀速(10秒内)增长至95%，请求成功，匀速加载到100%。
	 * [90, ] ：提示文案：抱歉，可能需要等待一会儿
	 *  
	 * 📌 代码调用示例
			const { clearTimers, done } = Utils.renderProgress({
				pending: (progress) => {
					console.log('当前进度：', progress);
				},
				ended: (progress) => {
					console.log('当前进度：', progress);
					console.log("定时器伪加载结束，更新UI，提示用户：抱歉，可能需要等待一会儿");
				},
				complete: () => {
					console.log("实际加载完成");
				}
			});
			setTimeout(() => {
				console.log("手动触发请求完成");
				done();
			}, 30 * 1000);
	 *
	 */
	static renderProgress = ({ id = '', pending, ended, complete }) => {
		// 1. 定义变量，记录相关值
		let localTimes = Date.now(); // 当前时间戳
		let timerOuter = null; // 区间定时器
		let timerInner = null; // 进度定时器
		let timeStamp = 0; // 记录持续时间，用于计算区间
		let progress = 0; // 当前进度
		let map = {}; // 标识某一区间是否已经触发进度更新定时器（每个区间只触发1次）

		// 2. 由于是伪进度，当用户切换页面或退出程序再次进入当前页面时应恢复进度展示
		// - 获取存储键
		const k = `__kPROGRESS_${id}`;
		// - 读取本地数据
		const locals = uni.getStorageSync(k);
		// - 判断本地是否存在数据
		if (locals) {
			const { t, v } = JSON.parse(locals); // 解构 t-时间戳，v-当前进度
			localTimes = +t; // 更新当前时间戳
			progress = +v; // 更新进度
			timeStamp = parseInt((Date.now() - t) / 1000); // 计算当前持续时间
		}

		console.log(`持续时间：${timeStamp}，当前进度值：${progress}`);
		// 3. 启用外部定时器计算区间
		timerOuter = setInterval(() => {
			switch (true) {
				case timeStamp >= 90:
					// [90, ]
					console.log('触发区间：[90, )');
					clearInterval(timerOuter);
					timerOuter = null;
					if (progress < 95) {
						progress = 95;
					}
					ended && ended(progress);
					break;
				case timeStamp >= 60:
					// [60, 90)
					if (!map._60To90) {
						console.log('触发区间：[60, 90)');
						map._60To90 = true;
						if (progress < 80) {
							progress = 80;
						}
						__startTimerInner(1200, 95);
					}
					break;
				case timeStamp >= 40:
					// [40, 60)
					if (!map._40To60) {
						console.log('触发区间：[40, 60)');
						map._40To60 = true;
						if (progress < 60) {
							progress = 60;
						}
						__startTimerInner(800, 80);
					}
					break;
				case timeStamp >= 20:
					// [20, 40)
					if (!map._20To40) {
						console.log('触发区间：[20, 40)');
						map._20To40 = true;
						if (progress < 40) {
							progress = 40;
						}
						__startTimerInner(800, 60);
					}
					break;
				case timeStamp >= 0:
					// [0, 20)
					if (!map._0T20) {
						console.log('触发区间：[0, 20)');
						map._0T20 = true;
						__startTimerInner(300, 40);
					}
					break;
			}
			timeStamp++;
			console.log('区间定时器运行中... ', timeStamp);
		}, 1000);

		// 4. 启用内部定时器计算百分比进度
		const __startTimerInner = (interval, threshold) => {
			// -- 每次启动内部定时器之前，清除上一次的定时操作
			// -- 场景：上次退出时进度在30%，再次进入时在第1区间进度没执行完时，可能已经进入第2区间了，此时会同时触发多个定时器
			clearInterval(timerInner);
			timerInner = null;
			// -- 启用内部定时器
			timerInner = setInterval(() => {
				progress += 1;
				pending && pending(progress);
				__updateLocals();
				if (progress === threshold) {
					clearInterval(timerInner);
					timerInner = null;
				}
			}, interval);
		};
		// 5. 更新本地存储数据（每次进度更新时触发）
		const __updateLocals = () => {
			uni.setStorageSync(
				k,
				JSON.stringify({
					t: localTimes,
					v: progress,
				})
			);
		};
		// 6. 销毁定时器
		const __clearTimers = () => {
			clearInterval(timerOuter);
			clearInterval(timerInner);
			timerOuter = null;
			timerInner = null;
		};
		// 7. 定义返回值
		return {
			/** 销毁定时器 */
			clearTimers: () => {
				__clearTimers();
			},
			/** 加载完成 */
			done: () => {
				__clearTimers();
				let t = setInterval(() => {
					progress += 1;
					pending && pending(progress);
					if (progress === 100) {
						uni.removeStorageSync(k);
						complete && complete();
						clearInterval(t);
						t = null;
					}
				}, 16.7 * 3);
			},
		};
	};
}