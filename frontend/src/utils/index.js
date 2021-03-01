export const isPhoneNumber = obj => {
  let out = parseInt(obj)
  if (isNaN(out)) return false
  return /^1[34578]\d{9}$/.test(out)
}

let timer
// 防抖
export const debounce = (fn, delay = 500) => {
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      return fn.apply(this, args)
    }, delay)
  }
}

// 保存数据
export const saveData = (state, payload) => {
  let stateCopy = Object.assign({}, state)
  for (let key in payload) {
    if (payload[key] !== undefined) {
      stateCopy[key] = payload[key]
    }
  }
  return stateCopy
}

export const filter = (arr, data) => {
  const selectRows = []
  arr.forEach(element => {
    data.forEach((item, index) => {
      if (element.barcode === item.barcode) {
        selectRows.push(index)
      }
    })
  })
  return selectRows
}

export const getSearchParam = param => {
  const url = window.location.href
  if (url.indexOf('__path__') > -1) {
    let search = parseQuery(window.location.search).__path__
    search = search.substr(search.indexOf('?'))
    return parseQuery(search)[param]
  } else {
    return parseQuery(window.location.search)[param]
  }
}

const parseQuery = search => {
  if (!search || search.length === 1) {
    return {}
  }
  return unparams(search.slice(1))
}

const unparams = str => {
  let params = {}
  str = str.split('&')
  for (let i = 0; i < str.length; i++) {
    let item = str[i].split('=')
    params[item[0]] = decodeURIComponent(item[1])
  }
  return params
}
