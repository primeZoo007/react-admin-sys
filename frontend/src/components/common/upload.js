import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { Upload, Icon } from 'antd'
import style from './upload.css'

class UploadCom extends PureComponent {
  static propTypes = {
    uploadChange: PropTypes.func,
    imageUrl: PropTypes.string,
  }
  constructor (props) {
    super(props)

    this.state = {}
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e) {
    this.setState({
      imageUrl: null,
    })
    if (e.file.status === 'done') {
      this.setState({
        loading: false,
        imageUrl: e.file.response.url,
      })
      this.props.uploadChange(e.file.response.url)
    } else {
      this.setState({
        loading: true,
      })
    }
  }

  render () {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    const imageUrl = this.state.imageUrl
      ? this.state.imageUrl
      : this.props.imageUrl
    return (
      <>
        <Upload
          withCredentials
          name="file"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="/mars/image/upload"
          onChange={this.handleChange}
        >
          {imageUrl ? (
            <img className={style['img']} src={imageUrl} alt="avatar" />
          ) : (
            uploadButton
          )}
        </Upload>
      </>
    )
  }
}

export default UploadCom
