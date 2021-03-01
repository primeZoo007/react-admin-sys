/* eslint-disable no-useless-return */
import React, { Component } from 'react'
import {
  Form,
  Row,
  Col,
  InputNumber,
  Input,
  Table,
  Select,
  Modal,
  message,
  DatePicker,
} from 'antd'
import { connect } from 'react-redux'
import { createContainer } from 'utils/hoc'
import PropTypes from 'prop-types'
import ContentBox from 'components/ContentBox'
import Title from 'components/Title'

import { debounce } from 'utils'
import bridge from 'utils/bridge'
import style from './add.css'

const Option = Select.Option
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    sm: { span: 9 },
  },
  wrapperCol: {
    sm: { span: 15 },
  },
}

class AddFrom extends Component {
  static propTypes = {
    display: PropTypes.string,
    form: PropTypes.object,
    commdity: PropTypes.array,
    selectedRowKeys: PropTypes.array,
  }
  constructor (props) {
    super(props)
    this.state = {
      tempArr: [],
      memberFlag: false,
      countFlag: true,
      display: 'none',
      preferDicCount: 0,
      amount: 0.00,
      subOrderList: [],
      acVisible: true,
      selectedRow: [],
      telList: [],
    }
    this.handleGenerate = this.handleGenerate.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.handleGetGoods = this.handleGetGoods.bind(this)
    this.amountChange = this.amountChange.bind(this)
    this.typeChange = this.typeChange.bind(this)
    this.deleteInfo = this.deleteInfo.bind(this)
    this.getCommdity = this.getCommdity.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.commodityChange = this.commodityChange.bind(this)
    this.commdityPageChange = this.commdityPageChange.bind(this)
    this.selectByCommdity = this.selectByCommdity.bind(this)
    this.handleEnterKey = this.handleEnterKey.bind(this)
    this.searchTel = this.searchTel.bind(this)
    this.selectTel = this.selectTel.bind(this)
    this.disCountAmount = this.disCountAmount.bind(this)
    this.disCountChange = this.disCountChange.bind(this)
    this.disCountBlur = this.disCountBlur(this)
    this.backSum = this.backSum(this)
    this.test1 = this.test1(this)
  }

  componentDidMount () {
    this.state.changeFlag = true
    this.state.memberFlag = false
    this.setState({
      moblieDisabled: false,
    })
    this.handleBridge()
    this.props.getOwnGoods({
      pageSize: 1000,
      pageNo: 1,
    })
    this.props.getServiceList({
      pageNo: 1,
      pageSize: 1000,
      available: true,
    })
    this.props.getClerks({
      pageSize: 1000,
      pageNo: 1,
    })
  }

  componentWillUnmount () {
    this.setState({
      display: 'none',
    })
    // 离开页面时删除C端的回调事件
    bridge.clearScancode()
    // 删除全局变量
    window.localStorage.setItem('orderAddMemberId', '')
  }
  test1 () {
    this.state.memberFlag = true
  }
  handleEnterKey (e) {
    this.setState({
      selectVisible: true,
    })
    if (e.keyCode === 13) {
      return
    }
  }
  async selectTel (val, key) {
    let flag
    // eslint-disable-next-line eqeqeq
    if (val != 'null') {
      flag = await this.props.queryTel({ mid: val })
    } else {
      flag.success = false
    }
    // eslint-disable-next-line eqeqeq
    if (flag.success) {
      this.state.memberFlag = flag.data.bneMem300Flag
    }
    if (val === 'null') {
      // 非会员送空
      window.localStorage.setItem('orderAddMemberId', '')
    } else {
      window.localStorage.setItem('orderAddMemberId', val)
    }
    this.setState({
      mobile: key.key,
    })
  }
  async searchTel (val) {
    let params = {
      mobile: val,
    }
    if (val.length > 3) {
      let json = await this.props.getTelList(params)
      if (json.data.list.length > 0) {
        this.setState({
          telList: json.data.list,
        })
      } else {
        // 2019-11-03，id不能置空，
        // 会导致创建服务订单输入非会员手机号时，误判为未输入手机号
        this.setState({
          telList: [{ name: '', mobile: val, id: 'null' }],
          mobile: val,
        })
      }
    }
  }
  // 按商品名称搜索
  selectByCommdity (event) {
    this.props.resetCommdity()
    this.setState({
      selectVisible: true,
      selectedRow: [],
      selectedRowKeys: [],
    })
  }

  getCommdity () {
    this.props.form.validateFields((e, values) => {
      if (!this.state.memberFlag) {
        this.props.getCommdity({
          name: values.name || null,
          pageNo: 1,
          pageSize: 10,
          bneMem300Flag: false,
          memberId: values.memberMobile || '',
        })
      } else {
        this.props.getCommdity({
          name: values.name || null,
          pageNo: 1,
          pageSize: 10,
          memberId: values.memberMobile || '',
          bneMem300Flag: true,
        })
      }
    })
  }

