import React, { Component } from 'react'
import {
  Form,
  Row,
  Col,
  Select,
  Input,
  Table,
  Modal,
  Button,
  Icon,
  message,
} from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import Title from 'components/Title'
import style from './edit.css'
// import bridge from 'utils/bridge'

const Option = Select.Option
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
}

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 16, offset: 8 },
  },
}

let id = 0
class EditFrom extends Component {
  static propTypes = {
    form: PropTypes.object,
  }
  constructor (props) {
    super(props)
    this.state = {
      norm: [1],
      specPriceList: [],
    }
    this.handleSave = this.handleSave.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.addNorm = this.addNorm.bind(this)
    this.editConfirm = this.editConfirm.bind(this)
    this.specIdChange = this.specIdChange.bind(this)
    this.goodChange = this.goodChange.bind(this)
    this.firChange = this.firChange.bind(this)
    this.secChange = this.secChange.bind(this)
    this.thiChange = this.thiChange.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }

  // 一级类目
  firChange (e, option) {
    this.setState({
      categoryId: e,
      first: option.props.children,
      second: undefined,
      third: undefined,
    })
    this.props.getfirCategory({ parentId: e })
  }
  // 二级类目
  secChange (e, option) {
    this.setState({
      categoryId: e,
      second: option.props.children,
      third: undefined,
    })
    this.props.getsecCategory({ parentId: e })
  }
  // 三级类目
  thiChange (e, option) {
    this.setState({
      categoryId: e,
      third: option.props.children,
    })
  }

  handleReset () {
    this.props.resetCategory()
    this.props.resetDetailCategory()
    this.setState({
      categoryId: null,
      first: undefined,
      second: undefined,
      third: undefined,
    })
  }

  goodChange (e) {
    if (parseInt(e) === 1) {
      this.setState({
        barcodeVisible: true,
      })
    } else {
      this.setState({
        barcodeVisible: false,
      })
    }
  }

