import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtAvatar, AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro'
import avater from '../../static/avater.png'
import './me.scss'

export default class Me extends Component {

  state = {
    avater: avater    //头像
  }

  toLink = () => {
    Taro.navigateTo({
      url: '/pages/member/member'
    })
  }

  render () {
    const {avater} = this.state

    return (
      <View className='me'>
        <View className='self'>
          <AtAvatar circle image={avater}></AtAvatar>
          <Text>啦啦啦</Text>
        </View>
        <View className='other'  onClick={this.toLink}>
          <View>成员管理</View>
          <AtIcon value='chevron-right' size='30' color='#fff'></AtIcon>
        </View>
      </View>
    )
  }
}
