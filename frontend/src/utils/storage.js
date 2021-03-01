export const getItem = key => {
  const value = window.localStorage.getItem(key)
  return value && JSON.parse(value)
}

export const setItem = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export const removeItem = key => {
  window.localStorage.removeItem(key)
}
