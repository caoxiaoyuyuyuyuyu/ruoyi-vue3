import request from '@/utils/request'
const miniUrl = import.meta.env.VITE_APP_MINI_API

// 查询leave_post列表
export function listLeave_post(query) {
  return request({
    url: '/function/leave_post/list',
    method: 'get',
    params: query
  })
}

// 查询leave_post详细
export function getLeave_post(id) {
  return request({
    url: '/function/leave_post/' + id,
    method: 'get'
  })
}

// 新增leave_post
export function addLeave_post(data) {
  return request({
    url: '/function/leave_post',
    method: 'post',
    data: data
  })
}

// 审核请假
export async function reviewLeave_post(data) {
  data.createdAt=null
  data.updatedAt=null
  console.log(JSON.stringify(data))
  const response = await fetch(miniUrl+'/leavePosts/reviewLeavePost', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // 如果服务器返回的是JSON数据
  return await response.json(); 
}

// 修改leave_post
export function updateLeave_post(data) {
  data.createdAt=null
  data.updatedAt=null
  return request({
    url: '/function/leave_post',
    method: 'put',
    data: data
  })
}

// 删除leave_post
export function delLeave_post(id) {
  return request({
    url: '/function/leave_post/' + id,
    method: 'delete'
  })
}
