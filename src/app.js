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
      userInfo: null,   //记录用户信息
      studentNum: '',
    }
  }

  updateUser = (userInfo) => {
    this.setState({
      userInfo
    })
  }

  updateStudentNum = (studentNum) => {
    this.setState({
      studentNum
    })
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    let obj = {
      ...this.state, 
      updateUser: this.updateUser,
      updateStudentNum: this.updateStudentNum
    }
    return (
      <AppContext.Provider value={obj}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

export default App
