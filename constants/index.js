/**********************
 ** Request Uris.
 **********************/

const APP_HOST_DEV = 'http://192.168.0.47:8888';
const APP_HOST_TES = '测试环境';
const APP_HOST_PRO = '生产环境';

export const APP_HOST = APP_HOST_DEV;


/**********************
 ** Keys for value
 **********************/
export const APP_KEY_TOKEN = "UNI_TOKNE"; /** 记录登录token */
export const APP_KEY_PHONE = 'UNI_HAS_BIND_PHONE'; /** 记录是否绑定手机号 **/
export const APP_KEY_SEARCH_HISTORY = 'APP_KEY_SEARCH_HISTORY'; /** 搜索历史记录 */

/**********************
 ** Others
 **********************/
export const APP_OSS_HOST = ""


/**********************
 ** Weixin
 **********************/
export const MP_APPID = 'wx9d0f652e42541e26';
export const MP_APP_SECRET = '802086a41c9b347b0c8d4e86bd979db5';


/**********************
 ** Some For Project.
 **********************/
export const APP_MINE_FNS = [
	{ label: '地址管理', path: '/pages/address/list' },
	{ label: '我的客服', path: '' },
	{ label: '意见反馈', path: '/pages/feedback/feedback' },
	{ label: '用户协议', path: '/pages/web-page/web-page?q=1' },
	{ label: '隐私政策', path: '/pages/web-page/web-page?q=2' },
]

import ICON_UNPAY from '../pages/mine/images/unpay.png'
import ICON_RECEIVE from '../pages/mine/images/receive.png'
import ICON_DELIVER from '../pages/mine/images/deliver.png'
import ICON_COMPLETE from '../pages/mine/images/complete.png'
export const APP_MINE_ORDERS = [{
		icon: ICON_UNPAY,
		path: '/pages/orders/list?q=0',
		label: '待支付'
	},
	{
		icon: ICON_DELIVER,
		path: '/pages/orders/list?q=1',
		label: '待发货'
	},
	{
		icon: ICON_RECEIVE,
		path: '/pages/orders/list?q=2',
		label: '待收货'
	},
	{
		icon: ICON_COMPLETE,
		path: '/pages/orders/list?q=3',
		label: '已完成'
	}
];
