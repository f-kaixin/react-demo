/**
 * 对Axios异步请求库进行包装后作为一个新模块抛出，Axios文档传送门：https://github.com/mzabriskie/axios
 */
import axios from 'axios';
import { notification } from 'antd';

// axios 配置
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.withCredentials = true;
// axios.defaults.baseURL = `https://xxx.oa.fenqile.com`;

// 弹出提醒
const openNotification  = (description, type = 'warning', message = '提醒', duration = 3000) => {
    notification[type]({
        message,
        description,
        duration
    });
   
}

axios.interceptors.response.use(function (res) {
    if ('development' === process.env.NODE_ENV) {
        console.log('interceptors.response:', res);
    }
    const data = res.data;
    const retcode = parseInt(data.retcode);
    data.retcode = retcode;

    switch (retcode) {
        case 0:
            break;
        case 10:
            window.location.href = `${window.location.protocol}//login`;
            break;
        case 20:
            openNotification('查询超时或异常，请重新尝试或减小搜索范围');
            break;
        default:
            openNotification('请求失败，请重新尝试');
    }
    return data
}, function (error) {
    openNotification('接口出现错误，请重新尝试~~');
    return Promise.resolve(error);
});
export default axios;