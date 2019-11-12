import store from 'src/store/index'
import * as constants from 'src/constants/basicInfo.js'

export const setUser = (user_infos) => {
	return  store.dispatch({
        type: constants.Set_User,
        user_infos
    })
}

