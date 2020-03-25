import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loadingState: false,  // loading组件
    loadingLocal: false, // 局部loading组件
    searchBoxShow: true, // 搜索结果列表外框
    searchListAn: false, // 搜索结果列表动画
    merchantIdStr: '', // 商家 id
    timeSlot: 1, // 早餐：1、中餐：2、晚餐：3（默认早餐：1)
    dishIndex: [], // 套餐index
    timeSlotActive: 0, // 选中餐点状态样式
    cartGoodsMorning: [],  // 购物车早餐的菜品
    cartGoodsNoon: [],  // 购物车中餐的菜品
    cartGoodsNight: [],  // 购物车晚餐的菜品
    foodsData: [], // 菜品列表数据
    formatWrapState: true, // 套餐规格弹层状态
    formatState: false, // 套餐规格动画状态
    cartShow: true, // 是否显示购物车(true 默认隐藏)
    cartAn: false, // 购物车动画
    shopcartListState: true, // 购物车中的菜品列表状态
    shopcartShow: true, // 购物车中菜品列表动画状态
    formatListDetails: [] // 菜品套餐列表详情
  },
  mutations: {
    SET_LOADING_STATE(state, loadingState) {
      state.loadingState = loadingState;
    },
    SET_LOADING_LOCAL(state, loadingLocal) {
      state.loadingLocal = loadingLocal;
    },
    SET_SEARCH_BOX_SHOW(state, searchBoxShow) {
      state.searchBoxShow = searchBoxShow;
    },
    SET_SEARCH_LIST_AN(state, searchListAn) {
      state.searchListAn = searchListAn;
    },
    SET_MERCHANT_ID(state, merchantIdStr) {
      state.merchantIdStr = merchantIdStr;
    },
    SET_TIME_SLOT(state, timeSlot) {
      state.timeSlot = timeSlot;
    },
    SET_DISH_INDEX(state, dishIndex) {
      state.dishIndex = dishIndex;
    },
    SET_TIME_SLOT_ACTIVE(state, timeSlotActive) {
      state.timeSlotActive = timeSlotActive;
    },
    SET_CART_GOODS_MORNING(state, cartGoodsMorning) {
      state.cartGoodsMorning = cartGoodsMorning;
    },
    SET_CART_GOODS_NOON(state, cartGoodsNoon) {
      state.cartGoodsNoon = cartGoodsNoon;
    },
    SET_CART_GOODS_NIGHT(state, cartGoodsNight) {
      state.cartGoodsNight = cartGoodsNight;
    },
    ADD_GOOD(state, {dishId, dishName, price, img, dishMode, goodsFormat = []}) {
      // console.log('vuex', state.timeSlot);
      switch (state.timeSlot) {
        case 1:
          state.timeSlotActive = 0;
          let isHasMorning = state.cartGoodsMorning.some(food => {
            if (food.dishId === dishId) {
              food.goodsNum++;
              return true;
            } else {
              return false;
            }
          });
          if (!isHasMorning) {
            state.cartGoodsMorning.push({
              dishId,
              dishName,
              price,
              img,
              dishMode,
              goodsFormat,
              goodsNum: 1,
              timeOfDay: 1
            });
          }
          break;
        case 2:
          state.timeSlotActive = 1;
          let isHasNoon = state.cartGoodsNoon.some(food => {
            if (food.dishId === dishId) {
              food.goodsNum++;
              return true;
            } else {
              return false;
            }
          });
          if (!isHasNoon) {
            state.cartGoodsNoon.push({
              dishId,
              dishName,
              price,
              img,
              dishMode,
              goodsFormat,
              goodsNum: 1,
              timeOfDay: 2
            });
          }
          break;
        case 3:
          state.timeSlotActive = 2;
          let isHasNight = state.cartGoodsNight.some(food => {
            if (food.dishId === dishId) {
              food.goodsNum++;
              return true;
            } else {
              return false;
            }
          });
          if (!isHasNight) {
            state.cartGoodsNight.push({
              dishId,
              dishName,
              price,
              img,
              dishMode,
              goodsFormat,
              goodsNum: 1,
              timeOfDay: 3
            });
          }
          break;
      }
    },
    REDUCE_GOOD(state, dishId) {
      switch (state.timeSlot) {
        case 1:
          state.timeSlotActive = 0;
          state.cartGoodsMorning.forEach((food, index) => {
            if (food.dishId === dishId) {
              food.goodsNum--;
              if (food.goodsNum === 0) {
                // 定时器作用：为减按钮留出动画时间
                setTimeout(() => {
                  state.cartGoodsMorning.splice(index, 1);
                  return;
                }, 510);
              }
            }
          });
          break;
        case 2:
          state.timeSlotActive = 1;
          state.cartGoodsNoon.forEach((food, index) => {
            if (food.dishId === dishId) {
              food.goodsNum--;
              if (food.goodsNum === 0) {
                // 定时器作用：为减按钮留出动画时间
                setTimeout(() => {
                  state.cartGoodsNoon.splice(index, 1);
                  return;
                }, 510);
              }
            }
          });
          break;
        case 3:
          state.timeSlotActive = 2;
          state.cartGoodsNight.forEach((food, index) => {
            if (food.dishId === dishId) {
              food.goodsNum--;
              if (food.goodsNum === 0) {
                // 定时器作用：为减按钮留出动画时间
                setTimeout(() => {
                  state.cartGoodsNight.splice(index, 1);
                  return;
                }, 510);
              }
            }
          });
          break;
      }
    },
    SET_FORMAT_WRAP_STATE(state, formatWrapState) {
      state.formatWrapState = formatWrapState;
    },
    SET_FORMAT_STATE(state, formatState) {
      state.formatState = formatState;
    },
    SET_CART_SHOW(state, cartShow) {
      state.cartShow = cartShow;
    },
    SET_CART_AN(state, cartAn) {
      state.cartAn = cartAn;
    },
    SET_SHOPCART_LIST_STATE(state, shopcartListState) {
      state.shopcartListState = shopcartListState;
    },
    SET_SHOPCART_SHOW(state, shopcartShow) {
      state.shopcartShow = shopcartShow;
    },
    SET_FORMAT_LIST(state, formatListDetails) {
      state.formatListDetails = formatListDetails;
    }
  },
  getters: {
    getLoadingState: state => state.loadingState,
    getLoadingLocal: state => state.loadingLocal,
    getSearchBoxShow: state => state.searchBoxShow,
    getSearchListAn: state => state.searchListAn,
    getMerchantIdStr: state => state.merchantIdStr,
    getTimeSlot: state => state.timeSlot,
    getDishIndex: state => state.dishIndex,
    getTimeSlotActive: state => state.timeSlotActive,
    getCartGoodsMorning: state => state.cartGoodsMorning,
    getCartGoodsNoon: state => state.cartGoodsNoon,
    getCartGoodsNight: state => state.cartGoodsNight,
    amount(state) {
      let amount = 0;
      state.cartGoodsMorning.forEach(good => {
        amount += good.cartGoodsMorning * good.count
      });
      return amount;
    },
    getFormatWrapState: state => state.formatWrapState,
    getFormatState: state => state.formatState,
    getCartShow: state => state.cartShow,
    getCartAn: state => state.cartAn,
    getShopcartListState: state => state.shopcartListState,
    getShopcartShow: state => state.shopcartShow,
    getFormatListDetails: state => state.formatListDetails
  },
  actions: {
    setLoadingState({commit}, loadingState) {
      commit('SET_LOADING_STATE', loadingState);
    },
    setLoadingLocal({commit}, loadingLocal) {
      commit('SET_LOADING_LOCAL', loadingLocal);
    },
    setSearchBoxShow({commit}, searchBoxShow) {
      commit('SET_SEARCH_BOX_SHOW', searchBoxShow);
    },
    setSearchListAn({commit}, searchListAn) {
      commit('SET_SEARCH_LIST_AN', searchListAn);
    },
    setMerchantIdStr({commit}, merchantIdStr) {
      commit('SET_MERCHANT_ID', merchantIdStr);
    },
    setTimeSlot({commit}, timeSlot) {
      commit('SET_TIME_SLOT', timeSlot);
    },
    setDishIndex({commit}, dishIndex) {
      commit('SET_DISH_INDEX', dishIndex);
    },
    setTimeSlotActive({commit}, timeSlotActive) {
      commit('SET_TIME_SLOT_ACTIVE', timeSlotActive);
    },
    setCartGoodsMorning({commit}, cartGoodsMorning) {
      commit('SET_CART_GOODS_MORNING', cartGoodsMorning);
    },
    setCartGoodsNoon({commit}, cartGoodsNoon) {
      commit('SET_CART_GOODS_NOON', cartGoodsNoon);
    },
    setCartGoodsNight({commit}, cartGoodsNight) {
      commit('SET_CART_GOODS_NIGHT', cartGoodsNight);
    },
    addGood({commit}, good) {
      commit('ADD_GOOD', good);
    },
    reduceGood({commit}, dishId) {
      commit('REDUCE_GOOD', dishId);
    },
    setFormatWrapState({commit}, formatWrapState) {
      commit('SET_FORMAT_WRAP_STATE', formatWrapState);
    },
    setFormatState({commit}, formatState) {
      commit('SET_FORMAT_STATE', formatState);
    },
    setCartShow({commit}, cartShow) {
      commit('SET_CART_SHOW', cartShow);
    },
    setCartAn({commit}, cartAn) {
      commit('SET_CART_AN', cartAn);
    },
    setShopcartListState({commit}, shopcartListState) {
      commit('SET_SHOPCART_LIST_STATE', shopcartListState);
    },
    setShopcartShow({commit}, shopcartShow) {
      commit('SET_SHOPCART_SHOW', shopcartShow);
    },
    setFormatListDetails({commit}, formatListDetails) {
      commit('SET_FORMAT_LIST', formatListDetails);
    }
  }
});
