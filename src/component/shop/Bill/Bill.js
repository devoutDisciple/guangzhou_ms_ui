import React from 'react';
// const { Option } = Select;
import {Table, Popconfirm, message} from 'antd';
import {inject, observer} from 'mobx-react';
import Request from '../../../request/AxiosRequest';
import moment from 'moment';
import Filter from '../../../util/FilterOrderStatus';

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
		await this.onSearchBill();
	}

	async onSearchBill() {
		let shopid = this.globalStore.userinfo.shopid;
		let res = await Request.get('/bill/getAllByShopid', {shop_id: shopid});
		let data = res.data || [];
		data.map(item => {
			item.key = item.id;
			item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
			item.modify_time = moment(item.modify_time).format('YYYY-MM-DD HH:mm:ss');
		});
		this.setState({list: res.data || []});
	}

	// 撤销申请
	async onCancelBill(data) {
		let res = await Request.post('/bill/modifyBillById', {id: data.id, status: 4});
		console.log(res);
		if(res.data == 'success') {
			message.success('撤销成功');
			this.onSearchBill();
		}
	}


	render() {
		let {list} = this.state;
		const columns = [
			{
				title: '审批编号',
				dataIndex: 'code',
				key: 'code',
				align: 'center'
			},
			{
				title: '支付方式',
				dataIndex: 'type',
				key: 'type',
				align: 'center',
				render: (text, record) => {
					return <span>{Filter.filterBillType(record.type)}</span>;
				}
			},
			{
				title: '收款账号',
				dataIndex: 'account',
				key: 'account',
				align: 'center'
			},
			{
				title: '联系人姓名',
				dataIndex: 'name',
				key: 'name',
				align: 'center'
			},
			{
				title: '联系人电话',
				dataIndex: 'phone',
				key: 'phone',
				align: 'center'
			},
			{
				title: '支付金额(元)',
				dataIndex: 'money',
				key: 'money',
				align: 'center'
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
				title: '状态',
				dataIndex: 'status',
				key: 'status',
				align: 'center',
				render: (text, record) => {
					let status = record.status;
					if(status == 1) return <span style={{color: '#15863d'}}>{Filter.filterBillStatus(record.status)}</span>;
					if(status == 2) return <span style={{color: 'red'}}>{Filter.filterBillStatus(record.status)}</span>;
					if(status == 3) return <span style={{color: '#008dff'}}>{Filter.filterBillStatus(record.status)}</span>;
					if(status == 4) return <span style={{color: 'red'}}>{Filter.filterBillStatus(record.status)}</span>;
				}
			},
			{
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				align: 'center',
				render: (text, record) => {
					let status = record.status;
					if(status == 1) {
						return <Popconfirm placement="top" title="是否确认撤销" onConfirm={this.onCancelBill.bind(this, record)} okText="确认" cancelText="取消">
							<a href="javascript:;">撤销</a>
			 			</Popconfirm>;
					}
				}
			},
		];
		return (
			<div className='common'>
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
