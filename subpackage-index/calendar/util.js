// 明天几号
export function getNextDay(tempTime) {
	if (!tempTime) {
		tempTime = new Date()
	}
	// tempTime.setHours(24, 0, 0, 0, 0); //这行会出现：8月32号哈哈哈哈哈哈哈哈哈哈哈

	tempTime.setDate(tempTime.getDate() + 1);

	return tempTime;
}
// 昨天几号
export function getBeforeDay(tempTime) {
	if (!tempTime) {
		tempTime = new Date()
	}
	tempTime.setHours(-24, 0, 0, 0, 0);
	return tempTime;
}

// 获取当前月份应该有多少天
export function getCurMonthDayNum(time) {
	if (!time) {
		time = new Date()
	}
	let day = 31;
	let month = time.getMonth() + 1
	let year = time.getFullYear()
	if ([1, 3, 5, 7, 8, 10, 12].indexOf(month) != -1) {
		day = 31;
	} else if ([4, 6, 9, 11].indexOf(month) != -1) {
		day = 30;
	} else if (year % 4 == 0) {
		day = 29
	} else {
		day = 28
	}
	return day
}
/**
 * 或者某个时间在其月份还剩多少天时间
 * @param {Object} time 时间
 */
export function getElseMonthDayNum(time) {
	if (!time) {
		time = new Date()
	}
	let total = getCurMonthDayNum(time);
	let day = time.getDate()
	return total - day;
}
/**
 * 时间格式化
 */
export function timeFormat(date, fmt = 'yyyy/MM/dd HH:mm:ss') {
	if (!date) {
		return ''
	}
	// dayjs
	if (typeof date === 'string') {
		date = date.replace('T', ' ').replace('Z', '');
		date = new Date(date.replace(/-/g, '/'))
	}
	if (typeof date === 'number') {
		date = new Date(date)
	}
	var o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
		'H+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds(),
		'q+': Math.floor((date.getMonth() + 3) / 3),
		'S': date.getMilliseconds()
	}
	var week = {
		//Unicode Han Character周 \u5468
		'0': '\u65e5',
		'1': '\u4e00',
		'2': '\u4e8c',
		'3': '\u4e09',
		'4': '\u56db',
		'5': '\u4e94',
		'6': '\u516d'
	}
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') :
				'') +
			week[date.getDay() + ''])
	}
	for (var k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k])
				.length)))
		}
	}
	return fmt
}

/**
 * 获取距离今天多少天的时间
 * @param {Object} days 据今天的时间长度
 */
export function getRecentDay(days, time) {
	if (!time) {
		time = new Date()
	}
	//日期list，从今天开始
	let dayList = []
	let curIndex = -1;
	// 补充这周的前几天时间
	let bbDay = new Date(time);
	bbDay.setHours(0, 0, 0, 0);

	// let week = bbDay.getDay() // 当前周几
	// week = (week - 1) < 0 ? 0 : (week - 1)
	// let bList = [];
	// for (var i = week; i >= 0; i--) {
	// 	let beforeDay = getBeforeDay(bbDay)
	// 	bList.push(timeFormat(beforeDay))
	// 	bbDay = beforeDay;
	// }
	// bList.reverse()
	// dayList = dayList.concat(bList)

	// 时间长度
	let nnDay = new Date(time);
	nnDay.setHours(0, 0, 0, 0);
	curIndex = dayList.length // 今天的索引
	let elseDay = days || getElseMonthDayNum(nnDay);
	for (var i = 0; i <= elseDay; i++) {
		dayList.push(timeFormat(nnDay))
		let nextDay = getNextDay(nnDay)
		nnDay = nextDay;
	}
	return {
		list: dayList,
		index: curIndex
	}
}

// 计算时间差
// 计算2022/05/23 20:15:00 到 2022/05/23 22:00:00 的时间差,并转化为分钟
export function getTimeDiff(startTime, endTime) {
	var startTimeArray = startTime.split(' ')
	var endTimeArray = endTime.split(' ')
	var startDate = startTimeArray[0]
	var endDate = endTimeArray[0]
	var startHour = startTimeArray[1]
	var endHour = endTimeArray[1]
	var startDateArray = startDate.split('/')
	var endDateArray = endDate.split('/')
	var startYear = startDateArray[0]
	var startMonth = startDateArray[1]
	var startDay = startDateArray[2]
	var endYear = endDateArray[0]
	var endMonth = endDateArray[1]
	var endDay = endDateArray[2]
	var startHourArray = startHour.split(':')
	var endHourArray = endHour.split(':')
	var startHour = startHourArray[0]
	var startMin = startHourArray[1]
	var endHour = endHourArray[0]
	var endMin = endHourArray[1]
	var startTime = new Date(startYear, startMonth, startDay, startHour, startMin, 0)
	var endTime = new Date(endYear, endMonth, endDay, endHour, endMin, 0)
	var diff = endTime.getTime() - startTime.getTime()
	var diffMin = diff / (1000 * 60)
	return diffMin
}
