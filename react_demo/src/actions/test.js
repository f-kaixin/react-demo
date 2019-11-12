import store from 'src/store/index'
import * as constants from '../constants/test'

export const firstStoreDemo = (test) => {
	return  store.dispatch({
			 	type: constants.Test_Data1,
                test
			 })
}

export const secStoreDemo = (test) => {
	return  store.dispatch({
			 	type: constants.Test_Data2,
                test
			 })
}

export const thiStoreDemo = (test) => {
	return  store.dispatch({
			 	type: constants.Test_Data3,
                test
			 })
}