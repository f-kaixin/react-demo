import React, { Component } from 'react';
import { deleteRelatedRequest } from 'src/api/index.js'
import { Steps, Card, Spin, Tabs, Table, Icon, Button, Modal, message } from 'antd';
import { IF_MENTION, CODE_STATUS, MERGE_STATUS, RELATED_STATUS } from 'src/common/enum.js'

class VersionPlan extends Component {
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
                { title: '需求id', dataIndex: 'request_id', key: 'request_id', width: 120, },
                {
                    title: '需求名称',
                    dataIndex: 'request_name',
                    key: 'request_name',
                    width: 196,
                    render: text => <a onClick={this.viewRequest}>{text}</a>,
                },
                {
                    title: '是否提测',
                    dataIndex: 'if_mention',
                    key: 'if_mention',
                    width: 96,
                    render: (text) => (
                        <span>{getObjLabel(text, IF_MENTION)}</span>
                    )
                },
                { title: '创建人', dataIndex: 'creator', key: 'creator', width: 96, },
                {
                    title: '代码状态',
                    dataIndex: 'code_status',
                    key: 'code_status',
                    width: 96,
                    render: (text) => (
                        <span>{getObjLabel(text, CODE_STATUS)}</span>
                    )
                },
                {
                    title: '涉及开发',
                    dataIndex: 'developer',
                    key: 'developer',
                    width: 150,
                    render: text => <span>{text}</span>,
                },
                {
                    title: '项目环境信息',
                    dataIndex: 'envir_info',
                    key: 'envir_info',
                    width: 240,
                    render: text => (
                        <div className="project-envir-info">
                            <p>group:{text.group}</p>
                            <p>IP:{text.ip}</p>
                        </div>
                    ),
                },
                {
                  title: '操作',
                  key: 'action',
                  width: 460,
                  render: (text, record) => (
                    <div className="action-btns">
                        <Button type="primary" icon="api">关联工程</Button>
                        <Button type="primary" icon="login" loading={record.relatedLoading} onClick={() => {this.applyEnvir(1, record)}}>项目环境申请</Button>
                        <Button type="danger" icon="delete" onClick={() => {this.deleteRequest(record)}}>剔除需求</Button>
                    </div>
                  ),
                },
            ],
            expandedColumns: [
                { title: '工程名', dataIndex: 'project_name', key: 'project_name', width: 150, },
                { title: '分支名', dataIndex: 'rel_name', key: 'rel_name', },
                {
                    title: '合并状态',
                    dataIndex: 'merge_status',
                    key: 'merge_status',
                    render: (text) => (
                        <span>{getObjLabel(text, MERGE_STATUS)}</span>
                    )
                },
                {
                    title: '分支关联状态',
                    dataIndex: 'related_status',
                    key: 'related_status',
                    render: (text) => (
                        <span>{getObjLabel(text, RELATED_STATUS)}</span>
                    )
                },
                {
                    title: '提交人',
                    dataIndex: 'submitter',
                    key: 'submitter',
                },
                {
                    title: '操作',
                    key: 'projectAction',
                    render: (text) => (
                        <a onClick={this.viewCode}><Icon type="link" />查看代码</a>
                    )
                },
            ]
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

    viewCode = () => {
        Modal.warning({
            title: '查看代码',
            content: '跳转到git仓库失败...',
        });
    }

    // 申请项目环境
    applyEnvir = (type, record) => {
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
                message.success(`正在为需求申请项目环境`);
                _this.props.getRequestLists();
        }, 500);
    }

    // 剔除需求
    deleteRequest = (record) => {
        this.setState({
            modalText: `确定要删除需求${record.request_name}吗`,
            toDelRequestId: record.request_id,
            showDelModal: true
        })
    }
    
    handleDelOk = () => {
        this.setState({
            submitDelLoading: true,
        }, () => {
            deleteRelatedRequest({id: this.state.toDelRequestId}).then(res => {
                if (res.retcode === 0) {
                    if (res.ifOk) {
                        this.setState({
                            showDelModal: false
                        })
                        message.success('删除需求成功');
                        this.props.getRequestLists();
                    } else {
                        message.error('删除需求失败，请重新尝试');
                    }
                }
                this.setState({
                    submitDelLoading: false,
                })
            })
        })
    }

    handleDelCancel = () => {
        this.setState({
            submitDelLoading: false,
            showDelModal: false
        })
    }

    render() {
        const requestList = this.state.requestList;
        const expandedRowRender = (row) => {
            console.log(row)
            return <Table columns={this.state.expandedColumns} dataSource={row.project_list} rowKey={row=>row.key} pagination={false} />;
        };
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange,
        };

        return (
            <div id="version_plan">
                <Button icon="login" type="primary" loading={this.state.applyLoading} disabled={!this.state.selectedRowKeys.length} onClick={() => {this.applyEnvir(0)}}>批量项目环境申请</Button>
                
                <Spin spinning={this.state.tableLoading}>
                    <Table 
                        className="request-plan-table"
                        columns={this.state.columns} 
                        dataSource={requestList} 
                        expandedRowRender={row =>expandedRowRender(row)}
                        rowKey={ row=> row.key } 
                        rowSelection={rowSelection}
                        pagination={{
                            defaultCurrent: 1,
                            defaultPageSize: 100,
                            total: requestList.length,
                            showTotal: (total) => `共${requestList.length}条`,
                        }}  
                    />
                </Spin>

                <Button type="dashed" icon="plus" block onClick={this.props.addRequest}>
                    关联需求
                </Button>

                <Modal
                    id="delete_request_dialog"
                    title="删除需求"
                    visible={this.state.showDelModal}
                    onOk={this.handleDelOk}  
                    confirmLoading={this.state.submitDelLoading}
                    onCancel={this.handleDelCancel}
                    >
                    <p>{this.state.modalText}</p>
                </Modal>
            </div>
        )
    }
}

export default VersionPlan;