import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/sequences/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(data) {
  return request({
    url: `/vue-element-admin/sequences/detail`,
    method: 'post',
    data
  })
}

export function fetchArticleInfo(data) {
  return request({
    url: `/vue-element-admin/sequences/info`,
    method: 'post',
    data
  })
}

export function fetchOrigin() {
  return request({
    url: '/vue-element-admin/sequences/origin',
    method: 'get',
    // params: { pv }
  })
}

export function fetchDiseaseType(query=null) {
  return request({
    url: '/vue-element-admin/sequences/type',
    method: 'get',
    params: { query }
  })
}

export function uploadFile(data) {
  return request({
    url: '/vue-element-admin/sequences/upload',
    method: 'post',
    data
  })
}

export function fetchBeiZhu(query=null) {
  return request({
    url: '/vue-element-admin/sequences/beizhu',
    method: 'get',
    params: { query }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/sequences/create',
    method: 'post',
    data
  })
}
// 修改样本测序表
export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/sequences/update',
    method: 'put',
    data
  })
}

// 删除样本测序表记录
export function deleteArticle(sequence_id) {
  return request({
    url: `/vue-element-admin/sequences/delete/${sequence_id}`,
    method: 'delete',
  })
}

//导入excel
export function importExcel(data) {
  return request({
    url: '/vue-element-admin/sequences/import',
    method: 'post',
    data
  })
}
