import request from '@/utils/request'

// 查询班级信息列表
export function listFun_classInfo(query) {
  return request({
    url: '/schoolInfo/fun_classInfo/list',
    method: 'get',
    params: query
  })
}

// 查询班级信息详细
export function getFun_classInfo(classId) {
  return request({
    url: '/schoolInfo/fun_classInfo/' + classId,
    method: 'get'
  })
}

// 新增班级信息
export function addFun_classInfo(data) {
  return request({
    url: '/schoolInfo/fun_classInfo',
    method: 'post',
    data: data
  })
}

// 修改班级信息
export function updateFun_classInfo(data) {
  return request({
    url: '/schoolInfo/fun_classInfo',
    method: 'put',
    data: data
  })
}

// 删除班级信息
export function delFun_classInfo(classId) {
  return request({
    url: '/schoolInfo/fun_classInfo/' + classId,
    method: 'delete'
  })
}
