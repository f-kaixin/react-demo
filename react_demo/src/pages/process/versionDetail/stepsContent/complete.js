import React, { Component } from 'react';
import { getMachineIp, getLogs } from 'src/api/index.js'
import { PROJECT_LIST } from 'src/common/enum.js';
import { Tabs, Card, Input, Radio, Select, Button } from 'antd';
import { setInterval } from 'core-js';

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const { Meta } = Card

let timer;

class Complete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectLists: [],
            tabPaneData: [],
            currentTab: 0,
            ipList: [],
            ipText: '',
            logs: '',
        }
    }

    componentDidMount(){
        let projectLists = [];
        let tabPaneData = [];
        for (let i = 0; i < 3; i ++) {
            projectLists.push(PROJECT_LIST[Math.floor(Math.random() * PROJECT_LIST.length)]);
            tabPaneData.push({ip: 0});
        }
        this.setState({
            projectLists,
            tabPaneData
        }, () => {
            this.getTabPaneData(0);
        })
        this.getMachineIp();
        this.setGetLogsInterval();
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUnmount() {
        if (timer) {
            clearInterval(timer)
        }
    }

    getMachineIp = () => {
        getMachineIp().then(res => {
            if (res.retcode === 0) {
                this.setState({
                    ipList: res.list
                })
            }
        })
    }

    changeTab = (key) => {
        this.setState({
            currentTab: key
        })
        this.getTabPaneData(key);
    }

    getTabPaneData = (index) => {

    }

    searchIp = (value, index) => {
        this.setState({
            ipText: value
        })
    }

    changeIpRadio = (val) => {
        console.log(val)
        this.setGetLogsInterval();
    }

    setGetLogsInterval = () => {
        if (timer) {
            clearInterval(timer);
        }
        this.setState({
            logs: ''
        }, () => {
            let _this = this;
            timer = setInterval(() => {
                _this.getLogs();
            }, 1000)
        })
    }

    getLogs = () => {
        getLogs().then(res => {
            if (res.retcode === 0) {
                this.setState({
                    logs: [this.state.logs, res.logs].join('<br>')
                }, () => {
                    this.refs.logs.innerHTML = this.state.logs
                })
            }
        })
    }

    render() {
        let tabPanes = [];
        let tabPaneData = this.state.tabPaneData[this.state.currentTab];

        let ipList = (this.state.ipText || this.state.ipText === 0) ?
            this.state.ipList.filter(item => {
                return `${item.ip}`.includes(this.state.ipText)
            }) :
            this.state.ipList;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        this.state.projectLists.forEach((item, index) => {
            tabPanes.push(
                <TabPane tab={item.label} key={index}>
                    <Card title="机器列表" style={{ width: 300 }}>
                        <Search
                            placeholder="ip搜索"
                            onSearch={value => this.searchIp(value, index)}
                            style={{marginBottom: '16px'}}
                        />
                        <Radio.Group key={index} onChange={this.changeIpRadio} value={this.state.tabPaneData[index].ip}>
                            {
                                ipList.map(citem => {
                                    return (
                                        <Radio style={radioStyle} value={citem.id} key={citem.id}>
                                            {citem.ip}
                                        </Radio>
                                    )
                                })
                            }
                        
                        </Radio.Group>
                    </Card>
                    
                    <Card className="complete-card-sec">
                        <Card.Meta 
                            title={
                                <div className="complete-card-meta">
                                    <div className="searchForm">
                                        <span>日志类型</span>
                                        <Select defaultValue="1" style={{ width: 120 }}>
                                            <Option value="1">业务日志</Option>
                                        </Select>
                                        <span>日志文件</span>
                                        <Select defaultValue="1" style={{ width: 120 }}>
                                            <Option value="1">日志文件1</Option>
                                        </Select>
                                        <span>自定义查看</span>
                                        <Select defaultValue="1" style={{ width: 120 }}>
                                            <Option value="1">最后200行</Option>
                                        </Select>
                                        <Button type="primary" onClick={this.setGetLogsInterval}>查询</Button>
                                    </div>
                                    <div className="complete-card-meta-btns">
                                        <Button><span>查看机器状态</span></Button>
                                        <Button><span>查看告警</span></Button>
                                        <Button type="danger">跨版本回滚</Button>
                                    </div>
                                </div>
                            }
                        >
                        </Card.Meta> 
                        <span ref="logs" className="log-pane"></span>
                    </Card>
                </TabPane>
            )
        })
        return (
            <div id="version_complete">
                <Tabs defaultActiveKey="0" onChange={this.changeTab}>
                    {tabPanes}
                </Tabs>,
            </div>
        )
    }
}

export default Complete;