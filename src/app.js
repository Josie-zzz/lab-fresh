import React, { Component } from 'react'
import {AppContext} from './context'
import './app.scss'
//引入主题样式
import './custom-theme.scss'
class App extends Component {
  constructor(){
    super()
    //全局变量设置
    this.state = {
      loginStatus: 0,         //登陆状态 0未登陆，非0是登陆
      userInfo: null,   //记录用户信息
      // openid: ''
    }
  }

  updateUser = (loginStatus, userInfo) => {
    this.setState({
      loginStatus: loginStatus || this.state.loginStatus, 
      userInfo: userInfo || this.state.userInfo,
      // openid: openid || this.state.openid
    })
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    let obj = {
      ...this.state, 
      updateUser: this.updateUser
    }
    return (
      <AppContext.Provider value={obj}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

export default App
