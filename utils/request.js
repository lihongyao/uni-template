import { APP_HOST, APP_KEY_TOKEN } from '@/constants/index.js';


let requestQueue = []; // 请求队列
let isRefreshingToken = false; // Token刷新状态

/**
 * 请求对象
 * @param  {String} url 请求uri地址
 * @param  {String} method 请求方法，默认GET
 * @param  {Object} data 发送参数
 * @param  {Object} headers 请求头
 * @return {Promise}     
 */
const request = (options) => {
	return new Promise((resolve, reject) => {
		// -- 处理默认配置
		const defaultOptions = { method: 'GET' };
		// -- 合并配置
		Object.assign(defaultOptions, options);
		// -- 解构配置
		let { method, url, data = {}, headers = {} } = defaultOptions;
		// -- 处理GET请求
		const timeStamp = new Date().getTime();
		if (method === 'GET') {
			data.timeStamp = timeStamp;
		}
		// -- 处理URL，如果传递完整请求地址(特殊请求)，则不做拼接处理
		if (!/^http(s?)/.test(url)) {
			url = `${APP_HOST}${url}`
		};
		// -- 获取token
		const token = uni.getStorageSync(APP_KEY_TOKEN);
		// -- 发送请求
		uni.request({
			url,
			method,
			data,
			timeout: 60 * 1000,
			header: {
				"Authorization": 'Bearer ' + token,
				...headers
			},
			success: (response) => {
				if ([200, 201].includes(response.statusCode)) {
					const { code, msg } = response.data;
					switch (code) {
						case 200:
							resolve(response.data);
							break;
						case 401:
							break;
						case 8888:
							// 是否正在刷新token
							// if (isRefreshingToken) {
							// 	console.log('放入任务队列~')
							// 	return new Promise(resolve => {
							// 		requestQueue.push(() => {
							// 			resolve(request(options));
							// 		})
							// 	})
							// } else {
							// 	isRefreshingToken = true;
							// 	// 刷新Token
							// 	setTimeout(() => {
							// 		uni.setStorageSync('DPMP_TOKEN', '');
							// 		console.log('token刷新成功');
							// 		// 执行任务队列
							// 		requestQueue.forEach(cb => cb());
							// 		requestQueue = [];
							// 		isRefreshingToken = false;
							// 		// 重试本次请求
							// 		return request(options);
							// 	}, 1000);
							// }
							break;
						default:
							uni.showToast({ title: msg || '服务器忙，请稍后再试！', icon: 'none' });
					}
				} else {
					uni.showToast({ title: response.data.error, icon: 'none' })
				}
			},
			fail: (err) => {
				console.log('AJAX_ERROR：', err)
			},
			complete: () => {}
		})
	});
};
export default request;
