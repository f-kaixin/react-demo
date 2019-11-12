// 引入axios配置
import axios from 'src/axios/index.js';

// 引入mock
if (process.env.NODE_ENV ==='development') {
    require('../mock/index.js');
}

// 鉴权
export const authSession = (data) => {
    return axios.post(`/auth_session.json`, data);
};

// 获取版本列表数据
export const getEditions = (data) => {
    return axios.get(`/get_editions.json`, {params: data});
};

// 编辑（新增/修改）版本
export const editEdition = (data) => {
    return axios.post(`/edit_edition.json`, data);
};

// 查询过程管理-版本列表
export const queryEditions = (data) => {
    return axios.get(`/query_editions.json`, {params: data});
};

// 删除版本
export const deleteVersion = (data) => {
    return axios.post(`/delete_version.json`, data);
};

// 获取需求列表
export const getRequestLists = (data) => {
    return axios.get(`/get_request_lists.json`, {params: data});
};

// 删除版本
export const deleteRelatedRequest = (data) => {
    return axios.post(`/delete_related_request.json`, data);
};

// 添加需求到版本
export const addProjectsToVersion = (data) => {
    return axios.post(`/add_projects_to_version.json`, data);
};

// 获取项目机器ip
export const getMachineIp = (data) => {
    return axios.get(`/get_machine_ip.json`, {params: data});
};

// 获取日志记录
export const getLogs = (data) => {
    return axios.get(`/get_log.json`, {params: data});
};

// 获取应用发布信息
export const getPublishData = (data) => {
    return axios.get(`/get_publish_data.json`, {params: data});
};