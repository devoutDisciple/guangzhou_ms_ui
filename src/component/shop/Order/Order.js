import React from 'react';
import {
	Table, message
} from 'antd';
import Request from '../../../request/AxiosRequest';
import moment from 'moment';
import {inject, observer} from 'mobx-react';
import FilterOrderStatus from '../../../util/FilterOrderStatus';

@inject('GlobalStore')
@observer
export default class Order extends React.Component{

	constructor(props) {
		super(props);
		this.globalStore = this.props.GlobalStore;
	}

	state = {
		oderList: []
	}

	async componentDidMount() {
		// 查询所有订单
		await this.onSearchOrder();
	}

	// 查询所有订单
	async onSearchOrder() {
		let shopid = this.globalStore.userinfo.shopid;
		let res = await Request.get('/order/getListByShopid', {shopid: shopid});
		let data = res.data || [];
		data.map(item => {
			item.key = item.id;
			item.order_time = moment(item.order_time).format('YYYY-MM-DD HH:mm:ss');
		});
		this.setState({oderList: res.data || []});
	}

	// 改变订单状态
	async onChangeOrderStatus(record, status) {
		let res = await Request.post('/order/updateStatus', {id: record.id, status});
		if(res.data == 'success') {
			message.success('更改成功');
			return this.onSearchOrder();
		}
	}


	render() {
		let {oderList} = this.state;
		const columns = [
			{
				title: '订单编号',
				dataIndex: 'id',
				key: 'id',
				align: 'center'
			},
			{
				title: '会员名称',
				dataIndex: 'username',
				key: 'username',
				align: 'center'
			},
			{
				title: '联系方式',
				dataIndex: 'phone',
				key: 'phone',
				align: 'center'
			},
			{
				title: '用户地址',
				dataIndex: 'userAddress',
				key: 'userAddress',
				align: 'center'
			},
			{
				title: '订单总价',
				dataIndex: 'total_price',
				key: 'shopName',
				align: 'center'
			},
			{
				title: '订单时间',
				dataIndex: 'order_time',
				key: 'order_time',
				align: 'center'
			},
			{
				title: '订单状态',
				dataIndex: 'status',
				key: 'status',
				align: 'center',
				render: (text, record) => {
					return <span>{FilterOrderStatus.filterOrderStatus(record.status)}</span>;
				}
			},
			{
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				align: 'center',
				render:(text, record) => {
					let status = record.status;
					return <span className="common_table_span">
						{
							status == 1 ?
								<a href="javascript:;" onClick={this.onChangeOrderStatus.bind(this, record, 2)}>接单</a>
								: <a href="javascript:;" disabled>接单</a>
						}
						{
							status == 2 ?
								<a href="javascript:;" onClick={this.onChangeOrderStatus.bind(this, record, 3)}>派送中</a>
								: <a href="javascript:;" disabled>派送中</a>
						}
						{
							status == 3 ?
								<a href="javascript:;" onClick={this.onChangeOrderStatus.bind(this, record, 4)}>订单完成</a>
								: <a href="javascript:;" disabled>订单完成</a>
						}
						{
							status != 4 && status != 5 && status != 6 ?
								<a href="javascript:;" onClick={this.onChangeOrderStatus.bind(this, record, 5)}>取消该订单</a>
								: <a href="javascript:;" disabled>取消该订单</a>
						}
					</span>;
				}
			}
		];
		return (
			<div className='common'>
				<div className='common_content'>
					<Table
						bordered
						dataSource={oderList}
						columns={columns}
						pagination={
							{
								total: oderList.length,
								showTotal: (total) => `共 ${total} 条`
							}
						}/>
				</div>
			</div>
		);
	}
}