  // 选择商品
  commodityChange (selectedRowKeys, selectedRow) {
    this.setState({
      selectedRowKeys,
      selectedRow,
    })
  }
  backSum (arr) {
    let temp = []
    // eslint-disable-next-line no-unused-vars
    let sum = 0
    if (arr.length > 0) {
      temp = arr
    }
    temp.map((item) => {
      if (item.commoditySrc) {
        sum += item.count * parseFloat(item.price)
      }
    })
  }
  // 添加商品
  handleAdd () {
    if (!this.state.memberFlag) {
      if (this.state.selectedRow.length > 0) {
        this.props.updateSelectedRowKeys(
          {
            selectedRowKeys: this.state.selectedRowKeys,
            selectedRow: this.state.selectedRow,
          },
          async () => {
            const arr = this.props.selectedRow
            const baseArr = JSON.parse(JSON.stringify(this.state.subOrderList))
            // eslint-disable-next-line no-unused-vars
            let amount = 0
            let sum = 0
            let commodityList = []
            let applyList = [] // 非百诺恩商品
            baseArr.concat(arr).map(item => {
              console.log(item.commoditySrc)
              amount += parseFloat(item.subOrderReceivableAmount)
              if (item.commoditySrc) {
                let m = {
                  barcodes: item.barcode,
                  total: item.count,
                  subOrderDiscount: item.subOrderDiscount,
                }
                sum += item.count * parseFloat(item.price)
                commodityList.push(m)
              } else {
                applyList.push(item)
              }
            })
            console.log(applyList)
            let mid = window.localStorage.getItem('orderAddMemberId')
            if (sum >= 300) {
              this.state.memberFlag = true
              let params = {
                commodityList: commodityList,
                memberId: mid,
                bneMem300Flag: true,
              }
              var h = await this.props.queryNewMember(params)
              amount = 0
              h.data.concat(applyList)
              console.log(h.data)
              h.data.map(item => {
                item.count = item.total
                item.subOrderReceivableAmount = (parseInt(item.subOrderReceivableAmount) / 100).toFixed(2)
                amount = amount += parseFloat(item.subOrderReceivableAmount)
              })
              let m = {}
              m.subOrderList = JSON.parse(JSON.stringify(h.data))
              m.subOrderList.map((item) => {
                item.price = parseInt((parseFloat(item.price).toFixed(2) * 100).toFixed(0))
                item.memberPrice = parseInt((parseFloat(item.memberPrice).toFixed(2) * 100).toFixed(0))
                item.subOrderDiscount = parseFloat(item.subOrderDiscount)
                item.subOrderReceivableAmount = parseInt((parseFloat(item.subOrderReceivableAmount).toFixed(2) * 100).toFixed(0))
              })
              if (this.state.changeFlag) {
                let json = await this.props.getPreferentialInfo(m)
                if (json.success) {
                // eslint-disable-next-line eqeqeq
                  if (json.data.combinationPreferentialModels && json.data.combinationPreferentialModels.length != 0) {
                    amount = (parseInt(amount) - parseInt(json.data.saveAmount / 100)).toFixed(2)
                    this.setState({
                      display: 'block',
                      moblieDisabled: true,
                      selectVisible: false,
                      subOrderList: baseArr.concat(arr),
                      preferDicCount: json.data.saveAmount / 100,
                      amount: amount,
                    })
                  } else {
                    this.setState({
                      display: 'none',
                      moblieDisabled: true,
                      selectVisible: false,
                      subOrderList: baseArr.concat(arr),
                      amount: amount,
                    })
                  }
                }
              }
            } else {
              amount = parseFloat(amount).toFixed(2)
              let m = {}
              m.subOrderList = JSON.parse(JSON.stringify(baseArr.concat(arr)))
              m.subOrderList.map((item) => {
                item.price = parseInt((parseFloat(item.price).toFixed(2) * 100).toFixed(0))
                item.memberPrice = parseInt((parseFloat(item.memberPrice).toFixed(2) * 100).toFixed(0))
                item.subOrderDiscount = parseFloat(item.subOrderDiscount)
                item.subOrderReceivableAmount = parseInt((parseFloat(item.subOrderReceivableAmount).toFixed(2) * 100).toFixed(0))
              })
              if (this.state.changeFlag) {
                let json = await this.props.getPreferentialInfo(m)
                if (json.success) {
                // eslint-disable-next-line eqeqeq
                  if (json.data.combinationPreferentialModels && json.data.combinationPreferentialModels.length != 0) {
                    amount = (parseInt(amount) - parseInt(json.data.saveAmount / 100)).toFixed(2)
                    this.setState({
                      display: 'block',
                      moblieDisabled: true,
                      selectVisible: false,
                      subOrderList: baseArr.concat(arr),
                      preferDicCount: json.data.saveAmount / 100,
                      amount: amount,
                    })
                  } else {
                    this.setState({
                      display: 'none',
                      moblieDisabled: true,
                      selectVisible: false,
                      subOrderList: baseArr.concat(arr),
                      amount: amount,
                    })
                  }
                }
              }
            }
            this.setState({
              display: 'none',
              moblieDisabled: true,
              selectVisible: false,
              subOrderList: h.data,
              amount: amount,
            })
          }
        )
      } else {
        message.warning('请选择要添加的商品', 4)
      }
    } else {
      if (this.state.selectedRow.length > 0) {
        this.props.updateSelectedRowKeys(
          {
            selectedRowKeys: this.state.selectedRowKeys,
            selectedRow: this.state.selectedRow,
          },
          async () => {
            const arr = this.props.selectedRow
            const baseArr = JSON.parse(JSON.stringify(this.state.subOrderList))
            // eslint-disable-next-line no-unused-vars
            let amount = 0
            baseArr.concat(arr).map(item => {
              amount += parseFloat(item.subOrderReceivableAmount)
            })
            amount = parseFloat(amount).toFixed(2)
            let m = {}
            m.subOrderList = JSON.parse(JSON.stringify(baseArr.concat(arr)))
            m.subOrderList.map((item) => {
              item.price = parseInt((parseFloat(item.price).toFixed(2) * 100).toFixed(0))
              item.memberPrice = parseInt((parseFloat(item.memberPrice).toFixed(2) * 100).toFixed(0))
              item.subOrderDiscount = parseFloat(item.subOrderDiscount)
              item.subOrderReceivableAmount = parseInt((parseFloat(item.subOrderReceivableAmount).toFixed(2) * 100).toFixed(0))
            })
            if (this.state.changeFlag) {
              let json = await this.props.getPreferentialInfo(m)
              if (json.success) {
                // eslint-disable-next-line eqeqeq
                if (json.data.combinationPreferentialModels && json.data.combinationPreferentialModels.length != 0) {
                  amount = (parseInt(amount) - parseInt(json.data.saveAmount / 100)).toFixed(2)
                  this.setState({
                    display: 'block',
                    moblieDisabled: true,
                    selectVisible: false,
                    subOrderList: baseArr.concat(arr),
                    preferDicCount: json.data.saveAmount / 100,
                    amount: amount,
                  })
                } else {
                  this.setState({
                    display: 'none',
                    moblieDisabled: true,
                    selectVisible: false,
                    subOrderList: baseArr.concat(arr),
                    amount: amount,
                  })
                }
              }
            }
          }
        )
      } else {
        message.warning('请选择要添加的商品', 4)
      }
    }
  }

