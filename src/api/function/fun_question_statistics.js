import request from '@/utils/request'

// 查询问卷作答统计列表
export function listFun_question_statistics(query) {
  return request({
    url: '/function/fun_question_statistics/list',
    method: 'get',
    params: query
  })
}

// 查询问卷作答统计列表
export function list_statistic_for_chart(id) {
  return request({
    url: '/function/fun_question_statistics/chart/' + id,
    method: 'get',
  })
}

// 查询问卷作答统计详细
export function getFun_question_statistics(id) {
  return request({
    url: '/function/fun_question_statistics/' + id,
    method: 'get'
  })
}

// 新增问卷作答统计
export function addFun_question_statistics(data) {
  return request({
    url: '/function/fun_question_statistics',
    method: 'post',
    data: data
  })
}

// 修改问卷作答统计
export function updateFun_question_statistics(data) {
  return request({
    url: '/function/fun_question_statistics',
    method: 'put',
    data: data
  })
}

// 删除问卷作答统计
export function delFun_question_statistics(id) {
  return request({
    url: '/function/fun_question_statistics/' + id,
    method: 'delete'
  })
}
