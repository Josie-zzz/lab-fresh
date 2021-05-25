import React from 'react'
import Taro from '@tarojs/taro'
import { View } from "@tarojs/components"
import { AtButton, AtDrawer, AtIcon } from 'taro-ui'
import { ListCard, AddBtn } from '@/components'
import { URL } from '@/url'
import {AppContext} from '@/context'
import './works.scss'
export default class Work extends React.Component {
  static contextType = AppContext

  state = {
    list: null,   //展示列表
    selfList: null, //自己的成果
    show: false,    //是否展示抽屉,
    type: 2,         //不变
  }

  //路由切换到此页面就会触发
  componentDidShow(){
    const { studentNum } = this.context
    Taro.request({
      url: URL.compData,
      method: 'GET',
      success: (res) => {
        const {status, errmsg, comp} = res.data
        if(status){
          this.setState({
            list: comp.filter(v => v.type == 2),
            selfList: comp.filter(v => v.type == 2 && v.studentNum == studentNum)
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
      url: `/pages/other/other?type=${type}&_id=${obj._id}`,
    })
  }

  render(){
    const { list, show, selfList } = this.state

    const loginLevel = this.context.level

    if(loginLevel == 3){
      return <View>目前不对非组内成员开放</View>
    }
    

    return (
      <View className='work'>
        <AtButton
          type='primary'
          onClick={() => {
          this.setState({
            show: true
          })
        }}>显示自己的发布的成果</AtButton>
        <AtDrawer 
          show={show} 
          mask 
          onClose={() => {
            this.setState({
              show: false
            })
          }} 
        >
          {
            (selfList && selfList.length) ? (
              selfList.map(val => (
                <View className='self-works'>
                  <View className='title'>{val.title}</View>
                  <AtIcon value='chevron-right' size='30' color='#0072ffe8'></AtIcon>
                </View>
              ))
            ) : (
              <View>你暂时还没有发布成果哦~</View>
            )
          }
        </AtDrawer>
        {
          list && list.map((val, index) => {
            return (
              <ListCard 
                style={{backgroundColor: '#89acee'}} 
                title={val.title}
                txt={val.txt}
                onClick={() => this.todedail(val)}
              />
            )
          })
        }
        <AddBtn onClick={this.toLink} />
      </View>
    )
  }
}