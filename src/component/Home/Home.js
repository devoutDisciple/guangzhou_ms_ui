import React from 'react';
import { Layout } from 'antd';
const { Sider, Content, Footer } = Layout;
import './index.less';
import Menu from '../Menu/Menu';
import MyHeader from './Header';
import { Route, Switch } from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import Swiper from '../Swiper/Swiper';
import Campus from '../Campus/Campus';

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
                            雀送管理后台
						</div>
						<Menu />
					</Sider>
					<Content className="root_layout_content">
						<MyHeader />
						<div className='content'>
							<Switch>
								<Route exact path="/" component={Campus} />
								<Route path="/home/swiper" component={Swiper} />
								<Route path="/home/campus" component={Campus} />
							</Switch>
						</div>
					</Content>
				</Layout>
				<Footer className="root_layout_footer">专业小程序开发者 微信号： 15906672702 </Footer>
			</React.Fragment>
		);
	}
}
