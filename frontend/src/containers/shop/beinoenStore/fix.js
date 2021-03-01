import React, { Component } from 'react'
import { Form, Row, Col, Select, Input, Table } from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import Title from 'components/Title'
import { debounce } from 'utils'
import style from './fix.css'

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

class EditFrom extends Component {
  static propTypes = {
    form: PropTypes.object,
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.handleSave = this.handleSave.bind(this)
  }

  handleSave () {
    this.props.form.validateFields((e, values) => {
      if (!e) {
        this.props.editBainuoenGoods(values)
      }
    })
  }

  codeChange (e, record, index) {
    // const value = e
  }

  saleChange (e, record, index) {
    // const value = e
  }

  finalChange (e, record, index) {
    // const value = e
  }

  storeChange (e, record, index) {
    // const value = e
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const dataSource = [
      {
        a: '32',
        b: '12',
        c: 12,
        d: '已入库',
        e: '张三',
        f: '2015',
      },
      {
        a: '41',
        b: '12',
        c: 12,
        d: '已入库',
        e: '张三',
        f: '2019',
      },
    ]
    const addClumns = [
      {
        title: '尺码',
        dataIndex: 'a',
        key: 'a',
        align: 'center',
      },
      {
        title: '款式',
        dataIndex: 'b',
        key: 'b',
        align: 'center',
      },
      {
        title: '规格编码',
        dataIndex: 'c',
        key: 'c',
        align: 'center',
        render: (text, record, index) => (
          <Input
            onChange={e =>
              debounce(this.codeChange, 500)(e.target.value, record, index)
            }
            style={{ width: '150px' }}
            defaultValue={text}
          />
        ),
      },
      {
        title: '建议零售价',
        dataIndex: 'bs',
        key: 'bs',
        align: 'center',
        render: (text, record, index) => (
          <Input
            onChange={e =>
              debounce(this.saleChange, 500)(e.target.value, record, index)
            }
            style={{ width: '80px' }}
            defaultValue={text}
          />
        ),
      },
      {
        title: '成交价',
        dataIndex: 'e',
        key: 'e',
        align: 'center',
        render: (text, record, index) => (
          <Input
            onChange={e =>
              debounce(this.finalChange, 500)(e.target.value, record, index)
            }
            style={{ width: '80px' }}
            defaultValue={text}
          />
        ),
      },
      {
        title: '商品库存',
        dataIndex: 'f',
        key: 'f',
        align: 'center',
        render: (text, record, index) => (
          <Input
            onChange={e =>
              debounce(this.storeChange, 500)(e.target.value, record, index)
            }
            style={{ width: '80px' }}
            defaultValue={text}
          />
        ),
      },
    ]
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
                    {getFieldDecorator('name')(
                      <Input placeholder="如无编码系统将自动生成" />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="商品名称">
                    {getFieldDecorator('name', {})(
                      <Select placeholder="例如：XXX无色面巾纸">
                        <Option key={1}>test</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="商品分类">
                    {getFieldDecorator('name', {})(
                      <Select placeholder="选择分类">
                        <Option key={1}>test</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="外部编码">
                    {getFieldDecorator('name')(
                      <Input placeholder="外部编码" />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="商品条形码">
                    {getFieldDecorator('name', {})(
                      <Input placeholder="请输入商品条形码" />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="商品单位">
                    {getFieldDecorator('name', {})(
                      <Select placeholder="请选择">
                        <Option key={1}>test</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
            <Title title="规格信息(SKU)" />
            <div className={style['form-container']}>
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="规格设置">
                    {getFieldDecorator('name', {})(
                      <Select placeholder="尺码">
                        <Option key={1}>test</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24} pull={1}>
                  <FormItem
                    {...{
                      labelCol: {
                        sm: { span: 4 },
                      },
                      wrapperCol: {
                        sm: { span: 20 },
                      },
                    }}
                    label="规格信息"
                  >
                    {getFieldDecorator('name', {})(
                      <Table
                        rowKey={(record, index) => index}
                        dataSource={dataSource}
                        columns={addClumns}
                        pagination={false}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
          </Form>
          <div className={style['btn-container']}>
            <button onClick={this.handleSave} className={style['save']}>
              保存
            </button>
          </div>
        </ContentBox>
      </div>
    )
  }
}

const mapState = state => ({})
const mapDispatch = dispatch => ({
  editBainuoenGoods: dispatch.shop.editBainuoenGoods,
})
const Edit = Form.create()(EditFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Edit)
)
