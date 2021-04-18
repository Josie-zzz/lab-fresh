import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './apply.scss'
import { AtIcon } from 'taro-ui'
import {AppContext} from '@/context'
import Card from '@/components/card'

//子页面路由
const pages = [
  {
    name: '协会纳新',
    icon: 'link',
    path: '/pages/fresh/fresh'
  },
  {
    name: '协会竞赛',
    icon: 'lightning-bolt',
    path: '/pages/competition/competition'
  },
  {
    name: '成果展示',
    icon: 'file-code',
    path: '/pages/works/works'
  },
  {
    name: '就业管理',
    icon: 'credit-card',
    path: '/pages/job/job'
  },
  {
    name: '成员管理',
    icon: 'user',
    path: '/pages/member/member'
  },
]

export default class Talk extends Component {
  static contextType = AppContext

  state = {
   
  }

  toLink(path){
    Taro.navigateTo({
      url: path
    })
  }

  render () {
    const {} = this.state

    return (
      <View className='apply'>
        <View className='many-page'>
            {
              pages.map((val, index) => {
                let color = '#4e73ba'
                if(index % 2 !== 0){
                  color = '#89acee'
                }

                return (
                  <View className='box' style={{backgroundColor: color}} onClick={() => this.toLink(val.path)}>
                    <View className='left'>
                      <AtIcon className='icon' value={val.icon} color='#fff' size='24'></AtIcon>
                      <Text>{val.name}</Text>
                    </View>
                    <AtIcon value='chevron-right' size='30' color='#fff'></AtIcon>
                  </View>
                )
              })
            }
          </View>
      </View>
    )
  }
}
