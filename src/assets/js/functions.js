String.prototype.capitalizeEachWord = function () {
  let arr = this.split(" ");
  arr.forEach((c, i) => {
    arr[i] = c.replace(/^./, c.charAt(0).toUpperCase());
  });
  return arr.join(" ");
};

String.prototype.removeExtraSpaces = function () {
  var str = this.trim();
  var res = "";
  var lastC;
  for (let i in str) {
    if (isNaN(i)) break;
    if (lastC == str[i] && str[i] == " ") continue;
    else res += str[i];
    lastC = str[i];
  }
  return res;
};
