import request from '@/api/apiConfig';


export function getOSSConfigs(data) {
	return request({
		url: '/api/ossConfigs',
	})
}