  commdityPageChange (pageNo) {
    this.props.form.validateFields((e, values) => {
      if (!this.state.memberFlag) {
        this.props.getCommdity({
          name: values.name || null,
          pageNo,
          pageSize: 10,
          bneMem300Flag: false,
          memberId: values.memberMobile || '',
        })
      } else {
        this.props.getCommdity({
          name: values.name || null,
          pageNo,
          pageSize: 10,
          memberId: values.memberMobile || '',
          bneMem300Flag: true,
        })
      }
    })
  }

  async deleteInfo (index) {
    let arr = this.state.subOrderList.slice(0)
    console.log(arr)
    arr.splice(index, 1)
    // eslint-disable-next-line no-unused-vars
    let amount = 0
    let sum = 0
    let commodityList = []
    let mid = window.localStorage.getItem('orderAddMemberId')
    arr.map(item => {
      amount += parseFloat(item.subOrderReceivableAmount)
      if (item.commoditySrc) {
        let m = {
          barcodes: item.barcode,
          total: item.count,
          subOrderDiscount: item.subOrderDiscount,
        }
        sum += item.count * parseFloat(item.price)
        commodityList.push(m)
      }
    })

    if (sum >= 300) {
      this.state.memberFlag = true
      let params = {
        commodityList: commodityList,
        memberId: mid,
        bneMem300Flag: false,
      }
      console.log(params)
      var h = await this.props.queryNewMember(params)
      console.log(h)
      amount = 0
      h.data.map(item => {
        item.subOrderReceivableAmount = (parseInt(item.subOrderReceivableAmount) / 100).toFixed(2)
        amount += parseFloat(item.subOrderReceivableAmount)
      })
      let cloneArr = JSON.parse(JSON.stringify(h.data))
      cloneArr.map((item) => {
        item.price = parseInt((parseFloat(item.price).toFixed(2) * 100).toFixed(0))
        item.memberPrice = parseInt((parseFloat(item.memberPrice).toFixed(2) * 100).toFixed(0))
        item.subOrderDiscount = parseFloat(item.subOrderDiscount)
        item.subOrderReceivableAmount = parseInt((parseFloat(item.subOrderReceivableAmount).toFixed(2) * 100).toFixed(0))
      })
      let m = {}
      m.subOrderList = cloneArr
      if (this.state.changeFlag) {
        // 隐藏组合优惠后不必再计算组合优惠
        let json = await this.props.getPreferentialInfo(m)
        if (json.success) {
        // eslint-disable-next-line eqeqeq
          if (json.data.combinationPreferentialModels && json.data.combinationPreferentialModels.length != 0) {
            amount = (parseInt(amount) - parseInt(json.data.saveAmount / 100)).toFixed(2)
            this.setState({
              display: 'block',
              subOrderList: h.data,
              preferDicCount: json.data.saveAmount / 100,
              amount: amount,
            })
          } else {
            this.setState({
              display: 'none',
              subOrderList: h.data,
              amount: amount,
            })
          }
        }
      } else {
        this.setState({
          display: 'none',
          subOrderList: h.data,
          amount: amount,
        })
      }
    } else {
      this.state.memberFlag = false
      amount = 0
      arr.map(item => {
        amount += parseFloat(item.subOrderReceivableAmount)
      })
      let cloneArr = JSON.parse(JSON.stringify(arr))
      cloneArr.map((item) => {
        item.price = parseInt((parseFloat(item.price).toFixed(2) * 100).toFixed(0))
        item.memberPrice = parseInt((parseFloat(item.memberPrice).toFixed(2) * 100).toFixed(0))
        item.subOrderDiscount = parseFloat(item.subOrderDiscount)
        item.subOrderReceivableAmount = parseInt((parseFloat(item.subOrderReceivableAmount).toFixed(2) * 100).toFixed(0))
      })
      let params = {}
      params.subOrderList = cloneArr
      if (this.state.changeFlag) {
        let json = await this.props.getPreferentialInfo(params)
        if (json.success) {
        // eslint-disable-next-line eqeqeq
          if (json.data.combinationPreferentialModels && json.data.combinationPreferentialModels.length != 0) {
            amount = (parseInt(amount) - parseInt(json.data.saveAmount / 100)).toFixed(2)
            this.setState({
              display: 'block',
              subOrderList: arr,
              preferDicCount: json.data.saveAmount / 100,
              amount: amount,
            })
          } else {
            this.setState({
              display: 'none',
              subOrderList: arr,
              amount: amount,
            })
          }
        }
      } else {
        // 隐藏组合优惠后不必再计算组合优惠
        this.setState({
          display: 'none',
          subOrderList: arr,
          amount: amount,
        })
      }
    }
  }

