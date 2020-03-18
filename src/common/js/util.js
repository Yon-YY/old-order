// 验证手机号
export const validatePhone = (value) => {
  if (value === '') {
    showToast('none', '手机号码不能为空', 1500);
    return;
  } else {
    if (value !== '') {
      const reg = /^1[3456789]\d{9}$/;
      if (!reg.test(value)) {
        showToast('none', '输入的手机号码无效', 1500);
        return;
      }
    }
  }
}

// 信息提示
export const showToast = (icon, title, time) => uni.showToast({
  icon: isEmpty(icon) ? 'none' : icon,
  title: isEmpty(title) ? '提示信息' : title,
  mask: true,
  duration: time
});

// 时间戳转日期
export function timeStampDate(timeStamp, type) {
  const time = new Date(timeStamp);
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const date = time.getDate();
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  switch (type) {
    case 1:
      return year + '-' + zeroize(month) + '-' + zeroize(date);
      break;
    case 2:
      return year + '/' + zeroize(month) + '/' + zeroize(date);
      break;
    case 3:
      return year + '年' + zeroize(month) + '月' + zeroize(date) + '日';
      break;
    default:
      return year + '-' + zeroize(month) + '-' + zeroize(date) + ' ' + zeroize(hours) + ':' + zeroize(minutes) + ':' + zeroize(seconds);
  }
}

// 商品列表滚动联动
/*
listH：右侧商品列表内容总高度
topHs：列表分类距离屏幕 scrollTop
currIndex：左侧菜单当前index
flag：标志位
*/
export function goodsBarIndex(e, listH, topHs) {
  const scrollTop = e.detail.scrollTop;
  const scorllArr = topHs;
  // console.log(scorllArr);
  if (scrollTop >= scorllArr[scorllArr.length - 1] - (listH / 2)) {
    return;
  } else {
    for (let i = 0; i < scorllArr.length; i++) {
      if (scrollTop >= 0 && scrollTop < scorllArr[0]) {
        if (0 != uni.getStorageSync('lastActive')) {
          uni.setStorageSync('currentMenuIndex', 0);
          uni.setStorageSync('lastActive', 0);
        }
      } else if (scrollTop >= scorllArr[i - 1] && scrollTop < scorllArr[i]) {
        if (i != uni.getStorageSync('lastActive')) {
          uni.setStorageSync('currentMenuIndex', i);
          uni.setStorageSync('lastActive', i);

          // console.log(i);
        }
      }
    }
  }
}

//判断字符是否为空的方法
const isEmpty = (obj) => {
  if (typeof obj == "undefined" || obj == null || obj == "") {
    return true;
  } else {
    return false;
  }
}

// 月份、日期、时间补零
function zeroize(date) {
  return date < 10 ? `0${date}` : date;
}




