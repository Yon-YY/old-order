import {getDataApi} from "./api";

const url = 'http://192.168.9.24:8081';
// 食堂菜单
export function canteenTab(params) {
  const path = '/api/u/merchantInfo/selectMerchantByHospitalId';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'GET', params);
}

// 搜索结果
export function searchResultList(params) {
  const path = '/api/u/goods/userSearchGoodsList';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'POST', params);
}

// 商品分类列表
export function goodsList(params) {
  const path = '/api/u/goods/selectGoodsInfo';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'POST', params);
}

// 订单列表
export function orderList(params) {
  const path = '/api/u/goodsOrder/selectGoodsOrderInfo';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'POST', params);
}

// 订单详情
export function orderDetailsMsg(params) {
  const path = '/api/u/goodsOrder/selectGoodsOrderDetail';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'GET', params);
}

// 配送地址
export function addressDefault(params) {
  const path = '/api/u/goodsOrder/selectGoodsOrderAddress';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'GET', params);
}

// 提交订单确认支付
export function submitOrder(params) {
  const path = '/api/u/goodsOrder/submitGoodsOrderInfo';// 域名、接口、请求类型(默认get请求)、请求参数(默认可为空)、设置请求头、参数是否加密(可传对象或方法)
  return getDataApi(url, path, 'POST', params);
}
