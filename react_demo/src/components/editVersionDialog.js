import React, { Component } from 'react';
import { editEdition } from 'src/api/index.js'
import { EDITION_TYPE, EDITION_STEP, BUSINESS_LINE, QUESTION_TYPE, PROJECT_LIST } from 'src/common/enum.js'
import { Button, Modal, Form, Input, Radio, Select, DatePicker, message, Icon } from 'antd';
import moment from 'moment';
import './editVersionDialog.scss';

const { TextArea } = Input;
const { Option } = Select;

class DialogForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editionInfo: this.props.editionInfo,
            modalType: this.props.modalType
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            editionInfo: nextProps.editionInfo,
            modalType: nextProps.modalType
        });
    }

    // 选择发布类型
    changePubType = (e) => {
        // 设置state对象深层级的属性写法
        this.state.editionInfo.type = e.target.value; 
        this.setState({});
    }

    render() {
        const {
            form: { validateFields, resetFields },
        } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
        };
        const timeFormat = 'YYYY-MM-DD HH:mm:ss';
        const editionInfo = this.state.editionInfo;

        // 公共表单项
        const publicEditionItems = (<div>
            <Form.Item label="发布类型" className="">
                {getFieldDecorator('type', {
                    initialValue: editionInfo.type || '',
                    rules: [
                        {
                            required: true,
                            message: '请选择发布类型',
                        },
                        ],
                })(
                    <Radio.Group disabled={this.state.modalType === 2} onChange={this.changePubType}>
                        {
                            EDITION_TYPE.map(item => {
                                return (
                                    <Radio key={item.value} value={item.value}>{item.label}</Radio>
                                )
                            })
                        }
                    </Radio.Group>,
                )}
            </Form.Item>
            <Form.Item label="业务线">
                {getFieldDecorator('business_line', {
                    initialValue: editionInfo.business_line || undefined,
                    rules: [
                        {
                            required: true,
                            message: '请选择业务线',
                        },
                    ],
                })(
                    <Select disabled={this.state.modalType === 2} placeholder="请选择业务线" allowClear>
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
            <Form.Item label="版本名称">
                {getFieldDecorator('name', {
                    initialValue: editionInfo.name || '',
                    rules: [
                        {
                            required: true,
                            message: '请输入版本名称',
                        },
                    ],
                })(
                    <Input placeholder="请输入版本名称" allowClear/>
                )}
            </Form.Item>
            <Form.Item label="上线时间">
                {getFieldDecorator('pub_time', {
                    initialValue: editionInfo.pub_time ? moment(editionInfo.pub_time, timeFormat) : null,
                    rules: [
                        {
                            required: true,
                            message: '请选择上线时间',
                        },
                        ],
                })(
                    <DatePicker showTime format={timeFormat} placeholder="请选择上线时间" allowClear/>,
                )}
            </Form.Item>
            <Form.Item label="版本负责人">
                {getFieldDecorator('charger', {
                    initialValue: editionInfo.charger || '',
                    rules: [
                        {
                            required: true,
                            message: '请输入版本负责人',
                        },
                        ],
                })(
                    <Input placeholder="请输入版本负责人" allowClear/>
                )}
            </Form.Item>
            <Form.Item label="需求链接">
                {getFieldDecorator('link', {
                    initialValue: editionInfo.link || '',
                    rules: [
                        {
                            required: true,
                            message: '请输入需求链接',
                        },
                        {
                            type: 'url',
                            message: '请输入正确的网页链接',
                            },
                        ],
                })(
                    <Input placeholder="请输入需求链接" allowClear/>
                )}
            </Form.Item>
        </div>)
        // 线上问题类型项
        const questionTypeItem = (<Form.Item label="线上问题类型">
            {getFieldDecorator('question_type', {
                initialValue: editionInfo.question_type || undefined,
                rules: [
                    {
                        required: true,
                        message: '请选择线上问题类型',
                    },
                ],
            })(
                <Select placeholder="请选择线上问题类型" allowClear>
                    {
                        QUESTION_TYPE.map(item => {
                            return (
                                <Option key={item.value} value={item.value}>{item.label}</Option>
                            )
                        })
                    }
                </Select>,
            )}
        </Form.Item>)

        // 线上问题描述项
        const descItem = (
            <Form.Item label="线上问题描述">
                {getFieldDecorator('desc', {
                    initialValue: editionInfo.desc || '',
                    rules: [
                        {
                            required: true,
                            message: '请输入详细描述',
                        },
                    ],
                })(
                    <TextArea placeholder="请输入详细描述" autosize={{ minRows: 2, maxRows: 3 }} />
                )}
            </Form.Item>
        )

        // 代码工程分支描述
        const codeDescList = [];
        (editionInfo.code_desc && editionInfo.code_desc.lngth) && editionInfo.code_desc.forEach((item, index) => {
            codeDescList.push(
                <Form.Item key={index}  className="code-desc-item" label="发布工程">
                    {getFieldDecorator('pub_project', {
                        initialValue: item.pub_project || undefined,
                        rules: [
                            {
                                required: true,
                                message: '请选择',
                            },
                        ],
                    })(
                        <Select placeholder="请选择" allowClear>
                            {
                                PROJECT_LIST.map(citem => {
                                    return (
                                        <Option key={citem.value} value={citem.value}>{citem.label}</Option>
                                    )
                                })
                            }
                        </Select>
                    )}
                    <Icon style={index === editionInfo.code_desc.length - 1 ? {} : {display: 'none'}} type="plus-circle" />
                    <Icon type="minus-circle" />
                </Form.Item>
            )
        }) 

        const formDom = editionInfo.type === 2 ?
            <Form {...formItemLayout} layout="inline"> 
                {publicEditionItems}
                {questionTypeItem}
                {descItem}
                {codeDescList}
            </Form> :
            <Form {...formItemLayout} layout="inline"> 
                {publicEditionItems}
            </Form> 

        return (formDom);
    }
}

