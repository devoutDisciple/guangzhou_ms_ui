import React from 'react';
import { Menu, Icon } from 'antd';
const { SubMenu }  = Menu;

export default class MyMenu extends React.Component {

	onClickMenu({key}) {
		location.hash = key;
	}



	render() {
		return (
			<Menu
				mode="inline"
				theme="dark"
				onClick={this.onClickMenu.bind(this)}
				defaultSelectedKeys={['/home/campus']}
				inlineCollapsed={false}>
				<Menu.Item key="/home/campus">
					<Icon type="inbox" />
					<span>校区管理</span>
				</Menu.Item>
				<Menu.Item key="/home/swiper">
					<Icon type="pie-chart" />
					<span>首页轮播图</span>
				</Menu.Item>
				<Menu.Item key="3">
					<Icon type="desktop" />
					<span>用户管理</span>
				</Menu.Item>
				<Menu.Item key="4">
					<Icon type="inbox" />
					<span>订单管理</span>
				</Menu.Item>
				<Menu.Item key="5">
					<Icon type="inbox" />
					<span>配送管理</span>
				</Menu.Item>
				<SubMenu
					key="sub1"
					title={
						<span>
							<Icon type="mail" />
							<span>Navigation One</span>
						</span>
					}>
					<Menu.Item key="9">Option 5</Menu.Item>
					<Menu.Item key="6">Option 6</Menu.Item>
					<Menu.Item key="7">Option 7</Menu.Item>
					<Menu.Item key="8">Option 8</Menu.Item>
				</SubMenu>
			</Menu>
		);
	}
}
