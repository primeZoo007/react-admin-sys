import React, { Component } from 'react'
import {
  Form,
  Row,
  Col,
  Select,
  Input,
  Table,
  Modal,
  Icon,
  Button,
  message,
} from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import Title from 'components/Title'
import style from './add.css'

const Option = Select.Option
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    sm: { span: 4 },
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
let a = 1
class AddFrom extends Component {
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
    this.addNorm = this.addNorm.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.goodChange = this.goodChange.bind(this)
    this.specIdChange = this.specIdChange.bind(this)
    this.editConfirm = this.editConfirm.bind(this)
    this.firChange = this.firChange.bind(this)
    this.secChange = this.secChange.bind(this)
    this.thiChange = this.thiChange.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }

  handleReset () {
    this.props.resetCategory()
    this.setState({
      categoryId: null,
      first: undefined,
      second: undefined,
      third: undefined,
    })
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
  }

  handleConfirm () {
    let data = this.state.specPriceList.slice(0)

    this.props.form.validateFields((e, values) => {
      console.log(1111, e, values)
      if (!e) {
        let specInfoList = []
        let info = ''
        values.keys.forEach((element, index) => {
          this.props.norm.map((item, idex) => {
            if (item.id === values.specId[index]) {
              if (values.specValue[index]) {
                info = info + `${values.specValue[index]}` + ' '
              }
            }
          })
          if (values.specId[index] && values.specValue[index]) {
            specInfoList.push({
              specId: values.specId[index] || null,
              specValue: values.specValue[index] || null,
            })
          }
        })
        if (specInfoList.length > 0) {
          data.push({
            cost: values.cost,
            stock: values.stock,
            price: values.price,
            specValueString: info,
            barcode: values.barcode,
            specInfoList,
          })
        } else {
          data.push({
            cost: values.cost,
            stock: values.stock,
            price: values.price,
            specValueString: info,
            barcode: values.barcode,
          })
        }
        this.setState({
          specPriceList: data,
          addVisible: false,
        })
      }
    })
  }

  specIdChange (value, option) {
    this.setState({
      specIdValue: option.props.children,
    })
  }
  v

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

  edit (record, index) {
    this.setState({
      editData: record,
      editKey: index,
      editVisible: true,
    })
  }
  editConfirm () {
    const { editKey } = this.state
    let data = this.state.specPriceList.slice(0)
    this.props.form.validateFields((e, values) => {
      data[editKey].cost = values.cost
      data[editKey].stock = values.stock
      data[editKey].price = values.price
      data[editKey].barcode = values.barcode
      // this.props.editInfo(data)
      this.setState({
        specPriceList: data,
        editVisible: false,
      })
    })
  }

  deleteInfo (index) {
    let data = this.state.specPriceList.slice(0)
    data.splice(index, 1)
    this.setState({
      specPriceList: data,
    })
  }

  // 保存
  handleSave () {
    if (!this.submiting) {
      this.props.form.validateFields((e, values) => {
        this.submiting = true
        // if (!e) {
        delete values.cost
        delete values.barcode
        delete values.keys
        delete values.stock
        delete values.price
        delete values.specValue
        delete values.specId
        values.categoryId = this.state.categoryId
        values.specPriceList = this.state.specPriceList
        this.props.addOwnGoods(values, res => {
          if (res.success) {
            message.success('添加成功', 4)
            setTimeout(() => {
              this.props.router.replace('/beinoen/shop/store')
            }, 500)
            this.submiting = false
          } else {
            this.submiting = false
          }
        })
        // }
      })
    }
  }

  render () {
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
    const { getFieldDecorator, getFieldValue } = this.props.form
    getFieldDecorator('keys', { initialValue: [] })
    const keys = getFieldValue('keys')
    const formItems = keys.map((k, index) => (
      <Row gutter={24} key={index}>
        <Col span={11}>
          <FormItem
            {...{
              labelCol: {
                sm: { span: 6 },
              },
              wrapperCol: {
                sm: { span: 18 },
              },
            }}
            label="规格设置"
          >
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
          <FormItem
            {...{
              labelCol: {
                sm: { span: 6 },
              },
              wrapperCol: {
                sm: { span: 18 },
              },
            }}
            label="规格型号"
          >
            {getFieldDecorator(`specValue[${k}]`)(
              <Input placeholder="输入规格型号" />
            )}
          </FormItem>
        </Col>
        <Col span={2}>
          <Icon
            style={{ paddingTop: '12px' }}
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
          {/* {keys.length > 1 ? (
            <Icon
              style={{ paddingTop: '12px' }}
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
                <Col span={15}>
                  <FormItem {...formItemLayout} label="商品名称">
                    {getFieldDecorator('name', {})(
                      <Input placeholder="请输入商品名称" />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="商品单位">
                    {getFieldDecorator('unit', {})(
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
                <Col span={15}>
                  <FormItem {...formItemLayout} label="商品分类">
                    {getFieldDecorator('type', {})(
                      <>
                        <div className={style['category-container']}>
                          <Select
                            placeholder="一级分类"
                            value={this.state.first}
                            className={style['pright']}
                            onChange={this.firChange}
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
                            value={this.state.second}
                            className={style['pright']}
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
                            placeholder="三级分类分类"
                            value={this.state.third}
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
            <Title title="规格信息" />
            <button
              onClick={() => this.addNorm()}
              className={style['add-norm-info']}
            >
              添加规格
            </button>
            <Table
              rowKey={(record, index) => index}
              dataSource={this.state.specPriceList}
              columns={columns}
              pagination={false}
            />
            <Modal
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
                  <Col span={20} push={2}>
                    <FormItem {...formItemLayout} label="商品条形码">
                      {getFieldDecorator('barcode', {
                        rules: [
                          {
                            required: true,
                            message: '请输入条形码',
                          },
                        ],
                      })(<Input autoFocus placeholder="请输入商品条形码" />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={20} push={2}>
                    <FormItem {...formItemLayout} label="建议零售价">
                      {getFieldDecorator(`price`, {
                        rules: [
                          {
                            required: true,
                            message: '请输入零售价',
                          },
                        ],
                      })(<Input type="number" placeholder="输入零售价" />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={20} push={2}>
                    <FormItem
                      {...formItemLayout}
                      label="成本价"
                      help="*成本价由系统自动计算，如需调整可在成本调价进行修改"
                    >
                      {getFieldDecorator(`cost`, {
                        rules: [
                          {
                            required: true,
                            message: '请输入成本价',
                          },
                        ],
                      })(<Input type="number" placeholder="请输入成本价" />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={20} push={2}>
                    <FormItem
                      {...formItemLayout}
                      label="商品库存"
                      help="*创建时可设置初始库存，创建后可在商品入库管理库存"
                    >
                      {getFieldDecorator(`stock`, {
                        rules: [
                          {
                            required: true,
                            message: '请输入库存',
                          },
                        ],
                      })(<Input type="number" placeholder="输入库存" />)}
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
              title="编辑"
              maskClosable={false}
              visible={this.state.editVisible}
              destroyOnClose
              footer={null}
              width={700}
              onCancel={() => {
                this.setState({
                  editVisible: false,
                })
              }}
            >
              <>
                <Row gutter={24}>
                  <Col span={20} push={2}>
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
                  <Col span={20} push={2}>
                    <FormItem {...formItemLayout} label="建议零售价">
                      {getFieldDecorator(`price`, {
                        initialValue:
                          this.state.editData && this.state.editData.price,
                        rules: [
                          {
                            required: true,
                            message: '请输入零售价',
                          },
                        ],
                      })(<Input placeholder="输入零售价" />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={20} push={2}>
                    <FormItem {...formItemLayout} label="商品条形码">
                      {getFieldDecorator('barcode', {
                        initialValue:
                          this.state.editData && this.state.editData.barcode,
                        rules: [
                          {
                            required: true,
                            message: '请输入条形码',
                          },
                        ],
                      })(
                        <Input type="number" placeholder="请输入商品条形码" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={20} push={2}>
                    <FormItem
                      {...formItemLayout}
                      label="成本价"
                      help="*成本价由系统自动计算，如需调整可在成本调价进行修改"
                    >
                      {getFieldDecorator(`cost`, {
                        initialValue:
                          this.state.editData && this.state.editData.cost,
                        rules: [
                          {
                            required: true,
                            message: '请输入成本价',
                          },
                        ],
                      })(<Input type="number" placeholder="请输入成本价" />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={20} push={2}>
                    <FormItem
                      {...formItemLayout}
                      label="商品库存"
                      help="*创建时可设置初始库存，创建后可在商品入库管理库存"
                    >
                      {getFieldDecorator(`stock`, {
                        initialValue:
                          this.state.editData && this.state.editData.stock,
                        rules: [
                          {
                            required: true,
                            message: '请输入库存',
                          },
                        ],
                      })(<Input type="number" placeholder="输入库存" />)}
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
  addRequest: state.shop.addRequest,
  category: state.shop.category || [],
  firCategory: (state.shop && state.shop.fircategory) || [],
  secCategory: (state.shop && state.shop.seccategory) || [],
})
const mapDispatch = dispatch => ({
  addOwnGoods: dispatch.shop.addOwnGoods,
  getGuige: dispatch.shop.getGuige,
  getCategory: dispatch.shop.getCategory,
  getfirCategory: dispatch.shop.getfirCategory,
  getsecCategory: dispatch.shop.getsecCategory,
  resetCategory: dispatch.shop.resetCategory,
})
const Add = Form.create()(AddFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Add)
)
