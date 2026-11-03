let idleSprite; // 儲存待機動畫的精靈圖。
let walkSprite; // 儲存行走動畫的精靈圖。
let characterX; // 儲存角色在畫布上的水平位置。
let facingDirection = 1; // 記錄角色朝向，1 為右、-1 為左。
const spriteScale = 2; // 設定角色顯示大小的縮放倍率。
const moveSpeed = 4; // 設定角色每幀移動的像素數。
const animationFrameDuration = 120; // 設定每張動畫影格顯示的毫秒數。
const idleFrameBounds = [[0, 84], [89, 173], [178, 262], [267, 351]]; // 設定待機圖每格實際影像的左右邊界。
const walkFrameBounds = [[0, 78], [83, 178], [183, 273], [278, 366], [371, 464]]; // 設定行走圖每格實際影像的左右邊界。

function preload() { // 在畫布開始繪製前載入動畫圖檔。
  idleSprite = loadImage('1/stop/stop.png'); // 載入由 4 格組成的待機精靈圖。
  walkSprite = loadImage('1/walk/walk.png'); // 載入由 5 格組成的行走精靈圖。
} // 結束圖檔載入函式。

function setup() { // 設定全螢幕畫布與角色初始位置。
  createCanvas(windowWidth, windowHeight); // 建立符合瀏覽器視窗大小的畫布。
  characterX = width / 2; // 將角色初始位置設在畫面水平中央。
  imageMode(CORNER); // 使用影格左上角作為繪圖座標。
} // 結束畫布設定函式。

function draw() { // 每一幀更新角色狀態並繪製畫面。
  background('#bde0fe'); // 使用指定的淺藍色清除畫布背景。

  const movement = Number(keyIsDown(RIGHT_ARROW)) - Number(keyIsDown(LEFT_ARROW)); // 依方向鍵狀態計算移動方向。
  const isWalking = movement !== 0; // 判斷角色目前是否正在移動。
  const animation = isWalking ? walkSprite : idleSprite; // 移動時使用行走圖，否則使用待機圖。
  const frameBounds = isWalking ? walkFrameBounds : idleFrameBounds; // 取得目前動畫每格的實際裁切邊界。
  const frameCountForAnimation = frameBounds.length; // 設定目前動畫的影格總數。
  const frameIndex = floor(millis() / animationFrameDuration) % frameCountForAnimation; // 循環選取目前要顯示的影格。
  const frameStartX = frameBounds[frameIndex][0]; // 取得目前影格在精靈圖中的水平起點。
  const frameWidth = frameBounds[frameIndex][1] - frameStartX; // 依實際邊界計算目前影格寬度。
  const frameHeight = animation.height; // 取得單格影格的高度。
  const spriteWidth = frameWidth * spriteScale; // 計算角色繪製後的寬度。
  const spriteHeight = frameHeight * spriteScale; // 計算角色繪製後的高度。

  if (isWalking) { // 只有在移動時更新角色朝向與位置。
    facingDirection = movement; // 依移動方向設定角色面朝左或右。
    characterX += movement * moveSpeed; // 讓角色依方向鍵往左或往右移動。
  } // 結束移動狀態判斷。

  const halfSpriteWidth = spriteWidth / 2; // 計算角色寬度的一半以限制移動範圍。
  const leftLimit = min(halfSpriteWidth, width / 2); // 設定角色在狹窄畫面中的最左側安全位置。
  const rightLimit = max(width - halfSpriteWidth, width / 2); // 設定角色在狹窄畫面中的最右側安全位置。
  characterX = constrain(characterX, leftLimit, rightLimit); // 限制角色位置，避免角色移出畫面。

  push(); // 暫存畫布座標狀態，避免影響其他繪圖。
  translate(characterX, height / 2); // 將座標原點移至角色所在的畫面中央位置。
  scale(facingDirection, 1); // 朝左時水平翻轉角色，朝右時維持原方向。
  image( // 繪製目前動畫影格並依角色大小縮放。
    animation, // 指定要繪製的待機或行走精靈圖。
    -spriteWidth / 2, // 設定影格左上角的水平位置，讓角色以中心對齊。
    -spriteHeight / 2, // 設定影格左上角的垂直位置，讓角色以中心對齊。
    spriteWidth, // 設定影格繪製後的寬度。
    spriteHeight, // 設定影格繪製後的高度。
    frameStartX, // 指定精靈圖中目前影格的實際水平起點。
    0, // 指定精靈圖中目前影格的垂直起點。
    frameWidth, // 指定從精靈圖擷取的影格寬度。
    frameHeight // 指定從精靈圖擷取的影格高度。
  ); // 結束目前影格的繪製。
  pop(); // 還原畫布座標狀態。
} // 結束每幀繪製函式。

function keyPressed() { // 接收鍵盤按下事件並控制頁面預設行為。
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) { // 檢查使用者是否按下左右方向鍵。
    return false; // 阻止方向鍵造成頁面捲動。
  } // 結束方向鍵判斷。
} // 結束鍵盤事件函式。

function windowResized() { // 在瀏覽器視窗大小變更時調整畫布。
  resizeCanvas(windowWidth, windowHeight); // 將畫布調整為最新的視窗大小。
} // 結束視窗尺寸變更函式。
