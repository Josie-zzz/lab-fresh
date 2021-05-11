import React from 'react'
import { View } from "@tarojs/components"
import { ListCard } from '@/components'
export default class Competition extends React.Component {
  state = {
    list,   //展示列表

  }
  render(){
    const { list } = this.state
    return (
      <View className='competiton'>
        {
          list.map((val, index) => {
            return (
              <ListCard 
                style={{backgroundColor: '#4e73ba'}} 
                title={val.title}
                txt={val.txt}
              />
            )
          })
        }
      </View>
    )
  }
}

var list = [
  {
    title: '网络创意设计大赛开始了',
    txt: '又迎来一年一度的网络创意设计大赛，网络创意设计大赛，网络创意设计大赛，网络创意设计大赛，网络创意设计大赛，网络创意设计大赛。'
  },
  {
    title: '网络创意设计大赛开始了',
    txt: '又迎来一年一度的网络创意设计大赛，网络创意设计大赛，网络创意设计大赛，网络创意设计大赛，网络创意设计大赛，网络创意设计大赛。'
  },
]