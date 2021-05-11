import React from 'react'
import { View, Text, Picker } from "@tarojs/components"
import { AtList, AtListItem, AtSearchBar, AtButton } from 'taro-ui'
import Table from 'taro3-table';
import './job.scss'

const selector = ['就业情况', '姓名', '学号', '小组']     //检索条件

const dataSource = [
  {
    _id: 1,		
    studentNum: '04172088',		
    name: '王曾洁',
    jobStatus: '未就业',	
    group: 'web组'
  },
  {
    _id: 2,		
    studentNum: '04172090',		
    name: '王冰冰',
    jobStatus: '百度',	
    group: 'web组'
  },
  {
    _id: 3,		
    studentNum: '04172091',		
    name: '王小洁',
    jobStatus: '考研',	
    group: 'java组'
  },
]

export default class Job extends React.Component {

  state = {
    checked: 0,
    search: ''
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
        title: '就业情况',
        dataIndex: 'jobStatus'
      },
      {
        title: '归属小组',
        dataIndex: 'group'
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
  
  //编辑
  updateInfo(){}

  //删除
  deleteInfo(){}

  changeSelect = e => {
    this.setState({
      checked: +e.detail.value
    })
  }

  render(){
    const { checked, search } = this.state
    return (
      <View className='job'>
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
            value={search}
            placeholder={'请输入要查找的' + selector[checked]}
            // onChange={this.onChange.bind(this)}
            // onActionClick={this.searchShowUsers}
          />
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