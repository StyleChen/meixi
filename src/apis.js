const apis = {
  uploadImage: 'http://upload.dreamhiway.com/uploadimg',
  Login: '/Sys/Logoff/Sys', // 登录
  VerifyCode: '/Sys/Logoff/VerifyCode', // 验证码
  Menu: '/Sys/Menu/List', // 用户菜单列表
  DepartList: '/Sys/User/DepartList', // 部门列表
  UserList: '/Sys/User/UserList', // 成员列表
  UserCancel: '/Sys/User/UserCancel', // 用户注销
  UserAuth: '/Sys/Menu/UserAuth', // 用户菜单授权
  ResetPwd: '/Sys/User/ResetPwd', // 重置密码
  DepartAdd: '/Sys/User/DepartAdd', // 新建部门
  UserAdd: '/Sys/User/UserAdd', // 添加成员
  MessageAdd: '/Sys/Message/Add', // 系统消息发布
  LogList: '/Sys/Log/List', // 操作日志
  FeedbackList: '/Sys/Feedback/List', // 用户反馈日志
  UserInfo: '/Sys/User/UserInfo', // 用户个人信息
  UserEdit: '/Sys/User/UserEdit', // 用户个人信息编辑
  ChangePwd: '/Sys/User/ChangePwd', // 用户修改密码
  AdvertsUpload: '/Sys/Adverts/Upload', // 广告上传
  AdvertsList: '/Sys/Adverts/List', // 广告列表
  NoticesList: '/Sys/Notices/List', // 公告列表
  NoticesDel: '/Sys/Notices/Del', // 公告删除
  NoticesAdd: '/Sys/Notices/Add', // 公告发布
  NoticesEdit: '/Sys/Notices/Edit', // 公告编辑
  CashList: '/Sys/Cash/List', // 账单管理 提现列表
  CashComfirm: '/sys/Cash/Comfirm', // 账单管理 提现处理
  CountUserDay: '/p/Count/UserDay', // 统计分析 每日用户
  CountPayList: '/p/Count/PayList', // 统计分析 充值列表
  CountUserWeek: '/p/Count/UserWeek', // 统计分析 每周用户
};

if (process.env.NODE_ENV === 'development') {
  Object.keys(apis).forEach((key) => {
    if (key.includes('upload')) {
      apis[key] = apis[key].replace(/.*\//, 'http://192.168.2.22:8050/');
    } else {
      apis[key] = `/api${apis[key]}`;
    }
  });
}

export default apis;
