import axios from 'axios'
import { getSearchParam } from 'utils'
import { getItem } from 'utils/storage'
import CONSTANTS from 'constants'
import baseConfig from '../config'

const fetchConfig = () => {
  const config = {
    get: {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-MARS-TOKEN': getSearchParam('minToken') || getItem('lhcSid') || '',
      },
    },
    post: {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-MARS-TOKEN': getSearchParam('minToken') || getItem('lhcSid') || '',
      },
    },
  }
  return config
}

const instance = axios.create({
  baseURL: '/',
  timeout: 20000,
  headers: { Accept: '*/*' },
})

instance.interceptors.request.use(request => {
  if (/^\/dtracker\//.test(request.url)) {
    request.url = baseConfig.dtrackerDomain + request.url
  }
  const data = request.params
  const config = fetchConfig()

  request.params = {
    t: Date.now(),
  }

  if (request.method === 'get') {
    request.params['data'] = data || {}
    request.headers['Content-Type'] = config['get']['headers']['Content-Type']
    request.headers['X-MARS-TOKEN'] = config['get']['headers']['X-MARS-TOKEN']
  }

  if (request.method === 'post') {
    request.data =
      'data=' + encodeURIComponent(JSON.stringify(request.data || {}))
    request.headers['Content-Type'] = config['post']['headers']['Content-Type']
    request.headers['X-MARS-TOKEN'] = config['post']['headers']['X-MARS-TOKEN']
  }

  return request
})

instance.interceptors.response.use(
  ({ data }) => {
    if (data.code === CONSTANTS.API_CODE_NEED_LOGIN) {
      location.href = '/login'
    }
    if (!data.success) {
      window.showError(data)
    }
    return data
  },
  err => {
    let error
    if (err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
      error = {
        code: '-1',
        msg: '请求超时未响应',
      }
    } else {
      error = {
        code: `${(err && err.response && err.response.status) || '-1'}`,
        msg: (err && err.message) || '未知错误',
      }
    }
    return window.showError(error)
  }
)

export default instance
