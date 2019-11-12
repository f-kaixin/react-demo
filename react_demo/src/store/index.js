import { createStore, combineReducers } from 'redux'
import basicInfoReducer from 'src/reducer/basicInfo.js'

const reducers = combineReducers({
	basicInfoState: basicInfoReducer
})

const store = createStore(reducers)

export default store