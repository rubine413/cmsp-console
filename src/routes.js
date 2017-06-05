import Login from './views/Login';
import Index from './views/Index';
import Form from './views/basic/Form';
import Table from './views/basic/Table';
import Icon from './views/basic/Icon';
import Navigation from './views/extend/Navigation';
import Notice from './views/extend/Notice';
import Panel from './views/extend/Panel';
import Progress from './views/extend/Progress';
import Chart from './views/chart/Index';

import SysResource from './views/system/resource';
import SysRole from './views/system/role';
import SysOrg from './views/system/organization';
import SysUser from './views/system/user';
import SysDict from './views/system/dict';

import MachBrand from './views/machine/brand';
import MachCategory from './views/machine/category';
import MachModel from './views/machine/model';
import MachTrade from './views/machine/trade';

export default [{
    path: '/basic',
    name: '基础组件',
    menu: true,
    submenu: true,    
    icon: 'clock',
    component: Index,
    children: [
        { path: 'form', component: Form, name: '表单' },
        { path: 'table', component: Table, name: '表格' },
        { path: 'icon', component: Icon, name: '图标' }
    ]
}, {
    path: '/extend',
    name: '扩展组件',
    menu: true,    
    submenu: true,
    icon: 'ios-list-outline',
    component: Index,
    children: [
        { path: 'notice', component: Notice, name: '通知提醒' },
        { path: 'panel', component: Panel, name: '面板视图' },
        { path: 'navigation', component: Navigation, name: '菜单导航' },
        { path: 'progress', component: Progress, name: '进度加载' }
    ]
}, {
    path: '/chart',
    name: '图表',
    menu: true,
    icon: 'pie-graph',
    component: Index,
    children: [
        { path: 'echarts', component: Chart, name: 'echarts' }
    ]
}, {
    path: '/sys',
    name: '系统管理',
    menu: true,
    submenu: true,    
    icon: 'gear-a',
    component: Index,
    children: [
        { path: 'res', component: SysResource, name: '资源管理' },
        { path: 'role', component: SysRole, name: '角色管理' },
        { path: 'org', component: SysOrg, name: '机构管理' },
        { path: 'dict', component: SysDict, name: '字典设置' },
        { path: 'user', component: SysUser, name: '用户管理' }
    ]
}, {
    path: '/machine',
    name: '设备管理',
    menu: true,
    submenu: true,    
    icon: 'aperture',
    component: Index,
    children: [
        { path: 'trade', component: MachTrade, name: '设备交易' },
        { path: 'brand', component: MachBrand, name: '品牌管理' },
        { path: 'category', component: MachCategory, name: '分类管理' },
        { path: 'model', component: MachModel, name: '型号管理' }
    ]
}, {
    path: '/login',
    name: 'login',
    component: Login
}, {
    path: '*',
    redirect: '/login'
}];
