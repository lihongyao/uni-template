/**********************
 ** Request Uris.
 **********************/

// -- server
const APP_HOST_DEV = 'https://resume.d-dou.cn';
const APP_HOST_TES = '测试环境';
const APP_HOST_PRO = '生产环境';
const APP_HOST_NCT = '穿透地址';
export const APP_HOST = APP_HOST_DEV;

// -- scoket
const APP_SCOKET_HOST_DEV = '开发环境';
const APP_SCOKET_HOST_TES = '测试环境';
const APP_SCOKET_HOST_PRO = '生产环境';
const APP_SCOKET_HOST_NCT = '穿透地址';
export const APP_SCOKET_HOST = APP_SCOKET_HOST_DEV;

/**********************
 ** Keys for value
 **********************/
export const APP_KEY_TOKEN = 'UNI_TOKNE'; /** 记录登录token */
export const APP_KEY_LOGIN = 'UNI_LOGIN_STATUS'; /** 记录登录状态（判断依据：是否绑定手机号） **/
export const APP_KEY_SEARCH_HISTORY = 'APP_KEY_SEARCH_HISTORY'; /** 搜索历史记录 */

/**********************
 ** Others
 **********************/
export const APP_OSS_HOST = '';
export const APP_H5_URI = '';
export const APP_UPLOAD_IMAGE_URI = APP_HOST + '/mall-portal/aliyun/oss/upload';
export const APP_UPLOAD_VOICE_URI = APP_HOST + '音频上传地址';

/**********************
 ** Weixin
 **********************/
export const MP_APPID = ''; /** 微信appID */
export const MP_APP_SECRET = ''; /** 微信appSecret */

/**********************
 ** Some For Project.
 **********************/

export const APP_MINE_FNS = [
	{ label: '地址管理', path: '/pages/address/list', checkLogin: true },
	{ label: '我的客服', path: '', checkLogin: false },
	{ label: '意见反馈', path: '/pages/fns/feedback', checkLogin: true },
	{ label: '设置', path: '/pages/fns/sets', checkLogin: false },
	{ label: '文件上传', path: '/pages/upload/upload', checkLogin: false },
];

import ICON_UNPAY from '@/pages/TabPages/images/unpay.png';
import ICON_RECEIVE from '@/pages/TabPages/images/receive.png';
import ICON_DELIVER from '@/pages/TabPages/images/deliver.png';
import ICON_COMPLETE from '@/pages/TabPages/images/complete.png';

export const APP_MINE_ORDERS = [{
		icon: ICON_UNPAY,
		path: '/pages/orders/list?q=0',
		label: '待支付',
	},
	{
		icon: ICON_DELIVER,
		path: '/pages/orders/list?q=1',
		label: '待发货',
	},
	{
		icon: ICON_RECEIVE,
		path: '/pages/orders/list?q=2',
		label: '待收货',
	},
	{
		icon: ICON_COMPLETE,
		path: '/pages/orders/list?q=3',
		label: '已完成',
	},
];