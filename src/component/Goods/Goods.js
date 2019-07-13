import React from 'react';
import {inject, observer} from 'mobx-react';
import {
	Button, Table, Popconfirm, message, Tooltip, Form, Select, Col
} from 'antd';
const FormItem = Form.Item;
const { Option } = Select;

@inject('GoodsStore')
@observer
class Goods extends React.Component{

	constructor(props) {
		super(props);
		this.goodsStore = props.GoodsStore;
	}

	state = {
		addDialogVisible: false,
		editorDialogVisible: false,
		editData: {},
		shopid: 1
	}

	async componentDidMount() {
		// 查询商店
		await this.onSearchShop();
	}

	// 查询商店
	async onSearchShop() {
		await this.goodsStore.getAllShop();
		let {shopList} = this.goodsStore;
		if(shopList && shopList.length != 0) {
			let id = shopList[0].id;
			this.setState({
				shopid: id
			}, async () => {
				setTimeout(() => {
					this.props.form.setFieldsValue({
						shop: id,
					});
				}, 100);
				await this.onSearchGoods(id);
			});
		}
	}

	// 查询菜品
	async onSearchGoods(id) {
		await this.goodsStore.getAllGoods(id);
	}

	// 查询商店所属菜品
	async onSearhcGoods() {

	}

	// 新增编辑框的显示
	controllerAddDialog() {
		this.setState({
			addDialogVisible: !this.state.addDialogVisible
		});
	}
	// 编辑框的显示
	controllerEditorDialog() {
		this.setState({
			editorDialogVisible: !this.state.editorDialogVisible
		});
	}

	// 确认删除
	async onConfirmDelete(record) {
		let result = await Request.post('/shop/delete', {id: record.id});
		if(result.data == 'success') {
			message.success('删除成功');
			return this.onSearch();
		}
	}

	// 点击修改
	onEditorCampus(record) {
		this.setState({
			editData: record
		}, () => {
			this.controllerEditorDialog();
		});
	}

	// 确认关店或者开店
	async onConfirmCloseOrOpen(record, status) {
		let res = await this.goodsStore.closeOrOpen({id: record.id, status});
		if(res.data == 'success') {
			if(status == 1) message.success('开启成功');
			else message.success('关店成功');
			this.onSearch();
		}
	}

	render() {
		const columns = [
			{
				title: '名称',
				dataIndex: 'name',
				key: 'name',
				align: 'center',
				render:(text, record) => {
					return <Tooltip placement="top" title={record.name}>
						<span className='common_table_ellipse'>{record.name}</span>
					   </Tooltip>;
				}
			},
			{
				title: '图片',
				dataIndex: 'url',
				key: 'url',
				align: 'center',
				render:(text, record) => {
					return <img className='common_table_img' src={record.url}/>;
				}
			},
			{
				title: '销售量',
				dataIndex: 'sales',
				key: 'sales',
				align: 'center'
			},
			{
				title: '描述',
				dataIndex: 'title',
				key: 'title',
				align: 'center',
				render:(text, record) => {
					return <Tooltip placement="top" title={record.title}>
						<span className='common_table_ellipse'>{record.title}</span>
					   </Tooltip>;
				}
			},
			{
				title: '价格(元)',
				dataIndex: 'price',
				key: 'price',
				align: 'center'
			},
			{
				title: '原价(元)',
				dataIndex: 'discount',
				key: 'discount',
				align: 'center'
			},
			{
				title: '餐盒费',
				dataIndex: 'package_cost',
				key: 'package_cost',
				align: 'center'
			},
			{
				title: '权重',
				dataIndex: 'sort',
				key: 'sort',
				align: 'center'
			},
			{
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				align: 'center',
				render:(text, record) => {
					return <span className="common_table_span">
						<a href="javascript:;" onClick={this.onEditorCampus.bind(this, record)}>修改</a>
						{
							record.status == 1 ?
								<Popconfirm placement="top" title="是否确认关店" onConfirm={this.onConfirmCloseOrOpen.bind(this, record, 2)} okText="确认" cancelText="取消">
									<a href="javascript:;" >关店</a>
     							</Popconfirm>
						 :
						 		<Popconfirm placement="top" title="是否确认开店" onConfirm={this.onConfirmCloseOrOpen.bind(this, record, 1)} okText="确认" cancelText="取消">
									<a href="javascript:;" >开店</a>
     							</Popconfirm>
						}

						<Popconfirm placement="top" title="是否确认删除" onConfirm={this.onConfirmDelete.bind(this, record)} okText="确认" cancelText="取消">
							<a href="javascript:;" >删除</a>
     					</Popconfirm>
					</span>;
				}
			}
		];
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		let {shopList, goodsList} = this.goodsStore;
		return (
			<div className='common'>
				<div className='common_search'>
					<Form {...formItemLayout}>
						<Col span={6}>
							<FormItem
								label="商店">
								{getFieldDecorator('shop', {
									rules: [{
										required: true,
										message: '请选择',
									}],
								})(
									<Select placeholder="请选择">
										{
											shopList && shopList.length != 0 ?
												shopList.map(item => {
													return <Option key={item.id} value={item.id}>{item.name}</Option>;
												})
												: null
										}
									</Select>
								)}
							</FormItem>
						</Col>
						<Col span={6} offset={1}>
							<Button className='goods_search_btn' type='primary' onClick={this.controllerAddDialog.bind(this)}>查询</Button>
							<Button className='goods_search_btn' type='primary' onClick={this.controllerAddDialog.bind(this)}>新增</Button>
						</Col>
					</Form>
				</div>
				<div className='common_content'>
					<Table
						bordered
						dataSource={goodsList}
						columns={columns}
						pagination={
							{
								total: goodsList.length || 0,
								showTotal: (total) => `共 ${total} 条`
							}
						}/>
				</div>
			</div>
		);
	}
}

const GoodsForm = Form.create()(Goods);
export default GoodsForm;

