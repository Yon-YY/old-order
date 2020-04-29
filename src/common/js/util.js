// 验证手机号
export const validatePhone = value => {
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

/*
* 防抖
* 效果：短时间内大量触发同一事件，只会执行一次函数
* fn [function] 需要防抖的函数
* delay [number] 毫秒，防抖期限值
*/
export function debounce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer); // 当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
    }
    timer = setTimeout(fn, delay); //当前并没有在计时，那么就开始一个计时
  }
}

/*
* 节流
* 效果：短时间内大量触发同一事件，在函数执行一次之后，该函数在指定的时间期限内不再工作，直至过了这段时间才重新生效
*/
export function throttle(fn, delay) {
  let valid = true;
  return function () {
    if (!valid) {
      return false;
    }
    // 执行函数并且在间隔期内把状态位设为无效
    valid = false
    setTimeout(() => {
      fn();
      valid = true;
    }, delay);
  }
}

// 授权过期提示
export function overdueRemind() {
  uni.showModal({
    title: '温馨提示',
    content: '用户尚未登录或登录已过期，是否重新登录',
    cancelText: '否',
    confirmText: '是',
    success: function (res) {
      if (res.confirm) {
        uni.setStorageSync('isCanUser', true); // 设置登录状态
        uni.reLaunch({
          url: '../../pages/login/login',
          animationType: 'none'
        });
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    }
  });
}

// 信息提示
export const showToast = (icon, title, time) => uni.showToast({
  icon: isEmpty(icon) ? 'none' : icon,
  title: isEmpty(title) ? '提示信息' : title,
  mask: true,
  duration: time
});

// 接口出错提示
export function errState(text = '服务崩溃啦~') {
  uni.showLoading({
    title: text,
    mask: true
  });
}

// 去掉字符串前后空格
export function strTrim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

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

// 时间戳转分
function a() {
  seconds = (time % (1000 * 60)) / 1000;
}

// 月份、日期、时间补零
export function zeroize(date) {
  return date < 10 ? `0${date}` : date;
}

//判断字符是否为空的方法
const isEmpty = (obj) => {
  if (typeof obj == "undefined" || obj == null || obj == "") {
    return true;
  } else {
    return false;
  }
}