const WorkBenchDialogForm = Form.create()(DialogForm);

class EditVersionDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalType: 0,
            modalTitle: '',
            showModal: false,
            confirmLoading: false,
            editionInfo: {}
        }
    }

    // type  1：新增 2：修改
    showModal = (type, item) => {
        if (this.refs.form) {
            this.refs.form.resetFields();
        }
        let modalTitle = type == 1 ? '新增版本' : '修改版本';
        this.setState({
            modalType: type,
            modalTitle,
            editionInfo: item,
            showModal: true,
        }, () => {
        });
    };

    submit = () => {
        this.refs.form.validateFields((errors, values) => {
            let detectExactParams = false;
            // 日常版本
            if (errors && values.type === 1) {
                const errorKeys = Object.keys(errors);
                let length = errorKeys.length;
                if (errorKeys.includes('desc')) {
                    length -= 1;
                }
                if (errorKeys.includes('question_type')) {
                    length -= 1;
                }
                if (length <= 0) {
                    detectExactParams = true;
                }
            }
            if (!errors || detectExactParams) {
                this.setState({
                    confirmLoading: true
                }, () => {
                    editEdition().then(res => {
                        this.setState({
                            confirmLoading: false
                        }, () => {
                            const typeStr = this.state.editionInfo.id ? '修改' : '新增';
                            if (res.retcode === 0 && res.ifOk) {
                                this.setState({
                                    showModal: false
                                }, () => {
                                    message.success(`${typeStr}版本成功`);
                                    this.props.getEditions();
                                });
                            } else {    
                                message.error(res.err_desc || `${typeStr}版本失败，请重新尝试`);
                            }
                        })
                    })
                })
            }
        });
    };

    closeModal = () => {
        this.setState({
            showModal: false,
        });
    };

    render() {
        const { modalTitle, showModal, confirmLoading } = this.state;

        return (
            <Modal
                className="edit-version-dialog"
                title={modalTitle}
                visible={showModal}
                confirmLoading={confirmLoading}
                onCancel={this.closeModal}
                footer={[
                    <Button key="back" onClick={this.closeModal}>
                        取 消
                    </Button>,
                    <Button key="submit" type="primary" loading={confirmLoading} onClick={this.submit}>
                        确 定
                    </Button>,
                ]}
            >
                <WorkBenchDialogForm 
                    ref="form" 
                    editionInfo={this.state.editionInfo}
                    modalType={this.state.modalType}
                >
                </WorkBenchDialogForm>            
            </Modal>
        );
    }
}

export default EditVersionDialog;





