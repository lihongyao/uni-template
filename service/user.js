
import request from '@/utils/request.js';

/**
 * POST：登录
 * @param {String} code
 */
export function login(code) {
	return request({
		url: '/api/auths/login',
		data: { code },
		method: 'POST'
	})
}



/**
 * 编辑用户信息
 * @param {Object} data
 * data.avatarUrl
 * data.nickname
 */
export function edit(data) {
	return request({
		url: '/api/users/edit',
		data,
		method: 'PUT'
	})
}



/**
 * GET：查询用户信息
 */
export function info() {
	return request({
		url: '/api/xxx'
	})
}