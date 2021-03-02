import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/disease/list',
    method: 'get',
    params: query
  })
}

export function disUploadFile(data) {
  return request({
    url: '/vue-element-admin/disease/upload',
    method: 'post',
    data
  })
}

export function fetchDisease(data) {
  return request({
    url: `/vue-element-admin/disease/detail`,
    method: 'post',
    data
  })
}

export function fetchArticleInfo(data) {
  return request({
    url: `/vue-element-admin/disease/info`,
    method: 'post',
    data
  })
}
export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/disease/create',
    method: 'post',
    data
  })
}
// 修改表
export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/disease/update',
    method: 'put',
    data
  })
}

export function removeArticle(data) {
  return request({
    url: '/vue-element-admin/disease/remove',
    method: 'put',
    data
  })
}

// 删除样本测序表记录
export function deleteArticle(sequence_id) {
  return request({
    url: `/vue-element-admin/disease/delete/${sequence_id}`,
    method: 'delete',
  })
}



export function importExcel(data) {
    return request({
      url: '/vue-element-admin/disease/import',
      method: 'post',
      data
    })
  }
