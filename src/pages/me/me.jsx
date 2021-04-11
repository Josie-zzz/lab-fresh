import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import { AtAvatar, AtIcon, AtMessage} from 'taro-ui'
import Taro from '@tarojs/taro'
import avater from '@/static/avater/20.png'
import {AppContext} from '@/context'
import './me.scss'

export default class Me extends Component {

  static contextType = AppContext

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


  render () {
    const {loginStatus, userInfo} = this.context
    let name = '点击登录'  
    let avaterUrl = avater
    let showMember = false
    if(loginStatus !== 0){
      name = userInfo.name
      avaterUrl = userInfo.avaterUrl
    }
    if(userInfo && userInfo.level == 1){
      showMember = true
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
        <View className='label'>
          {
            showMember && (
              <View className='other'  onClick={this.toLink}>
                <View>成员管理</View>
                <AtIcon value='chevron-right' size='30' color='#fff'></AtIcon>
              </View>
            )
          }
        </View>
      </View>
    )
  }
}
