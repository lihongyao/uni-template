export const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

export const getDateMeta = (date) => {
	const year = date.getFullYear().toString();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	return { year, month, day };
}

export const getYears = (min, max, showTillNow) => {

	const start = min.getFullYear();
	const end = max.getFullYear();
	const years = [];
	for (let i = start; i <= end; i++) {
		years.push(i.toString());
	}
	// -- 处理至今
	if (showTillNow) {
		const currentYear = (new Date()).getFullYear().toString();
		const index = years.findIndex(year => year === currentYear);
		if (index) {
			years.splice(index + 1, 0, "至今");
		} else {
			years.push("至今");
		}
	}
	return years;
}
export const getMonths = () => {
	const months = [];
	for (let i = 1; i <= 12; i++) {
		const month = i.toString().padStart(2, '0');
		months.push(month);
	}
	return months;
}

export const getDays = ({ year, month }) => {
	const days = [];
	let max = 31;
	if ([4, 6, 9, 11].indexOf(month) !== -1) {
		max = 30;
	} else if (month === 2) {
		// 计算是否闰年
		if (isLeapYear(year)) {
			max = 29;
		} else {
			max = 28;
		}
	}
	for (let i = 1; i <= max; i++) {
		const day = i.toString().padStart(2, '0');
		days.push(day);
	}
	return days;
}
