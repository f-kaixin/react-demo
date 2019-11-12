// 版本类型
export const EDITION_TYPE = [
    {
        label: '日常版本',
        value: 1,
    },
    {
        label: '补丁版本',
        value: 2,
    },
]

// 版本流程
export const EDITION_STEP = [
    {
        label: '版本规划',
        value: 0,
    },
    {
        label: '版本质检',
        value: 1,
    },
    {
        label: '测试管理',
        value: 2,
    },
    {
        label: '版本发布',
        value: 3,
    },
    {
        label: '发布观察',
        value: 4,
    },
    {
        label: '发布完成',
        value: 5,
    },
]

// 业务线
export const BUSINESS_LINE = [
    {
        label: '管理委员会',
        value: 10,
    },
    {
        label: '消费金融线',
        value: 11,
    },
    {
        label: '电商业务线',
        value: 12,
    },
    {
        label: '风险策略线',
        value: 13,
    },
    {
        label: '金融资管线',
        value: 14,
    },
    {
        label: '区域营销线',
        value: 15,
    },
    {
        label: '集团职能线',
        value: 16,
    },
    {
        label: '技术管理线',
        value: 17,
    },
    {
        label: '理财产品部',
        value: 18,
    },
    {
        label: '客户服务部',
        value: 19,
    },
    {
        label: '市场公关部',
        value: 20,
    },
]

// 线上问题类型
export const QUESTION_TYPE = [
    {
        label: '逻辑错误',
        value: 10,
    },
    {
        label: '压力过载',
        value: 11,
    },
    {
        label: '配置错误',
        value: 12,
    },
    {
        label: '代码覆盖',
        value: 13,
    },
    {
        label: '其他',
        value: 14,
    },
]

// 工程列表
export const PROJECT_LIST = [
    {
        label: 'crm_web',
        value: 1001,
    },
    {
        label: 'hr_web',
        value: 1002,
    },
    {
        label: 'oa_web',
        value: 1003,
    },
    {
        label: 'publish_web',
        value: 1004,
    },
    {
        label: 'qulity_web',
        value: 1005,
    },
    {
        label: 'home_web',
        value: 1006,
    },
    {
        label: 'risk_web',
        value: 1007,
    },
    {
        label: 'risk_java',
        value: 1008,
    },
    {
        label: 'router_java',
        value: 1009,
    },
    {
        label: 'sale_java',
        value: 1010,
    },
    {
        label: 'middleware_java',
        value: 1011,
    },
    {
        label: 'oa_java',
        value: 1012,
    },
]

// 审批状态
export const APPROVAL_STATUS = [
    {
        label: '待审批',
        value: 0,
    },
    {
        label: '审批中',
        value: 1,
    },
    {
        label: '审批完成',
        value: 2,
    }
]

// 是否提测
export const IF_MENTION = [
    { label: '是', value: 0, },
    { label: '否', value: 1, },
]

// 代码状态
export const CODE_STATUS = [
    { label: '未发布', value: 0, },
    { label: '发布中', value: 1, },
    { label: '已发布', value: 2, },
]

// 合并状态
export const MERGE_STATUS = [
    { label: '未合并', value: 0, },
    { label: '已合并', value: 1, },
]

// 分支关联状态
export const RELATED_STATUS = [
    { label: '未关联', value: 0, },
    { label: '关联中', value: 1, },
    { label: '已关联', value: 2, },
]

// 应用类型
export const APPLICATION_TYPE = [
    { label: 'java应用', value: 0, },
    { label: '静态应用', value: 1, },
    { label: 'php', value: 2, },
]

// 是否提测
export const TEST_TYPE = [
    { label: '是', value: 0, },
    { label: '否', value: 1, },
]

// 测试状态
export const TEST_STATUS = [
    { label: '未提测', value: 0, },
    { label: '已提测', value: 1, },
    { label: '提测中', value: 2, },
    { label: '测试完成', value: 3, },
]

// 质检状态
export const INSPECT_STATUS = [
    { label: '已通过', value: 0, },
    { label: '未通过', value: 1, },
]

