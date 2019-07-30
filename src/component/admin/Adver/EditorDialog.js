import React from 'react';
import {
	Form, Modal, Row, Col, message, Select
} from 'antd';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import Request from '../../../request/AxiosRequest';
const FormItem = Form.Item;
const { Option } = Select;

class EditorDialog extends React.Component {

	constructor(props) {
		super(props);
		this.swiperStore = props.SwiperStore;
	}

	state = {
		allShopDetail: [],
		allGoodsDetail: [],
	};

	async componentDidMount() {
		let editData = this.props.editData;
		await this.getAllShop();
		await this.shopSelect(editData.shop_id);
		setTimeout(() => {
			this.props.form.setFieldsValue({
				shop: String(editData.shop_id),
				goods: String(editData.goods_id),
				status: String(editData.status)
			});
		}, 100);
	}

	async handleOk()  {
		this.props.form.validateFields(async (err, values) => {
			try {
				if (err) return;
				console.log(this.props.editData);
				console.log(values);
				const formData = new FormData();
				formData.append('id', this.props.editData.id);
				formData.append('shop_id', values.shop);
				formData.append('goods_id', values.goods);
				formData.append('status', values.status);
				if(!this.cropper) {
					let res = await Request.post('/adver/modify', formData);
					if(res.data == 'success') {
						this.props.controllerEditorDialog();
						this.props.onSearch();
						return message.success('编辑成功');
					}
				}
				this.cropper.getCroppedCanvas().toBlob(async (blob) => {
					formData.append('file', blob);
					let res = await Request.post('/adver/modify', formData);
					if(res.data == 'success') {
						this.props.controllerEditorDialog();
						this.props.onSearch();
						return message.success('编辑成功');
					}
				});
			} catch (error) {
				console.log(error);
			}
		});
	}

	handleCancel() {
		this.props.controllerEditorDialog();
	}

	fileChange() {
		let self = this;
		let file = document.getElementById('swiper_dialog_img').files[0];
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onprogress = function(e) {
			if (e.lengthComputable) {
				// 简单把进度信息打印到控制台吧
				console.log(e.loaded / e.total + '%');
			}
		};
		reader.onload = function(e) {
			var image = new Image();
			image.src = e.target.result;
			let dom = document.querySelector('.swiper_dialog_preview');
			dom.innerHTML = '';
			dom.appendChild(image);
			self.cropper = new Cropper(image, {
				aspectRatio: 4 / 5,
				zoomable: false
			});
		};
		reader.onerror = function() {
			message.warning('服务端错误, 请稍后重试');
		};
	}

	// 获取所有商店信息
	async getAllShop() {
		// 获取所有店铺信息
		let res = await Request.get('/shop/getAllForSelect');
		let data = res.data || [];
		this.setState({
			allShopDetail: data
		});
	}

	// 商店选择获取食品信息
	async shopSelect(shopid) {
		console.log(shopid, 678);
		// 获取所有店铺信息
		let res = await Request.get('/goods/getDescGoodsByShopId', {shopid: shopid});
		let data = res.data || [];
		this.setState({
			allGoodsDetail: data
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		let {allShopDetail, allGoodsDetail} = this.state;
		return (
			<div>
				<Modal
					className='common_dialog'
					title="广告信息编辑"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}>
					<Form {...formItemLayout} onSubmit={this.handleSubmit}>
						<FormItem
							label="关联店铺">
							{getFieldDecorator('shop', {
								rules: [{
									required: true,
									message: '请选择',
								}],
							})(
								<Select placeholder="请选择" onSelect={this.shopSelect.bind(this)}>
									{
										allShopDetail && allShopDetail.length != 0 ?
											allShopDetail.map(item => {
												return <Option key={item.id} value={String(item.id)}>{item.name}</Option>;
											})
											: null
									}
								</Select>
							)}
						</FormItem>
						<FormItem
							label="关联食品">
							{getFieldDecorator('goods', {
								rules: [{
									required: true,
									message: '请选择',
								}],
							})(
								<Select placeholder="请选择">
									{
										allGoodsDetail && allGoodsDetail.length != 0 ?
											allGoodsDetail.map(item => {
												return <Option key={item.id} value={String(item.id)}>{item.name}</Option>;
											})
											: null
									}
								</Select>
							)}
						</FormItem>
						<FormItem
							label="是否展示">
							{getFieldDecorator('status', {
								rules: [{
									required: true,
									message: '请选择',
								}],
							})(
								<Select placeholder="请选择">
									<Option value="1">展示</Option>
									<Option value="2">不展示</Option>
								</Select>
							)}
						</FormItem>
						<Row className='campus_container'>
							<Col span={4} className='campus_container_label'>图片录入：</Col>
							<Col span={20}>
								<input
									type="file"
									id='swiper_dialog_img'
									accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
									onChange={this.fileChange.bind(this)}/>
							</Col>
						</Row>
						<Row className='campus_container'>
							<Col span={4} className='campus_container_label'></Col>
							<Col span={20} className='swiper_dialog_preview'>
								<img src={this.props.editData.url}/>
							</Col>
						</Row>
					</Form>
				</Modal>
			</div>
		);
	}
}

const EditorDialogForm = Form.create()(EditorDialog);
export default EditorDialogForm;
