import React from 'react';
import { Layout } from 'antd';
const { Sider, Content, Footer } = Layout;
import Menu from '../Menu/Menu';
import MyHeader from './Header';
import { Route, Switch } from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import './index.less';
import Swiper from '../Swiper/Swiper';
import Campus from '../Campus/Campus';
import Shop from '../Shop/Shop';
import Goods from '../Goods/Goods';
import Member from '../Member/Member';
import Today from '../Today/Today';
import Order from '../Order/Order';
import Money from '../Money/Money';
import Evaluate from '../Evaluate/Evaluate';
import Data from '../Data/Data';

@inject('GlobalStore')
@observer
export default class MyLayout extends React.Component{

	constructor(props) {
		super(props);
		this.globalStore = this.props.GlobalStore;
	}

	componentDidMount() {
	}

	render() {
		return (
			<React.Fragment>
				<Layout>
					<Sider className="root_layout_sider">
						<div className="root_layout_sider_header">
                            贝沃思管理后台
						</div>
						<Menu />
					</Sider>
					<Content className="root_layout_content">
						<MyHeader />
						<div className='content'>
							<Switch>
								<Route exact path="/home" component={Campus} />
								<Route path="/home/swiper" component={Swiper} />
								<Route path="/home/campus" component={Campus} />
								<Route path="/home/shop" component={Shop} />
								<Route path="/home/goods" component={Goods} />
								<Route path="/home/member" component={Member} />
								<Route path="/home/today" component={Today} />
								<Route path="/home/order" component={Order} />
								<Route path="/home/money" component={Money} />
								<Route path="/home/evaluate" component={Evaluate} />
								<Route path="/home/data" component={Data} />
							</Switch>
						</div>
					</Content>
				</Layout>
				<Footer className="root_layout_footer">专业小程序开发者 微信号： 15906672702 </Footer>
			</React.Fragment>
		);
	}
}
