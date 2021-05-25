import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Picker } from "@tarojs/components"
import { AtList, AtListItem, AtSearchBar, AtButton, AtInput, AtModal, AtMessage, AtTimeline } from 'taro-ui'
import { Modal } from '@/components'
import Table from 'taro3-table';
import { URL } from '@/url'
import {AppContext} from '@/context'
import './fresh.scss'

const freshStatus = ['已报名', '一面', '二面', '三面', '未通过', '已通过']
const groupMap = ['web开发组', '技术运维组', '视觉设计组', '网络安全组', '产品&运营组']
const selector = ['面试状态', '报名小组', '姓名', '学号', ]     //检索条件
const selectMap = ['status', 'goalGroup', 'name', 'studentNum']

export default class Fresh extends React.Component {
  static contextType = AppContext

  state = {
    checked: 0,
    search: '',
    dataSource: [],     //显示的数据
    showDataSource: [], //显示的表格数据
    stuCurt: null,     //点击修改选中的学生
    isOpened: false,    //是否显示编辑框
    isOpenedDel: false,  //是否显示删除框
    isOpenedAdd: false,   //是否显示添加框
    freshInfo: {          //报名信息
      goalGroup: '',
      status: ''
    },
    addInfo: {    //添加的成员信息
      groupCurt: '',    //选中的小组
      searchNum: '',    //要搜索的学号
      searchInfo: null, //搜索到的学生
      status: ''        //面试状态
    },
    stuGroup: '',       //报名时的目标小组
    baomingObj: null,     //如果是普通学生，他是否已经报名
  }

