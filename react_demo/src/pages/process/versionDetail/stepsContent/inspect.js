import React, { Component } from 'react';
import { deleteRelatedRequest } from 'src/api/index.js'
import { Steps, Card, Spin, Tabs, Table, Icon, Button, Modal, message } from 'antd';
import { IF_MENTION, CODE_STATUS, MERGE_STATUS, RELATED_STATUS, TEST_TYPE, TEST_STATUS, INSPECT_STATUS } from 'src/common/enum.js'

class Inspect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestList: [],
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
                    title: '涉及开发',
                    dataIndex: 'developer',
                    key: 'developer',
                },
                {
                    title: '是否提测',
                    dataIndex: 'if_mention',
                    key: 'if_mention',
                    render: (text) => (
                        <span>{getObjLabel(text, IF_MENTION)}</span>
                    )
                },
                {
                    title: '质检状态',
                    dataIndex: 'inspect_status',
                    key: 'inspect_status',
                    render: (text) => (
                        <span style={text === 0 ? {color: '#d67c1c'} : {}}>{getObjLabel(text, INSPECT_STATUS)}</span>
                    )
                },
                {
                  title: '操作',
                  key: 'action',
                  render: (text, record) => (
                    <div className="action-btns">
                        <Button type="primary" icon="login" disabled>批量CR邀请</Button>
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

    // 设置列表数据
    setTableData = () => {
    }

    viewRequest = () => {
        Modal.warning({
            title: '查看需求',
            content: '跳转到TAPD失败...',
        });
    }

    render() {
        const requestList = this.state.requestList;

        return (
            <div id="version_plan">
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

export default Inspect;