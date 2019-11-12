import React, { Component } from 'react';
import { connect } from 'react-redux';
import { queryEditions, deleteVersion } from 'src/api/index.js'
import './index.scss';
import EditVersionDialog  from 'src/components/editVersionDialog.js';
import { Form, Input, Button, Select, DatePicker, Card, Table, Divider, Modal, message, Pagination, Spin } from 'antd';
import { EDITION_TYPE, EDITION_STEP, BUSINESS_LINE, APPROVAL_STATUS } from 'src/common/enum.js'

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Column, ColumnGroup } = Table;
const { confirm } = Modal;

class SearchForm extends React.Component {
    constructor(props) {
        super(props);
    }

    // 列表查询
    searchList = () => {
        this.props.searchList();
    }

    resetForm = () => {
        this.props.form.resetFields();
    }

    editVersion = (type, item = {}) => {
        this.props.editVersion(type, item);
    }

    render() {
        const {
            form: { getFieldDecorator, getFieldsValue, resetFields },
        } = this.props;
        return (
            <Form ref="searchForm" id="search_list" layout="inline">
                <Form.Item  label="版本id">
                    {getFieldDecorator('edition_id', {})(
                            <Input placeholder="请输入" allowClear/>,
                        )
                    }
                </Form.Item>
                <Form.Item  label="版本名称">
                    {getFieldDecorator('edition_name')(
                        <Input placeholder="请输入" allowClear/>,
                    )
                }
                </Form.Item>
                <Form.Item  label="版本负责人">
                    {getFieldDecorator('edition_charger', {
                        initialValue: this.props.user,
                    })(
                        <Input placeholder="请输入" allowClear/>,
                    )
                }
                </Form.Item>
                <Form.Item label="业务线">
                    {getFieldDecorator('business_line')(
                        <Select placeholder="请选择" allowClear>
                            {
                                BUSINESS_LINE.map(item => {
                                    return (
                                        <Option key={item.value} value={item.value}>{item.label}</Option>
                                    )
                                })
                            }
                        </Select>,
                    )}
                </Form.Item>
                <Form.Item label="发布类型">
                    {getFieldDecorator('edition_type')(
                        <Select placeholder="请选择" allowClear>
                            {
                                EDITION_TYPE.map(item => {
                                    return (
                                        <Option key={item.value} value={item.value}>{item.label}</Option>
                                    )
                                })
                            }
                        </Select>,
                    )}
                </Form.Item>
                <Form.Item label="发布阶段">
                    {getFieldDecorator('edition_step', {
                        initialValue: null,
                    })(
                        <Select placeholder="请选择" allowClear>
                            {
                                EDITION_STEP.map(item => {
                                    return (
                                        <Option key={item.value} value={item.value}>{item.label}</Option>
                                    )
                                })
                            }
                        </Select>,
                    )}
                </Form.Item>
                <Form.Item label="预计上线时间">
                    {getFieldDecorator('pub_time', {
                        initialValue: null,
                    })(
                        <RangePicker 
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder={['开始日期', '结束日期']}
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" icon="search" onClick={this.searchList} loading={this.props.submitLoading}>
                        查询
                    </Button>
                    <Button icon="redo" onClick={this.resetForm}>
                        重制
                    </Button>
                    <Button type="plus" icon="search" onClick={() => {this.editVersion(1)}}>
                        新建版本
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}

const WrappedSearchForm = Form.create()(SearchForm);


class EditionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submitLoading: false,
            tableData: [],
            tableLoading: false,
            total: 0,
            pageNum: 1,
            pageSize: 10,
            columns: [
                {
                    title: '版本ID',
                    dataIndex: 'id'
                },
                {
                    title: '版本名称',
                    dataIndex: 'name',
                    render: (text, record) => (
                        <a onClick={() => {this.versionDetail(record)}}>版本-{text}</a>
                    )
                },
                {
                    title: '业务线',
                    dataIndex: 'business_line',
                    render: (text) => (
                        <span>{getObjLabel(text, BUSINESS_LINE)}</span>
                    )
                },
                {
                    title: '发布类型',
                    dataIndex: 'type',
                    render: (text) => (
                        <span>{getObjLabel(text, EDITION_TYPE)}</span>
                    )
                },
                {
                    title: '需求个数',
                    dataIndex: 'request_sum',
                },
                {
                    title: '版本负责人',
                    dataIndex: 'charger',
                },
                {
                    title: '版本阶段',
                    dataIndex: 'step',
                    render: (text) => (
                        <span>{getObjLabel(text, EDITION_STEP)}</span>
                    )
                },
                {
                    title: '预计上线时间',
                    dataIndex: 'pub_time',
                },
                {
                    title: '审批状态',
                    dataIndex: 'approval_status',
                    render: (text) => (
                        <span>{getObjLabel(text, APPROVAL_STATUS)}</span>
                    )
                },
                {
                    title: '操作',
                    dataIndex: 'actions',
                    render: (text, record) => (
                        <span>
                            <a onClick={() => {this.versionDetail(record)}}>进入版本</a>
                            <Divider type="vertical" />
                            <a onClick={() => {this.editVersion(2, record)}}>修改</a>
                            <Divider type="vertical" />
                            <a onClick={() => {this.deleteVersion(record)}}>删除</a>
                        </span>
                    ),
                },
            ]
        }
    }

    componentDidMount() {
        this.getList();
    }

    searchList = () => {
        this.setState({
            submitLoading: true,
        }, () => {
            this.getList();
        })
    }   

    getList = () => {
        this.setState({
            tableLoading: true,
        }, () => {
            let searchForm = Object.assign({}, this.searchForm.props.form.getFieldsValue(), {
                page_num: this.state.pageNum,
                page_size: this.state.pageSize,
            });
            queryEditions(searchForm).then(res => {
                this.setState({
                    submitLoading: false,
                })
                if (res.retcode === 0) {
                    this.setState({
                        tableData: res.list,
                        total: res.total,
                    })
                }
            }).finally(() => {
                this.setState({
                    tableLoading: false,
                })
            })
        })
    }

    // 查看版本详情
    versionDetail = (item) => {
        this.props.history.push({ pathname: `/process/versionDetail/${item.id}`, params: item});
    }

    // 新增/修改版本
    editVersion = (type, item) => {
        this.refs.dialog.showModal(type, item);
    }

    // 删除版本
    deleteVersion = (record) => {
        let _this = this;
        confirm({
            title: '提示',
            content: `您确定要删除版本-${record.name}吗`,
            okText: "确 定",
            cancelText: "取 消",
            onOk() {
                return new Promise((resolve, reject) => {
                    deleteVersion({id: record.id}).then(res => {
                        if (res.retcode === 0) {
                            if (res.ifOk) {
                                resolve();
                                message.success(`删除版本成功`);
                                _this.getList();
                            } else {
                                reject();
                                message.error(`删除版本失败，${res.err_desc || '请重新尝试'}`);
                            }
                        }
                    })
                });
            },
            onCancel() {
            },
        });
    }

    // 改变没页列表显示条数
    chanePageSize = (current, pageSize) => {
        this.setState({
            pageNum: current,
            pageSize
        }, () => {
            this.getList();
        })
    }

    // 页数跳转
    changePageNum = (pageNumber) => {
        this.setState({
            pageNum: pageNumber,
        }, () => {
            this.getList();
        })
    }

    render() {
        return (
            <div id="edition_list">
                <WrappedSearchForm 
                    wrappedComponentRef={ref=>{this.searchForm=ref}}
                    submitLoading={this.state.submitLoading}
                    user={this.props.user_infos.user}
                    searchList={this.searchList}
                    editVersion={this.editVersion}
                >
                </WrappedSearchForm>

                <Card id="edition_list_content">
                    <Spin spinning={this.state.tableLoading}>
                        <Table 
                            rowKey={row=>row.id} 
                            columns={this.state.columns} 
                            dataSource={this.state.tableData}
                            pagination={{
                                showSizeChanger: true,
                                showQuickJumper: true,
                                defaultCurrent: this.state.pageNum,
                                defaultPageSize: this.state.pageSize,
                                total: this.state.total,
                                showTotal: (total) => `共${this.state.total}条`,
                                onShowSizeChange: this.chanePageSize,
                                onChange: this.changePageNum,
                            }}
                        >
                        </Table>
                    </Spin>
                </Card>
                
                <EditVersionDialog ref="dialog" getEditions={this.searchList}></EditVersionDialog>
            </div>
        )
    }
}

const mapStateToProps = ({basicInfoState}) => {
    return {
        user_infos: basicInfoState.user_infos
	};
};
export default connect(
	mapStateToProps,
)(EditionList);



