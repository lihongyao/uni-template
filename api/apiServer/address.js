import request from '@/api/apiConfig';

/**
 * 地址列表
 */
export function list() {
	return request({
		url: '/api/address/list'
	})
}

/**
 * 编辑或新增地址
 * @param {Object} data
 */
export function addOrUpdate(data) {
	return request({
		url: '/api/address/addOrUpdate',
		method: "POST",
		data
	})
}

/**
 * 移除地址
 * @param {Object} id
 */
export function remove(id) {
	return request({
		url: `/api/address/remove/${id}`,
		method: "DELETE"
	})
}
