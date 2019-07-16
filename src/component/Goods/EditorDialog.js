import React from 'react';
import {
	Form, Input, Modal, Radio, Row, Col, message, Upload, Icon
} from 'antd';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import config from '../../../config/config';
import request from '../../request/AxiosRequest';

const FormItem = Form.Item;
// const { Option } = Select;

class EditorDialog extends React.Component {

	constructor(props) {
		super(props);
		this.shopStore = props.ShopStore;
	}

	state = {
		previewVisible: false,
		previewImage: '',
		fileList: [
		],
	};

	async componentDidMount() {
		// this.props.form.setFieldsValue({
		// 	today: '2'
		// });
		let data = this.props.data;
		this.props.form.setFieldsValue({
			name: data.name,
			title: data.title,
			price: data.price,
			package_cost: data.package_cost,
			today: String(data.today) || '1',
			sort: data.sort,
			sales: data.sales
		});
		let list = data.desc || [], fileList = [];
		list = JSON.parse(list);
		console.log(list, 9989);
		list.map((item, index) => {
			fileList.push({
				uid: index,
				name: `${index}.jpg`,
				status: 'done',
				url: item,
			});
		});
		this.setState({
			fileList: fileList
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
		console.log(this.state.fileList, 6789);
		this.props.form.validateFields(async (err, values) => {
			try {
				if (err) return;
				let formData = new FormData(), {fileList} = this.state, desc = [];
				fileList.map(item => {
					desc.push(item.response ? item.response.data : item.url);
				});
				desc =  JSON.stringify(desc);
				formData.append('desc', desc);
				formData.append('id', this.props.data.id);
				formData.append('name', values.name);
				formData.append('title', values.title);
				formData.append('price', values.price);
				formData.append('package_cost', values.package_cost);
				formData.append('today', values.today);
				formData.append('sort', values.sort);
				formData.append('shopid', this.props.shopid);
				if(!this.cropper) {
					let res = await request.post('/goods/update', formData);
					if(res.data == 'success') {
						message.success('修改成功');
						this.props.onSearch();
						this.props.controllerEditorDialog();
					}
					return;
				}
				this.cropper.getCroppedCanvas().toBlob(async (blob) => {
					formData.append('file', blob);
					let res = await request.post('/goods/update', formData);
					if(res.data == 'success') {
						message.success('修改成功');
						this.props.onSearch();
						this.props.controllerEditorDialog();
					}
				});
			} catch (error) {
				console.log(error);
			}
		});
	}

	handleDialogCancel() {
		this.props.controllerEditorDialog();
	}

	handleCancel() {
		this.setState({ previewVisible: false });
	}

	getBase64(file) {
		return new Promise((resolve, reject) => {
		  const reader = new FileReader();
		  reader.readAsDataURL(file);
		  reader.onload = () => resolve(reader.result);
		  reader.onerror = error => reject(error);
		});
	}

	async handlePreview (file) {
  		if (!file.url && !file.preview) {
  			file.preview = await this.getBase64(file.originFileObj);
	  	}
	  	this.setState({
			previewImage: file.url || file.preview,
			previewVisible: true,
		});
	}

	handleChange ({ fileList }) {
		this.setState({ fileList });
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		const { previewVisible, previewImage, fileList } = this.state;
		const uploadButton = (
			<div>
				<Icon type="plus" />
				<div className="ant-upload-text">Upload</div>
			</div>
		);
		return (
			<div>
				<Modal
					className='common_dialog common_max_dialog'
					title="新增商品"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleDialogCancel.bind(this)}>
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
							{getFieldDecorator('today', {
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
							{getFieldDecorator('title')(
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
						<Row className='campus_container goods_img_container'>
							<Col span={4} className='campus_container_label'></Col>
							<Col span={20} className='goods_main_preview'>
								<img src={this.props.data.url}/>
							</Col>
						</Row>
						<FormItem
							label="描述图片">
							{getFieldDecorator('descFile')(
								<Upload
									action={`${config.baseUrl}/goods/uploadDescImg`}
									listType="picture-card"
									withCredentials
									fileList={fileList}
									onPreview={this.handlePreview.bind(this)}
									onChange={this.handleChange.bind(this)}>
									{fileList.length >= 3 ? null : uploadButton}
								</Upload>

							)}
						</FormItem>
						<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel.bind(this)}>
							<img alt="example" style={{ width: '100%' }} src={previewImage} />
						</Modal>
					</Form>
				</Modal>
			</div>
		);
	}
}

const EditorDialogForm = Form.create()(EditorDialog);
export default EditorDialogForm;
