const HOST = 'http://127.0.0.1:3009/'
//内网地址
// const HOST = 'http://172.20.10.2:3009/'
//家 内网
// const HOST = 'http://192.168.10.7:3009/'

export const URL = {
  //首页各种介绍
  brief: `${HOST}brief/all`,
  //注册
  register: `${HOST}login/register`,
  //登录
  doLogin: `${HOST}login/doLogin`,
  //用户详情信息
  info: `${HOST}user/info`,
  //更新登陆者信息（修改头像和密码）
  updateUser: `${HOST}user/updateUser`,
  //返回所有成员以及信息
  member: `${HOST}user/member`,
  //删除成员
  deleteMember: `${HOST}user/deleteMember`,
  //添加成员
  addMember: `${HOST}user/addMember`,
  //更新权限值
  updateLevel: `${HOST}user/updateLevel`,
  //搜索在校生信息
  studentInfo: `${HOST}user/studentInfo`,
  //纳新所有信息
  freshData: `${HOST}fresh/data`,
  //纳新增加
  freshAdd: `${HOST}fresh/add`,
  //删除
  freshDel: `${HOST}fresh/delete`,
  //修改信息
  freshUpdate: `${HOST}fresh/update`,
  //成员就业
  jobAll: `${HOST}job/all`,
  //更新就业信息
  updJobInfo: `${HOST}job/update`,
  //请求竞赛和成果的信息
  compData: `${HOST}comp/data`,
  //添加竞赛或者成果
  compAdd: `${HOST}comp/add`,
  //删除
  compDel: `${HOST}comp/del`,
  // 修改
  compUpd: `${HOST}comp/update`,
}
