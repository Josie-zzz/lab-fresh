import React, { Component } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import { AtAvatar, AtIcon, AtMessage, AtForm, AtInput, AtFloatLayout, AtButton} from 'taro-ui'
import Taro from '@tarojs/taro'
import {AppContext} from '@/context'
import './me.scss'
import defaultAvater from '@/static/avater/defaultAvater.png'
const avaterArr = []
for(let i = 0; i < 20; i++){
  avaterArr[i] = require('../../static/avater/' + i + '.png')
}

export default class Me extends Component {

  static contextType = AppContext

  state = {
    isOpened: false,
    avaterUrl: avaterArr[0],
    editable: false,     //输入框可编辑吗
  }

  oldInfo = {}

  openEdit = (editable) => {
    this.setState({
      editable
    })
  }

  updateAvater = () => {
    this.setState({
      isOpened: true
    })
  }

  selectAvater = (index) => {
    const { updateState } = this.context
    updateState('avaterUrl', avaterArr[index])
  }

  toLogin(){
    Taro.navigateTo({
      url: '/pages/login/login'
    })
  }

  changeInput = (val, e) => {
    const { updateState, userInfo } = this.context
    let key = e.mpEvent.target.id
    updateState(userInfo, {...userInfo, [key]: val})
  }

  updateInfo = () => {
    const { studentNum, avaterUrl, password } = this.context
    const { avaterUrl: avaterUrl2, password: password2 } = this.oldInfo
    if(avaterUrl === avaterUrl2 && password === password2){
      Taro.atMessage({
        message: '未做任何修改哦，请继续修改，或者点击取消',
        type: 'warning'
      })
      return
    }
    Taro.request({
      url: 'http://127.0.0.1:3009/login/updateUser',
      method: 'POST',
      data: {
        studentNum,
        password,
        avaterUrl
      },
      success: (res) => {
        const {status} = res.data
        if(status){
          Taro.atMessage({
            message: '修改成功',
            type: 'success'
          })
          if(password !== password2){
            Taro.atMessage({
              message: '密码已经修改，请重新登陆',
              type: 'warning'
            })
            setTimeout(() => {
              Taro.redirectTo({
                url: '/pages/login/login'
              })
            }, 1500)
          } else {
            this.openEdit(false)
          }
        }
      }
    })
  }
  onClose = () => {
    this.setState({
      isOpened: false
    })
  }
 
  render () {
    const { isOpened, editable } = this.state
    const { studentNum, userInfo, avaterUrl } = this.context 
    const { password, name, department, subject } = userInfo

    return (
      <View className='me'>
        <AtMessage />
        <View className='self'>
          <View className='left'>
            <AtAvatar circle image={avaterUrl || defaultAvater}></AtAvatar>
            <Text>{name || 'xxx'}</Text>
          </View>
          {
            editable && (
              <View onClick={this.updateAvater}>
                <Text style={{color: '#06d4cb'}}>点击更换头像</Text>
                <AtIcon value='chevron-right' size='20' color='#06d4cb'></AtIcon>
              </View>
            )
          }
        </View>
        <View className='info'>
          <AtForm className='me_at-form'>
            <AtInput
              editable={false}
              name='studentNum'
              required
              title='学号'
              type='text'
              placeholder='请输入8位学号'
              value={studentNum}
            />
            {
              editable && (
                <AtInput
                  editable={editable}
                  name='password'
                  required
                  title='密码'
                  type='password'
                  placeholder='请输入至少8位密码'
                  value={password || ''}
                  onChange={this.changeInput}
                />
              )
            }
            <AtInput
              editable={false}
              name='department'
              required
              title='院系'
              type='text'
              placeholder='例如：计算机学院'
              value={department || ''}
            />
            <AtInput
              editable={false}
              name='subject'
              required
              title='专业班级'
              type='text'
              placeholder='例如：网络1703'
              value={subject || ''}
            />
          </AtForm>
          <View className='btn'>
            {
              !editable ? (
                <>
                  <AtButton 
                    type='primary' 
                    size='normal' 
                    onClick={() => {
                      //每次修改前保存副本，便于之后判断
                      this.oldInfo = {
                        avaterUrl,
                        password
                      }
                      this.openEdit(true)
                    }}
                  >修改密码和头像</AtButton>
                  <AtButton type='primary' size='normal' onClick={this.toLogin}>切换账号</AtButton>
                </>
              ) : (
                <>
                  <AtButton type='secondary' size='normal' onClick={this.updateInfo}>保存</AtButton>
                  <AtButton type='secondary' size='normal' onClick={() => this.openEdit(false)}>取消</AtButton>
                </>
              )
            }
          </View>
          {
            //因为这个其实是隐藏了不是没有，这样可以优化一下
            isOpened && (
              <AtFloatLayout isOpened={isOpened} onClose={this.onClose} title="请选择一个喜欢的头像吧">
                <View className='avater_select'>
                  {
                    avaterArr.map((val, index) => {
                      return (
                        <Image mode='widthFix' src={val} onClick={() => this.selectAvater(index)}></Image>
                      )
                    })
                  }
                </View>
              </AtFloatLayout>
            )
          }
        </View>
      </View>
    )
  }
}
