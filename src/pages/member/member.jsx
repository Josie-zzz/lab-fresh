import React from 'react'
import {AppContext} from '@/context'
import Taro from '@tarojs/taro'
import {AtAccordion, AtList, AtListItem, AtIcon, AtSearchBar,
   AtButton, AtModal, AtRadio, AtForm, AtMessage } from 'taro-ui'
import {View, Picker} from '@tarojs/components'
import { Modal, AddBtn } from '@/components'
import { URL} from '@/url'
import './member.scss'

//这三个一一对应
const selectMap = ['name', 'level', 'studentNum']
const placeholder = ['请输入需要查找的姓名', '请输入权限等级：1、2', '请输入学号']
const selector = ['姓名', '权限', '学号']     //检索条件
const options = [
  { label: 'LV1', value: 1, desc: '拥有所有权限，所有子系统管理权限' },
  { label: 'LV2', value: 2, desc: '可以查看子系统的资料内容等，但不可以编辑'}
]
const groupMap = ['web开发组', '技术运维组', '视觉设计组', '网络安全组', '产品&运营组']

export default class Member extends React.Component {
  static contextType = AppContext

  state = {
    users: [],        //储存请求来的用户数据
    showUsers: [],    //需要展示的用户
    open: {},         //储存每个用户的标签闭合
    user: {},         //被选中展开的成员
    search: '',       //搜索内容
    searchNum: '',    //根据学号搜索
    searchInfo: null, //记录当前搜索到的信息
    checked: 0,       //选中的检索条件
    isOpened: false,  //修改权限的模态框显示否
    isOpenedDel: false,   //删除的模态框显示否
    isOpenedAdd: false,   //添加的模态框显示否
    selectLevel: -1,      //被选中的权限值
    groupCurt: 0,       //当前被选中的组
  }

  componentDidMount(){
    this.searchAllMember()
  }

  //搜索所有成员
  searchAllMember = () => {
    const {studentNum} = this.context
    Taro.request({
      url: `${URL.member}?studentNum=${studentNum}`,
      method: 'GET',
      success: (res) => {
        const {status, users} = res.data
        if(status == 1){
          this.setState({
            users,
            showUsers: users
          })
        }
      }
    })
  }

  handleClick (index, user) {
    //点击后展开
    const open = this.state.open
    this.setState({
      open: {...open, [index]: !open[index]}
    })
    //记录当前的user
    if(open[index]){
      this.setState({
        user: {}
      })
    } else {
      this.setState({
        user
      })
    }
    // console.log(index, user, this.state.user)
  }

  showChangeLevel(bool){
    this.setState({
      isOpened: bool,
    })
    //每次打开显示当前权限
    if(bool){
      this.setState((state) => ({
        selectLevel: state.user.level,
      }))
    }
  }

  changeLevel(selectLevel){
    this.setState({
      selectLevel
    })
  }

  //删除成员
  deleteUser = () => {
    const {studentNum} = this.context
    const { user } = this.state
    Taro.request({
      url: `${URL.deleteMember}`,
      method: 'POST',
      data: {
        operator: studentNum,
        studentNum: user.studentNum
      },
      success: (res) => {
        const {status, errmsg} = res.data
        if(status == 1){
          Taro.atMessage({
            message: errmsg,
            type: 'success',
          })
          this.handleClose(false)
          this.searchAllMember()
        } else {
          Taro.atMessage({
            message: errmsg,
            type: 'error',
          })
        }
      }
    })
  }

  handleClose = (isOpenedDel) => {
    this.setState({
      isOpenedDel
    })
  }

  showUserInfo(users){
    const {userInfo} = this.context
    let open = {}

    return users.map(user => {
      //给open对象设置每个list的值来控制开启和闭合
      let index = user.studentNum
      open[index] = false

      //排除自己，最高权限的人不可以管理自己
      if(user.studentNum == userInfo.studentNum){
        return false
      }

      return (
        <AtAccordion
          open={this.state.open[index]}
          onClick={() => this.handleClick(index, user)}
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
            <AtListItem
              title={groupMap[user.groupInfo.group]}
              note='归属小组'
            />
          </AtList>
          <View className='btns'>
            <AtButton  type='primary' onClick={() => this.showChangeLevel(true)}>修改权限</AtButton>
            <AtButton className='btn-red'  type='warn' onClick={ () => this.handleClose(true) }>删除操作</AtButton>
          </View>            
        </AtAccordion>
      )
    })
  }

  onChange (value) {
    this.setState({
      search: value
    })
    //变成空的时候默认是显示全部
    if(!value){
      this.setState((state) => ({
        showUsers: state.users
      }))
    }
  }

  searchShowUsers = () => {
    const { search, checked, users } = this.state
    //根据检索条件筛选出展示的数据
    let key = selectMap[checked]
    if(!search){
      Taro.atMessage({
        'message': '输入框不可以为空',
        'type': 'warning',
      })
    } else {
      this.setState({
        showUsers: users.filter(v => v[key] == search)
      })
    }
  }

  changeSelect = e => {
    this.setState({
      checked: +e.detail.value
    })
  }

  //添加成员
  addMember = () => {
    this.setState({
      isOpenedAdd: true
    })
  }

  searchChange = (value) => {
    this.setState({
      searchNum: value  
    })
    if(!value || this.state.searchInfo){
      this.setState({
        searchInfo: null  
      })
    }
  }

