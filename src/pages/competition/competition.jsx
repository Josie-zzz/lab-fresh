import React from 'react'
import Taro from '@tarojs/taro'
import { View } from "@tarojs/components"
import { AtTextarea } from 'taro-ui'
import { ListCard, AddBtn, Modal } from '@/components'
import { URL } from '@/url'
import {AppContext} from '@/context'
export default class Competition extends React.Component {
  static contextType = AppContext

  state = {
    list: null,   //展示列表
    isOpened: true,    //弹框显隐
    title: '',      //编辑的标题
    txt: '',        //编辑的内容
    type: 1,         //不变
  }

  //路由切换到此页面就会触发
  componentDidShow(){
    Taro.request({
      url: URL.compData,
      method: 'GET',
      success: (res) => {
        const {status, errmsg, comp} = res.data
        if(status){
          this.setState({
            list: comp.filter(v => v.type == 1),
          })
        }
      }
    })
  }

  //跳转页面
  toLink = () => {
    const { type } = this.state
    Taro.navigateTo({
      url: `/pages/other/other?type=${type}`,
    })
  }

  //跳转页面，查看详情
  todedail = (obj) => {
    const { type } = this.state
    Taro.navigateTo({
      url: `/pages/other/other?type=${type}&_id=${obj._id}&studentNum=${obj.studentNum}`,
    })
  }

  render(){
    const { list } = this.state
    const { level } = this.context

    return (
      <View className='competiton'>
        {
          list && list.map((val, index) => {
            return (
              <ListCard 
                style={{backgroundColor: '#4e73ba'}} 
                title={val.title}
                txt={val.txt}
                onClick={() => this.todedail(val)}
              />
            )
          })
        }
        {
          level != 3 && <AddBtn onClick={this.toLink} />
        }
      </View>
    )
  }
}