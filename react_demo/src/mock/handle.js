const responseContent = (result) => {
    return {
        retcode: 0,
        retmsg: "success",
        result
    }
}


// 鉴权api
export const handleAuthSession = (params) => {
    return responseContent({ ifOk: (params.username && params.username) ? true : false });
}