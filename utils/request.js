import { APP_HOST, APP_KEY_TOKEN } from '@/constants/index.js';

/**
 * 请求对象
 * @param  {String} url 请求uri地址
 * @param  {String} method 请求方法，默认GET
 * @param  {Object} data 发送参数
 * @param  {Object} headers 请求头
 * @return {Promise}     
 */
const request = (options) => {
	// 1. 处理默认配置
	const defaultOptions = { method: 'GET' };
	// 2. 合并配置
	Object.assign(defaultOptions, options);
	// 3. 解构配置
	let { method, url, data = {}, headers = {} } = defaultOptions;
	// 4. 处理GET请求(添加时间戳)
	const timeStamp = new Date().getTime();
	if (method === 'GET') {
		data.timeStamp = timeStamp;
	}
	// 5. 过滤无用的数据
	const t = {};
	for (let k in data) {
		if (data[k]) {
			t[k] = data[k]
		}
	}
	// 6.  处理URL，如果传递完整请求地址(特殊请求)，则不做拼接处理
	if (!/^http(s?)/.test(url)) {
		url = `${APP_HOST}${url}`
	};
	// 7. 获取Token
	const token = uni.getStorageSync(APP_KEY_TOKEN);
	// 8. 执行请求
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method,
			data: t,
			timeout: 60 * 1000,
			header: {
				"Authorization": 'Bearer ' + token,
				...headers
			},
			success: (response) => {
				const { statusCode, data } = response;
				switch (statusCode) {
					case 200:
					case 201:
						resolve(data);
						break;
					case 401:
						reject();
						uni.showToast({ title: '401 (Unauthorized)', icon: 'none' });
						break;
					default:
						reject();
						uni.showToast({ title: data.message || "服务器异常，请稍后再试", icon: 'none' });
				}
			},
			fail: () => {
				reject();
				uni.showToast({ title: data.message || "服务器异常，请稍后再试", icon: 'none' });
			}
		})
	});
};
export default request;