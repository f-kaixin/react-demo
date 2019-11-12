import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import Login from 'src/pages/login/index.js';
import Home from 'src/pages/home/index.js';
import Workbench from 'src/pages/workbench/index.js';
import EditionList from 'src/pages/process/editionList/index.js';
import VersionDetail from 'src/pages/process/versionDetail/index.js';
import WhiteList from 'src/pages/application/whiteList/index.js';
import BlackList from 'src/pages/application/blackList/index.js';
import Test1 from 'src/pages/application/other/test1/index.js';
import Test2 from 'src/pages/application/other/test2/index.js';
import NotFound from 'src/pages/notFound/index.js';

export const Router = () => (
	<BrowserRouter>
		<Switch>
			<Route path="/login" component={Login} exact />
			<Route path="/" component={Home}></Route>
			<Route path="/notFound" component={NotFound}/>
			<Redirect from="/index" exact to="/"/>
		</Switch>
	</BrowserRouter>
)

export const siderMenus = [
	{
		title: '我的工作台',
		url: '/workbench',
		component: Workbench,
		icon: 'home',
		ifSidebar: true,
		ifExact: true,
	},
	{
		title: '过程管理',
		url: '/process',
		component: '',
		icon: 'sync',
		ifSidebar: true,
		ifExact: true,
        children: [{
            title: '版本列表',
            url: '/process/edition',
			component: EditionList,
			ifSidebar: true,
			ifExact: true,
		},{
            title: '版本详情',
            url: '/process/versionDetail/:id',
			component: VersionDetail,
			ifSidebar: false,
			ifExact: false,
		},
		]
	},
	{
		title: '应用管理',
		url: '/application',
		component: '',
		icon: 'setting',
		ifSidebar: true,
		ifExact: true,
        children: [{
            title: '白名单应用管理',
            url: '/application/whiteList',
			component: WhiteList,
			ifSidebar: true,
			ifExact: true,
        }, {
            title: '黑名单应用管理',
            url: '/application/blackList',
			component: BlackList,
			ifSidebar: true,
			ifExact: true,
        }, {
            title: '其他应用',
            url: '/application/other',
			component: '',
			ifExact: true,
			ifSidebar: true,
			children: [{
				title: '测试页面1',
				url: '/application/other/test1',
				component: Test1,
				ifSidebar: true,
				ifExact: true,
			}, {
				title: '测试页面2',
				url: '/application/other/test2',
				component: Test2,
				ifSidebar: true,
				ifExact: true,
			}]
        }]
	},
	{
		title: 'notFound',
		url: '/notFound',
		component: NotFound,
		ifSidebar: false,
		ifExact: true,
	},
];







