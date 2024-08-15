import request from '@/utils/request'

// 查询学校通知列表
export function listFun_notice(query) {
  return request({
    url: '/function/fun_notice/list',
    method: 'get',
    params: query
  })
}

// 查询学校通知详细
export function getFun_notice(id) {
  return request({
    url: '/function/fun_notice/' + id,
    method: 'get'
  })
}

// 新增学校通知
export function addFun_notice(data) {
  return request({
    url: '/function/fun_notice',
    method: 'post',
    data: data
  })
}

// 修改学校通知
export function updateFun_notice(data) {
  return request({
    url: '/function/fun_notice',
    method: 'put',
    data: data
  })
}

// 删除学校通知
export function delFun_notice(id) {
  return request({
    url: '/function/fun_notice/' + id,
    method: 'delete'
  })
}
