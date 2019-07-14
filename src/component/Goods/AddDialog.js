import React from 'react';
import {
	Form, Input, Modal, Radio, Row, Col, message
} from 'antd';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

const FormItem = Form.Item;
// const { Option } = Select;

class AddDialog extends React.Component {

	constructor(props) {
		super(props);
		this.shopStore = props.ShopStore;
	}

	state = {

	};

	async componentDidMount() {
		this.props.form.setFieldsValue({
			send_price: '2'
		});
	}

	fileChange() {
		let self = this;
		let file = document.getElementById('goods_main_img').files[0];
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
			let dom = document.querySelector('.goods_main_preview');
			dom.innerHTML = '';
			dom.appendChild(image);
			self.cropper = new Cropper(image, {
				aspectRatio: 4 / 4,
				zoomable: false
			});
		};
		reader.onerror = function() {
			message.warning('服务端错误, 请稍后重试');
		};
	}

	descChange() {
		let files = document.getElementById('goods_desc_img').files;
		console.log(files);
		let dom = document.querySelector('.goods_desc_preview');
		for(let i = 0; i < files.length; i++) {
			var reader = new FileReader();
			reader.readAsDataURL(files[i]);
			reader.onload = function(e) {
				var image = new Image();
				image.src = e.target.result;
				dom.appendChild(image);
			};
			reader.onerror = function() {
				message.warning('服务端错误, 请稍后重试');
			};
		}
	}

	async handleOk()  {
		this.props.form.validateFields(async (err, values) => {
			let descFiles = document.getElementById('goods_desc_img').files;
			console.log(descFiles);
			try {
				if (err) return;
				if(!this.cropper) return message.warning('请上传主图');

				this.cropper.getCroppedCanvas().toBlob(async (blob) => {
					let campus = localStorage.getItem('campus') || '';
					// const formData = new FormData();
					// formData.append('campus', campus);
					// formData.append('file', blob);
					// formData.append('shop', values.shop);
					// formData.append('sort', Number(values.sort) || 1);
					// let res = await this.swiperStore.addSwiper(formData);
					// if(res.data == 'success') {
					// 	this.props.controllerAddDialog();
					// 	this.props.onSearch();
					// 	return message.success('新增成功');
					// }
				});
				console.log(values);
			} catch (error) {
				console.log(error);
			}
		});
	}

	handleCancel() {
		this.props.controllerAddDialog();
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		return (
			<div>
				<Modal
					className='common_dialog common_max_dialog'
					title="新增商品"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}>
					<Form {...formItemLayout} onSubmit={this.handleSubmit}>
						<FormItem
							label="商品名称">
							{getFieldDecorator('name', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input placeholder="请输入" />
							)}
						</FormItem>
						<FormItem
							label="价格">
							{getFieldDecorator('price', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input type="number" placeholder="请输入" />
							)}
						</FormItem>
						<FormItem
							label="餐盒费">
							{getFieldDecorator('package_cost', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input type="number" placeholder="请输入" />
							)}
						</FormItem>
						<FormItem
							label="今日推荐">
							{getFieldDecorator('send_price', {
								rules: [{
									required: true,
									message: '请选择',
								}],
							})(
								<Radio.Group>
									<Radio value="1">是</Radio>
									<Radio value="2">否</Radio>
								</Radio.Group>
							)}
						</FormItem>
						<FormItem
							label="权重">
							{getFieldDecorator('sort', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input type="number" placeholder="请输入权重, 权重越高, 排名越靠前" />
							)}
						</FormItem>
						<FormItem
							label="描述">
							{getFieldDecorator('desc')(
								<Input placeholder="请输入(8个字以内)" />
							)}
						</FormItem>
						<Row className='campus_container'>
							<Col span={4} className='campus_container_label'>主图录入：</Col>
							<Col span={20}>
								<input
									type="file"
									id='goods_main_img'
									accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
									onChange={this.fileChange.bind(this)}/>
							</Col>
						</Row>
						<Row className='campus_container'>
							<Col span={4} className='campus_container_label'></Col>
							<Col span={20} className='goods_main_preview'>
							</Col>
						</Row>
						<Row className='campus_container goods_container'>
							<Col span={4} className='campus_container_label'>描述图片：</Col>
							<Col span={20}>
								<input
									type="file"
									id='goods_desc_img'
									multiple
									accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
									onChange={this.descChange.bind(this)}/>
							</Col>
						</Row>
						<Row className='campus_container'>
							<Col span={4} className='campus_container_label'></Col>
							<Col span={20} className='goods_desc_preview'>
							</Col>
						</Row>
					</Form>
				</Modal>
			</div>
		);
	}
}

const AddDialogForm = Form.create()(AddDialog);
export default AddDialogForm;
