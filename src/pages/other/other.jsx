import React from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from "@tarojs/components"
import { AtButton, AtTextarea, AtMessage } from 'taro-ui'
import {AppContext} from '@/context'
import { URL } from '@/url'

export default class Competition extends React.Component {
  static contextType = AppContext

  constructor(){
    super()
    this.state = {
      title: '',      //编辑的标题
      txt: '',        //编辑的内容
      dedail: null,   //显示详情的内容
    }
  }

  componentDidMount(){
    const {params: {_id}} = getCurrentInstance().router
    if(_id){
      Taro.request({
        url: URL.compData,
        data: {
          _id
        },
        method: 'GET',
        success: (res) => {
          const {status, errmsg, comp} = res.data
          if(status){
            this.setState({
              dedail: comp[0]
            })
          }
        }
      })
    }
  }

  //修改state
  updateState = (key, val) => {
    this.setState({
      [key]: val
    })
  }

  //提交表单信息
  submitComp = () => {
    const { title, txt} = this.state
    const {params: {type}} = getCurrentInstance().router
    const { userInfo } = this.context
    if(!title){
      Taro.atMessage({
        message: '请填写标题',
        type: 'warning',
      })
      return
    } else if(!txt){
      Taro.atMessage({
        message: '请填写内容',
        type: 'warning',
      })
      return
    }
    console.log({
      type: +type,
      title,
      txt,
      creator: userInfo.name,
      studentNum: userInfo.studentNum,
      createTime: Date.now().toString()
    })
    Taro.request({
      url: URL.compAdd,
      method: 'POST',
      data: {
        comp: {
          type,
          title,
          txt,
          creator: userInfo.name,
          studentNum: userInfo.studentNum,
          createTime: Date.now().toString()
        }
      },
      success: (res) => {
        const { status, errmsg} = res.data
        if(status){
          Taro.atMessage({
            message: errmsg,
            type: 'success',
          })
          //添加成功后跳转回去
          setTimeout(() => {
            let index = 'works'
            if(type == 1){
              index = 'competition'
            }
            Taro.navigateBack({
              url: `/pages/${index}/${index}`,
            })
          }, 1000)
        }
      }
    })
  }

  render(){
    const { title, txt, dedail } = this.state
    let { params: {_id} } = getCurrentInstance().router

    //有_id是查询，没有是展示
    if(_id){
      console.log(dedail)
      return dedail ? (
        <View className='at-article' style={{height: '100%', backgroundColor: '#fff'}}>
          <View className='at-article__h1' style={{marginTop: 0, paddingTop: '30rpx'}}>
            {dedail.title}
          </View>
          <View className='at-article__info' style={{color: '#908e8e'}}>
            {changeTime(dedail.createTime)}&nbsp;&nbsp;&nbsp;{dedail.creator}
          </View>
          <View className='at-article__p' style={{fontSize: '30rpx'}}>
            {dedail.txt}
          </View>
        </View>
      ) : (<View>稍等，正在请求中...</View>)
    } else {
      return (
        <View>
          <AtMessage />
          <View style={{padding: 10}}>标题：</View>
          <AtTextarea
            value={title}
            onChange={(val) => {
              this.updateState('title', val)
            }}
            count
            height={50}
            maxLength={20}
            placeholder='输入标题'
          />
          <View  style={{padding: 10}}>内容：</View>
          <AtTextarea
            value={txt}
            count
            maxLength={1000}
            height={500}
            onChange={(val) => {
              this.updateState('txt', val)
            }}
            placeholder='输入添加的内容'
          />
          <AtButton type='primary' onClick={this.submitComp}>提交</AtButton>
        </View>
      )
    }
    
  }
}

//处理时间函数
function changeTime (str) {
  let d = new Date(+str)
  let year = d.getFullYear()
  let mounth = d.getMonth() + 1
  let day = d.getDate()
  let hour = d.getHours()
  let min = d.getMinutes()

  return `${year}-${mounth}-${day} ${hour}:${min}`
}