import React from 'react';
import {
	Modal, Table, Tooltip
} from 'antd';
import moment from 'moment';

export default class EvaluateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.shopStore = props.ShopStore;
	}

	state = {
		data: []
	};

	async componentDidMount() {
		let data = this.props.data;
		data.map((item, index) => {
			item.key = index;
			item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
			item.desc = item.desc ? item.desc : '...';
		});
		this.setState({
			data: data
		});
	}


	handleCancel() {
		this.props.onControllerEvaluateDialog();
	}

	render() {
		const columns = [
			{
				title: '商品名称',
				dataIndex: 'goods_id',
				key: 'goods_id',
				align: 'center'
			},
			{
				title: '评价',
				dataIndex: 'desc',
				key: 'desc',
				align: 'center',
				render:(text, record) => {
					return <Tooltip placement="top" title={record.desc}>
						<span className='common_table_ellipse'>{record.desc}</span>
					   </Tooltip>;
				}
			},
			{
				title: '快递员评分',
				dataIndex: 'sender_grade',
				key: 'sender_grade',
				align: 'center',
			},
			{
				title: '商店评分',
				dataIndex: 'shop_grade',
				key: 'shop_grade',
				align: 'center',
			},
			{
				title: '评价时间',
				dataIndex: 'create_time',
				key: 'create_time',
				align: 'center'
			}
		];
		let {data} = this.state;
		return (
			<div>
				<Modal
					className='common_dialog common_max_dialog'
					title="评价记录"
					visible={true}
					footer={null}
					onCancel={this.handleCancel.bind(this)}>
					<Table
						bordered
						dataSource={data}
						columns={columns}
						pagination={
							{
								total: data.length,
								showTotal: (total) => `共 ${total} 条`
							}
						}/>
				</Modal>
			</div>
		);
	}
}
