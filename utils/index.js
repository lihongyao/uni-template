// -- 引入常量配置
import { APP_OSS_HOST, APP_KEY_PHONE, APP_KEY_TOKEN } from '@/constants/index.js';
import crypto from 'crypto-js';
import { Base64 } from 'js-base64';

export default class Utils {
	/**
	 * 预览：长按识别关注微信公众号
	 */
	static subscribeOfficialAccounts() {
		uni.previewImage({
			urls: [
				'https://qn.d-dou.com/dcep/dbean/4278855d38954d89a5095b9f6e637071ri1m0p.png'
			],
			indicator: "none"
		})
	}

	/**
	 *  预览：长按识别添加企业微信
	 */
	static joinEnterpriseWechat() {
		uni.previewImage({
			urls: [
				'https://qn.d-dou.com/dcep/dbean/4068932c9f9f4b4bafabe34c43f6fb833zlvce.png'
			],
			indicator: "none"
		})
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
		})
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
			icon: 'none'
		})
	}

	/** 加载动画
	 * @param {Object} title
	 */
	static loading(title) {
		uni.showLoading({
			title,
			duration: 20 * 1000,
			mask: true
		})
	}

	/**
	 * 页面入栈
	 * @param {Object} url
	 */
	static push(url) {
		uni.navigateTo({
			url
		})
	}

	/**
	 * 页面重载
	 * @param {Object} url
	 */
	static reLaunch(url) {
		uni.reLaunch({
			url
		})
	}

	/**
	 * 页面出栈
	 */
	static pop(delta = 1) {
		uni.navigateBack({
			delta
		})
	}


	/**
	 * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页
	 * @param {Object} url
	 */
	static switchTab(url) {
		uni.switchTab({
			url
		})
	}


	/**
	 * 执行登录
	 * @param {Function} login 登录接口函数
	 * @param {Function} editApiFn 编辑用户信息接口函数
	 */
	static login(loginFn, eidt, shareCode) {
		return new Promise((resolve, reject) => {
			uni.login({
				provider: "weixin",
				scopes: "auth_base", // 静默授权
				withCredentials: true,
				success({ code }) {
					console.log("登录授权code：", code);
					loginFn && loginFn(code).then(r => {
						const { isBindPhone, token } = r.data;
						uni.setStorageSync(APP_KEY_TOKEN, token);
						uni.setStorageSync(APP_KEY_PHONE, isBindPhone);
						resolve(null);
						// -- 判断用户是否授权获取信息，如果已授权则获取
						/*
						uni.getSetting({
							success(res) {
								if (res.authSetting['scope.userInfo']) {
									uni.getUserInfo({
										provider: 'weixin',
										withCredentials: true,
										success: function({ userInfo }) {
											if (userInfo) {
												console.log(userInfo);
											}
										}
									});
								} else {
									
								}
							}
						})*/
					})
				},
				fail(err) {
					console.log("wx.login error：", err);
					reject(err);
				}
			})
		})
	}

	/**
	 * 检查是否绑定手机号
	 */
	static checkLogin() {
		return new Promise((resolve, reject) => {
			if (uni.getStorageSync(APP_KEY_PHONE)) {
				resolve();
			} else {
				uni.navigateTo({
					url: '/pages/auth/auth'
				})
			}
		})
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
	 * 打开地图选择位置。
	 */
	static chooseLocation() {
		return new Promise((resolve) => {
			uni.chooseLocation({
				success: function(res) {
					if (/ok/.test(res.errMsg) && res.name) {
						delete res.errMsg;
						resolve(res);
					} else {
						Utils.toast("请选择地址并点击确定~");
					}
				},
				fail() {
					// 调用失败 / 表示用户未授权
					// 判断是否是第1次进入 ，如果是第1次进入，在拒绝授权后不再弹框
					if (!uni.getStorageSync('XXX_UN_FIRSTIN')) {
						uni.setStorageSync('XXX_UN_FIRSTIN', true);
						return;
					}
					uni.getSetting({
						success(res) {
							// 判断用户是否授权获取定位信息
							if (!res.authSetting['scope.userLocation']) {
								uni.showModal({
									title: "授权获取你的位置信息",
									content: "定位，获取用户距离",
									success(r) {
										if (r.confirm) {
											// 如果用户同意授权地理信息，则打开授权设置页面，判断用户的操作
											uni.openSetting({
												success(data) {
													// 如果用户授权了地理信息在， 则提示授权成功
													if (data.authSetting['scope.userLocation']) {
														uni.chooseLocation({
															success(res) {
																if (/ok/.test(res.errMsg) && res.name) {
																	delete res.errMsg;
																	resolve(res);
																} else {
																	Utils.toast("请选择地址列表并点击确定~");
																}
															}
														})
													} else {
														console.log('[Utils.chooseLocation]：用户未授权')
													}
												}
											})
										} else {
											console.log('[Utils.chooseLocation]：用户点击取消授权')
										}
									}
								})
							}
						},
						fail() {
							console.log('[Utils.chooseLocation]：拉取用户授权配置信息失败')
						}
					})
				}
			});
		})
	}

	/**
	 * 获取定位信息
	 */
	static getLocation() {
		return new Promise((resolve) => {
			// 直接获取用户定位信息 / 获取失败则做后续处理
			uni.getLocation({
				success({ errMsg, latitude, longitude }) {
					if (/ok/.test(errMsg)) {
						resolve({ lat: latitude, lng: longitude });
					} else {
						resolve({});
					}
				},
				fail() {
					// 调用失败 / 表示用户未授权
					// 判断是否是第1次进入 ，如果是第1次进入，在拒绝授权后不再弹框
					if (!uni.getStorageSync('UN_FIRSTIN')) {
						uni.setStorageSync('UN_FIRSTIN', true);
						resolve({});
						return;
					}
					// 如果不是第1次进入，再次弹框让用户授权
					uni.getSetting({
						success(res) {
							// 判断用户是否授权获取定位信息
							if (!res.authSetting['scope.userLocation']) {
								uni.showModal({
									title: "授权获取你的位置信息",
									content: "用于定位当前位置和商家的距离",
									success(r) {
										if (r.confirm) {
											// 如果用户同意授权地理信息，则打开授权设置页面，判断用户的操作
											uni.openSetting({
												success(data) {
													// 如果用户授权了地理信息在， 则提示授权成功
													if (data.authSetting['scope.userLocation']) {
														uni.getLocation({
															success({ errMsg, latitude, longitude }) {
																if (/ok/.test(errMsg)) {
																	resolve({ lat: latitude, lng: longitude });
																} else {
																	resolve({});
																}
															},
														})
													} else {
														resolve({});
													}
												}
											})
										} else {
											resolve({});
										}
									}
								})
							}
						},
						fail() {
							resolve({});
						}
					})
				}
			})
		})
	}

	/**
	 * 订阅授权
	 */
	static checkSubscriptions() {
		uni.getSetting({
			withSubscriptions: true,
			success(res) {
				console.log(res)
				uni.showModal({
					title: "授权获取你的订阅",
					content: "用于定位当前位置和商家的距离",
					success(r) {
						if (r.confirm) {
							uni.openSetting({
								withSubscriptions: true,
								success(res) {
									console.log(res);
								}
							})
						}
					}
				})

			}
		})
	}

	/**
	 * OSS - 文件上传
	 * @param {Object} uploadFile 配置信息
	 */
	static uploadFile({ key, filePath, accessKeySecret, accessKeyId, securityToken }) {
		return new Promise((resolve, reject) => {
			// 1. 客户端获取签名
			// -- 构造policy
			const date = new Date();
			date.setHours(date.getHours() + 1);
			const policyText = {
				expiration: date.toISOString(),
				conditions: [
					["content-length-range", 0, 1024 * 1024 * 1024],
				],
			};
			const policy = Base64.encode(JSON.stringify(policyText));
			// -- 获取签名
			const signature = crypto.enc.Base64.stringify(crypto.HmacSHA1(policy, accessKeySecret));
			// 2.构造formData
			const formData = {
				key,
				policy,
				signature,
				OSSAccessKeyId: accessKeyId,
				"x-oss-security-token": securityToken // 使用STS签名时必传。
			}
			// 3. 执行上传
			uni.uploadFile({
				url: APP_OSS_HOST,
				filePath,
				name: 'file',
				formData,
				success: (res) => {
					if (res.statusCode === 204) {
						resolve(`${APP_OSS_HOST}/${key}`);
					}
				},
				fail: err => {
					reject(err);
				}
			});
		})
	}
}
