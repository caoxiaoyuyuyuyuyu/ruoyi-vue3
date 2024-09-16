import request from '@/utils/request'

// 查询leave_mentor列表
export function listLeave_mentor(query) {
  return request({
    url: '/function/leave_mentor/list',
    method: 'get',
    params: query
  })
}

// 查询leave_mentor详细
export function getLeave_mentor(id) {
  return request({
    url: '/function/leave_mentor/' + id,
    method: 'get'
  })
}

// 新增leave_mentor
export function addLeave_mentor(data) {
  return request({
    url: '/function/leave_mentor',
    method: 'post',
    data: data
  })
}

// 修改leave_mentor
export function updateLeave_mentor(data) {
  return request({
    url: '/function/leave_mentor',
    method: 'put',
    data: data
  })
}

// 删除leave_mentor
export function delLeave_mentor(id) {
  return request({
    url: '/function/leave_mentor/' + id,
    method: 'delete'
  })
}
