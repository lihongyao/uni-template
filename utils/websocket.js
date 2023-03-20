// -- 重连间隔，默认20秒
const kRECONNECT_INTERVAL = 20 * 1000;
// -- 心跳间隔，默认100秒，即每个100秒发送一次心跳给服务器，证明我还活着
const kHEARTBEAT_INTERVAL = 80 * 1000;
// -- 重连最大次数
const kMAX_RECONNECT_TIMES = 5;
// -- 心跳描述字符串
const kHEARTBEAT_STRING = 'heartbeat';

export default class KWebSocket {
	/**
	 * 构造WebSocket实例
	 * @param {Object} options 配置项
	 * @param {String} options.uri 连接地址，格式一般为：ws[s]://SERVER_HOST/userID
	 * @param {Function} options.onConnected 连接成功回调/触发时机：首次连接成功和断线重新连接后（防止断线期间对方发送消息未接收到）一般用于请求历史消息列表
	 * @param {Function} options.onMessage 收到服务器消息回调
	 */
	constructor(options) {
		// -- 配置项
		this.options = options;
		// -- WebScoket实例
		this.socketTask = null;
		// -- 标识是否正常关闭
		this.normalCloseFlag = false;
		// -- 重新连接次数
		this.reconnectTimes = 1;
		// -- 重连定时器Timer
		this.reconnectTimer = null;
		// -- 心跳定时器Timer
		this.heartbeatTimer = null;
		// -- 发起链接
		this._init();
	}

	_init() {
		// 1. 建立链接
		this.socketTask = uni.connectSocket({
			url: this.options.uri,
			success: () => {
				console.log("「KWebSocket」：连接成功");
			},
			fail: (error) => {
				console.log("「KWebSocket」：连接失败", error);
			}
		});
		// 2. 监听Socket
		this._watch();
	}

	/**
	 * 监听Socket
	 */
	_watch() {
		// 1. 监听 WebSocket 连接打开事件
		this.socketTask.onOpen(() => {
			console.log("「KWebSocket」：打开成功");
			// -- 连接成功
			this.options.onConnected && this.options.onConnected();
			// -- 重置连接次数
			this.reconnectTimes = 1;
			// -- 发送心跳
			this._sendHeartbeat();
			// -- 监听消息
			this._onMessage();

		});

		// 2. 监听 WebSocket 异常
		this.socketTask.onError(() => {
			// -- 关闭连接
			this.socketTask.close();
		});

		// 3. 监听 WebSocket 连接关闭事件
		this.socketTask.onClose((res) => {
			// -- 连接错误，发起重连
			if (!this.normalCloseFlag) {
				this._onDisconnected(res);
			}
		})
	}

	/**
	 * 发送心跳
	 */
	_sendHeartbeat() {
		this.heartbeatTimer = setInterval(() => {
			this.socketTask.send({
				data: kHEARTBEAT_STRING,
				success: () => {
					console.log("「KWebSocket」：心跳已发送 → ", kHEARTBEAT_STRING);
				}
			});
		}, kHEARTBEAT_INTERVAL);
	}

	/**
	 * 监听消息
	 */
	_onMessage() {
		this.socketTask.onMessage(resp => {
			// -- 此处需与后端定义心跳描述字符串，一般为：heartbeat
			if (resp.data !== kHEARTBEAT_STRING) {
				this.options.onMessage && this.options.onMessage(JSON.parse(resp.data));
			} else {
				console.log("「KWebSocket」：心跳已接收 → ", resp.data);
			}
		})
	}

	/**
	 * 断开连接
	 * @param {Object} res
	 */
	_onDisconnected(res) {
		console.log("「KWebSocket」：断开连接. Reason → ", JSON.stringify(res));
		// -- 关闭心跳
		clearInterval(this.heartbeatTimer);
		// -- 尝试重新连接
		this._onReconnect();
	}
	/**
	 * 断开重连
	 */
	_onReconnect() {
		// -- 清除重连定时器
		clearTimeout(this.reconnectTimer);
		// -- 校验重连次数
		if (this.reconnectTimes < kMAX_RECONNECT_TIMES) {
			this.reconnectTimer = setTimeout(() => {
				console.log(`「KWebSocket」：第 ${this.reconnectTimes} 次尝试重连`);
				this._init();
				this.reconnectTimes++;
			}, kRECONNECT_INTERVAL);
		} else {
			console.log("「KWebSocket」：重连失败");
		}
	}

	/**
	 * 外部调用：关闭连接
	 */
	close() {
		// 1. 正常光比状态
		this.normalCloseFlag = true;
		// 2. 关闭WebSocket
		this.socketTask.close();
		// 3. 关闭心跳定时器
		clearInterval(this.heartbeatTimer);
		// 4. 关闭重连定时器
		clearTimeout(this.reconnectTimer);
	}
}


/**
 ---- 参考：https://juejin.cn/post/7144913531664597029
 
 使用指南：
 1. 引入KWebSocket
 2. 实例化：uri/onConnected/onMessage
 3. 页面销毁，断开连接

 **/
