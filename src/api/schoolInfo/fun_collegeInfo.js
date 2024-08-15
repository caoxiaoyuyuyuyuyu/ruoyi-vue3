import request from '@/utils/request'

// 查询学院信息列表
export function listFun_collegeInfo(query) {
  return request({
    url: '/schoolInfo/fun_collegeInfo/list',
    method: 'get',
    params: query
  })
}

// 查询学院信息详细
export function getFun_collegeInfo(collegeId) {
  return request({
    url: '/schoolInfo/fun_collegeInfo/' + collegeId,
    method: 'get'
  })
}

// 新增学院信息
export function addFun_collegeInfo(data) {
  return request({
    url: '/schoolInfo/fun_collegeInfo',
    method: 'post',
    data: data
  })
}

// 修改学院信息
export function updateFun_collegeInfo(data) {
  return request({
    url: '/schoolInfo/fun_collegeInfo',
    method: 'put',
    data: data
  })
}

// 删除学院信息
export function delFun_collegeInfo(collegeId) {
  return request({
    url: '/schoolInfo/fun_collegeInfo/' + collegeId,
    method: 'delete'
  })
}