  componentDidMount () {
    this.props.getGuige()
    this.props.getCategory()
    this.props.getEditDetails({
      commodityId: this.props.match.params.id,
    })
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.editDetail && nextProps.editDetail && !this.state.action) {
      this.setState({
        first: nextProps.editDetail && nextProps.editDetail.firstCategoryName,
        second: nextProps.editDetail && nextProps.editDetail.secondCategoryName,
        third: nextProps.editDetail && nextProps.editDetail.thirdCategoryName,
        action: true,
      })
    }
  }

  handleConfirm () {
    let data = []

    this.props.form.validateFields((e, values) => {
      const specInfoList = []
      let info = ''
      values.keys.forEach((element, index) => {
        this.props.norm.map((item, idex) => {
          if (item.id === values.specId[index]) {
            info = info + `${values.specValue[index]}` + ' '
          }
        })

        if (values.specId[index] && values.specValue[index]) {
          specInfoList.push({
            specId: values.specId[index] || null,
            specValue: values.specValue[index] || null,
          })
        }
        // specInfoList.push({
        //   specId: values.specId[index],
        //   specValue: values.specValue[index],
        // })
      })
      data.push({
        cost: values.cost,
        stock: values.stock,
        price: values.price,
        barcode: values.barcode,
        specValueString: info,
        specInfoList,
      })
      this.props.addInfo(data)
      this.setState({
        addVisible: false,
      })
    })
  }

  specIdChange (value, option) {
    this.setState({
      specIdValue: option.props.children,
    })
  }

  editConfirm () {
    const { editKey } = this.state
    let data = this.props.editDetail.specPriceList.slice(0)
    this.props.form.validateFields((e, values) => {
      data[editKey].cost = values.cost
      data[editKey].stock = values.stock
      data[editKey].price = values.price
      data[editKey].barcode = values.barcode
      this.props.editInfo(data)
      this.setState({
        editVisible: false,
      })
    })
  }

  addNorm () {
    const { form } = this.props
    id = 0
    form.setFieldsValue({
      keys: [],
    })
    this.setState({
      addVisible: true,
      editData: {},
    })
  }

  add () {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(id++)
    form.setFieldsValue({
      keys: nextKeys,
    })
  }

  edit (record, index) {
    this.setState({
      editData: record,
      editKey: index,
      editVisible: true,
    })
  }

  remove (k) {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    // if (keys.length === 1) {
    //   return
    // }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    })
  }

  deleteInfo (index) {
    let data = this.props.editDetail.specPriceList.slice(0)
    data.splice(index, 1)
    this.props.deleteInfo(data)
  }

  handleSave () {
    if (!this.submiting) {
      this.props.form.validateFields((e, values) => {
        this.submiting = true
        delete values.keys
        delete values.cost
        delete values.price
        delete values.stock

        values.commodityId = this.props.editDetail.id
        const arr = JSON.parse(
          JSON.stringify(this.props.editDetail.specPriceList.slice(0))
        )
        // arr.forEach(element => {
        //   if (element.specInfoList && element.specInfoList.length > 0) {
        //     element.cost = element.cost
        //     element.price = element.price
        //   }
        // })
        values.specPriceList = arr
        if (this.state.categoryId) {
          values.categoryId = this.state.categoryId
        }
        this.props.editOwnGoods(values, res => {
          if (res.success) {
            message.success('编辑成功', 4)
            this.props.router.replace('/beinoen/shop/store')
            this.submiting = false
          } else {
            this.submiting = false
          }
        })
      })
    }
  }

  render () {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const columns = [
      {
        title: '规格信息',
        dataIndex: 'specValueString',
        key: 'specValueString',
        align: 'center',
        width: 300,
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
      },
      {
        title: '成本价',
        dataIndex: 'cost',
        key: 'cost',
        align: 'center',
      },
      {
        title: '库存',
        dataIndex: 'stock',
        key: 'stock',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        align: 'center',
        width: 150,
        render: (text, record, index) => {
          return (
            <div className={style['edit-container']}>
              <a
                className={style[`add-norm`]}
                onClick={() => this.edit(record, index)}
              >
                编辑
              </a>
              <a
                className={style[`add-norm`]}
                onClick={() => this.deleteInfo(index)}
              >
                删除
              </a>
            </div>
          )
        },
      },
    ]
    getFieldDecorator('keys', { initialValue: [] })
    const keys = getFieldValue('keys')
    const formItems = keys.map((k, index) => (
      <Row gutter={24} key={index}>
        <Col span={11}>
          <FormItem {...formItemLayout} label="规格设置">
            {getFieldDecorator(`specId[${k}]`)(
              <Select
                placeholder="请选择"
                style={{ width: '220px' }}
                width={220}
                onChange={this.specIdChange}
              >
                {this.props.norm.map((item, index) => {
                  return (
                    <Option key={index} value={item.id}>
                      {item.name}
                    </Option>
                  )
                })}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={11}>
          <FormItem {...formItemLayout} label="规格型号">
            {getFieldDecorator(`specValue[${k}]`)(
              <Input placeholder="输入规格型号" />
            )}
          </FormItem>
        </Col>
        <Col span={2}>
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
          {/* {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(k)}
            />
          ) : null} */}
        </Col>
      </Row>
    ))
    return (
      <div className="contaienr-box">
        <ContentBox>
          <Form>
            <Title title="基本信息" />
            <div className={style['form-container']}>
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="商品编码"
                    help="*内部管理使用，如外部系统商品，建议编码规则一致"
                  >
                    {getFieldDecorator('id')(
                      <div style={{ fontSize: '20px' }}>
                        {this.props.editDetail && this.props.editDetail.id}
                      </div>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="商品名称">
                    {getFieldDecorator('name', {
                      initialValue:
                        this.props.editDetail && this.props.editDetail.name,
                    })(<Input placeholder="输入商品名称" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="商品单位">
                    {getFieldDecorator('unit', {
                      initialValue:
                        this.props.editDetail && this.props.editDetail.unit,
                    })(
                      <Select placeholder="请选择">
                        <Option value="瓶">瓶</Option>
                        <Option value="件">件</Option>
                        <Option value="袋">袋</Option>
                        <Option value="片">片</Option>
                        <Option value="盒">盒</Option>
                        <Option value="箱">箱</Option>
                        <Option value="桶">桶</Option>
                        <Option value="听">听</Option>
                        <Option value="个">个</Option>
                        <Option value="双">双</Option>
                        <Option value="只">只</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={16} pull={1}>
                  <FormItem {...formItemLayout} label="商品分类">
                    {getFieldDecorator('type', {})(
                      <>
                        <div className={style['category-container']}>
                          <Select
                            placeholder="一级分类"
                            className={style['pright']}
                            onChange={this.firChange}
                            value={
                              this.state.first ||
                              (this.props.editDetail &&
                                this.props.editDetail.firstCategoryName)
                            }
                          >
                            {this.props.category.map(item => {
                              return (
                                <Option key={1} value={item.id}>
                                  {item.name}
                                </Option>
                              )
                            })}
                          </Select>
                          <Select
                            placeholder="二级分类"
                            className={style['pright']}
                            value={
                              this.state.second ||
                              (this.props.editDetail &&
                                this.props.editDetail.secondCategoryName)
                            }
                            onChange={this.secChange}
                          >
                            {this.props.firCategory.map(item => {
                              return (
                                <Option key={1} value={item.id}>
                                  {item.name}
                                </Option>
                              )
                            })}
                          </Select>
                          <Select
                            placeholder="三级分类"
                            value={
                              this.state.third ||
                              (this.props.editDetail &&
                                this.props.editDetail.thirdCategoryName)
                            }
                            onChange={this.thiChange}
                          >
                            {this.props.secCategory.map(item => {
                              return (
                                <Option key={1} value={item.id}>
                                  {item.name}
                                </Option>
                              )
                            })}
                          </Select>
                        </div>
                      </>
                    )}
                  </FormItem>
                </Col>
                <Col span={4}>
                  <button
                    onClick={this.handleReset}
                    className={style['select']}
                  >
                    重置类目
                  </button>
                </Col>
              </Row>
            </div>
            <Title title="规格信息(SKU)" />
            <button
              onClick={() => this.addNorm()}
              className={style['add-norm-info']}
            >
              添加规格
            </button>
            <Table
              rowKey={(record, index) => index}
              dataSource={
                (this.props.editDetail &&
                  this.props.editDetail.specPriceList) ||
                []
              }
              columns={columns}
              pagination={false}
            />
            <Modal
              key={1}
              destroyOnClose
              maskClosable={false}
              title="添加规格"
              visible={this.state.addVisible}
              width={700}
              footer={null}
              onCancel={() => {
                this.setState({ addVisible: false })
              }}
            >
              <>
                {formItems}
                <FormItem {...formItemLayoutWithOutLabel}>
                  <Button
                    type="dashed"
                    onClick={() => this.add()}
                    style={{ width: '60%' }}
                  >
                    <Icon type="plus" /> 添加规格
                  </Button>
                </FormItem>
                <Row gutter={24}>
                  <Col span={12} push={6}>
                    <FormItem {...formItemLayout} label="商品条形码">
                      {getFieldDecorator('barcode', {})(
                        <Input placeholder="请输入商品条形码" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12} push={6}>
                    <FormItem {...formItemLayout} label="建议零售价">
                      {getFieldDecorator(`price`, {})(
                        <Input placeholder="输入零售价" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12} push={6}>
                    <FormItem
                      {...formItemLayout}
                      label="成本价"
                      help="*成本价由系统自动计算，如需调整可在成本调价进行修改"
                    >
                      {getFieldDecorator(`cost`, {})(
                        <Input placeholder="请输入成本价" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12} push={6}>
                    <FormItem
                      {...formItemLayout}
                      label="商品库存"
                      help="*创建时可设置初始库存，创建后可在商品入库管理库存"
                    >
                      {getFieldDecorator(`stock`, {})(
                        <Input placeholder="输入库存" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <div className={style['btn-container']}>
                  <button
                    className={style['add-norm-info']}
                    onClick={this.handleConfirm}
                  >
                    确认
                  </button>
                </div>
              </>
            </Modal>
            <Modal
              key={2}
              title="编辑"
              maskClosable={false}
              visible={this.state.editVisible}
              destroyOnClose
              footer={null}
              onCancel={() => {
                this.setState({
                  editVisible: false,
                })
              }}
            >
              <>
                <Row gutter={24}>
                  <Col span={16} push={2}>
                    <FormItem {...formItemLayout} label="规格信息">
                      {getFieldDecorator(`sku`)(
                        <div>
                          {this.state.editData &&
                            this.state.editData.specValueString}
                        </div>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={16} push={2}>
                    <FormItem {...formItemLayout} label="建议零售价">
                      {getFieldDecorator(`price`, {
                        initialValue:
                          this.state.editData && this.state.editData.price,
                      })(<Input placeholder="输入零售价" />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={16} push={2}>
                    <FormItem {...formItemLayout} label="商品条形码">
                      {getFieldDecorator('barcode', {
                        initialValue:
                          this.state.editData && this.state.editData.barcode,
                      })(<Input disabled placeholder="请输入商品条形码" />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={16} push={2}>
                    <FormItem
                      {...formItemLayout}
                      label="成本价"
                      help="*成本价由系统自动计算，如需调整可在成本调价进行修改"
                    >
                      {getFieldDecorator(`cost`, {
                        initialValue:
                          this.state.editData && this.state.editData.cost,
                      })(<Input placeholder="请输入成本价" />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={16} push={2}>
                    <FormItem
                      {...formItemLayout}
                      label="商品库存"
                      help="*创建时可设置初始库存，创建后可在商品入库管理库存"
                    >
                      {getFieldDecorator(`stock`, {
                        initialValue:
                          this.state.editData && this.state.editData.stock,
                      })(<Input placeholder="输入库存" />)}
                    </FormItem>
                  </Col>
                </Row>
                <div className={style['btn-container']}>
                  <button
                    className={style['add-norm-info']}
                    onClick={this.editConfirm}
                  >
                    确认
                  </button>
                </div>
              </>
            </Modal>
          </Form>
          <div className={style['btn-container']}>
            <button onClick={this.handleSave} className={style['save']}>
              保存
            </button>
            <button
              onClick={() => {
                this.props.router.goBack()
              }}
              className={style['save']}
            >
              返回
            </button>
          </div>
        </ContentBox>
      </div>
    )
  }
}

const mapState = state => ({
  norm: state.shop.norm || [],
  editDetail: state.shop.editDetail,
  category: state.shop.category || [],
  firCategory: (state.shop && state.shop.fircategory) || [],
  secCategory: (state.shop && state.shop.seccategory) || [],
})
const mapDispatch = dispatch => ({
  editOwnGoods: dispatch.shop.editOwnGoods,
  getEditDetails: dispatch.shop.getEditDetails,
  getGuige: dispatch.shop.getGuige,
  deleteInfo: dispatch.shop.deleteInfo,
  addInfo: dispatch.shop.addInfo,
  editInfo: dispatch.shop.editInfo,
  getCategory: dispatch.shop.getCategory,
  getfirCategory: dispatch.shop.getfirCategory,
  getsecCategory: dispatch.shop.getsecCategory,
  resetDetailCategory: dispatch.shop.resetDetailCategory,
  resetCategory: dispatch.shop.resetCategory,
})
const Edit = Form.create()(EditFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Edit)
)
