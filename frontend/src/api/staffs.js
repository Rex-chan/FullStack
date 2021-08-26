// import request from '@/utils/request'

// export function add(data) {
//   return request({
//     url: '/api/staffs/add',
//     method: 'post',
//     data
//   })
// }


import request from '@/utils/axios'
import qs from 'qs'

export const add = params => {
  return request.post('/api/staffs/add', params).then(res => res)
}
