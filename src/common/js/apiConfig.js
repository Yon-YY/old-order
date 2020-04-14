import {getDataApi} from "./api";

let url = '';
if (process.env.NODE_ENV === 'development') {
  url = 'http://192.168.9.42:8081';
  console.log('开发环境');
} else {
  console.log('生产环境');
}

// 获取登录OpenId
export function getOpenId(params) {
  const path = '/wecat/getWecatOpenId';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'GET', params);
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

// 订单详情
export function orderDetailsMsg(params) {
  const path = '/orderInfo/getOrderInfoDetail';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'POST', params);
}

// 配送地址
export function addressDefault(params) {
  const path = '/orderInfo/getSingleAddress';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'POST', params);
}

// 提交订单确认支付
export function submitOrder(params) {
  const path = '/orderInfo/submitOrderInfo';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'POST', params);
}
