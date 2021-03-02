import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/result/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(data) {
  return request({
    url: `/vue-element-admin/result/detail`,
    method: 'post',
    data
  })
}

export function resultUploadFile(data) {
  return request({
    url: '/vue-element-admin/result/upload',
    method: 'post',
    data
  })
}

export function fetchCoverage() {
  return request({
    url: '/vue-element-admin/result/coverage',
    method: 'get',
    // params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/result/create',
    method: 'post',
    data
  })
}
// 修改样本测序表
export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/result/update',
    method: 'put',
    data
  })
}

export function removeArticle(data) {
  return request({
    url: '/vue-element-admin/result/remove',
    method: 'put',
    data
  })
}

// 删除样本测序表记录
export function deleteArticle(sequence_id) {
  return request({
    url: `/vue-element-admin/result/delete/${sequence_id}`,
    method: 'delete',
  })
}

importExcel//导入excel
export function importExcel(data) {
  return request({
    url: '/vue-element-admin/result/import',
    method: 'post',
    data
  })
}
