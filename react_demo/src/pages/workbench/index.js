import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUser } from 'src/actions/basicInfo.js';
import { getEditions, deleteVersion } from 'src/api/index.js'
import { Card, Divider, Tabs, Icon, Skeleton, Row, Col, Tooltip, Modal, message } from 'antd';
import './index.scss';
import { EDITION_TYPE, EDITION_STEP, BUSINESS_LINE } from 'src/common/enum.js'
import EditVersionDialog  from 'src/components/editVersionDialog.js';
import { deepClone } from 'src/common/util.js';

const { TabPane } = Tabs;
const { Meta } = Card
const { confirm } = Modal;

class WorkBench extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editionsLoading: false,
            editionsList: [],
        }
    }

    componentDidMount(){
        this.getEditions();
    }

    unFinished = () => {
        Modal.info({
            title: '提示',
            content: (
                <div>
                    很抱歉，暂未实现该功能···
                </div>
            ),
            onOk() {},
        });
    }

    getEditions = () => {
        getEditions().then(res => {
            this.setState({
                editionsList: deepClone(res.editions_list),
            })
        })
    }

    changeTab = (key) => {
        console.log(key);
    }

    // 查看版本详情
    versionDetail = (item) => {
        this.props.history.push({ pathname: `/process/versionDetail/${item.id}`, params: item});
    }

    // 新增修改版本
    changeEdition = (item) => {
        this.refs.dialog.showModal(2, item);
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
                                _this.getEditions();
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

    showModal = (type, item = {}) => {
        this.refs.dialog.showModal(type, item);
    }

    render() {
        return (
            <div id="work_bench">
                <Card>
                    <h2>您好，{this.props.user_infos.user}</h2>
                    <p>{this.props.user_infos.job} | {this.props.user_infos.department}</p>
                    <Divider></Divider>
                    <div className="issues">
                        <p>待发布版本，<span>{this.props.user_infos.to_release_editions}个</span></p>
                        <p>待评审分支，<span onClick={this.unFinished}>{this.props.user_infos.to_exam_rels}个</span></p>
                        <p>待优化CR问题，<span onClick={this.unFinished}>{this.props.user_infos.to_optimizes_crs}个</span></p>
                    </div>
                </Card>

                <Card className="content-card">
                    <Tabs defaultActiveKey="1" onChange={this.changeTab}>
                        <TabPane tab="我的版本" key="1">
                            <Row gutter={16}>
                                {
                                    this.state.editionsList.map(item => {
                                        return (
                                            <Col key={item.id} className="gutter-row" sm={24} lg={12} xl={8} xxl={6}>
                                                <Card
                                                    className="edition-card"
                                                    actions={[
                                                        <Tooltip title="详情">
                                                            <Icon type="ellipsis" key="ellipsis" onClick={()=>{this.versionDetail(item)}}/>
                                                        </Tooltip>,
                                                        <Tooltip title="修改">
                                                            <Icon type="edit" key="edit" onClick={()=>{this.changeEdition(item)}}/>
                                                        </Tooltip>,
                                                        <Tooltip title="删除">
                                                            <Icon type="delete" key="delete"  onClick={()=>{this.deleteVersion(item)}}/>
                                                        </Tooltip>,
                                                    ]}
                                                >  
                                                {/* //// */}
                                                    <Skeleton loading={this.editionsLoading} avatar active>
                                                        <Meta
                                                            avatar={
                                                                <Icon className="edition-card-tag" type="tags" theme="twoTone" />
                                                            }
                                                            title={
                                                                <p>
                                                                    <span>【{getObjLabel(item.type, EDITION_TYPE)}】</span> - <span className={5 === item.step ? "success-text" : null}>{getObjLabel(item.step, EDITION_STEP)}</span>
                                                                </p>
                                                            }
                                                            description={`版本-${item.name}`}
                                                        />
                                                    </Skeleton>
                                                </Card>
                                            </Col>
                                        )
                                    })
                                }
                                <Col className="gutter-row" sm={24} lg={12} xl={8} xxl={6}>
                                    <div className="edition-card add-edition-card">  
                                        <p  onClick={()=>{this.showModal(1)}}>+新建版本</p>
                                    </div>
                                </Col>
                            </Row>
                        </TabPane>
                    </Tabs>
                </Card>

                <EditVersionDialog 
                    ref="dialog"
                    getEditions={this.getEditions}
                >
                </EditVersionDialog>
            </div>
        )
    }
}

const mapStateToProps = ({basicInfoState}) => {
	return {
        user_infos: basicInfoState.user_infos
	};
};

const mapDispatchToProps = { setUser };
  
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(WorkBench);


