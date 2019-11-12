import React, { Component } from 'react';
import { Route, Switch, Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUser } from 'src/actions/basicInfo.js';
import { authSession } from 'src/api/index.js';
import { Spin, Layout, Menu, Icon, Dropdown, Avatar } from 'antd';
import { siderMenus } from 'src/router/index.js';
import './index.scss';
import headerImg from './../../assets/images/header.jpg'

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

// 设置菜单列表
class MenuList extends React.Component {
	createMenu(data) {
        if (!data.ifSidebar) {
            return null
        }

        let submenuItem = data.icon ?
            <span>
                <Icon type={data.icon}/>
                <span>{data.title}</span>
            </span> :
            <span>
                <span>{data.title}</span>
            </span>
        if (data.children) {
            return (
                <SubMenu key={data.url} title={submenuItem}>
                    {
                        data.children.map(item => {
                            return this.createMenu(item);
                        })
                    }
                </SubMenu>
            )
        }
        let menuItem = data.icon ?
            <Menu.Item key={data.url} className="sidebar-item">
                <Icon type={data.icon} />
                <Link key={data.url} to={data.url}>{data.title}</Link>
            </Menu.Item> :
            <Menu.Item key={data.url} className="sidebar-item">
                <Link key={data.url} to={data.url}>{data.title}</Link>
            </Menu.Item>
        return menuItem
    }
    
	render() {
		return (
            <Menu mode="inline" theme="dark">
                {
                    siderMenus.map((item) => {
                        return this.createMenu(item);
                    })
                }
            </Menu>
		);
	}
}

// 设置路由
class Routers extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            routers: [] 
        };
    }  

    componentDidMount(){
        let routers = [];
        siderMenus.map(item => {
            this.createRouter(item, routers);
        })
        this.setState({
            routers
        });
    }

    createRouter(data, routers) {
        data.children ?
            data.children.map(item => {
                this.createRouter(item, routers);
            }) :
            routers.push(data);
    }

	render() {
        return (
            // 使用Switch匹配结果较精确
            <Switch>
            {
                this.state.routers.map(item => {
                    return (<Route path={item.url} key={item.url} exact={item.ifExact} component={item.component} ></Route>)
                })
            }
                <Redirect from="/" exact to="/workbench"/>
                <Redirect to="/notFound"/>
            </Switch>
        )
	}
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            loading: false,
            collapsed: false, 
        };
    }  

    //组件挂载完成的时候触发的生命周期函数
    componentDidMount(){
        this.setState({
            loading: true
        })

        let username = localStorage.getItem('username'),
            password = localStorage.getItem('password');
        authSession({username, password}).then(res => {
            if (res.retcode === 0 && res.result) {
                if (res.result.ifOk) {
                    setUser(res.result.user_infos);
                } else {
                    this.props.history.push({ pathname: '/login' });
                }
            }
        }).finally(() => {
            this.setState({
                loading: false
            })
        });
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    
    exit = () => {
        this.props.history.push({ pathname: '/login' })
    }

    render() {
        const dropdownMenu = (
            <Menu>
                <Menu.Item>
                    <span onClick={this.exit}>退出</span>
                </Menu.Item>
            </Menu>
        );

        return ( 
            <Spin spinning={this.state.loading} id="system_spin" tip="系统加载中···">
                <Layout id="layout">
                    {/* 这里的sidebar应该不需要额外设置个组件 根据不同的结构设置不同的menu 设置页面路由对象数组 */}
                    <Sider trigger={null} collapsible collapsed={this.state.collapsed} id="sidebar">
                        <div className="system_sign">
                            <Icon type="alibaba" theme="twoTone" />
                            <span>研发管理系统</span>
                        </div>
                        <MenuList></MenuList>    
                    </Sider>
                    <Layout>
                        <Header style={{ background: '#fff', padding: 0 }}>
                            {/* <Icon
                                className="trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            /> */}
                            <div className="user-info">
                                <Avatar src={headerImg}></Avatar>
                                <Dropdown overlay={dropdownMenu}>
                                    <a className="ant-dropdown-link" href="#">
                                        {this.props.user_infos.user} <Icon type="down" />
                                    </a>
                                </Dropdown>
                            </div>
                        </Header>
                        <Content
                            style={{
                                margin: '24px 16px',
                                padding: 24,
                                background: '#fff',
                                minHeight: 280,
                            }}
                        >
                            <Routers></Routers>
                        </Content>
                    </Layout>
                </Layout>
            </Spin>
        )
    }
}

// 将定义的testState传进来
const mapStateToProps = ({basicInfoState} /*, ownProps*/) => {
	return {
        user_infos: basicInfoState.user_infos
	};
};

const mapDispatchToProps = { setUser };
  
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Home);