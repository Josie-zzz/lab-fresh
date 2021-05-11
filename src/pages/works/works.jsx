import React from 'react'
import { View } from "@tarojs/components"
import { ListCard, AddBtn } from '@/components'
export default class Work extends React.Component {
  state = {
    list,   //展示列表

  }

  render(){
    const { list } = this.state
    return (
      <View className='work'>
        {
          list.map((val, index) => {
            return (
              <ListCard 
                style={{backgroundColor: '#89acee'}} 
                title={val.title}
                txt={val.txt}
              />
            )
          })
        }
        <AddBtn />
      </View>
    )
  }
}

var list = [
  {
    title: '非常舒适的表单校验SDK-王曾洁',
    txt: '背景: 在github上查阅了相关的校验包，总是觉得不满意，于是乎自己搞了一个。。。。。。。'
  },
  {
    title: '非常舒适的表单校验SDK-王曾洁',
    txt: '背景: 在github上查阅了相关的校验包，总是觉得不满意，于是乎自己搞了一个。。。。。。。'
  },
]