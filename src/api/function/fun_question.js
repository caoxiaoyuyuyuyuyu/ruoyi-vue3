import request from '@/utils/request'

// 查询问卷中的问题列表
export function listFun_question(query) {
  return request({
    url: '/function/fun_question/list',
    method: 'get',
    params: query
  })
}

// 查询问卷中的问题列表
export function list_question_for_chart(id) {
  return request({
    url: '/function/fun_question/chart/' + id,
    method: 'get',
  })
}

// 查询问卷中的问题详细
export function getFun_question(id) {
  return request({
    url: '/function/fun_question/' + id,
    method: 'get'
  })
}

// 新增问卷中的问题
export function addFun_question(data) {
  return request({
    url: '/function/fun_question',
    method: 'post',
    data: data
  })
}

// 修改问卷中的问题
export function updateFun_question(data) {
  return request({
    url: '/function/fun_question',
    method: 'put',
    data: data
  })
}

// 删除问卷中的问题
export function delFun_question(id) {
  return request({
    url: '/function/fun_question/' + id,
    method: 'delete'
  })
}
