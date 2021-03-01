import fetch from 'utils/fetch'

export default {
  // report
  queryAssistant (params) {
    return fetch.post('/mars/salesStatisticsy/search', params)
  },
  querySaleList (params) {
    return fetch.post('/mars/clerk/querySale', params)
  },
}