  handleBridge () {
    bridge.scanCode(response => {
      if (!this.state.memberFlag) {
        this.props.getGoods({
          barcode: (response && response.url) || '',
          memberId: window.localStorage.getItem('orderAddMemberId'),
          bneMem300Flag: false,
        })
      } else {
        this.props.getGoods({
          barcode: (response && response.url) || '',
          memberId: window.localStorage.getItem('orderAddMemberId'),
          bneMem300Flag: true,
        })
      }
      this.setState({
        moblieDisabled: true,
      })
    })
  }

  async componentWillReceiveProps (nextProps) {
    const arr = this.state.subOrderList.slice(0)
    let isAlive = false
    if (!this.props.goodsRequest && nextProps.goodsRequest) {
      if (nextProps.goods) {
        if (arr.length > 0) {
          arr.forEach(item => {
            if (item.barcode === nextProps.goods.barcode) {
              isAlive = true
              item.count = parseInt(item.count) + 1
              item.subOrderReceivableAmount = (item.memberPrice * item.count * item.subOrderDiscount / 10).toFixed(2)
            }
          })
          if (!isAlive) {
            arr.push(nextProps.goods || [])
          }
        } else {
          arr.push(nextProps.goods || [])
        }
        // eslint-disable-next-line no-unused-vars
        let amount = 0
        let sum = 0
        let commodityList = []
        let applyList = []
        console.log(arr)
        arr.map(item => {
          amount += parseFloat(item.subOrderReceivableAmount)
          if (item.commoditySrc) {
            let m = {
              barcodes: item.barcode,
              total: item.count,
              subOrderDiscount: item.subOrderDiscount,
            }
            sum += item.count * parseFloat(item.price)
            commodityList.push(m)
          } else {
            applyList.push(item)
          }
        })
        let mid = window.localStorage.getItem('orderAddMemberId')
        if (sum >= 300) {
          this.state.memberFlag = true
          let params = {
            commodityList: commodityList,
            memberId: mid,
            bneMem300Flag: true,
          }

          var h = await this.props.queryNewMember(params)
          h.data = h.data.concat(applyList)
          console.log(h.data)
          let amount = 0
          h.data.map(item => {
            item.subOrderReceivableAmount = (parseInt(item.subOrderReceivableAmount) / 100).toFixed(2)
            amount += parseFloat(item.subOrderReceivableAmount)
          })
          let cloneArr = JSON.parse(JSON.stringify(h.data))
          cloneArr.map((item) => {
            item.price = parseInt((parseFloat(item.price).toFixed(2) * 100).toFixed(0))
            item.memberPrice = parseInt((parseFloat(item.memberPrice).toFixed(2) * 100).toFixed(0))
            item.subOrderDiscount = parseFloat(item.subOrderDiscount)
            item.subOrderReceivableAmount = parseInt((parseFloat(item.subOrderReceivableAmount).toFixed(2) * 100).toFixed(0))
          })
          let m = {}
          m.subOrderList = cloneArr
          if (this.state.changeFlag) {
            // 组合优惠分支
            let json = await this.props.getPreferentialInfo(m)
            if (json.success) {
            // eslint-disable-next-line eqeqeq
              if (json.data.combinationPreferentialModels && json.data.combinationPreferentialModels.length != 0) {
                amount = (parseInt(amount) - parseInt(json.data.saveAmount / 100)).toFixed(2)
                this.setState({
                  display: 'block',
                  subOrderList: h.data,
                  preferDicCount: json.data.saveAmount / 100,
                  amount: amount,
                })
              } else {
                this.setState({
                  display: 'none',
                  subOrderList: h.data,
                  amount: amount,
                })
              }
            }
          }
        } else {
          // eslint-disable-next-line no-unused-vars
          let amount = 0
          console.log(arr)
          arr.map(item => {
            amount += parseFloat(item.subOrderReceivableAmount)
          })
          amount = parseFloat(amount).toFixed(2)
          // this.props.form.validateFields((e, values) => {
          //   if (!e) {
          //     values = JSON.parse(JSON.stringify(values))
          //     // values.commoditySrc = this.state.fromType || null
          //     values.guiderId = values.guiderId || ''
          //     values.subOrderList = JSON.parse(JSON.stringify(arr))// 深度克隆防止传递的数据影响表格展示数据
          //     values.validDate = Date.parse(values.validDate)
          //     values.memberMobile = this.state.mobile || ''
          //     values.subOrderList.map((item) => {
          //       item.price = parseFloat(item.price * 100)
          //       item.memberPrice = parseFloat(item.memberPrice * 100)
          //       item.subOrderDiscount = parseFloat(item.subOrderDiscount)
          //       item.subOrderReceivableAmount = parseFloat(item.subOrderReceivableAmount * 100)
          //     })
          //     console.log(values)
          //     this.props.getPreferentialInfo(values)
          //   }
          // })
          let cloneArr = JSON.parse(JSON.stringify(arr))
          cloneArr.map((item) => {
            item.price = parseInt((parseFloat(item.price).toFixed(2) * 100).toFixed(0))
            item.memberPrice = parseInt((parseFloat(item.memberPrice).toFixed(2) * 100).toFixed(0))
            item.subOrderDiscount = parseFloat(item.subOrderDiscount)
            item.subOrderReceivableAmount = parseInt((parseFloat(item.subOrderReceivableAmount).toFixed(2) * 100).toFixed(0))
          })
          let params = {}
          // if (this.state.changeFlag) {
          // 改变过价格的标识
          params.subOrderList = cloneArr
          let json = await this.props.getPreferentialInfo(params)
          if (json.success) {
            // eslint-disable-next-line eqeqeq
            if (json.data.combinationPreferentialModels && json.data.combinationPreferentialModels.length != 0) {
              amount = (parseInt(amount) - parseInt(json.data.saveAmount / 100)).toFixed(2)
              this.setState({
                display: 'block',
                subOrderList: arr,
                preferDicCount: json.data.saveAmount / 100,
                amount: amount,
              })
            } else {
              this.setState({
                display: 'none',
                subOrderList: arr,
                amount: amount,
              })
            }
          }
          // }
        }
        message.success('添加成功', 4)
      } else {
        message.warning('未查询到商品信息', 4)
      }
    }
  }

