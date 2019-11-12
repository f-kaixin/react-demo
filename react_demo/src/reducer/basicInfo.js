import * as constants from '../constants/basicInfo'

const initialState = {
	user_infos: {
		id: '',
		user: '',
		job: '',
		department: '',
		to_release_editions: 0,
		to_exam_rels: 0,
		to_optimizes_crs: 0,
	}
}

const basicInfoReducer = (state = initialState, action) => {
	switch(action.type) {
		case constants.Set_User:
			return Object.assign({}, state, {user_infos: action.user_infos})
		default:
			return state
	}
}

export default basicInfoReducer