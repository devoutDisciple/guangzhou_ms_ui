import React from 'react';
// const { Option } = Select;
import {Table, Popconfirm, message, Button, Col} from 'antd';
import {inject, observer} from 'mobx-react';
import Request from '../../../request/AxiosRequest';
import moment from 'moment';
import Filter from '../../../util/FilterOrderStatus';
import BillDialog from './BillDialog';


@inject('GlobalStore')
@observer
export default class Order extends React.Component{

	constructor(props) {
		super(props);
		this.globalStore = this.props.GlobalStore;
	}

	state = {
		list: [],
		billDialogVisible: false,
		resMoney: 0, // 可提现金额
	}

	async componentDidMount() {
		await this.onSearchBill();
		await this.getMoneyBillAlready();
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

	// 获取已提现金额和可提现金额
	async getMoneyBillAlready() {
		let shopid = this.globalStore.userinfo.shopid;
		let res = await Request.get('/bill/getBillMoneyReadyByShopid', {shopid: shopid});
		let data = res.data;
		this.setState({
			alreadyMoney: data.alreadyMoney || 0, //已经提现金额
			resMoney: data.resMoney || 0, // 可提现金额
		});
	}

	// 控制提现弹框的开关
	onControllerBillDialogVisible() {
		this.setState({
			billDialogVisible: !this.state.billDialogVisible
		});
	}


	render() {
		let {list, billDialogVisible, resMoney} = this.state;
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
				title: '收款人姓名',
				dataIndex: 'name',
				key: 'name',
				align: 'center'
			},
			{
				title: '收款人电话',
				dataIndex: 'phone',
				key: 'phone',
				align: 'center'
			},
			{
				title: '申请金额(元)',
				dataIndex: 'money',
				key: 'money',
				align: 'center'
			},
			{
				title: '平台抽成(元)',
				dataIndex: 'our_money',
				key: 'our_money',
				align: 'center'
			},
			{
				title: '提现手续费(元)',
				dataIndex: 'other_money',
				key: 'other_money',
				align: 'center'
			},
			{
				title: '到账金额(元)',
				dataIndex: 'real_money',
				key: 'real_money',
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
				<div className='common_search'>
					<Col span={6} offset={1}>
						<Button className='goods_search_btn' type='primary' onClick={this.onControllerBillDialogVisible.bind(this)}>新增</Button>
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
				{
					billDialogVisible ?
						<BillDialog
							resMoney={resMoney}
							onControllerBillDialogVisible={this.onControllerBillDialogVisible.bind(this)}/>
						: null
				}
			</div>
		);
	}
}
