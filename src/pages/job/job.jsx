import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Picker } from "@tarojs/components"
import { AtList, AtListItem, AtSearchBar, AtButton, AtInput, AtMessage } from 'taro-ui'
import Table from 'taro3-table';
import { Modal } from '@/components'
import { URL } from '@/url'
import {AppContext} from '@/context'
import './job.scss'

const selector = ['就业情况', '姓名', '学号', '小组']     //检索条件
const selectMap = ['jobStatus', 'name', 'studentNum', 'group']
const groupMap = ['web开发组', '技术运维组', '视觉设计组', '网络安全组', '产品&运营组']
const jobStatus = ['已就业', '未就业', '考研']

export default class Job extends React.Component {
  static contextType = AppContext

  state = {
    checked: 0,
    search: '',
    dataSource: [],     //表格数据
    showDataSource: [], //显示的表格数据
    userCurt: null,     //点击修改选中的成员
    isOpened: false,    //是否显示修改框
    jobInfo: {
      jobStatus: '',       //就业表单
      company: '',   //就业单位
      city: '',      //就业城市
      post: '',      //就业岗位
      money: '',      //薪资
    }
  }

  get columns(){
    return [
      {
        title: '学号',
        dataIndex: 'studentNum'
      },
      {
        title: '姓名',
        dataIndex: 'name'
      },
      {
        title: '归属小组',
        dataIndex: 'group',
        render: (text, record) => {
          const { groupInfo } = record
          let txt = groupMap[groupInfo.group] || '*'
          return txt
        }
      },
      {
        title: '就业情况',
        dataIndex: 'jobStatus',
        render: (text, record) => {
          const { jobInfo } = record
          let txt = jobStatus[jobInfo.jobStatus] || '*'
          return txt
        }
      },
      {
        title: '就业单位',
        dataIndex: 'company',
        render: (text, record) => {
          const { jobInfo } = record
          let txt = jobInfo.company || '*'
          return txt
        }
      },
      {
        title: '就业城市',
        dataIndex: 'city',
        render: (text, record) => {
          const { jobInfo } = record
          let txt = jobInfo.city || '*'
          return txt
        }
      },
      {
        title: '岗位',
        dataIndex: 'post',
        render: (text, record) => {
          const { jobInfo } = record
          let txt = jobInfo.post || '*'
          return txt
        }
      },
      {
        title: '薪资(k)',
        dataIndex: 'money',
        render: (text, record) => {
          const { jobInfo } = record
          let txt = jobInfo.money || '*'
          return txt
        }
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <View style={{width: '100%'}}>
              <Text style={{color: 'blue', marginRight: '5px'}} onClick={() => this.updateInfo(record)}>编辑</Text>
            </View>
          )
        }
      }
    ]
  }

  componentDidMount(){
    this.getJobInfo()
  }

  getJobInfo = () => {
    const {studentNum} = this.context
    Taro.request({
      url: `${URL.jobAll}?studentNum=${studentNum}`,
      method: 'GET',
      success: (res) => {
        const {status, users} = res.data
        if(status){
          this.setState({
            dataSource: users,
            showDataSource: users
          })
        }
      }
    })
  }
  
  //编辑
  updateInfo = (record) => {
    this.setState(state => ({
      userCurt: record,
      jobInfo: {...state.jobInfo, ...record.jobInfo}
    }))
    this.closeModal(true)
  }

  changeSelect = e => {
    this.setState({
      checked: +e.detail.value
    })
  }

  closeModal = (bool) => {
    this.setState({
      isOpened: bool
    })
    //关闭的时候，清空当前选中的对象
    if(!bool){
      this.setState({
        userCurt: null
      })
    }
  }

  //修改state
  changeJobInfo = (key, val) => {
    this.setState(state => ({
      jobInfo: {...state.jobInfo, [key]: val}
    }))
  }

  //清空表单
  clearIpt = () => {
    this.setState({
      jobInfo: {
        jobStatus: '', 
        company: '',  
        city: '', 
        money: '',
        post: ''
      }
    })
  }

  submitIpt = () => {
    const { jobInfo, userCurt } = this.state
    //校验
    if(![0,1,2].includes(jobInfo.jobStatus)){
      Taro.atMessage({
        message: '请选择就业情况',
        type: 'warning',
      })
      return
    } else if ([1,2].includes(jobInfo.jobStatus)) {
      for (let key in jobInfo){
        if(key == 'jobStatus') continue
        if(jobInfo[key]){
          Taro.atMessage({
            message: '未就业或者考研不需要填写就业内容',
            type: 'warning',
          })
          return
        }
      }
    }

    Taro.request({
      url: URL.updJobInfo,
      method: 'POST',
      data: {
        studentNum: userCurt.studentNum,
        jobInfo
      },
      success: (res) => {
        const { status, errmsg} = res.data
        if(status){
          Taro.atMessage({
            message: errmsg,
            type: 'success',
          })
          //清空所选中的成员和表单
          this.closeModal()
          this.clearIpt()
          //更新数据
          this.getJobInfo()
        } else {
          Taro.atMessage({
            message: errmsg,
            type: 'error',
          })
        }
      }
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

  //根据输入框修改显示内容
  searchjobInfo = () => {
    const {checked, search, dataSource} = this.state
    if(!search){
      Taro.atMessage({
        'message': '输入框不可以为空',
        'type': 'warning',
      })
      return
    }
    let key = selectMap[checked]
    if([1,2].includes(checked)){
      this.setState({
        showDataSource: dataSource.filter(v => v[key] == search)
      })
    } else if (checked === 3) {
      this.setState({
        showDataSource: dataSource.filter(v => groupMap[v.groupInfo.group] == search)
      })
    } else if (checked === 0) {
      this.setState({
        showDataSource: dataSource.filter(v => jobStatus[v.jobInfo.jobStatus] == search)
      })
    }
  }

  render(){
    const { checked, search, showDataSource, isOpened, userCurt,
      jobInfo } = this.state
    return (
      <View className='job'>
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
            onActionClick={this.searchjobInfo}
          />
        </View>
        <Table
          columns={this.columns}
          dataSource={showDataSource}
          scroll={{x: true, y: true}}
        />
        <Modal
          header = {`请添加${userCurt ? userCurt.name : 'xxx'}相关的就业信息`}
          isOpened={isOpened}
          contentDOM = {(
            <>
              <Picker className='search' mode='selector' range={jobStatus} 
                onChange={(e) => {
                  this.changeJobInfo('jobStatus',  +e.detail.value)
                }}
              >
                <AtList>
                  <AtListItem
                    title='选择就业情况'
                    extraText={ jobStatus[jobInfo.jobStatus] || ''}
                  />
                </AtList>
              </Picker>
              <AtInput 
                name='companyIpt'
                title='就业单位' 
                type='text' 
                placeholder='请填写就业单位' 
                value={jobInfo.company} 
                onChange={(val) => {
                  this.changeJobInfo('company',  val)
                }}
              />
              <AtInput 
                name='cityIpt'
                title='就业城市' 
                type='text' 
                placeholder='请填写就业城市' 
                value={jobInfo.city} 
                onChange={(val) => {
                  this.changeJobInfo('city',  val)
                }}
              />
              <AtInput 
                name='postIpt'
                title='岗位' 
                type='text' 
                placeholder='请填写岗位' 
                value={jobInfo.post} 
                onChange={(val) => {
                  this.changeJobInfo('post',  val)
                }}
              />
              <AtInput 
                name='moneyIpt'
                title='薪资' 
                type='number' 
                placeholder='单位是(k)' 
                value={jobInfo.money} 
                onChange={(val) => {
                  this.changeJobInfo('money',  val)
                }}
              />
            </>
          )}
          onOk={this.submitIpt}
          onCancel={() => this.closeModal(false)}
        />
      </View>
    )
  }
}