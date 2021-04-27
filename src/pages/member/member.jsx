import React from 'react'
import {AppContext} from '@/context'
import Taro from '@tarojs/taro'
import {AtAccordion, AtList, AtListItem, AtIcon, AtSearchBar, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtRadio} from 'taro-ui'
import {View, Picker, Button} from '@tarojs/components'
import './member.scss'

//这三个一一对应
const selectMap = ['name', 'level', 'studentNum']
const placeholder = ['请输入需要查找的姓名', '请输入权限等级：1、2、3', '请输入学号']
const selector = ['姓名', '权限', '学号']     //检索条件
const options = [
  { label: 'LV1', value: 1, desc: '拥有所有权限，包括成员管理' },
  { label: 'LV2', value: 2, desc: '拥有权限不包括成员管理'},
  { label: 'LV3', value: 3, desc: '可以在讨论区发帖，其他编辑权限没有'}
]

function returnOption(userLevel){
  return options.map(v => {
    if(v.value == userLevel){
      return {...v, disabled: true}
    }
    return {...v}
  })
}

export default class Member extends React.Component {
  static contextType = AppContext

  state = {
    users: [],        //储存请求来的用户数据
    open: {},         //储存每个用户的标签闭合
    search: '',       //搜索内容
    checked: 0,       //选中的检索条件
    isOpened: false,  //修改权限的模态框显示否
    changeLevel: this.context.userInfo.level
  }

  componentDidMount(){
    // const {studentNum} = this.context
    let studentNum = '04172088'
    Taro.request({
      url: `http://127.0.0.1:3009/login/member?studentNum=${studentNum}`,
      method: 'GET',
      success: (res) => {
        const {status, users} = res.data
        console.log(res)
        this.setState({
          users
        })
      }
    })
  }

  handleClick (index) {
    const open = this.state.open
    this.setState({
      open: {...open, [index]: !open[index]}
    })
  }

  showChangeLevel(bool){
    this.setState({
      isOpened: bool
    })
  }

  changeLevel(value){
    this.setState({
      value
    })
  }

  showUserInfo(users){
    const {userInfo} = this.context
    const {isOpened, options} = this.state
    let open = {}

    return users.map((user, index) => {
      //给open对象设置每个list的值来控制开启和闭合
      open[index] = false

      //排除自己，最高权限的人不可以管理自己
      if(user.studentNum == userInfo.studentNum){
        return false
      }

      return (
        <AtAccordion
          open={this.state.open[index]}
          onClick={() => this.handleClick(index)}
          title={user.name}
        >
          <AtList hasBorder={false}>
            <AtListItem
              title={'LV' + user.level}
              note='权限'
            />
            <AtListItem
              title={user.studentNum}
              note='学号'
            />
            <AtListItem
              title={user.department}
              note='院系'
            />
            <AtListItem
              title={user.subject}
              note='专业班级'
            />
          </AtList>
          <AtButton  type='primary' onClick={() => this.showChangeLevel(true)}>修改权限</AtButton>
            <AtModal isOpened={isOpened}>
              <AtModalHeader>请选择你需要修改的权限</AtModalHeader>
              <AtModalContent>
                <AtRadio
                  options={returnOption(user.level)}
                  value={this.state.value}
                  onClick={this.changeLevel.bind(this)}
                />
              </AtModalContent>
              <AtModalAction> <Button onClick={() => this.showChangeLevel(false)}>取消</Button> <Button>确定</Button> </AtModalAction>
            </AtModal>
        </AtAccordion>
      )
    })
  }

  onChange (value) {
    this.setState({
      search: value
    })
  }

  changeSelect = e => {
    this.setState({
      checked: +e.detail.value
    })
  }

  render(){
    const {users, search, checked} = this.state

    if(users.length == 0){
      return (
        <View className='member_err'>
          <AtIcon value='close-circle' size='30' color='#000'></AtIcon>
          <View>暂时还没有其他成员哦～</View>
        </View>
      )
    } else {
      let showUsers = users
      //根据检索条件筛选出展示的数据
      let key = selectMap[checked]
      if(search){
        showUsers = users.filter(v => v[key] == search)
      }

      return (
        <View className='member'>
          <View className='search'>
            <Picker mode='selector' range={selector} onChange={this.changeSelect}>
              <AtList>
                <AtListItem
                  title='点击此处选择检索的条件'
                  extraText={selector[checked]}
                />
              </AtList>
            </Picker>
            <AtSearchBar
              value={search}
              placeholder={placeholder[checked]}
              onChange={this.onChange.bind(this)}
            />
          </View>
          <View className='all'>
            {
              showUsers.length ? this.showUserInfo(showUsers) : (
                <View>没搜到</View>
              )
            }
          </View>
        </View>
      )
    }

  }
}