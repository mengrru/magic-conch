const outputCanvas = document.getElementById('palette');
const testImgUrls = ['test2.png', 'test3.png', 'test4.png', 'test5.jpg', 'test6.jpg', 'test7.jpg', 'test8.jpg'];

const imgListDOM = document.getElementById('img-list');

for (url of testImgUrls) {
  imgListDOM.innerHTML += `<li><a href="./${url}" onclick="return false">${url}</a></li>`;
}

imgListDOM.addEventListener('click', function(e) {
  if (e.target.nodeName.toLowerCase() === 'a') {
    const imgUri = e.target.getAttribute('href');
    loadImg(imgUri)
      .then((imgObj) => {
        const colors = extract(getPixel(imgObj), 10, 4);
        draw(colors, outputCanvas);
      }).catch((err) => {
        console.log(err.stack);
      });
  }
})

/*
 * @param {String} uri 图片地址
 * @return {Promise}
 */
function loadImg(uri) {
  const img = new Image();
    img.src = uri;

  return new Promise(function(resolve, reject) {
    img.onload = function() {
      const imgDiv = document.getElementById('img')
      imgDiv.innerHTML = '';
      imgDiv.appendChild(img);
      resolve(img);
    }
    img.onerror = function() {
      reject(new Error('图片加载失败'));
    }
  });
}

/*
 * @param {Image} imgObj 图片对象
 * @return {Array}
 */
function getPixel(imgObj) {
  const canvasObj = document.createElement('canvas');
    canvasObj.width = imgObj.width;
    canvasObj.height = imgObj.height;

  const canvasCtx = canvasObj.getContext('2d');
    canvasCtx.drawImage(imgObj, 0, 0, imgObj.width, imgObj.height);

  return canvasCtx.getImageData(0, 0, imgObj.width, imgObj.height);
}
/*
 * @param {HTMLCanvasElement} outputCanvas
 */
function draw(colors, outputCanvas) {
  outputCanvas.width = 500;
  outputCanvas.height = 300;
  const unitWidth = 25;
  const unitHeight = 25;
  let originHeight = 0;
  const ctx = outputCanvas.getContext('2d');
  for (let i = 0; i < colors.length; i++) {
    let c = colors[i];
    let originWidth = unitWidth * (i % (outputCanvas.width / unitWidth));
    ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
    if (originHeight / unitHeight < Math.floor((i / (outputCanvas.width / unitWidth)))) {
      originHeight += unitHeight;
    }
    ctx.fillRect(originWidth, originHeight, unitWidth, unitHeight);
  }
}