  get columns(){
    return [
      {
        title: '序号',
        dataIndex: 'id'
      },
      {
        title: '学号',
        dataIndex: 'studentNum'
      },
      {
        title: '姓名',
        dataIndex: 'name'
      },
      {
        title: '报名小组',
        dataIndex: 'goalGroup',
        render: (text) => {
          return groupMap[text]
        }
      },
      {
        title: '面试状态',
        dataIndex: 'status',
        render: (text) => {
          return freshStatus[text]
        }
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <View style={{width: '100%'}}>
              <Text style={{color: 'blue', marginRight: '5px'}} onClick={() => this.updateInfo(record)}>编辑</Text>
              <Text style={{color: 'red'}}  onClick={() => this.deleteInfo(record)}>删除</Text>
            </View>
          )
        }
      }
    ]
  }

  componentDidMount(){
    const { level, studentNum } = this.context
    if(level == 1){
      this.requestFresh()
    } else {
      //请求报名者数据
      this.requestBaoming()
    }
  }

  //请求报名者数据
  requestBaoming = () => {
    const { studentNum } = this.context
    Taro.request({
      url: URL.freshData,
      data: {
        studentNum
      },
      success: (res) => {
        const { status, fresh } = res.data
        if(status == 1){
          console.log(res.data)
          if(fresh.length){
            this.setState({
              baomingObj: fresh[0]
            })
          }
        }
      }
    })
  }

  //请求数据
  requestFresh = () => {
    Taro.request({
      url: URL.freshData,
      success: (res) => {
        const { status, fresh } = res.data
        if(status == 1){
          let newFresh = fresh.map((v, i) => ({...v, id: i + 1}))
          this.setState({
            dataSource: newFresh,
            showDataSource: newFresh
          })
        }
      }
    })
  }
  
  //编辑
  updateInfo(record){
    this.setState({
      stuCurt: record,
      isOpened: true,
      freshInfo: {
        goalGroup: record.goalGroup,
        status: record.status,
      }
    })
  }

  //删除
  deleteInfo(record){
    this.setState({
      stuCurt: record,
      isOpenedDel: true
    })
  }

  //编辑学生确认
  updateStu = () => {
    const {freshInfo, stuCurt} = this.state
    const {studentNum} = this.context
    if((freshInfo.status || freshInfo.goalGroup) === ''){
      Taro.atMessage({
        message: '报名小组和面试情况不可以为空',
        type: 'warning',
      })
      return
    }
    Taro.request({
      url: URL.freshUpdate,
      method: 'POST',
      data: {
        operator: studentNum,
        studentNum: stuCurt.studentNum,
        freshInfo
      },
      success: (res) => {
        const {errmsg, status} = res.data
        if(status){
          Taro.atMessage({
            message: errmsg,
            type: 'success',
          })
          this.closeModal('isOpened', false)
          this.requestFresh()
        } else {
          Taro.atMessage({
            message: errmsg,
            type: 'error',
          })
        }
      }
    })
  }

  //删除学生确认
  deleteStu = () => {
    const {stuCurt} = this.state
    const {studentNum} = this.context
    Taro.request({
      url: URL.freshDel,
      method: 'POST',
      data: {
        operator: studentNum,
        studentNum: stuCurt.studentNum,
      },
      success: (res) => {
        const {errmsg, status} = res.data
        if(status){
          Taro.atMessage({
            message: errmsg,
            type: 'success',
          })
          this.closeModal('isOpenedDel', false)
          this.requestFresh()
        } else {
          Taro.atMessage({
            message: errmsg,
            type: 'error',
          })
        }
      }
    })
  }

  //修改freshInfo
  updateFreshInfo = (key, val) => {
    this.setState(state => ({
      freshInfo: {...state.freshInfo, [key]: val}
    }))
  }

  //关闭弹框
  closeModal = (key, bool) => {
    this.setState({
      [key]: bool
    })
    //关闭的时候，清空当前选中的对象
    if(!bool){
      this.setState({
        stuCurt: null
      })
      if(key == 'isOpened'){
        this.setState({
          freshInfo: {
            goalGroup: '',
            status: ''
          }
        })
      }
    }
  }

  changeSelect = e => {
    this.setState({
      checked: +e.detail.value
    })
  }

  //检索搜索框变化
  searchChange = (search) => {
    this.setState({
      search
    })
    //变成空的时候默认是显示全部
    if(!search){
      this.setState((state) => ({
        showDataSource: state.dataSource
      }))
    }
  }

  //添加的search
  searchChangeAdd = (search) => {
    this.setState(state => ({
      addInfo: {...state.addInfo, searchNum: search}
    }))
    //变成空的时候默认是显示全部
    if(!search || this.state.addInfo.searchInfo){
      this.setState(state => ({
        addInfo: {...state.addInfo, searchInfo: null}
      }))
    }
  }

  //根据输入框修改显示内容
  searchShowFresh = () => {
    const {checked, search, dataSource} = this.state
    if(!search){
      Taro.atMessage({
        'message': '输入框不可以为空',
        'type': 'warning',
      })
      return
    }
    let key = selectMap[checked]
    // ['面试状态', '报名小组', '姓名', '学号', ]
    if([2,3].includes(checked)){
      this.setState({
        showDataSource: dataSource.filter(v => v[key] == search)
      })
    } else if (checked === 0) {
      this.setState({
        showDataSource: dataSource.filter(v => freshStatus[v.status] == search)
      })
    } else if (checked === 1) {
      this.setState({
        showDataSource: dataSource.filter(v => groupMap[v.goalGroup] == search)
      })
    }
  }

  //选择小组变化
  groupChange = (e) => {
    this.setState(state => ({
      addInfo: {...state.addInfo, groupCurt: +e.detail.value}
    }))
  }

  //根据学号搜索信息
  searchInfoByNum = (value) => {
    const { addInfo: {searchNum} } = this.state
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
            this.setState(state => ({
              addInfo: {...state.addInfo, searchInfo: stu}
            }))
          } else {
            this.setState(state => ({
              addInfo: {...state.addInfo, searchInfo: null}
            }))
            Taro.atMessage({
              message: errmsg,
              type: 'warning',
            })
          }
        }
      })
    }
  }

  requestAddFresh = () => {
    const { studentNum } = this.context
    const {addInfo:{searchInfo, groupCurt, status, searchNum}} = this.state
    console.log(this.state.addInfo)
    if(!searchInfo){
      Taro.atMessage({
        message: '请先搜索需要添加的成员',
        type: 'warning',
      })
      return
    } else if((groupCurt || status) === ''){
      Taro.atMessage({
        message: '选择小组和面试状态都需要填写',
        type: 'warning',
      })
      return
    }
    Taro.request({
      url: URL.freshAdd,
      method: 'POST',
      data: {
        stu: {
          studentNum: searchNum,
          name: searchInfo.name,
          goalGroup: groupCurt,
          status
        }
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
          this.requestFresh()
          //关闭弹窗
          this.setState(state => ({
            isOpenedAdd: false,
            addInfo: {...state.addInfo, searchNum: '', searchInfo: null, groupCurt: '', status: ''}
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

  //提交报名信息
  submitBaoming = () => {
    const { userInfo: {studentNum, name} } = this.context
    const { stuGroup} = this.state
    if(stuGroup === ''){
      console.log('请选择要加入的小组，再提交')
      Taro.atMessage({
        message: '请选择要加入的小组，再提交',
        type: 'warning',
      })
      return
    }
    Taro.request({
      url: URL.freshAdd,
      method: 'POST',
      data: {
        stu: {
          studentNum,
          name,
          goalGroup: stuGroup,
          status: 0
        }
      },
      success: (res) => {
        const { status, errmsg} = res.data
        if(status == 1){
          Taro.atMessage({
            message: errmsg,
            type: 'success',
          })
          setTimeout(() => {
            this.requestBaoming()
          }, 1000)
        } else {
          Taro.atMessage({
            message: errmsg,
            type: 'error',
          })
        } 
      }
    })
  }

  render(){
    const { checked, search, showDataSource, isOpened, isOpenedDel, isOpenedAdd, 
      freshInfo, stuCurt, addInfo, stuGroup, baomingObj } = this.state
    const loginLevel = this.context.level
    console.log(freshInfo)

      if(loginLevel == 1){
        return (
          <View className='fresh'>
            <AtMessage />
            <View className='search'>
              <Picker mode='selector' range={selector} 
                onChange={this.changeSelect}
              >
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
                placeholder={'请输入要查找的' + selector[checked]}
                onChange={this.searchChange}
                onActionClick={this.searchShowFresh}
              />
              <AtButton type='primary' onClick={() => {
                this.setState({
                  isOpenedAdd: true
                })
              }}>添加报名学生</AtButton>
              <View className="warning-txt">注意：一般情况不需要手动添加报名学生</View>
            </View>
            <Table
              columns={this.columns}
              dataSource={showDataSource}
              scroll={{x: true, y: true}}
            />
            <Modal
              header = '请编辑当前学生报名信息'
              isOpened={isOpened}
              contentDOM = {(
                <>
                  <Picker className='search' mode='selector' range={groupMap} 
                    onChange={(e) => {
                      this.updateFreshInfo('goalGroup',  +e.detail.value)
                    }}
                  >
                    <AtList>
                      <AtListItem
                        title='报名小组'
                        extraText={ groupMap[freshInfo.goalGroup] || ''}
                      />
                    </AtList>
                  </Picker>
                  <Picker className='search' mode='selector' range={freshStatus} 
                    onChange={(e) => {
                      this.updateFreshInfo('status',  +e.detail.value)
                    }}
                  >
                    <AtList>
                      <AtListItem
                        title='面试状态'
                        extraText={ freshStatus[freshInfo.status] || ''}
                      />
                    </AtList>
                  </Picker>
                </>
              )}
              onOk={this.updateStu}
              onCancel={() => {
                this.closeModal('isOpened', false)
              }}
            />
            {/* 删除成员 */}
            <AtModal
              isOpened={isOpenedDel}
              cancelText='取消'
              confirmText='确认'
              onConfirm={ this.deleteStu }
              onCancel={ () => {
                this.closeModal('isOpenedDel', false)
              }}
              content={`你确定删除姓名为${stuCurt ? stuCurt.name : '**'}，学号为${stuCurt ? stuCurt.studentNum : '**'}的成员吗`}
            />
            {/* 添加成员 */}
            <View className='searchInfo'>
              <Modal
                header = '请使用学号搜索需要添加的成员'
                isOpened={isOpenedAdd}
                contentDOM = {(
                  <>
                    <AtSearchBar
                      showActionButton
                      value={addInfo.searchNum}
                      placeholder='请输入学号'
                      onChange={this.searchChangeAdd}
                      onActionClick={this.searchInfoByNum}
                    />
                    {
                      addInfo.searchInfo && (
                        <View style={{textIndent: '2em'}}>
                          <View>姓名：{addInfo.searchInfo.name}</View>
                          <View>学院：{addInfo.searchInfo.department}</View>
                          <View>专业：{addInfo.searchInfo.subject}</View>
                        </View>
                      )
                    }
                    <Picker className='search' mode='selector' range={groupMap} onChange={this.groupChange}>
                      <AtList>
                        <AtListItem
                          title='选择小组'
                          extraText={groupMap[addInfo.groupCurt]}
                        />
                      </AtList>
                    </Picker>
                    <Picker className='search' mode='selector' range={freshStatus} 
                      onChange={(e) => {
                        this.setState(state => ({
                          addInfo: {...state.addInfo, status: +e.detail.value}
                        }))
                      }}
                    >
                      <AtList>
                        <AtListItem
                          title='面试状态'
                          extraText={ freshStatus[addInfo.status] || ''}
                        />
                      </AtList>
                    </Picker>
                  </>
                )}
                onOk={this.requestAddFresh}
                onCancel={() => {
                  this.setState(state => ({
                    isOpenedAdd: false,
                    addInfo: {...state.addInfo, searchNum: '', searchInfo: null, groupCurt: '', status: ''}
                  }))
                }}
              />
            </View>
          </View>
        )
      } else if(loginLevel == 2){
        return <View>目前只对非组内人员开放哦</View>
      } else {
        if(!baomingObj){
          return (
            <View className='fresh'>
              <AtMessage />
              <View className='stu_title'>请选择你要报名的小组</View>
              <Picker className='search' mode='selector' range={groupMap} 
                onChange={(e) => {
                  this.setState({
                    stuGroup: +e.detail.value
                  })
                }}>
                <AtList>
                  <AtListItem
                    title='选择小组'
                    extraText={groupMap[stuGroup]}
                  />
                </AtList>
              </Picker>
              <AtButton type='primary' onClick={this.submitBaoming}>提交</AtButton>
            </View>
          )
        } else {
          console.log(baomingObj)
          let items = freshStatus.map((val, index) => {
            let obj = {
              title: val
            }
            if(index <= baomingObj.status){
              obj.icon = 'check'
              obj.color = 'red'
            }
            return obj
          })
          return (
            <View className='fresh' style={{backgroundColor: '#fff', padding: '20rpx', height: '100%'}}>
              <AtMessage />
              <View className='stu_title'>你已经报名，当前面试状态如下</View>
              <AtTimeline 
                  pending 
                  style={{fontSize: '30rpx'}}
                  items={items}></AtTimeline>
            </View>
          )
        }
      }
  }
}