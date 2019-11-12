import * as constants from '../constants/test.js'

const initialState = {
	test: 'initial state'
}

const testReducer = (state = initialState, action) => {
	// console.log(action)
	// console.log(action.type)
	// console.log(action.test)
	// console.log(constants.Test_Data1)
	switch(action.type) {
		case constants.Test_Data1:
			// console.log('发生了改变1')
			// console.log(Object.assign({}, state, {
			// 	test: action.test
			// }))
			return Object.assign({}, state, {
				test: action.test
			})
		case constants.Test_Data2:
			return Object.assign({}, state, {
				test: action.test
			})
		case constants.Test_Data3:
			return Object.assign({}, state, {
				test: action.test
			})
		default:
			// console.log('没有改变')
			return state
	}
}

export default testReducer