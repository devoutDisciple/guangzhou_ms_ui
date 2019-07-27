import React from 'react';
// const { Option } = Select;
import {Col, Button, Table} from 'antd';
import {inject, observer} from 'mobx-react';

@inject('GlobalStore')
@observer
export default class Order extends React.Component{

	constructor(props) {
		super(props);
		this.globalStore = this.props.GlobalStore;
	}

	state = {
		list: []
	}

	async componentDidMount() {
	}


	render() {
		let {list} = this.state;
		const columns = [
			{
				title: '编号',
				dataIndex: 'id',
				key: 'id',
				align: 'center'
			},
			{
				title: '商店名称',
				dataIndex: 'shopid',
				key: 'shopid',
				align: 'center'
			},
			{
				title: 'type',
				dataIndex: '支付方式',
				key: '支付方式',
				align: 'center'
			},
			{
				title: '商家账号',
				dataIndex: 'account',
				key: 'account',
				align: 'center'
			},
			{
				title: '支付金额(元)',
				dataIndex: 'money',
				key: 'money',
				align: 'center'
			},
			{
				title: '状态',
				dataIndex: 'status',
				key: 'status',
				align: 'center',
				// render: (text, record) => {
				// 	return <span>{FilterOrderStatus.filterOrderStatus(record.status)}</span>;
				// }
			},
			{
				title: '申请时间',
				dataIndex: 'create_time',
				key: 'create_time',
				align: 'center',
			},
			{
				title: '处理时间',
				dataIndex: 'modify_time',
				key: 'modify_time',
				align: 'center',
			},
			{
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				align: 'center',
				render: () => {
					return <span>hello</span>;
				}
			},
		];
		return (
			<div className='common'>
				<div className='common_search'>
					<Col span={6} offset={1}>
						<Button className='goods_search_btn' type='primary'>新增</Button>
					</Col>
				</div>
				<div className='common_content'>
					<Table
						bordered
						dataSource={list}
						columns={columns}
						pagination={
							{
								total: list.length || 0,
								showTotal: (total) => `共 ${total} 条`
							}
						}/>
				</div>
			</div>
		);
	}
}
