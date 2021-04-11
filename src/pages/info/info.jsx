import { View, Image } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import React from 'react'
import { AtAvatar, AtForm, AtInput, AtButton, AtFloatLayout, AtTabs, AtTabsPane, AtMessage } from 'taro-ui'
import './info.scss'
import {AppContext} from '@/context'

const avaterArr = []
for(let i = 0; i < 20; i++){
  avaterArr[i] = require('../../static/avater/' + i + '.png')
}

export default class Info extends React.Component {
  static contextType = AppContext

  constructor () {
    super(...arguments)
    this.state = {
      loginStatus: +getCurrentInstance().router.params.loginStatus,
      isOpened: false,
      avaterUrl: avaterArr[0],
      studentNum: '',
      password: '',
      name: '',
      department: '',     //院系
      subject: '',         //专业
      editable: true,     //输入框可编辑吗
    }
  }

  changeAvater = () => {
    const {loginStatus} = this.context
    if(loginStatus){
      return
    }
    this.setState({
      isOpened: true
    })
  }

  selectAvater(index){
    this.setState({
      avaterUrl: avaterArr[index],
      isOpened: false
    })
  }

  changeInput = (val, e) => {
    let key = e.mpEvent.target.id
    this.setState({
      [key]: val
    })
  }

  componentDidMount(){
    const {loginStatus, userInfo} = this.context
    console.log(loginStatus, userInfo, this.context)
    if(loginStatus){
      this.setState({
        avaterUrl: userInfo.avaterUrl,
        studentNum: userInfo.studentNum,
        password: userInfo.password,
        name: userInfo.name,
        department: userInfo.department,     //院系
        subject: userInfo.subject,         //专业
        editable: false
      })
    }
  }

  render () {
    const { loginStatus, isOpened, avaterUrl, 
      studentNum, password, name, department, subject, editable } = this.state

    return (
      <View className='info'>
        <AtMessage />
        <AtForm>
          <View className='avater' onClick={this.changeAvater}>
            <View className='txt' style={loginStatus && {color: '#c2c2c2'}}>头像</View>
            <AtAvatar circle image={avaterUrl}></AtAvatar>
            {
              !loginStatus && <View className='txt2'>点击更换头像</View>
            }
          </View>
          <AtInput
            editable={editable}
            name='studentNum'
            required
            title='学号'
            type='text'
            placeholder='请输入8位学号'
            value={studentNum}
            onChange={this.changeInput}
          />
          {
            !loginStatus && (
              <AtInput
                editable={editable}
                name='password'
                required
                title='密码'
                type='password'
                placeholder='请输入至少8位密码'
                value={password}
                onChange={this.changeInput}
              />
            )
          }
          <AtInput
            editable={editable}
            name='name'
            required
            title='姓名'
            type='text'
            placeholder='请输入真实姓名'
            value={name}
            onChange={this.changeInput}
          />
          <AtInput
            editable={editable}
            name='department'
            required
            title='院系'
            type='text'
            placeholder='例如：计算机学院'
            value={department}
            onChange={this.changeInput}
          />
          <AtInput
            editable={editable}
            name='subject'
            required
            title='专业班级'
            type='text'
            placeholder='例如：网络1703'
            value={subject}
            onChange={this.changeInput}
          />
        </AtForm>
        {
          !loginStatus && <AtButton type="primary" onClick={this.register}>注册</AtButton>
        }
        {
          //如果不这样判断的话，查看状态（没法修改）的时候也会请求（因为这个其实是隐藏了不是没有），这样可以优化一下
          !loginStatus && (
            <AtFloatLayout isOpened={isOpened} title="请选择一个喜欢的头像吧">
            {
              avaterArr.map((val, index) => {
                return (
                  <Image mode='widthFix' src={val} onClick={() => this.selectAvater(index)}></Image>
                )
              })
            }
          </AtFloatLayout>
          )
        }
      </View>
    )
  }
}