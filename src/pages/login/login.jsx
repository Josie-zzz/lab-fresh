import { View, Image } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import React from 'react'
import { AtAvatar, AtForm, AtInput, AtButton, AtFloatLayout, AtTabs, AtTabsPane, AtMessage } from 'taro-ui'
import './login.scss'
import {AppContext} from '../../context'

const avaterArr = []
for(let i = 0; i < 20; i++){
  avaterArr[i] = require('../../static/avater/' + i + '.png')
}

export default class Index extends React.Component {
  static contextType = AppContext

  constructor () {
    super(...arguments)
    this.state = {
      loginStatus: +getCurrentInstance().router.params.loginStatus,
      isOpened: false,
      current: 0,
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

  handleClick(value){
    this.setState({
      current: value
    })
  }
  //提交表单
  register = () => {
    const {studentNum, password, name, department, subject, avaterUrl} = this.state
    let obj = {
      studentNum, 
      password, 
      name,
      department,
      subject,
      avaterUrl
    }
    //表单校验
    for(let key in obj){
      let bool = tools.checkEmpty(obj[key])
      if(!bool){
        tools.popTip('表单信息都是必填项', 'warning')
        return
      }
    }
    if(obj.studentNum.length !== 8){
      tools.popTip('学号必须是8位', 'error')
      return
    }
    if(obj.password.length < 8){
      tools.popTip('密码至少8位', 'error')
      return
    }

    Taro.request({
      url: 'http://127.0.0.1:3009/login/register',
      method: 'POST',
      data: obj,
      success: (res) => {
        const {status} = res.data
        if(status == 1){
          tools.popTip('注册成功，请继续登陆', 'success')
          setTimeout(() => {
            this.handleClick(1)
          }, 1000)
        } else if(status == 2){
          tools.popTip('用户已经存在，请直接登陆', 'warning')
          this.handleClick(1)
        }
      }
    })
  }

  doLogin = () => {
    const {studentNum, password, editable} = this.state
    const {updateUser} = this.context
    let obj = {
      studentNum, 
      password
    }

    for(let key in obj){
      let bool = tools.checkEmpty(obj[key])
      if(!bool){
        tools.popTip('表单信息都是必填项', 'warning')
        return
      }
    }

    Taro.request({
      url: 'http://127.0.0.1:3009/login/doLogin',
      method: 'POST',
      data: obj,
      success: (res) => {
        const {status, userInfo} = res.data
        if(status == 3){
          tools.popTip('此用户不存在，请先注册', 'error')
          this.handleClick(0)
        } else if(status == 4){
          tools.popTip('密码输入错误，请检查', 'error')
        } else if(status == 5){
          tools.popTip('登陆成功，请等待跳转', 'success')
          updateUser(status, userInfo)
          setTimeout(() => {
            Taro.switchTab({
              url: '/pages/me/me'
            })
          }, 1000)
        }
      }
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
      studentNum, password, name, department, subject, current, editable } = this.state
    let tabList = [{title: '注册页'}, {title: '登陆页'}]
    if(loginStatus){
      tabList = [{title: '用户信息'}]
    }
    console.log('context2',this.context)

    return (
      <View className='login'>
        <AtMessage />
        <AtTabs current={current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={current} index={0} >
            <AtForm>
              <View className='avater' onClick={this.changeAvater}>
                <View className='txt'>头像</View>
                <AtAvatar circle image={avaterUrl}></AtAvatar>
                <View className='txt2'>点击更换头像</View>
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
          </AtTabsPane>
          <AtTabsPane current={current} index={1}>
            <AtInput
              name='studentNum'
              required
              title='学号'
              type='text'
              placeholder='请输入8位学号'
              value={studentNum}
              onChange={this.changeInput}
            />
            <AtInput
              name='password'
              required
              title='密码'
              type='password'
              placeholder='请输入至少8位密码'
              value={password}
              onChange={this.changeInput}
            />
            <AtButton type='primary' onClick={this.doLogin}>登陆</AtButton>
          </AtTabsPane>
        </AtTabs>
        <AtFloatLayout isOpened={isOpened} title="请选择一个喜欢的头像吧">
          {
            avaterArr.map((val, index) => {
              return (
                <Image mode='widthFix' src={val} onClick={() => this.selectAvater(index)}></Image>
              )
            })
          }
        </AtFloatLayout>
      </View>
    )
  }
}

var tools = {
  //校验是否为空
  checkEmpty(key){
    if(key){
      return true
    }
    return false
  }, 
  //提示框
  popTip(message, type){
    Taro.atMessage({
      message,
      type,
    })
  },
}