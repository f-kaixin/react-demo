import Mock from "mockjs";
const Random = Mock.Random; // Mock.Random 是一个工具类，用于生成各种随机数据

// 设置请求延迟
const duration = '100-600';
// 英文字符
const enCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

// 请求返回内容
const responseContent = (result) => {
    return {
        retcode: 0,
        retmsg: "success",
        result
    }
}

// 配置mock api
const apiConfig = (options) => {
    Mock.setup({
        timeout: options.duration //表示响应时间介于 100 和 600 毫秒之间。默认值是'10-100'。
    })
    Mock.mock(options.url, options.type, options.res);
};


// 鉴权api
apiConfig({
    url: /auth_session.json/,
    type: "post",
    duration,
    res: (options) => {
        const params = JSON.parse(options.body);
        let ifOk = (params.username && params.password) ? true : false;
        let user_infos = {
            id: '3875',
            user: params.username,
            job: '工程师',
            department: '研发管理部-技术线-业余开发组',
            to_release_editions: 3,
            to_exam_rels: 1,
            to_optimizes_crs: 2,
        }

        return responseContent({ 
            ifOk,
            user_infos
        });
    }
});

// 获取版本列表
apiConfig({
    url: /get_editions.json/,
    type: "get",
    duration,
    res: {
        'retcode': 0,
        'editions_list|3-9': [{
            'id|+1': 101,
            'type|1-2': 1,
            'step|0-5': 0,
            'name': '@ctitle',
            'charger': Random.cname(),
            'pub_time': Random.datetime(),
            'business_line': Random.integer(10, 20),
            'link': '@url()',
            'question_type|10-14': 10,
            'desc': '@cparagraph()',
            'code_desc|1-3': [{
                'pub_project|1001-1012': 1001,
                'pub_rel|1-5': 1 
            }]
        }]
    }
});

// 编辑版本
apiConfig({
    url: /edit_edition.json/,
    type: "post",
    duration,
    res: {
        'ifOk': Random.boolean(),
        'retcode|0-1': 0,
    }
});

// 查询过程管理-版本列表
apiConfig({
    url: /query_editions.json/,
    type: "get",
    duration,
    res: {
        'retcode': 0,
        'total|15-42': 15,
        'list|10': [{
            'id|+1': 101,
            'name': '@ctitle',
            'business_line|10-20': 10,
            'type|1-2': 1,
            'request_sum|0-3': 0,
            'charger': Random.cname(),
            'step|0-5': 0,
            'pub_time': Random.datetime(),
            'approval_status|0-2': 0,
            'link': '@url()',
        }]
    }
});

// 删除版本
apiConfig({
    url: /delete_version.json/,
    type: "post",
    duration,
    res: {
        'ifOk': Random.boolean(),
        'err_desc': '@cparagraph()',
        'retcode': 0,
    }
});

// 获取需求列表
apiConfig({
    url: /get_request_lists.json/,
    type: "get",
    duration,
    res: {
        'retcode': 0,
        'list|0-5': [{
            'request_id|+1': 1000000,
            'request_name': Random.cword('零一二三四五六七八九十', 3, 12),
            'if_mention|0-1': 0,
            'creator': Random.cname(),
            'code_status|0-2': 0,
            'developer': Random.cname(),
            'inspect_status|0-1': 0,
            'estimate_time': Random.datetime(),
            'if_start_test|0-1': 0,
            'TEST_STATUS|0-3': 0,
            'envir_info': {
                'group': Random.cname(),
                'ip': '@url()',
            },
            'project_list|1-4': [{
                'project_name|1001-1012': 1001,
                'project_id|+1': 10001,
                'rel_name': Random.cword(enCharacters, 4, 12),
                'merge_status|0-2': 0,
                'related_status|0-2': 0,
                'submitter': Random.cname(),
            }]
        }]
    }
});

// 删除需求列表
apiConfig({
    url: /delete_related_request.json/,
    type: "post",
    duration,
    res: {
        'retcode': 0,
        'ifOk': Random.boolean(),
    }
});

// 添加需求到版本
apiConfig({
    url: /add_projects_to_version.json/,
    type: "post",
    duration,
    res: {
        'retcode': 0,
        'ifOk': Random.boolean(),
    }
});

// 获取项目机器ip
apiConfig({
    url: /get_machine_ip.json/,
    type: "get",
    duration,
    res: {
        'retcode': 0,
        'list|10': [{
            'id|+1': 0,
            'ip|1000000-2000000': 1000000,
        }],
    }
});

// 获取日志
apiConfig({
    url: /get_log.json/,
    type: "get",
    duration,
    res: {
        'retcode': 0,
        'logs': Random.csentence( 100, 200 )
    }
});

// 获取应用发布信息
apiConfig({
    url: /get_publish_data.json/,
    type: "get",
    duration,
    res: {
        'retcode': 0,
        'data|3-4': [{
            'merge_status': 0,
            'application_type|0-2': 0,
            'application_name': Random.cname(),
            'developer': Random.cname(),
            'tag': Random.character(),
        }] 
    }
});




