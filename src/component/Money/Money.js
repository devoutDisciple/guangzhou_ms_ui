import React from 'react';
import {
	Table
} from 'antd';
// // const { Option } = Select;
// import Request from '../../request/AxiosRequest';
// import moment from 'moment';

export default class Order extends React.Component{

	constructor(props) {
		super(props);
	}

	state = {
		oderList: []
	}

	async componentDidMount() {

	}



	// 查看订单详情
	async onSearchOrderDetail() {

	}


	render() {
		let {oderList} = this.state;
		const columns = [
			{
				title: '商店名称',
				dataIndex: 'name',
				key: 'name',
				align: 'center'
			},
			{
				title: '账户类型',
				dataIndex: 'type',
				key: 'type',
				align: 'center'
			},
			{
				title: '账户',
				dataIndex: 'account',
				key: 'account',
				align: 'center'
			},
			{
				title: '提现金额',
				dataIndex: 'money',
				key: 'money',
				align: 'center'
			},
			{
				title: '发起时间',
				dataIndex: 'time',
				key: 'time',
				align: 'center'
			},

			{
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				align: 'center',
				render:(text, record) => {
					return <span className="common_table_span">
						<a href="javascript:;" onClick={this.onSearchOrderDetail.bind(this, record)}>订单详情</a>
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