  typeChange (e) {
    if (parseInt(e) === 0) {
      this.setState({
        acVisible: true,
      })
    } else {
      this.setState({
        acVisible: false,
      })
    }
  }

  // 获取商品信息
  handleGetGoods () {
    this.props.form.validateFields((e, values) => {
      if (values.barcode) {
        let mid = ''
        // 2019-11-04，如果选到的是非会员，select控件选中的id将是null，
        // 这时候memberId应该传''
        if (values.memberMobile === 'null') {
          mid = ''
        } else {
          mid = values.memberMobile
        }
        if (!this.state.memberFlag) { // 判断为非300会员时
          this.props.getGoods({
            barcode: values.barcode,
            // commoditySrc: this.state.fromType || null,
            // commodityName: values.commodityName,
            memberId: mid,
            bneMem300Flag: false,
          })
        } else {
          this.props.getGoods({
            barcode: values.barcode,
            // commoditySrc: this.state.fromType || null,
            // commodityName: values.commodityName,
            memberId: mid,
            bneMem300Flag: false,
          })
        }
        this.setState({
          moblieDisabled: true,
        })
      } else {
        message.error('请输入条形码', 4)
      }
    })
  }

  // 生成
  handleGenerate () {
    if (!this.submiting) {
      this.submiting = true
      this.props.form.validateFields((e, values) => {
        if (!e) {
          delete values.barcode
          values = JSON.parse(JSON.stringify(values))
          // values.commoditySrc = this.state.fromType || null
          values.combinationPreferentiaIds = this.props.idList
          values.combinationPreferentiaSaveAmount = this.props.saveAmount
          values.subOrderList = JSON.parse(JSON.stringify(this.state.subOrderList))// 深度克隆防止传递的数据影响表格展示数据
          values.validDate = Date.parse(values.validDate)
          values.memberMobile = this.state.mobile
          values.subOrderList.map((item) => {
            item.price = parseInt((parseFloat(item.price).toFixed(2) * 100).toFixed(0))
            item.memberPrice = parseInt((parseFloat(item.memberPrice).toFixed(2) * 100).toFixed(0))
            item.subOrderDiscount = parseFloat(item.subOrderDiscount)
            item.subOrderReceivableAmount = parseInt((parseFloat(item.subOrderReceivableAmount).toFixed(2) * 100).toFixed(0))
          })
          this.props.createOrder(values, res => {
            if (res.success) {
              message.success('创建成功', 4)
              this.props.router.replace('/beinoen/order')
              this.submiting = false
            } else {
              this.submiting = false
            }
          })
        } else {
          this.submiting = false
        }
      })
    }
  }

