import http from '../request/index.js';

const calendarApi = {
  getScheduleList: '/schedule/getByIdAndDate', // 获取日程信息
}

export function getScheduleList(data) {
  return http.post(calendarApi.getScheduleList, {
    ...data
  })
}
