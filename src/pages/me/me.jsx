import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import { AtAvatar, AtIcon, AtMessage} from 'taro-ui'
import Taro from '@tarojs/taro'
import avater from '../../static/avater/20.png'
import {AppContext} from '../../context'
import './me.scss'

export default class Me extends Component {

  static contextType = AppContext

  state = {
    isOpened: false
  }

  toLink = () => {
    Taro.navigateTo({
      url: '/pages/member/member',
      
    })
  }

  toLogin = () => {
    const {loginStatus} = this.context

    Taro.navigateTo({
      url: `/pages/login/login?loginStatus=${loginStatus}`
    })
  }

  popTip(message, type){
    Taro.atMessage({
      message,
      type,
    })
  }

  changeOpen(bool){
    this.setState({
      isOpened: bool
    })
  }

  bindgetuserinfo(e){
    console.log(e)
  }

  render () {
    const {loginStatus, userInfo} = this.context
    let name = '点击登录'  
    let avaterUrl = avater
    if(loginStatus !== 0){
      name = userInfo.name
      avaterUrl = userInfo.avaterUrl
    }

    return (
      <View className='me'>
        <AtMessage />
        <View className='self' onClick={this.toLogin}>
          <View className='left'>
            <AtAvatar circle image={avaterUrl}></AtAvatar>
            <Text>{name}</Text>
          </View>
          <AtIcon value='chevron-right' size='30' color='#fff'></AtIcon>
        </View>
        <View className='other'  onClick={this.toLink}>
          <View>成员管理</View>
          <AtIcon value='chevron-right' size='30' color='#fff'></AtIcon>
        </View>
      </View>
    )
  }
}
