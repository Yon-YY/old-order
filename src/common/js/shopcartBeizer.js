export function pierreBezier(points, times) {
  // 0、以3个控制点为例，点A,B,C,AB上设置点D,BC上设置点E,DE连线上设置点F,则最终的贝塞尔曲线是点F的坐标轨迹。
  // 1、计算相邻控制点间距。
  // 2、根据完成时间,计算每次执行时D在AB方向上移动的距离，E在BC方向上移动的距离。
  // 3、时间每递增100ms，则D,E在指定方向上发生位移, F在DE上的位移则可通过AD/AB = DF/DE得出。
  // 4、根据DE的正余弦值和DE的值计算出F的坐标。
  // 邻控制AB点间距

  /*
  Math.sqrt(x)
  x 必须是大于等于 0 的数
  返回参数 x 的平方根。
  如果 x 小于 0，则返回 NaN

  Math.pow(x,y)
  返回 x 的 y 次幂
  如果结果是虚数或负数，则该方法将返回 NaN。
  如果由于指数过大而引起浮点溢出，则该方法将返回 Infinity

  Math.atan(x)
  返回 x 的反正切值。
  返回的值是 -PI/2 到 PI/2 之间的弧度值
  */
  let bezier_points = [];
  let points_D = [];
  let points_E = [];
  const DIST_AB = Math.sqrt(Math.pow(points[1]['x'] - points[0]['x'], 2) + Math.pow(points[1]['y'] - points[0]['y'], 2));
  // 邻控制BC点间距
  const DIST_BC = Math.sqrt(Math.pow(points[2]['x'] - points[1]['x'], 2) + Math.pow(points[2]['y'] - points[1]['y'], 2));
  // D每次在AB方向上移动的距离
  const EACH_MOVE_AD = DIST_AB / times;
  // E每次在BC方向上移动的距离
  const EACH_MOVE_BE = DIST_BC / times;
  // 点AB的正切
  const TAN_AB = (points[1]['y'] - points[0]['y']) / (points[1]['x'] - points[0]['x']);
  // 点BC的正切
  const TAN_BC = (points[2]['y'] - points[1]['y']) / (points[2]['x'] - points[1]['x']);
  // 点AB的弧度值
  const RADIUS_AB = Math.atan(TAN_AB);
  // 点BC的弧度值
  const RADIUS_BC = Math.atan(TAN_BC);
  // 每次执行
  for (let i = 1; i <= times; i++) {
    // AD的距离
    let dist_AD = EACH_MOVE_AD * i;
    // BE的距离
    let dist_BE = EACH_MOVE_BE * i;
    // D点的坐标
    let point_D = {};
    point_D['x'] = dist_AD * Math.cos(RADIUS_AB) + points[0]['x'];
    point_D['y'] = dist_AD * Math.sin(RADIUS_AB) + points[0]['y'];
    points_D.push(point_D);
    // E点的坐标
    let point_E = {};
    point_E['x'] = dist_BE * Math.cos(RADIUS_BC) + points[1]['x'];
    point_E['y'] = dist_BE * Math.sin(RADIUS_BC) + points[1]['y'];
    points_E.push(point_E);
    // 此时线段DE的正切值
    let tan_DE = (point_E['y'] - point_D['y']) / (point_E['x'] - point_D['x']);
    // tan_DE的弧度值
    let radius_DE = Math.atan(tan_DE);
    // 地市DE的间距
    let dist_DE = Math.sqrt(Math.pow((point_E['x'] - point_D['x']), 2) + Math.pow((point_E['y'] - point_D['y']), 2));
    // 此时DF的距离
    let dist_DF = (dist_AD / DIST_AB) * dist_DE;
    // 此时DF点的坐标
    let point_F = {};
    point_F['x'] = dist_DF * Math.cos(radius_DE) + point_D['x'];
    point_F['y'] = dist_DF * Math.sin(radius_DE) + point_D['y'];
    bezier_points.push(point_F);
  }
  return {
    bezier_points
  };
}
