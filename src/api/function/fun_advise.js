import request from '@/utils/request'

// 查询投诉与建议列表
export function listFun_advise(query) {
  return request({
    url: '/function/fun_advise/list',
    method: 'get',
    params: query
  })
}

// 查询投诉与建议详细
export function getFun_advise(id) {
  return request({
    url: '/function/fun_advise/' + id,
    method: 'get'
  })
}

// 新增投诉与建议
export function addFun_advise(data) {
  return request({
    url: '/function/fun_advise',
    method: 'post',
    data: data
  })
}

// 修改投诉与建议
export function updateFun_advise(data) {
  return request({
    url: '/function/fun_advise',
    method: 'put',
    data: data
  })
}

// 删除投诉与建议
export function delFun_advise(id) {
  return request({
    url: '/function/fun_advise/' + id,
    method: 'delete'
  })
}
