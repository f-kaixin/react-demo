import React, { Component } from 'react';
import { deleteRelatedRequest } from 'src/api/index.js'
import { Steps, Card, Spin, Tabs, Table, Icon, Button, Modal, message } from 'antd';
import { IF_MENTION, CODE_STATUS, MERGE_STATUS, RELATED_STATUS, TEST_TYPE, TEST_STATUS } from 'src/common/enum.js'

class TestManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestList: [],
            applyLoading: false,
            tableLoading: false,
            selectedRowKeys: [],
            showDelModal: false,
            submitDelLoading: false,
            modalText: '',
            toDelRequestId: undefined,
            columns: [
                {
                    title: '需求名称',
                    dataIndex: 'request_name',
                    key: 'request_name',
                    render: text => <a onClick={this.viewRequest}>{text}</a>,
                },
                {
                    title: '是否提测',
                    dataIndex: 'if_mention',
                    key: 'if_mention',
                    render: (text) => (
                        <span>{getObjLabel(text, IF_MENTION)}</span>
                    )
                },
                { title: '预计提测时间', dataIndex: 'estimate_time', key: 'estimate_time', width: 120, },
                {
                    title: '是否提测',
                    dataIndex: 'if_start_test',
                    key: 'if_start_test',
                    render: (text) => (
                        <span>{getObjLabel(text, TEST_TYPE)}</span>
                    )
                },
                {
                    title: '测试状态',
                    dataIndex: 'test_status',
                    key: 'test_status',
                    render: (text) => (
                        <span>{getObjLabel(text, TEST_STATUS)}</span>
                    )
                },
                {
                  title: '操作',
                  key: 'action',
                  width: 460,
                  render: (text, record) => (
                    <div className="action-btns">
                        <Button type="primary" icon="login" loading={record.relatedLoading} onClick={() => {this.arrangeEnvir(1, record)}}>项目环境部署</Button>
                    </div>
                  ),
                },
            ],
        }
    }

    componentDidMount(){
        let _this = this;
        setTimeout(() => {
            let requestList = _this.props.requestList.map(item => {
                let project_list = item.project_list.map(citem => {
                    return Object.assign({}, citem, {key: citem.project_id});
                });
                return Object.assign({}, item, {
                    key: item.request_id,
                    relatedLoading: false,
                    project_list
                })
            });
            _this.setState({
                tableLoading: true
            }, () => {
                _this.setState({
                    requestList
                }, () => {
                    _this.setTableData();
                    _this.setState({
                        tableLoading: false
                    })
                })
            })
        }, 333)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            requestList: nextProps.requestList
        }, () => {
            this.setTableData();
        })
    }

    // 选中列表环境
    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };

    // 设置列表数据
    setTableData = () => {
    }

    viewRequest = () => {
        Modal.warning({
            title: '查看需求',
            content: '跳转到TAPD失败...',
        });
    }

    // 部署项目环境
    arrangeEnvir = (type, record) => {
        type === 0 ?
            this.setState({
                applyLoading: true
            }) :
            record.relatedLoading = true;
        let _this = this;
        setTimeout(() => {
            type === 0 ?
                _this.setState({
                    applyLoading: false
                }) :
                record.relatedLoading = false;
                message.success(`正在为需求部署项目环境`);
                _this.props.getRequestLists();
        }, 500);
    }

    render() {
        const requestList = this.state.requestList;

        return (
            <div id="version_plan">
                <Button icon="login" type="primary" loading={this.state.applyLoading} disabled={!this.state.selectedRowKeys.length} onClick={() => {this.arrangeEnvir(0)}}>批量项目环境申请</Button>
                
                <Spin spinning={this.state.tableLoading}>
                    <Table 
                        className="request-plan-table"
                        columns={this.state.columns} 
                        dataSource={requestList} 
                        rowKey={ row=> row.key } 
                        pagination={{
                            defaultCurrent: 1,
                            defaultPageSize: 100,
                            total: requestList.length,
                            showTotal: (total) => `共${requestList.length}条`,
                        }}  
                    />
                </Spin>
            </div>
        )
    }
}

export default TestManage;