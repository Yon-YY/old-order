// 域名、接口、请求类型、请求参数、请求头、参数是否加密(可传对象或方法)
export function getDataApi(apiUrl, apiPath, method ='GET', params = null, headers, encryp = null) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${apiUrl}${apiPath}`,
      method: method,
      data: params,
      header: {
        'content-type': 'application/json;charset=UTF-8' || headers,
        encryp
      },
      success: resolve,
      fail: reject
    });
  });
}
