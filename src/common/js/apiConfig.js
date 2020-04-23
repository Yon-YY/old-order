import {getDataApi} from "./api";

let url = '';
let userIdUrl = '';
if (process.env.NODE_ENV === 'development') {
  url = 'http://192.168.9.42:8081';
  userIdUrl = 'http://192.168.9.42:8082';
  console.log('开发环境');
} else {
  url = 'orderuser.kangdoctor.cn';
  console.log('生产环境');
}

// 获取登录OpenId
export function getOpenId(params) {
  const path = '/wecat/getWecatOpenId';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'GET', params);
}

// 获取登录userId
export function getUserId(params) {
  const path = '/login/getWxUserId';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(userIdUrl, path, 'POST', params);
}

// 早中晚
export function timeSlot(params) {
  const path = '/dishClass/queryDishClasses';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'POST', params);
}

// 左侧菜单列表
export function menuList(params) {
  const path = '/dishClass/queryDishClassesByDishClassId';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'POST', params);
}

// 套餐
export function dishMeal(params) {
  const path = '/businessModel/getBusinessModel';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'POST', params);
}

// 右侧菜品列表
export function foodsList(params) {
  const path = '/dish/queryDishes';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'POST', params);
}

// 订单列表
export function orderList(params) {
  const path = '/orderInfo/queryStatusOrders';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'POST', params);
}

// 提交退款申请
export function orderRefund(params) {
  const path = '/orderInfo/applyRefund';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'POST', params);
}

// 订单详情
export function orderDetailsRefund(params) {
  const path = '/orderInfo/getOrderInfoDetail';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'POST', params);
}

// 用户取消订单
export function cancelOrder(params) {
  const path = '/orderInfo/cancelOrder';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'POST', params);
}

// 退款原因下拉框
export function refundExplain(params) {
  const path = '/refundReason/queryRefundReasons';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'POST', params);
}

// 配送地址
export function addressDefault(params) {
  const path = '/orderInfo/getSingleAddress';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'POST', params);
}

// 订单中菜品备注
export function getRemark(params) {
  const path = '/businessModel/getRemarkLable';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'GET', params);
}

// 提交订单确认支付
export function submitOrder(params) {
  const path = '/orderInfo/submitOrderInfo';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'POST', params);
}

// 订单提交后支付状态
export function orderStatus(params) {
  const path = '/orderInfo/getOrderPayStatus';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'POST', params);
}

