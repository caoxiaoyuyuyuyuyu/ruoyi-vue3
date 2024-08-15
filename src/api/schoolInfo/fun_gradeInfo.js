import request from '@/utils/request'

// 查询年级信息列表
export function listFun_gradeInfo(query) {
  return request({
    url: '/schoolInfo/fun_gradeInfo/list',
    method: 'get',
    params: query
  })
}

// 查询年级信息详细
export function getFun_gradeInfo(gradeId) {
  return request({
    url: '/schoolInfo/fun_gradeInfo/' + gradeId,
    method: 'get'
  })
}

// 新增年级信息
export function addFun_gradeInfo(data) {
  return request({
    url: '/schoolInfo/fun_gradeInfo',
    method: 'post',
    data: data
  })
}

// 修改年级信息
export function updateFun_gradeInfo(data) {
  return request({
    url: '/schoolInfo/fun_gradeInfo',
    method: 'put',
    data: data
  })
}

// 删除年级信息
export function delFun_gradeInfo(gradeId) {
  return request({
    url: '/schoolInfo/fun_gradeInfo/' + gradeId,
    method: 'delete'
  })
}