  handleCancel () {
    this.setState({
      visible: false,
    })
  }

  handleConfirm () {}
  disCountBlur (val) {
  }
  async disCountAmount (e, record, index) {
    const arr = JSON.parse(JSON.stringify(this.state.subOrderList))
    arr[index].subOrderDiscount = (e / (arr[index].memberPrice * arr[index].count) * 10).toFixed(1)
    arr[index].subOrderReceivableAmount = e
    // eslint-disable-next-line no-unused-vars
    let amount = 0
    let allamt = 0
    arr.map(item => {
      allamt += item.memberPrice * item.count
    })
    arr.map((item) => {
      amount += parseFloat(item.subOrderReceivableAmount)
    })
    amount = parseFloat(amount).toFixed(2)
    allamt = parseFloat(allamt).toFixed(2)
    // eslint-disable-next-line eqeqeq
    if (allamt != amount) {
      // 计算出的amount和memberprice不相等时候，隐藏显示组合优惠
      this.setState({
        display: 'none',
      })
      this.state.changeFlag = false
    } else {
      this.setState({
        display: 'block',
      })
      this.state.changeFlag = true
      let cloneArr = JSON.parse(JSON.stringify(arr))
      cloneArr.map((item) => {
        item.price = parseInt((parseFloat(item.price).toFixed(2) * 100).toFixed(0))
        item.memberPrice = parseInt((parseFloat(item.memberPrice).toFixed(2) * 100).toFixed(0))
        item.subOrderDiscount = parseFloat(item.subOrderDiscount)
        item.subOrderReceivableAmount = parseInt((parseFloat(item.subOrderReceivableAmount).toFixed(2) * 100).toFixed(0))
      })
      let params = {}
      params.subOrderList = cloneArr
      if (this.state.changeFlag) {
        let json = await this.props.getPreferentialInfo(params)
        if (json.success) {
          // eslint-disable-next-line eqeqeq
          if (json.data.combinationPreferentialModels && json.data.combinationPreferentialModels.length != 0) {
            amount = (parseInt(amount) - parseInt(json.data.saveAmount / 100)).toFixed(2)
            this.setState({
              display: 'block',
              subOrderList: arr,
              preferDicCount: json.data.saveAmount / 100,
              amount: amount,
            })
          } else {
            this.setState({
              display: 'none',
              subOrderList: arr,
              amount: amount,
            })
          }
        }
      }
      this.state.changeFlag = true
    }
    this.setState({
      subOrderList: arr,
      amount: amount,
    })
  }
  disCountChange (e, record, index) {
    const arr = JSON.parse(JSON.stringify(this.state.subOrderList))
    arr[index].subOrderDiscount = e
    arr[index].subOrderReceivableAmount = (arr[index].memberPrice * arr[index].count * e / 10).toFixed(2)
    // eslint-disable-next-line no-unused-vars
    let amount = 0
    arr.map(item => {
      amount += parseFloat(item.subOrderReceivableAmount)
    })
    amount = parseFloat(amount).toFixed(2)
    this.setState({
      subOrderList: arr,
      amount: amount,
    })
  }

