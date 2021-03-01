import { init } from '@rematch/core'
import * as models from 'models'
import immer from '@rematch/immer'
import createLoadingPlugin from '@rematch/loading'

// see options API below
const options = {}
const loading = createLoadingPlugin(options)

const store = init({
  plugins: [immer, loading],
  models,
})

export default store
