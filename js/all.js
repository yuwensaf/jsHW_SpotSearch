// 資料
let data = []; // 先建立一個「空的陣列」
let xhr = new XMLHttpRequest();
xhr.open('get','https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
xhr.send(null);

// 下拉式選單
let zoneList = []; // 先建立一個「空的陣列」
let zone = []; // 先建立一個「空的陣列」

xhr.onload = function(){
    let response = JSON.parse(xhr.responseText); // 把「回傳的字串」先轉為「物件」的格式
    let recordsAry = response.result.records; // 選取「records 陣列」

    for (let i=0; i<recordsAry.length; i++){
        data.push(recordsAry[i]); // 把「records 陣列」裡面的物件，一個一個 push 到「data 陣列」裡面
    }

    // 下拉式選單
    // 先篩選出「Zone 屬性的值」
    for (let i=0; i<data.length; i++){
        zoneList.push(data[i].Zone); // 只把「data 陣列中的 Zone 屬性的值」，push 到「zoneList 陣列」裡面
    }
    // 再篩選出「不重複的值」
    zoneList.forEach(check);

    // 初始化 init
    initInfo(); // 頁面一載入，就先進行 init
}

function check(currentValue){
    if(zone.indexOf(currentValue) === -1){
        zone.push(currentValue);
    }
}

// 

// 指定 dom
let row = document.querySelector('.info .row');
let select = document.getElementById('district');
let district = document.querySelector('.info-district');
let buttonWrap = document.querySelector('.button-wrap');
let goTopBtn = document.querySelector('.goTop');

// 初始化 init
function initInfo(){

    let title = '所有景點'; // 頁面標題

    // 景點資訊
    let dataLen = data.length; // 取得「陣列長度」
    let infoStr = ''; // 組「景點資訊」的字串

    for (let i = 0; i < dataLen; i++) {
        infoStr += `
            <div class="col-lg-6">
                <div class="info-box">
                    <div class="info-img" style="background-image: url(${data[i].Picture1})">
                        <div class="info-title">
                            <p class="attraction-name mr-auto">${data[i].Name}</p>
                            <p class="attraction-district">${data[i].Zone}</p>
                        </div>
                    </div>
                    <div class="info-text">
                        <div class="time text-layout">
                            <img src="img/icons_clock.svg" alt="time">
                            <p>${data[i].Opentime}</p>
                        </div>
                        <div class="location text-layout">
                            <img src="img/icons_pin.svg" alt="location">
                            <p>${data[i].Add}</p>
                        </div>
                        <div class="phone text-layout-2">
                            <div class="d-flex mr-auto">
                                <img src="img/icons_phone.svg" alt="phone">
                                <p>${data[i].Tel}</p>
                            </div>
                            <div class="free">
                                <img src="img/icons_tag.svg" alt="free">
                                <p>${data[i].Ticketinfo}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `

    }
    row.innerHTML = infoStr; // 插入「景點資訊」

    // 下拉式選單的項目
    let zoneLen = zone.length; // 取得「陣列長度」
    let zoneStr = '<option>-- 請選擇行政區 --</option>'; // 組「下拉選單項目」的字串
    for(let i=0; i<zoneLen; i++){
        zoneStr += `
            <option value="${zone[i]}">${zone[i]}</option>
        `
    }
    select.innerHTML = zoneStr; // 插入「下拉選單的項目」

    district.innerHTML = title; // 插入「頁面標題」
}


// user 從「下拉式選單」選擇
// 綁定監聽事件
select.addEventListener('change', showInfo, false); // 當 user 切換「下拉式選單的選項」時，就會執行「showInfo 函式」

function showInfo(e){
    let currentValue = e.target.value; // 取得「user 當下選擇的」value 值
    let dataLen = data.length; // 取得「陣列長度」
    let infoStr = ''; // 組「景點資訊」的字串
    let title = ''; // 頁面標題

    for (let i = 0; i < dataLen; i++){
        if (currentValue === data[i].Zone){
            title = data[i].Zone; // 頁面標題

            infoStr += `
            <div class="col-lg-6">
                <div class="info-box">
                    <div class="info-img" style="background-image: url(${data[i].Picture1})">
                        <div class="info-title">
                            <p class="attraction-name mr-auto">${data[i].Name}</p>
                            <p class="attraction-district">${data[i].Zone}</p>
                        </div>
                    </div>
                    <div class="info-text">
                        <div class="time text-layout">
                            <img src="img/icons_clock.svg" alt="time">
                            <p>${data[i].Opentime}</p>
                        </div>
                        <div class="location text-layout">
                            <img src="img/icons_pin.svg" alt="location">
                            <p>${data[i].Add}</p>
                        </div>
                        <div class="phone text-layout-2">
                            <div class="d-flex mr-auto">
                                <img src="img/icons_phone.svg" alt="phone">
                                <p>${data[i].Tel}</p>
                            </div>
                            <div class="free">
                                <img src="img/icons_tag.svg" alt="free">
                                <p>${data[i].Ticketinfo}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `            
        }                
    }
    select.value = title; // 把「select」改成跟「頁面標題」一致
    district.innerHTML = title; // 插入「頁面標題」
    row.innerHTML = infoStr; // 插入「景點資訊」
}

// user 從「熱門行政區」選擇
// 綁定監聽事件
buttonWrap.addEventListener('click', btnShowInfo, false); // 監聽「外層的 div」，來偵測裡面的「每一個 button」

function btnShowInfo(e){
    let currentButton = e.target.nodeName; // 撈出「現在點擊的是什麼元素」
    if (currentButton === 'BUTTON'){
        showInfo(e); // 注意！這裡的小括號內，要帶入「參數 e」             
    }
}

// 顯示「goTop 按鈕」
window.addEventListener('scroll', showGoTop, false); 

function showGoTop(){
    let scrollPos = window.scrollY; // 取得「捲軸滾動的高度」
    let innerHeight = window.innerHeight; // 取得「瀏覽器內部的高度」

    if(scrollPos > innerHeight){
        goTopBtn.style.display = 'block';
    }else{
        goTopBtn.style.display = 'none';
    }
}

// go to top
goTopBtn.addEventListener('click', goTop, false);

function goTop(e){
    e.preventDefault(); // 要記得加上！！    
    window.scrollTo(0, 0);
}

