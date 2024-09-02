import request from '@/utils/request'

// 查询卫检成绩列表
export function listFun_hygiene(query) {
  return request({
    url: '/function/fun_hygiene/list',
    method: 'get',
    params: query
  })
}

// 查询卫检成绩详细
export function getFun_hygiene(id) {
  return request({
    url: '/function/fun_hygiene/' + id,
    method: 'get'
  })
}

// 新增卫检成绩
export function addFun_hygiene(data) {
  return request({
    url: '/function/fun_hygiene',
    method: 'post',
    data: data
  })
}

// 修改卫检成绩
export function updateFun_hygiene(data) {
  return request({
    url: '/function/fun_hygiene',
    method: 'put',
    data: data
  })
}

// 删除卫检成绩
export function delFun_hygiene(id) {
  return request({
    url: '/function/fun_hygiene/' + id,
    method: 'delete'
  })
}
