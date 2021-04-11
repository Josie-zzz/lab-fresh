import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtIcon, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtTextarea, AtMessage } from 'taro-ui'
import './talk.scss'
import Discuss from '@/components/discuss'
import {AppContext} from '@/context'

const tabList = [{ title: '交流贴' }, { title: '就业贴' }]

export default class Talk extends Component {
  static contextType = AppContext

  state = {
    isOpened: false,
    value: ''
  }

  changeModal(bool){
    this.setState({
      isOpened: bool
    })
  }

  handleChange = (value) => {
    this.setState({
      value
    })
  }

  submitContent = () => {
    const {current, value} = this.state
    const {openid} = this.context

    if(value == ''){
      this.popTip('输入的信息不可以为空', 'warning')
      return
    }

    let obj = {
      type: current,
      openid,
      content: value,
      createTime: Date.now()
    }

    Taro.request({
      url: 'http://127.0.0.1:3009/discuss',
      method: 'POST',
      data: obj,
      success: (res) => {
        console.log('res', res)
        if(res.data.errno == 0){
          this.popTip('添加成功', 'success')
        }
        this.changeModal(false)
      }
    })
  }

  popTip(message, type){
    Taro.atMessage({
      message,
      type,
    })
  }

  render () {
    const {isOpened, value} = this.state

    return (
      <View className='talk'>
        <AtMessage />
        <View className='content'>
          <Discuss></Discuss>
          <Discuss></Discuss>
        </View>
        <Button className='btn_fixed' circle type='primary' onClick={() => this.changeModal(true)}>
          <AtIcon value='add' color='#fff'></AtIcon>
        </Button>
        <AtModal isOpened={isOpened}>
          <AtModalHeader>发布帖子</AtModalHeader>
          <AtModalContent>
            <AtTextarea
              value={value}
              onChange={this.handleChange}
              maxLength={500}
              placeholder='请输入你想讨论的内容...'
            />
          </AtModalContent>
          <AtModalAction> <Button onClick={() => this.changeModal(false)}>取消</Button> <Button onClick={this.submitContent}>确定</Button> </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
