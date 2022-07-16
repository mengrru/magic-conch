window.onload = function() {
  startTime();
  setBtnEvent();
}
function setBtnEvent() {
  document.getElementById('clock_btn').setAttribute('onclick', 'clock()');
  document.getElementById('show_time').setAttribute('onclick', 'showTime()');
  document.getElementById('undo').setAttribute('onclick', 'undo()');
  document.getElementById('back').setAttribute('onclick', "back('clock_box', 'chart_box')");
}
function clock() {
  if(storeData()) {
    var clockBox = document.getElementById('clock_box'),
      goodNightBox = document.getElementById('good_night_box');
    giveGreeting();
    clockBox.style.display = 'none';
    goodNightBox.style.display = 'block';
  } else {
    alert('该换浏览器了少年');
  }
}
function showTime() {
  var chartBox = document.getElementById('chart_box'),
    clockBox = document.getElementById('clock_box');
  createTimeList();
  clockBox.style.display = 'none';
  chartBox.style.display = 'block';
}
function undo() {
  if(window.localStorage.sleepTime) {
    var a = window.localStorage.sleepTime.indexOf('],', window.localStorage.sleepTime.length-40);
    if(a < 30 && window.localStorage.sleepTime.length <30) {
      window.localStorage.sleepTime = '';
    } else {
      window.localStorage.sleepTime = window.localStorage.sleepTime.substring(0, a+2);
    }
    back('clock_box', 'good_night_box');
  }
}
function back(show, hide) {
  var show = document.getElementById(show),
    hide = document.getElementById(hide);
  show.style.display = 'block';
  hide.style.display = 'none';
}
function giveGreeting() {
  var wordsList = [
    '晚安。',
    '哦呀粟喵',
    'ぉやすみ',
    '明天也要努力地拯救地球哟',
    '好梦:)',
    'Good night',
  ];
  var goodNight = document.getElementById('good_night');
  goodNight.innerHTML = wordsList[Math.floor(Math.random()*wordsList.length)];
}
function storeData(){
  if(window.localStorage){
    var today = new Date();
    var y =  today.getFullYear(),
      mo = today.getMonth(),
      d = today.getDate(),
      day = today.getDay(),
      h=today.getHours(),
      m=today.getMinutes();

    m=checkTime(m);
    if(window.localStorage.sleepTime) {
      window.localStorage.sleepTime += '[\''+y+ '.' +(mo+1)+ '.' +d+ '\',\'' +day+ '\',\'' +h+ ':' +m+ '\'],';
      return true;
    } else {
      window.localStorage.sleepTime = '';
      window.localStorage.sleepTime += '[\''+y+ '.' +(mo+1)+ '.' +d+ '\',\'' +day+ '\',\'' +h+ ':' +m+ '\'],';
      return true;
    }
  } else {
    return false;
  }
}
function createTimeList() {
  var timeList = document.getElementById('time_list');
  timeList.innerHTML = '';
  if(window.localStorage.sleepTime && window.localStorage.showTime != '') {
    var ymd, day, hm;
    eval('var sleepTime = ['+window.localStorage.sleepTime+']');
    for(var i=sleepTime.length-1; i>sleepTime.length-8; i--) {

      if(sleepTime[i] != undefined) {

        ymd = sleepTime[i][0];
        hm = sleepTime[i][2];

        switch(sleepTime[i][1]) {
          case '0' :
            day = '星期日';
            break;
          case '1' :
            day = '星期一';
            break;
          case '2' :
            day = '星期二';
            break;
          case '3' :
            day = '星期三';
            break;
          case '4' :
            day = '星期四';
            break;
          case '5' :
            day = '星期五';
            break;
          case '6' :
            day = '星期六';
            break;
        } 
        timeList.innerHTML += '<p>' + ymd + ' ' + day + ' ' + hm + '</p>';
      } else {
        break;
      }
    }
  } else {
    timeList.innerHTML = '<p>暂无躺倒记录_(:з」∠)_</p>'
  }
}
function startTime() {
  var today=new Date();
  var h=today.getHours();
  var m=today.getMinutes();
  var s=today.getSeconds();

  m=checkTime(m);
  s=checkTime(s);
  document.getElementById('time').innerHTML=h+":"+m+":"+s;
  t=setTimeout('startTime()',500);
}
function checkTime(i) {
  if (i<10) {
    i="0" + i;
  }
  return i
}
