import React from 'react';
import { Row, Button } from 'antd';
import './index.less';
import {inject, observer} from 'mobx-react';
import Request from '../../../request/AxiosRequest';
import EditorDialog from './EditorDialog';

@inject('GlobalStore')
@observer
export default class Shop extends React.Component{

	constructor(props) {
		super(props);
		this.globalStore = this.props.GlobalStore;
	}

	state = {
		data: {},
		editorDialogVisible: false,
	}

	componentDidMount() {
		this.onSearchShop();
	}

	// 查询所有订单
	async onSearchShop() {
		let shopid = this.globalStore.userinfo.shopid;
		let res = await Request.get('/shop/getShopByShopid', {id: shopid});
		let data = res.data || {};
		this.setState({data});
	}

	// 编辑框的显示
	controllerEditorDialog() {
		this.setState({
			editorDialogVisible: !this.state.editorDialogVisible
		});
	}

	render() {
		let {data, editorDialogVisible} = this.state;
		return (
			<div className='data'>
				<Row className="shop_detail">
					<Row className='shop_detail_col'>
						<span className='shop_detail_label'>名称：</span>
						<span className='shop_detail_content'>{data.name}</span>
					</Row>
					<Row className='shop_detail_col'>
						<span className='shop_detail_label'>所属区域：</span>
						<span className='shop_detail_content'>{data.campus}</span>
					</Row>
					<Row className='shop_detail_col'>
						<span className='shop_detail_label'>月售：</span>
						<span className='shop_detail_content'>{data.sales}</span>
					</Row>
					<Row className='shop_detail_col'>
						<span className='shop_detail_label'>地址：</span>
						<span className='shop_detail_content'>{data.address}</span>
					</Row>
					<Row className='shop_detail_col'>
						<span className='shop_detail_label'>联系电话：</span>
						<span className='shop_detail_content'>{data.phone}</span>
					</Row>
					<Row className='shop_detail_col'>
						<span className='shop_detail_label'>起送费：</span>
						<span className='shop_detail_content'>{data.start_price}</span>
					</Row>
					<Row className='shop_detail_col'>
						<span className='shop_detail_label'>配送费：</span>
						<span className='shop_detail_content'>{data.send_price}</span>
					</Row>
					<Row className='shop_detail_col'>
						<span className='shop_detail_label'>营业时间：</span>
						<span className='shop_detail_content'>{`${data.start_time} - ${data.end_time}`}</span>
					</Row>
					<Row className='shop_detail_col'>
						<span className='shop_detail_label'>商店描述：</span>
						<span className='shop_detail_content'>{data.desc}</span>
					</Row>
					<Row className='shop_detail_col'>
						<span className='shop_detail_label'>打印机编号(SN)：</span>
						<span className='shop_detail_content'>{data.sn}</span>
					</Row>
					<Row className='shop_detail_col'>
						<span className='shop_detail_label'>打印机秘钥(KEY)：</span>
						<span className='shop_detail_content'>{data.key}</span>
					</Row>
					<Row>
						<Button type="primary" onClick={this.controllerEditorDialog.bind(this)}>修改</Button>
					</Row>
				</Row>
				{
					editorDialogVisible ?
						<EditorDialog
							editData={data}
							onSearch={this.onSearchShop.bind(this)}
							controllerEditorDialog={this.controllerEditorDialog.bind(this)} />
						: null
				}
			</div>
		);
	}
}
