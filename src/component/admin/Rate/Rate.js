import React from 'react';
import Request from '../../../request/AxiosRequest';
import {
	Table
} from 'antd';
import EditorDialog from './EditorDialog';
import axios from 'axios';

export default class Rate extends React.Component{

	constructor(props) {
		super(props);
	}

	state = {
		data: [],
		visible: false,
		editData: {}
	}

	componentDidMount() {
		this.onSearch();
	}

	// 获取数据
	async onSearch() {
		let result = await Request.get('/rate/getAll');
		let data = result.data || [];
		data.map(item => item.key = item.id);
		console.log(data);
		this.setState({data});
	}

	// 控制弹框开关
	controllerEditorDialog() {
		this.setState({visible: !this.state.visible});
	}

	// 点击编辑
	onEditAdver(data) {
		this.setState({
			editData: data
		}, () => this.controllerEditorDialog());
	}

	//
	async btnClick() {
		let access_token = '24_KeztjsqzyULsifsSvxA25ixZVKigVnR_wUBa--NRPMxs0_111hsvst7p9VOx4kZhQkF_WI7GgRQbJksUFzUmyZIV6sSvxlWI3TaDSxo7rItfIGQyjKdF19WCvGXtSNAokihbf4Z9MiTmYqE-UFFeABABMM';
		let params = JSON.parse(JSON.stringify({
			'path': 'pages/index/index?age=1'
		}));
		let result = await axios.post(`https://api.weixin.qq.com/wxa/getwxacode?access_token=${access_token}`, params);
		console.log(result);
	}

	render() {
		const columns = [
			{
				title: '平台抽成(%)',
				dataIndex: 'shop_rate',
				key: 'shop_rate',
				align: 'center',
			},
			{
				title: '提现费率(%)',
				dataIndex: 'other_rate',
				key: 'other_rate',
				align: 'center'
			},
			{
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				align: 'center',
				render: (text, record) => {
					return <a href="javascript:;" onClick={this.onEditAdver.bind(this, record)}>修改</a>;
				}
			},
		];
		let {data, visible, editData} = this.state;
		return (
			<div className='common'>
				{/* <Button onClick={this.btnClick.bind(this)}>点击</Button> */}
				<div className='common_content'>
					<Table
						bordered
						dataSource={data}
						columns={columns}
						pagination={false}/>
				</div>
				{
					visible ?
						<EditorDialog
							editData={editData}
							onSearch={this.onSearch.bind(this)}
							controllerEditorDialog={this.controllerEditorDialog.bind(this)}/>
						: null
				}
			</div>
		);
	}
}
