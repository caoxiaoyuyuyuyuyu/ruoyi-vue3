import request from '@/utils/request'

// 查询专业信息列表
export function listFun_majorInfo(query) {
  return request({
    url: '/schoolInfo/fun_majorInfo/list',
    method: 'get',
    params: query
  })
}

// 查询专业信息详细
export function getFun_majorInfo(majorId) {
  return request({
    url: '/schoolInfo/fun_majorInfo/' + majorId,
    method: 'get'
  })
}

// 新增专业信息
export function addFun_majorInfo(data) {
  return request({
    url: '/schoolInfo/fun_majorInfo',
    method: 'post',
    data: data
  })
}

// 修改专业信息
export function updateFun_majorInfo(data) {
  return request({
    url: '/schoolInfo/fun_majorInfo',
    method: 'put',
    data: data
  })
}

// 删除专业信息
export function delFun_majorInfo(majorId) {
  return request({
    url: '/schoolInfo/fun_majorInfo/' + majorId,
    method: 'delete'
  })
}
