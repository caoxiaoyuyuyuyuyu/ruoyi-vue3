import request from '@/utils/request'

// 查询宿舍信息列表
export function listBuildingInfo(query) {
  return request({
    url: '/schoolInfo/buildingInfo/list',
    method: 'get',
    params: query
  })
}

// 查询宿舍信息详细
export function getBuildingInfo(buildingId) {
  return request({
    url: '/schoolInfo/buildingInfo/' + buildingId,
    method: 'get'
  })
}

// 新增宿舍信息
export function addBuildingInfo(data) {
  return request({
    url: '/schoolInfo/buildingInfo',
    method: 'post',
    data: data
  })
}

// 修改宿舍信息
export function updateBuildingInfo(data) {
  return request({
    url: '/schoolInfo/buildingInfo',
    method: 'put',
    data: data
  })
}

// 删除宿舍信息
export function delBuildingInfo(buildingId) {
  return request({
    url: '/schoolInfo/buildingInfo/' + buildingId,
    method: 'delete'
  })
}
