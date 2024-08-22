import request from '@/utils/request'
const miniUrl = import.meta.env.VITE_APP_MINI_API

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
export async function delFun_user(id) {
  // 删除逻辑
  const formData = new FormData();
  formData.append('ids', id);

  try {
    const response = await fetch(miniUrl+'/upload/deleteAvatar', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // 如果服务器返回的是JSON数据
    const data = await response.json(); 

    console.log('上传成功:', data);

    // 返回request调用
    return request({
      url: `/function/fun_user/${id}`,
      method: 'delete'
    });
  } catch (error) {
    console.error('上传失败:', error);
    throw error; // 抛出错误以便外部捕获
  }
}
