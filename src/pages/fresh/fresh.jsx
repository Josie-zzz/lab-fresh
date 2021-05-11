import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Picker } from "@tarojs/components"
import { AtList, AtListItem, AtSearchBar, AtButton } from 'taro-ui'
import Table from 'taro3-table';
import { URL } from '@/url'
import './fresh.scss'

const STATUS = {
  '0': '已报名',
  '1': '一面', 
  '2': '二面',
  '3': '三面',
  'fail': '未通过',
  'done': '已通过'
}
const selector = ['面试状态', '姓名', '学号', '小组']     //检索条件

export default class Fresh extends React.Component {

  state = {
    checked: 0,
    search: '',
    dataSource: [],     //显示的数据
  }

  get columns(){
    return [
      {
        title: '序号',
        dataIndex: '_id'
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
        dataIndex: 'goalGroup'
      },
      {
        title: '面试状态',
        dataIndex: 'status',
        render: (text) => {
          return <Text>{ STATUS[text] }</Text>
        }
      },
      {
        title: '操作',
        render: (text, record) => {
          console.log(record)
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
    Taro.request({
      url: URL.freshAll,
      success: (res) => {
        const { status, fresh } = res.data
        if(status == 1){
          this.setState({
            dataSource: fresh
          })
        }
      }
    })
  }
  
  //编辑
  updateInfo(){}

  //删除
  deleteInfo(){}

  //添加
  addInfo(){

  }

  changeSelect = e => {
    this.setState({
      checked: +e.detail.value
    })
  }

  render(){
    const { checked, search, dataSource } = this.state
    return (
      <View className='fresh'>
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
            // onChange={this.onChange.bind(this)}
            // onActionClick={this.searchShowUsers}
          />
          <AtButton type='primary'>添加报名学生</AtButton>
          <View className="warning-txt">注意：一般情况不需要手动添加报名学生</View>
        </View>
        <Table
          columns={this.columns}
          dataSource={dataSource}
          scroll={{x: true, y: true}}
        />
      </View>
    )
  }
}