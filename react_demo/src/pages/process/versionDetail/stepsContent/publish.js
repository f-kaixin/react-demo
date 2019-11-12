import React, { Component } from 'react';
import { Tabs, Button, Icon, Spin, Table, message } from 'antd';
import { APPLICATION_TYPE, MERGE_STATUS } from 'src/common/enum.js';
import { getPublishData } from 'src/api/index.js'

const { TabPane } = Tabs;

class Publish extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabsData: [
                {label: '预发布', value: 0},
                {label: '灰度', value: 1},
                {label: 'OA', value: 2},
                {label: '线上', value: 3},
            ],
            currentTab: 0,
            tableLoading: false,
            commonPublishSets: [],
            publishSets: [[], [], [], []],
            columns: [
                { 
                    title: '合并状态', 
                    dataIndex: 'merge_status', 
                    key: 'merge_status', 
                    render: (text) => (
                        <span>{getObjLabel(text, MERGE_STATUS)}</span>
                    )
                },
                {
                    title: '发布顺序',
                    dataIndex: 'sort_index',
                    key: 'sort_index',
                    render: text => (
                        <p>
                            <span style={{marginRight: '16px'}}>{text}</span>
                            <Icon style={{cursor: 'poniter'}} type="edit" />
                        </p>
                    )
                },
                {
                    title: '应用名称',
                    dataIndex: 'application_name',
                    key: 'application_name',
                },
                {
                    title: '应用类型',
                    dataIndex: 'application_type',
                    key: 'application_type',
                    render: (text) => (
                        <span>{getObjLabel(text, APPLICATION_TYPE)}</span>
                    )
                },
                {
                    title: '打包进度',
                    dataIndex: 'pack_process',
                    key: 'pack_process',
                    width: 320,
                    render: (text, record) => {
                        let dom = [];
                        this.state.tabsData.forEach((item, index) => {
                            dom.push(
                                <p key={index} style={{display: 'inline-block', marginBottom: '0'}}>
                                    <Icon style={record.pub_envir_status[index] !== 0 ? {display: 'none'} : {}} type="exclamation-circle" theme="twoTone" twoToneColor="#1890ff" />
                                    <Icon style={record.pub_envir_status[index] === 0 ? {display: 'none'} : {}} type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
                                    <span style={{marginLeft: '4px', marginRight: '8px'}}>{item.label}</span>
                                </p>
                            )
                        })
                        return (
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                {dom}
                            </div>
                        )
                    }
                    // 
                },
                { title: '涉及开发', dataIndex: 'developer', key: 'developer',  width: 144, },
                { title: '发布tag', dataIndex: 'tag', key: 'tag',  width: 120, },
                {
                  title: '操作',
                  key: 'action',
                  render: (text, record) => (
                    <div className="action-btns">
                        <Button type="primary" icon="api" onClick={() => {this.packApplication(record)}}>应用打包</Button>
                        <Button icon="unlock">应用发布</Button>
                        <Button type="danger" icon="file-sync">查看发布单</Button>
                    </div>
                  ),
                },
            ],
            packAllApplicationLoading: false,
        }
    }

    componentDidMount(){
        this.getPublishData();
    }

    componentWillReceiveProps(nextProps) {
    }

    changeTab = (key) => {
        this.setState({
            currentTab: key
        })
    };

    getPublishData = () => {
        this.setState({
            tableLoading: true
        }, () => {
            getPublishData().then(res => {
                if (res.retcode === 0) {
                    let publishSets = [];
                    for (let i = 0; i < 4; i++) {
                        let data = res.data.concat([]);
                        data.forEach((item, index) => {
                            item.index = index;
                            item.sort_index = (index + 1);
                            item.pub_envir_status = [0, 0, 0, 0];
                        })
                        publishSets.push(data);
                    }
                    this.setState({
                        commonPublishSets: res.data,
                        publishSets
                    })
                }
            }).finally(() => {
                this.setState({
                    tableLoading: false
                })
            })
        })
    }

    // 查看审批详情
    viewApprovalDetail = () => {
        message.error(`暂未实现该功能···`);
    }

    // 打包所有应用
    packAllApplication = () => {
        this.setState({
            packAllApplicationLoading: true
        }, () => {
            let _this = this;
            setTimeout(() => {
                let publishSets = _this.state.publishSets;
                publishSets.map(item => {
                    item.map(citem => {
                        citem.pub_envir_status = [1, 1, 1, 1];
                    })
                })
                _this.setState({
                    publishSets,
                    packAllApplicationLoading: false
                })
            }, 1000);
        })
    }

    // 打包应用
    packApplication = (record) => {
        let publishSets = this.state.publishSets; 
        publishSets[this.state.currentTab][record.index].pub_envir_status = [1, 1, 1, 1];
        this.setState({
            publishSets,
        })
    } 

    render() {
        const operations = (
            <div>
                <Button onClick={this.viewApprovalDetail}>
                    <Icon type="eye" />
                    查看审批详情 
                </Button>
                <Button type="primary" loading={this.state.packAllApplicationLoading} onClick={this.packAllApplication} style={{marginLeft: '16px'}}>
                    一键打包所有应用 
                </Button>
            </div>
        )
        
        let publishSets = this.state.publishSets;
        let tabPanes = [];
        this.state.tabsData.forEach((item, index) => {
            tabPanes.push(
                <TabPane tab={item.label} key={item.value}>
                    <Spin spinning={this.state.tableLoading}>
                        <Table 
                            className="publish-table"
                            columns={this.state.columns} 
                            dataSource={publishSets[index]} 
                            rowKey={ row=> row.index } 
                            pagination={{
                                defaultCurrent: 1,
                                defaultPageSize: 100,
                                total: publishSets[index].length,
                                showTotal: (total) => `共${publishSets[index].length}条`,
                            }}  
                        />
                    </Spin>
                </TabPane>
            )
        })

        return (
            <div id="publish_version">
                <Tabs 
                    defaultActiveKey="0" 
                    tabBarExtraContent={operations} 
                    onChange={this.changeTab}>
                    {tabPanes}
                </Tabs>,
            </div>
        )
    }
}

export default Publish;