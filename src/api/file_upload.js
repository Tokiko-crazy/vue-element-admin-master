import request from '@/utils/request'

export function uploadFile(data) {
    return request({
      url: '/vue-element-admin/sequences/upload',
      method: 'post',
      data
    })
  }