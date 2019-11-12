import React, { Component } from 'react';
import { getRequestLists, addProjectsToVersion } from 'src/api/index.js'
import { Tabs, Modal, Form, Input, Table, Tag, message, Button, Spin, Tooltip  } from 'antd';

const { TabPane } = Tabs;

class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitLoading: false
        }
    }

    // 列表查询
    searchList = () => {
        this.props.getOtherRequests();
    }

    resetForm = () => {
        this.props.form.resetFields();
    }

    render() {
        const {
            form: { getFieldDecorator, getFieldsValue, resetFields },
        } = this.props;
        return (
            <Form ref="searchForm" layout="inline">
                <Form.Item  label="需求名称">
                    {getFieldDecorator('request_name', {})(
                            <Input placeholder="请输入" allowClear/>,
                        )
                    }
                </Form.Item>
                <Form.Item  label="参与开发">
                    {getFieldDecorator('developer')(
                        <Input placeholder="请输入" allowClear/>,
                    )
                }
                </Form.Item>
                <Form.Item  label="需求id">
                    {getFieldDecorator('request_id', {
                    })(
                        <Input placeholder="请输入" allowClear/>,
                    )
                }
                </Form.Item>
                <Form.Item>
                    <Button type="primary" icon="search" onClick={this.searchList} loading={this.state.submitLoading} style={{marginRight: '12px'}}>
                        查询
                    </Button>
                    <Button icon="redo" onClick={this.resetForm}>
                        重置
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}

const WrappedSearchForm = Form.create()(SearchForm);

class AddRequestDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            confirmLoading: false,
            myRequest: {
                columns: [
                    {
                        title: '需求名称',
                        dataIndex: 'request_name',
                        key: 'request_name',
                        render: (text, record) => (
                            <a onClick={() =>{this.viewRequest(record)}}>{text}</a>
                        )
                    },
                    {
                        title: '关联工程',
                        dataIndex: 'related_projects',
                        key: 'related_projects',
                        render: (text, record) => (
                            <Tooltip title={text}>
                                <a onClick={() =>{this.viewProjects(record)}}>{text}</a>
                            </Tooltip>
                        )
                    },
                    { title: '创建人', dataIndex: 'creator', key: 'creator', },
                    { title: '涉及开发', dataIndex: 'developer', key: 'developer', },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        key: 'action',
                        render: (text, record) => (
                            <Button 
                                type="link" 
                                className="act-link-btn" 
                                onClick={() => {this.chooseRequest(0, record)}}
                                disabled={this.state.myRequest.choosedRequests.find(item => item.request_id === record.request_id)}
                                >
                                选择
                            </Button>
                        )
                    },
                ],
                tableData: [],
                currentNum: 1,
                defaultPageSize: 5,
                choosedRequests: [],
            },
            otherRequest: {
                columns: [
                    {
                        title: '需求名称',
                        dataIndex: 'request_name',
                        key: 'request_name',
                        render: (text, record) => (
                            <a onClick={() =>{this.viewRequest(record)}}>{text}</a>
                        )
                    },
                    {
                        title: '关联工程',
                        dataIndex: 'related_projects',
                        key: 'related_projects',
                        render: (text, record) => (
                            <Tooltip title={text}>
                                <a onClick={() =>{this.viewProjects(record)}}>{text}</a>
                            </Tooltip>
                        )
                    },
                    { title: '创建人', dataIndex: 'creator', key: 'creator', },
                    { title: '涉及开发', dataIndex: 'developer', key: 'developer', },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        key: 'action',
                        render: (text, record) => (
                            <Button 
                                type="link" 
                                className="act-link-btn" 
                                onClick={() => {this.chooseRequest(1, record)}}
                                disabled={this.state.otherRequest.choosedRequests.find(item => item.request_id === record.request_id)}
                                >
                                选择
                            </Button>
                        )
                    },
                ],
                tableData: [],
                currentNum: 1,
                defaultPageSize: 5,
                choosedRequests: [],
                tableLoading: false,
            },
        }
    }

    componentDidMount() {
        
    }

    // 获取我的需求
    getMyRequests = () => {
        getRequestLists().then(res => {
            if (res.retcode === 0) {
                let myRequest = this.state.myRequest;
                myRequest.tableData = res.list.map(item => {
                    let related_projects = [];
                    item.project_list.map(citem => {
                        related_projects.push(citem.project_name);
                    })
                    return Object.assign({}, item, {related_projects: related_projects.join(',')});
                });
                this.setState({
                    myRequest
                })
            }
        })
    }

    // 获取其它需求
    getOtherRequests = () => {
        let otherRequest = this.state.otherRequest;
        otherRequest.tableLoading = true;
        this.setState({
            otherRequest
        }, () => {
            getRequestLists().then(res => {
                if (res.retcode === 0) {
                    let otherRequest = this.state.otherRequest;
                    otherRequest.tableData = res.list.map(item => {
                        let related_projects = [];
                        item.project_list.map(citem => {
                            related_projects.push(citem.project_name);
                        })
                        return Object.assign({}, item, {related_projects: related_projects.join(',')});
                    });
                    otherRequest.tableLoading = false;
                    this.setState({
                        otherRequest
                    })
                }
            })
        })
    }

    showModal = () => {
        this.getMyRequests();
        this.getOtherRequests();
        let [myRequest, otherRequest] = [this.state.myRequest, this.state.otherRequest]
        myRequest.choosedRequests = [];
        otherRequest.choosedRequests = [];
        this.setState({
            myRequest,
            otherRequest,
            showModal: true,
        }, () => {
        });
    }

    // 点击确定
    confirmModal = () => {
        let ids = [];
        this.state.myRequest.choosedRequests.map(item => {
            ids.push(item.request_id);
        })
        this.state.otherRequest.choosedRequests.map(item => {
            ids.push(item.request_id);
        })
        if (!ids.length) {
            message.warning('您暂未选择需求');
            return
        }

        this.setState({
            confirmLoading: true,
        }, () => {
            addProjectsToVersion({ids}).then(res => {
                this.setState({
                    confirmLoading: false,
                })
                if (res.retcode === 0) {
                    if (res.ifOk) {
                        this.setState({
                            showModal: false
                        })
                        message.success('添加需求成功');
                        this.props.getRequestLists();
                    } else {
                        message.error('添加需求失败，请重新尝试');
                    }
                }
            })
        })
    }

    closeModal = () => {
        this.setState({
            showModal: false,
        });
    };

    changeTab = (key) => {
    }

    viewRequest = () => {
        Modal.warning({
            title: '查看需求',
            content: '跳转到TAPD失败...',
        });
    }

    viewProjects = () => {
        Modal.warning({
            title: '设置工程',
            content: 'GGGGGGGGG',
        });
    }

    // 选择需求
    chooseRequest = (type, item) => {
        let request = type === 0 ? this.state.myRequest : this.state.otherRequest;
        request.choosedRequests.push(item);
        type === 0 ?
            this.setState({
                myRequest: request
            }) :
            this.setState({
                otherRequest: request
            });
    }

    // 关闭已选需求tag
    closeTag = (type, item) => {
        let request = type === 0 ? this.state.myRequest : this.state.otherRequest;
        request.choosedRequests = request.choosedRequests.filter(citem => citem.request_id !== item.request_id);
        type === 0 ?
            this.setState({
                myRequest: request
            }) :
            this.setState({
                otherRequest: request
            });
    }

    render() {
        const [myRequestInfo, otherRequestInfo] = [this.state.myRequest, this.state.otherRequest];
        let myRequestTags = myRequestInfo.choosedRequests.length ?
            <div className="choosed-requests">
                <span>已选需求：</span>
                <p>
                    {
                        myRequestInfo.choosedRequests.map(item => 
                            <Tag key={item.request_id} color="blue" closable onClose={() => {this.closeTag(0, item)}}>{item.request_name}</Tag>
                        )
                    }
                </p>
            </div> :
            null;
        let otherRequestTags = otherRequestInfo.choosedRequests.length ?
            <div className="choosed-requests">
                <span>已选需求：</span>
                <p>
                    {
                        otherRequestInfo.choosedRequests.map(item => 
                            <Tag key={item.request_id} color="blue" closable onClose={() => {this.closeTag(1, item)}}>{item.request_name}</Tag>
                        )
                    }
                </p>
            </div> :
            null;
        return (
            <Modal
                className="add-request-modal"
                title="关联需求"
                visible={this.state.showModal}
                width="1080px"
                onOk={this.confirmModal}  
                confirmLoading={this.state.confirmLoading}
                onCancel={this.closeModal}
                bodyStyle={{
                }}
            >
                <Tabs defaultActiveKey="0" onChange={this.changeTab}>
                    <TabPane tab="我的需求" key="0">
                        {myRequestTags}
                        <Table 
                            columns={myRequestInfo.columns} 
                            dataSource={myRequestInfo.tableData} 
                            rowKey={ row=> row.request_id } 
                            pagination={{
                                defaultCurrent: myRequestInfo.currentNum,
                                defaultPageSize: myRequestInfo.defaultPageSize,
                                total: myRequestInfo.tableData.length,
                                showTotal: (total) => `共${myRequestInfo.tableData.length}条`,
                            }}  
                        />
                    </TabPane>
                    <TabPane tab="其他需求" key="1">
                        <WrappedSearchForm getOtherRequests={this.getOtherRequests}></WrappedSearchForm>
                        {otherRequestTags}

                        <Spin spinning={otherRequestInfo.tableLoading}>
                            <Table 
                                columns={otherRequestInfo.columns} 
                                dataSource={otherRequestInfo.tableData} 
                                rowKey={ row=> row.request_id } 
                                pagination={{
                                    defaultCurrent: otherRequestInfo.currentNum,
                                    defaultPageSize: otherRequestInfo.defaultPageSize,
                                    total: otherRequestInfo.tableData.length,
                                    showTotal: (total) => `共${otherRequestInfo.tableData.length}条`,
                                }}  
                            />
                        </Spin>
                    </TabPane>
                </Tabs>,
            </Modal>
        );
    }
}

export default AddRequestDialog;