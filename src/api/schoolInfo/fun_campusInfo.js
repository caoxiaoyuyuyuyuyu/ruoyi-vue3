import request from '@/utils/request'

// 查询学校信息列表
export function listFun_campusInfo(query) {
  return request({
    url: '/schoolInfo/fun_campusInfo/list',
    method: 'get',
    params: query
  })
}

// 查询学校信息详细
export function getFun_campusInfo(campusId) {
  return request({
    url: '/schoolInfo/fun_campusInfo/' + campusId,
    method: 'get'
  })
}

// 新增学校信息
export function addFun_campusInfo(data) {
  return request({
    url: '/schoolInfo/fun_campusInfo',
    method: 'post',
    data: data
  })
}

// 修改学校信息
export function updateFun_campusInfo(data) {
  return request({
    url: '/schoolInfo/fun_campusInfo',
    method: 'put',
    data: data
  })
}

// 删除学校信息
export function delFun_campusInfo(campusId) {
  return request({
    url: '/schoolInfo/fun_campusInfo/' + campusId,
    method: 'delete'
  })
}
