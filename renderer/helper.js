exports.$ = (selectors) => {
  return window.document.querySelector(selectors);
};

exports.convertDuration1 = (time) => {
  // 计算分钟 单数返回 ‘01’，多位数 ‘010’
  const minutes = '0' + Math.floor(time / 60);
  // 计算秒数 单数返回 ‘02’，多位数返回 ‘020’
  const seconds = '0' + Math.floor(time - minutes * 60);
  return minutes.substr(-2) + ':' + seconds.substr(-2);
};

exports.convertDuration = (time) => {
  const m = '0' + Math.floor(time / 60);
  const s = '0' + Math.floor(time - m * 60);
  return m.substr(-2) + ':' + s.substr(-2);
};