  //根据学号搜索信息
  searchInfoByNum = (value) => {
    const { searchNum } = this.state
    if(!searchNum){
      Taro.atMessage({
        'message': '输入框不可以为空',
        'type': 'warning',
      })
    } else if(searchNum.length < 8){
      Taro.atMessage({
        'message': '学号不可以小于八位',
        'type': 'warning',
      })
    } else {
      if(value == searchNum){
        return
      }
      Taro.request({
        url: `${URL.studentInfo}?studentNum=${searchNum}`,
        success: (res) => {
          const { stu, status, errmsg } = res.data
          console.log(res, stu)
          if(status){
            this.setState({
              searchInfo: stu,
            })
          } else {
            this.setState({
              searchInfo: null,
            })
            Taro.atMessage({
              message: errmsg,
              type: 'warning',
            })
          }
        }
      })
    }
  }

  //点击确认添加成员
  requestMember = () => {
    const { studentNum } = this.context
    const { searchInfo, groupCurt } = this.state
    if(!searchInfo){
      Taro.atMessage({
        message: '请先搜索需要添加的成员',
        type: 'warning',
      })
      return
    }
    Taro.request({
      url: URL.addMember,
      method: 'POST',
      data: {
        operator: studentNum,
        user: searchInfo.studentNum,
        groupInfo: {
          group: groupCurt
        },
      },
      success: (res) => {
        const { status, errmsg} = res.data
        console.log(res.data)
        if(status == 1){
          Taro.atMessage({
            message: errmsg,
            type: 'success',
          })
          //刷新当前数据
          this.searchAllMember()
          //关闭弹窗
          this.setState({
            isOpenedAdd: false,
            searchNum: '',
            searchInfo: null
          })
        } else {
          Taro.atMessage({
            message: errmsg,
            type: 'error',
          })
        }
      }
    })
  }

  //更新权限值
  updateLevel = () => {
    const { studentNum } = this.context
    const { selectLevel, user } = this.state
    if (selectLevel == user.level) {
      Taro.atMessage({
        message: '权限并未修改，请重新选择',
        type: 'warning',
      })
      return
    }
    Taro.request({
      url: URL.updateLevel,
      method: 'POST',
      data: {
        operator: studentNum,
        studentNum: user.studentNum,
        level: selectLevel
      },
      success: (res) => {
        const { status, errmsg} = res.data
        if(status){
          Taro.atMessage({
            message: errmsg,
            type: 'success',
          })
          this.searchAllMember()
          this.showChangeLevel(false)
          //成功以后，更新一下被选中的值，因为他还是之前的，避免还未收起标签但又被点击了，出现权限错误
          this.setState(state => ({
            user: {...state.user, level: selectLevel}
          }))
        } else {
          Taro.atMessage({
            message: errmsg,
            type: 'error',
          })
        }
      }
    })
  }

  //选择小组变化
  groupChange = (e) => {
    this.setState({
      groupCurt: +e.detail.value
    })
  }

  render(){
    const {user, showUsers, search, searchInfo, searchNum, checked, 
      isOpened, isOpenedDel, isOpenedAdd, selectLevel, groupCurt} = this.state

      return (
        <View className='member'>
          <AtMessage />
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
              showActionButton
              value={search}
              placeholder={placeholder[checked]}
              onChange={this.onChange.bind(this)}
              onActionClick={this.searchShowUsers}
            />
          </View>
          <View className='all'>
            {
              showUsers.length ? this.showUserInfo(showUsers) : (
                <View>没搜到</View>
              )
            }
          </View>
          <View className='modals'>
            {/* 修改权限 */}
            <Modal
              header = '请选择你需要修改的权限'
              isOpened={isOpened}
              contentDOM = {(
                <AtRadio
                  options={options}
                  value={selectLevel}
                  onClick={this.changeLevel.bind(this)}
                />
              )}
              onOk={this.updateLevel}
              onCancel={() => this.showChangeLevel(false)}
            />
            {/* 删除成员 */}
            <AtModal
              isOpened={isOpenedDel}
              cancelText='取消'
              confirmText='确认'
              onConfirm={ this.deleteUser }
              onCancel={ () => this.handleClose(false)}
              content={`你确定删除姓名为${user.name}，学号为${user.studentNum}的成员吗`}
            />
            {/* 搜索成员 */}
            <View className='searchInfo'>
              <Modal
                header = '请使用学号搜索需要添加的成员'
                isOpened={isOpenedAdd}
                contentDOM = {(
                  <>
                    <Picker className='search' mode='selector' range={groupMap} onChange={this.groupChange}>
                      <AtList>
                        <AtListItem
                          title='选择小组'
                          extraText={groupMap[groupCurt]}
                        />
                      </AtList>
                    </Picker>
                    <AtSearchBar
                      showActionButton
                      value={searchNum}
                      placeholder='请输入学号'
                      onChange={this.searchChange}
                      onActionClick={this.searchInfoByNum}
                    />
                    {
                      searchInfo && (
                        <View style={{textIndent: '2em'}}>
                          <View>姓名：{searchInfo.name}</View>
                          <View>学院：{searchInfo.department}</View>
                          <View>专业：{searchInfo.subject}</View>
                        </View>
                      )
                    }
                  </>
                )}
                onOk={this.requestMember}
                onCancel={() => {
                  this.setState({
                    isOpenedAdd: false,
                    searchNum: '',
                    searchInfo: null
                  })
                }}
              />
            </View>
          </View>
          <AddBtn onClick={this.addMember} />
        </View>
      )

  }
}