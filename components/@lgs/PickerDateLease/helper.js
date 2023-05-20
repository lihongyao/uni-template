/**
 * 周，用于计算当前处于周几
 * 取周公式：weeks[date.getDay()]
 */
const weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

/**
 * 解析营业时间
 * @param {Object} businessHours
 */
export function parseBusinessHours(businessHours) {
	const [timeStart, timeEnd] = businessHours.replace(/\s*/g, "").split("-");
	const { year, month, day } = getDateMeta(new Date());
	const workTimeStart = new Date(`${year}/${month}/${day} ${timeStart}`);
	const workTimeEnd = new Date(`${year}/${month}/${day} ${timeEnd}`);
	return { workTimeStart, workTimeEnd }
}

/**
 * 处理日期格式
 * 主要用于 时/分 数值小于10时在前面插入0
 * @param {Object} n
 */
export function format(n) {
	return n.toString().padStart(2, '0');
};


/**
 * 处理渲染日期格式，格式为 MM月DD日 HH:mm
 * @param {Object} date
 */
export function dateFormat(date, format) {
	const { month, day, hours, minutes } = getDateMeta(date);
	return `${month}月${day}日 ${hours}:${minutes}`;
}


/**
 * 获取筛选小时数
 */
export function getHours() {
	const t = [];
	for (let i = 0; i < 24; i++) {
		t.push(format(i));
	}
	return t;
}


/**
 * 获取日期数据（解构）
 * @param {Object} date
 */
export function getDateMeta(date) {
	const year = date.getFullYear().toString();
	const month = format(date.getMonth() + 1);
	const day = format(date.getDate());
	const hours = format(date.getHours());
	const minutes = format(date.getMinutes());
	const seconds = format(date.getSeconds());
	const week = weeks[date.getDay()];
	return { year, month, day, hours, minutes, seconds, week };
}



/**
 * 组件加载时，根据当前时间计算默认展示的取车时间和还车时间
 * @param {Object} currentDate 当前时间
 * @param {Object} businessHours 营业时间
 */
export function getDefaultResult(currentDate, businessHours) {
	// 1. 解析营业时间
	const { workTimeStart, workTimeEnd } = parseBusinessHours(businessHours);
	console.log('————————————————————————————————————')
	console.log("上班时间：", workTimeStart);
	console.log("下班时间：", workTimeEnd);
	console.log('————————————————————————————————————')

	// 2. 解构
	const { year, month, day, hours, minutes, seconds } = getDateMeta(currentDate);
	// 4. 处理开始时间
	let startDate = new Date(`${year}/${month}/${day} ${hours}:${minutes}:${seconds}`);
	// -- 判断当前时间是否在营业时间期间
	if (currentDate > workTimeStart && currentDate < workTimeEnd) {
		console.log("__营业中__");
		// 获取当前时、分
		const hours = startDate.getHours();
		const minutes = startDate.getMinutes();
		if (minutes < 30) {
			// 当前分钟数小于30分时，取车时间：分置为30、秒置为0
			startDate.setMinutes(30);
			startDate.setSeconds(0);
		} else {
			// 当前分钟数大于30分时，取车时间：小时+1，分、秒置为0
			startDate.setHours(hours + 1);
			startDate.setMinutes(0);
			startDate.setSeconds(0);
			console.log(startDate);
			if (startDate.getTime() > workTimeEnd.getTime()) {
				// 计算后的取车时间超过打烊时间时
				const date = workTimeStart.getDate();
				const hours = workTimeStart.getHours();
				const minutes = workTimeStart.getMinutes();
				startDate.setDate(date + 1);
				startDate.setHours((minutes > 0 && minutes < 30) ? hours + 1 : hours);
				startDate.setMinutes((minutes > 0 && minutes < 30) ? 30 : 0);
				startDate.setSeconds(0);
			}
		}
	} else {
		const isClose = currentDate > workTimeEnd;
		console.log(isClose ? "__已打烊__" : '__未营业__');
		const date = workTimeStart.getDate();
		const hours = workTimeStart.getHours();
		const minutes = workTimeStart.getMinutes();
		if (isClose) {
			startDate.setDate(date + 1);
		}
		startDate.setHours((minutes > 0 && minutes < 30) ? hours + 1 : hours);
		startDate.setMinutes((minutes > 0 && minutes < 30) ? 30 : 0);
		startDate.setSeconds(0);
	}

	// 5. 处理结束时间
	const endDate = new Date(startDate.getTime());
	endDate.setDate(endDate.getDate() + 2);
	// 6. 返回
	return {
		start: startDate,
		end: endDate
	};
}


/**
 * 渲染拾取器第1列数据
 * @param {Object} date
 */
export function renderColumnItemForDate(date) {
	if (date === '今日') return date;
	const { month, day, week } = getDateMeta(date);
	return `${month}月${day}日 ${week}`;
}


/**
 * 获取租赁时长
 * @param {Object} startDate
 * @param {Object} endDate
 */
export function getLengthOfLease(startDate, endDate) {
	let ms = endDate - startDate;
	let day = Math.floor(ms / 1000 / 60 / 60 / 24);
	let hours = Math.floor((ms / 1000 / 60 / 60) % 24);
	let minutes = Math.floor((ms / 1000 / 60) % 60);
	let result = '';
	if (minutes >= 30) {
		hours += 1;
	}
	if (day) {
		result += `${day}天`;
	}
	if (hours) {
		result += `${hours}小时`
	}
	return result || '0小时';
}