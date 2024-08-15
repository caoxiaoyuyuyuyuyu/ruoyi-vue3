import request from '@/utils/request'

// 查询学生信息列表
export function listFun_user(query) {
  return request({
    url: '/function/fun_user/list',
    method: 'get',
    params: query
  })
}

// 查询学生信息详细
export function getFun_user(id) {
  return request({
    url: '/function/fun_user/' + id,
    method: 'get'
  })
}

// 新增学生信息
export function addFun_user(data) {
  return request({
    url: '/function/fun_user',
    method: 'post',
    data: data
  })
}

// 修改学生信息
export function updateFun_user(data) {
  return request({
    url: '/function/fun_user',
    method: 'put',
    data: data
  })
}

// 删除学生信息
export function delFun_user(id) {
  return request({
    url: '/function/fun_user/' + id,
    method: 'delete'
  })
}
