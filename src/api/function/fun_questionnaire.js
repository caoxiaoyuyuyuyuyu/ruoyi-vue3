import request from '@/utils/request'

// 查询问卷列表
export function listFun_questionnaire(query) {
  return request({
    url: '/function/fun_questionnaire/list',
    method: 'get',
    params: query
  })
}

// 查询问卷详细
export function getFun_questionnaire(id) {
  return request({
    url: '/function/fun_questionnaire/' + id,
    method: 'get'
  })
}

// 新增问卷
export function addFun_questionnaire(data) {
  return request({
    url: '/function/fun_questionnaire',
    method: 'post',
    data: data
  })
}

// 修改问卷
export function updateFun_questionnaire(data) {
  return request({
    url: '/function/fun_questionnaire',
    method: 'put',
    data: data
  })
}

// 删除问卷
export function delFun_questionnaire(id) {
  return request({
    url: '/function/fun_questionnaire/' + id,
    method: 'delete'
  })
}
