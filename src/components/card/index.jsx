import {Component} from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default class Card extends Component {
  toLink(toGo){
    if(typeof toGo !== 'string' || toGo == ''){
      return
    }
    Taro.navigateTo({
      url: toGo
    })
  }

  render (){
    const {children, title, more, color, toGo} = this.props

    return (
      <View className='card'>
        <View className='title'>
          <View>{title}</View>
          {
            more && <View style={{color}} onClick={() => this.toLink(toGo)}>{more}</View>
          }
        </View>
        <View className='content'>
          {children}
        </View>
      </View>
    )
  }
}