  async amountChange (e, record, index) {
    const arr = JSON.parse(JSON.stringify(this.state.subOrderList))
    arr[index].count = e
    arr[index].subOrderReceivableAmount = (arr[index].memberPrice * e * arr[index].subOrderDiscount / 10).toFixed(2)
    // eslint-disable-next-line no-unused-vars
    let amount = 0
    arr.map(item => {
      amount += parseFloat(item.subOrderReceivableAmount)
    })

    let cloneArr = JSON.parse(JSON.stringify(arr))
    cloneArr.map((item) => {
      item.price = parseInt((parseFloat(item.price).toFixed(2) * 100).toFixed(0))
      item.memberPrice = parseInt((parseFloat(item.memberPrice).toFixed(2) * 100).toFixed(0))
      item.subOrderDiscount = parseFloat(item.subOrderDiscount)
      item.subOrderReceivableAmount = parseInt((parseFloat(item.subOrderReceivableAmount).toFixed(2) * 100).toFixed(0))
    })
    let params = {}
    params.subOrderList = cloneArr
    if (this.state.changeFlag) {
      let json = await this.props.getPreferentialInfo(params)
      if (json.success) {
        // eslint-disable-next-line eqeqeq
        if (json.data.combinationPreferentialModels && json.data.combinationPreferentialModels.length != 0) {
          amount = (parseInt(amount) - parseInt(json.data.saveAmount / 100)).toFixed(2)
          this.setState({
            display: 'block',
            subOrderList: arr,
            preferDicCount: json.data.saveAmount / 100,
            amount: amount,
          })
        } else {
          this.setState({
            display: 'none',
            subOrderList: arr,
            amount: amount,
          })
        }
      }
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.commodityChange,
    }
    const goodsColumn = [
      {
        title: '条形码',
        dataIndex: 'barcode',
        key: 'barcode',
        align: 'center',
      },
      {
        title: '商品信息',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '商品分类',
        dataIndex: 'categoryName',
        key: 'categoryName',
        align: 'center',
        render: text => text || '-',
      },
      {
        title: '库存',
        dataIndex: 'stock',
        key: 'stock',
        align: 'center',
      },
    ]

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 140,
      },
      {
        title: 'SKU',
        dataIndex: 'sku',
        key: 'sku',
        align: 'center',
        width: 140,
      },
      {
        title: '编码',
        dataIndex: 'barcode',
        key: 'barcode',
        align: 'center',
        width: 140,
      },
      {
        title: '分类',
        dataIndex: 'categoryName',
        key: 'categoryName',
        align: 'center',
        width: 140,
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
        width: 120,
      },
      {
        title: '会员价',
        dataIndex: 'memberPrice',
        key: 'memberPrice',
        align: 'center',
        width: 140,
      },
      {
        title: '折扣',
        dataIndex: 'subOrderDiscount',
        key: 'subOrderDiscount',
        align: 'center',
        width: 120,
        render: (text, record, index) => {
          return (
            <div>
              <Input
                key={index}
                maxLength="3"
                onChange={e =>
                  debounce(this.disCountChange, 10)(e.target.value, record, index)
                }
                style={{ width: '50px' }}
                value={record.subOrderDiscount}
              />折
            </div>
          )
        },
      },
      {
        title: '实收',
        dataIndex: 'subOrderReceivableAmount',
        key: 'subOrderReceivableAmount',
        align: 'center',
        width: 160,
        render: (text, record, index) => {
          return (
            <div>
              <InputNumber
                key={index}
                ref="test"
                onChange={value =>
                  debounce(this.disCountAmount, 10)(value, record, index)
                }
                style={{ width: '80px' }}
                value={record.subOrderReceivableAmount}
              />元
            </div>
          )
        },
      },
      {
        title: '数量',
        dataIndex: 'count',
        key: 'count',
        align: 'center',
        width: 110,
        render: (text, record, index) => {
          return (
            <Input
              key={index}
              onChange={e =>
                debounce(this.amountChange, 10)(e.target.value, record, index)
              }
              style={{ width: '50px' }}
              value={record.count}
            />
          )
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        align: 'center',
        width: 90,
        fixed: 'right',
        render: (text, record, index) => (
          <a
            className={style[`add-norm`]}
            onClick={() => this.deleteInfo(index)}
          >
            删除
          </a>
        ),
      },
    ]
    return (
      <div className="contaienr-box">
        <ContentBox>
          <div className={style['search-container']}>
            <Form>
              <Title title="主订单" onClick={this.test1} />
              <Row gutter={24} style={{ marginTop: '10px' }}>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="订单类型">
                    {getFieldDecorator('type', {
                      initialValue: '0',
                    })(
                      <Select
                        placeholder="选择订单类型"
                        onChange={this.typeChange}
                      >
                        <Option value="0">普通订单</Option>
                        <Option value="1">服务订单</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="服务">
                    {getFieldDecorator('activityId', {})(
                      <Select
                        placeholder="选择服务"
                        disabled={this.state.acVisible}
                      >
                        {this.props.serviceList.map((item, index) => {
                          return (
                            <Option value={item.id} key={index}>
                              {item.name}
                            </Option>
                          )
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="手机号">
                    {getFieldDecorator('memberMobile', {
                      rules: [
                        {
                          required: !this.state.acVisible,
                          message: '请输入手机号',
                        },
                      ],
                    })(<Select mode="mutiple"
                      disabled={this.state.moblieDisabled}
                      filterOption={false}
                      showSearch
                      onSelect={this.selectTel}
                      onSearch={this.searchTel}
                      placeholder="请输入手机号"
                      notFoundContent="该手机号非会员用户"
                    >{
                        this.state.telList.map((item) => {
                          return (
                            <Option value={item.id} key={item.mobile}>
                              <span >{item.mobile} </span>
                              <span style={{ width: 10 }} />
                              <span style={{ width: 10 }} />
                              <span style={{ width: 10 }} />
                              <span style={{ width: 10 }} />
                              <span> {item.name}</span>
                            </Option>
                          )
                        })
                      }
                    </Select>)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24} style={{ marginTop: '10px' }}>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="导购员">
                    {getFieldDecorator('guiderId')(
                      <Select placeholder="请选择">
                        {this.props.clerks.map(item => (
                          <Option value={item.id} key={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="有效期">
                    {getFieldDecorator('validDate')(
                      <DatePicker
                        disabled={this.state.acVisible}
                        placeholder="选择日期"
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Title title="商品管理" />
              <Row gutter={24} style={{ marginTop: '10px' }}>
                <Col span={9}>
                  <FormItem {...formItemLayout} label="商品条形码">
                    {getFieldDecorator('barcode')(
                      <Input
                        onPressEnter={this.handleEnterKey}
                        disabled={!this.state.acVisible}
                        placeholder="请输入商品条形码"
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={9} push={15}>
                  <div className={style['add-btn-container']}>
                    <button
                      onClick={
                        this.state.acVisible ? this.handleGetGoods : null
                      }
                      className={
                        this.state.acVisible
                          ? style['select']
                          : style['unable-select']
                      }
                    >
                      获取商品
                    </button>
                    {this.state.acVisible ? (
                      <button
                        onClick={this.selectByCommdity}
                        className={style['select-shop']}
                      >
                        按商品名称搜索
                      </button>
                    ) : (
                      <button className={style['unable-select-shop']}>
                        按商品名称搜索
                      </button>
                    )}
                  </div>
                </Col>
              </Row>
              <Modal
                destroyOnClose
                maskClosable={false}
                title="按商品名称查询"
                width={800}
                visible={this.state.selectVisible}
                footer={null}
                onCancel={() => {
                  this.setState({
                    selectVisible: false,
                  })
                }}
              >
                <Row gutter={24} style={{ marginTop: '10px' }}>
                  <Col span={14}>
                    <FormItem
                      {...{
                        labelCol: {
                          sm: { span: 6 },
                        },
                        wrapperCol: {
                          sm: { span: 15 },
                        },
                      }}
                      label="商品名称"
                    >
                      {getFieldDecorator('name')(
                        <Input placeholder="请输入" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <div
                      className={style['select-name']}
                      onClick={this.getCommdity}
                    >
                      搜索
                    </div>
                  </Col>
                </Row>
                <Row style={{ marginTop: '10px' }}>
                  <Table
                    loading={this.props.commdityLoading}
                    rowSelection={rowSelection}
                    rowKey={record => record.commodityId}
                    columns={goodsColumn}
                    dataSource={this.props.commdity}
                    pagination={{
                      total: this.props.commdityTotal,
                      onChange: this.commdityPageChange,
                    }}
                  />
                </Row>
                <div
                  style={{
                    marginTop: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    className={style['select-name']}
                    onClick={this.handleAdd}
                  >
                    添加
                  </div>
                </div>
              </Modal>
            </Form>
          </div>
        </ContentBox>
        <ContentBox>
          <div className={style['amount']}>实收总额{this.state.amount}元</div>
          {this.state.acVisible && (
            <Table
              rowKey={(record, index) => index}
              dataSource={this.state.subOrderList}
              columns={columns}
              pagination={false}
            />
          )}
          <div className={style['disountType']} style={{ display: this.state.display }}>
            <span>优惠类型:</span>
            <span className={style['content-type']}>组合优惠</span>
          </div>
          {/* eslint-disable-next-line standard/object-curly-even-spacing */}
          <div className={style['disountType']} style={{ display: this.state.display }}>
            <span>优惠金额:</span>
            <span className={style['content-type']}>{this.props.saveAmountStr}元</span>
          </div>
          <div className={style['btn-container']}>
            <button onClick={this.handleGenerate}>生成</button>
          </div>
        </ContentBox>
        <Modal
          title="请确认订单支付情况，是否已经付款？"
          maskClosable={false}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          width={600}
          footer={null}
        >
          <div className={style['modal-btn-container']}>
            <button onClick={this.handleConfirm} className={style['confirm']}>
              确认
            </button>
            <button onClick={this.handleCancel} className={style['cancel']}>
              取消
            </button>
          </div>
        </Modal>
      </div>
    )
  }
}

const mapState = state => ({
  selectedRowKeys: state.order.selectedRowKeys || [],
  serviceList:
    (state.service.serviceList &&
      state.service.serviceList.list &&
      state.service.serviceList.list.length > 0 &&
      state.service.serviceList.list) ||
    [],
  goodsList: (state.shop.ownGoods && state.shop.ownGoods.list) || [],
  goods: state.order.goods,
  goodsRequest: state.order.goodsRequest,
  commdity: state.order.commdity || [],
  commdityTotal: state.order.commdityTotal,
  commdityLoading: state.order.commdityLoading,
  selectedRow: state.order.selectedRow || [],
  clerks: (state.system.clerks && state.system.clerks).list || [],
  saveAmountStr: state.order.saveAmountStr,
  saveAmount: state.order.saveAmount,
  idList: state.order.idList,
  display: state.order.display || 'none',
})
const mapDispatch = dispatch => ({
  queryNewMember: dispatch.order.queryNewMember,
  queryTel: dispatch.order.queryTel,
  getPreferentialInfo: dispatch.order.getPreferentialInfo,
  createOrder: dispatch.order.createOrder,
  generateOrder: dispatch.order.generateOrder,
  getServiceList: dispatch.service.getServiceList,
  getOwnGoods: dispatch.shop.getOwnGoods,
  getGoods: dispatch.order.getGoods, // 增加标识 bneMem300Flag
  getCommdity: dispatch.order.getCommdity, // 增加标志 bneMem300Flag
  updateSelectedRowKeys: dispatch.order.updateSelectedRowKeys,
  resetCommdity: dispatch.order.resetCommdity,
  getClerks: dispatch.system.getClerks,
  getTelList: dispatch.order.getTelList,
})
const Add = Form.create()(AddFrom)

export default createContainer(
  connect(
    mapState,
    mapDispatch
  )(Add)
)
