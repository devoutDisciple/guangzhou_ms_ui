import React from 'react';
import {inject, observer} from 'mobx-react';
import {
	Button, Table, Popconfirm, message, Tooltip, Form, Select, Col
} from 'antd';
const FormItem = Form.Item;
const { Option } = Select;
import Request from '../../request/AxiosRequest';
import AddDialog from './AddDialog';
import EditorDialog from './EditorDialog';
import './index.less';

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
		// new Audio(
		// 	'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=您有新的订单啦~'
		//   ).play();
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
				await this.onSearchGoods();
			});
		}
	}

	// 查询菜品
	async onSearchGoods() {
		await this.goodsStore.getAllGoods(this.state.shopid);
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
		let result = await Request.post('/goods/delete', {id: record.id});
		if(result.data == 'success') {
			message.success('删除成功');
			return this.onSearchGoods();
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


	// 修改今日推荐
	async onRecommend(data, type) {
		let result = await Request.get('/goods/updateToday', {id: data.id, type});
		if(result.data == 'success') {
			message.success('修改成功');
			return this.onSearchGoods();
		}
	}

	// 商店选择的时候
	selectChange(id) {
		this.setState({
			shopid: id
		}, async () => {
			await this.onSearchGoods();
		});
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
				title: '餐盒费',
				dataIndex: 'package_cost',
				key: 'package_cost',
				align: 'center'
			},
			{
				title: '今日推荐',
				dataIndex: 'today',
				key: 'today',
				align: 'center',
				render:(text, record) => {
					if(record.today == 1) return <span className='common_cell_green'>是</span>;
					return <span className='common_cell_red'>否</span>;
				}
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
							record.today == 2 ?
								<a href="javascript:;" onClick={this.onRecommend.bind(this, record, 1)}>今日推荐</a>
								:
								<a href="javascript:;" onClick={this.onRecommend.bind(this, record, 2)}>取消推荐</a>
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
		let {addDialogVisible, shopid, editorDialogVisible, editData} = this.state;
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
									<Select placeholder="请选择" onChange={this.selectChange.bind(this)}>
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
				{
					addDialogVisible ?
						<AddDialog
							shopid={shopid}
							onSearch={this.onSearchGoods.bind(this)}
							controllerAddDialog={this.controllerAddDialog.bind(this)}/>
						: null
				}
				{
					editorDialogVisible ?
						<EditorDialog
							shopid={shopid}
							data={editData}
							onSearch={this.onSearchGoods.bind(this)}
							controllerEditorDialog={this.controllerEditorDialog.bind(this)}/>
						: null
				}
			</div>
		);
	}
}

const GoodsForm = Form.create()(Goods);
export default GoodsForm;
