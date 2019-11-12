import React, { Component } from 'react';
import { getRequestLists } from 'src/api/index.js'
import { Steps, Card, Divider, Tabs, Icon, Button, Skeleton, Row, Col, Tooltip, Modal, message } from 'antd';
import './index.scss';
import { EDITION_STEP, BUSINESS_LINE, EDITION_TYPE } from 'src/common/enum.js'
import AddRequestDialog  from './addNeedsDialog.js';
import { deepClone } from 'src/common/util.js';

import VersionPlan from './stepsContent/versionPlan';
import Inspect from './stepsContent/inspect';
import TestManage from './stepsContent/testManage';
import Publish from './stepsContent/publish';
import Observer from './stepsContent/observe';
import Complete from './stepsContent/complete';

const { Step } = Steps;

class VersionDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: null,
            maxStep: null,
            basicInfo: {},
            requestList: [],
        }
    }

    componentDidMount(){
        this.setState({
            basicInfo: deepClone(this.props.history.location.params),
            currentStep: this.props.history.location.params.step,
            maxStep: this.props.history.location.params.step,
        })
        this.getRequestLists();
    }

    getRequestLists = () => {
        getRequestLists().then(res => {
            if (res.retcode === 0) {
                this.setState({
                    requestList: res.list
                })
                if (this.state.currentStep === 0 && !res.list.length) {
                    this.addRequest();
                }
            }
        })
    }

    // 添加需求
    addRequest = () => {
        this.refs.addRequestDialog.showModal();
    }   

    previousStep = () => {
        this.setState({
            currentStep: this.state.currentStep - 1
        })
    }

    nextStep = () => {
        this.setState({
            currentStep: this.state.currentStep + 1
        })
    }

    changeStep = (currentStep) => {
        this.setState({
            currentStep
        })
    }
    

    render() {
        const basicInfos = [
            {label: '版本名称', value: `版本-${this.state.basicInfo.name}`},
            {label: '版本负责人', value: this.state.basicInfo.charger},
            {label: '业务线', value: getObjLabel(this.state.basicInfo.business_line, BUSINESS_LINE)},
            {label: '上线时间', value: this.state.basicInfo.pub_time},
            {label: '发布类型', value: getObjLabel(this.state.basicInfo.type, EDITION_TYPE)},
        ]

        let stepContent; 
        switch(this.state.currentStep) {
            case 0:
                stepContent = (
                    <VersionPlan
                        requestList={this.state.requestList}
                        getRequestLists={this.getRequestLists}
                        addRequest={this.addRequest}
                    >
                    </VersionPlan>
                )
                break;
            case 1:
                stepContent = (
                    <Inspect
                        requestList={this.state.requestList}
                    >
                    </Inspect>
                )
                break;
            case 2:
                stepContent = (
                    <TestManage
                        requestList={this.state.requestList}
                    >
                    </TestManage>
                )
                break;
            case 3:
                stepContent = (<Publish></Publish>)
                break;
            case 4:
                stepContent = (<Observer></Observer>)
                break;
            case 5:
                stepContent = (<Complete></Complete>)
                break;
            default:
                stepContent = null
                break;
        } 

        const stepStyle = {};
        
        return (
            <div id="version_detail">
                <Card id="step_overall">
                    <Steps 
                        type="navigation" 
                        onChange={this.changeStep} 
                        current={this.state.currentStep}
                        style={stepStyle}
                    >
                        {EDITION_STEP.map(item => (
                            <Step 
                                status={item.value < this.state.currentStep ? 'finish' : item.value === this.state.currentStep ? 'process' : 'wait'} 
                                key={item.value} 
                                title={item.label} 
                                disabled={item.value > this.state.maxStep}
                            />
                        ))}
                    </Steps>

                    <Divider />
                    <div id="basic_info_text">
                        {
                            basicInfos.map(item => (
                                <p key={item.label} className="basic-info-text-item">
                                    <span className="basic-info-text-label">{item.label}：</span>
                                    <span className="basic-info-text-value">{item.value}</span>
                                </p>
                            ))
                        }
                    </div>
                </Card>
                <Card id="step_wrap">
                    <section id="step_wrap_footer">
                        {stepContent}

                        <Divider />
                        <Button.Group >
                            <Button type="primary" style={this.state.currentStep === 0 ? {display: 'none'} : {}} onClick={this.previousStep}>
                                <Icon type="left" />
                                上一步 
                            </Button>
                            <Button type="primary" disabled={this.state.currentStep >= this.state.maxStep} style={this.state.currentStep === 5 ? {display: 'none'} : {}} onClick={this.nextStep}>
                                下一步
                                <Icon type="right" />
                            </Button>
                        </Button.Group>
                    </section>
                </Card>

                <AddRequestDialog ref="addRequestDialog" getRequestLists={this.getRequestLists}></AddRequestDialog>
            </div>
        )
    }
}

export default VersionDetail;


