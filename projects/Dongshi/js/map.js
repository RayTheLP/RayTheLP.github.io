// 互動地圖 - Leaflet 版本
(function(){
  const mapEl = document.getElementById('interactiveMap');
  const spots = getSpotsData();
  window.spots = spots;

  if (!mapEl || !window.L) return;

  // 東石周邊中心點
  const center = [23.4599, 120.1453];
  
  // 設定東石區域邊界（限制地圖範圍）
  const bounds = L.latLngBounds(
    [23.35, 120.05],  // 西南角
    [23.55, 120.25]   // 東北角
  );

  const map = L.map('interactiveMap', {
    center: center,
    zoom: 12,
    minZoom: 11,
    maxZoom: 17,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0  // 完全限制在邊界內
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // 景點/美食資料（不含圖片/難度/季節）
  // 座標來源：能在 OSM 查到者直接填入；查不到者先設為 null，避免亂標點。
  // region 對應頁面按鈕：north=景點、east=美食、south=廟宇、stay=住宿
  function getSpotsData() {
    return [
    // --- 景點 ---
    { id: 1, name: '東石漁港', lat: 23.4507319, lng: 120.1377473, region: 'north', type: '漁港', desc: '港邊散步看船景，感受東石海港日常。' },
    { id: 2, name: '東石漁人碼頭', lat: 23.4510879, lng: 120.1352919, region: 'north', type: '觀光碼頭', desc: '海風步道與拍照點，適合悠閒走走看海景。' },
    { id: 3, name: '東石大橋', lat: 23.4589172, lng: 120.1777429, region: 'north', type: '橋樑', desc: '東石地標景觀橋，路過可順拍海岸視野。' },
    { id: 4, name: '東石水中古厝', lat: 23.476063949764335, lng: 120.1695420136088, region: 'north', type: '歷史建築', desc: '特殊地景與老屋意象，是東石很有記憶點的景色。' },
    { id: 5, name: '鰲鼓濕地森林園區', lat: 23.508129757534064, lng: 120.14779444600848, region: 'north', type: '濕地生態', desc: '濕地與林帶交織的自然區域，適合散步與生態觀察。' },
    { id: 6, name: '鰲鼓濕地生態展示館', lat: 23.5087395, lng: 120.1605968, region: 'north', type: '生態教育', desc: '了解濕地與鳥類生態的展示空間，適合親子停留。' },
    { id: 7, name: '紅樹林生態公園', lat: 23.459883246366605, lng: 120.17662377428937, region: 'north', type: '生態公園', desc: '紅樹林景觀帶，適合散步賞景、觀察潮間帶生態。' },
    { id: 8, name: '向禾休閒漁場', lat: 23.5078220, lng: 120.1496700, region: 'north', type: '休閒農漁', desc: '結合休閒體驗的漁場型景點，適合安排半日行程。' },
    { id: 9, name: '白水湖', lat: 23.4228664, lng: 120.1534386, region: 'north', type: '沙洲景觀', desc: '開闊海岸與沙洲景色，黃昏時段特別適合看夕陽。' },
    { id: 10, name: '東石先天宮', lat: 23.4573074, lng: 120.1486192, region: 'south', type: '廟宇', desc: '在地信仰中心之一，路過可參拜祈福、感受廟埕氛圍。' },
    { id: 11, name: '笨港口港口宮', lat: 23.495893264870737, lng: 120.18591474059684, region: 'south', type: '廟宇', desc: '地方重要廟宇，常見香客參拜，是在地文化的一部分。' },
    { id: 14, name: '東石網寮鎮安宮', lat: 23.436790396768544, lng: 120.15266995593718, region: 'south', type: '廟宇', desc: '社區廟宇與聚落信仰據點，適合順遊停留。' },
    { id: 15, name: '東石型厝寮福安宮', lat: 23.47427901530278, lng: 120.15241605409008, region: 'south', type: '廟宇', desc: '在地聚落常拜廟宇，環境樸實、節奏安靜。' },
    { id: 16, name: '東石塭港福海宮', lat: 23.467755248287272, lng: 120.14691396943157, region: 'south', type: '廟宇', desc: '沿海聚落的信仰中心，適合行程中短暫參拜。' },
    { id: 17, name: '東石中洲福安宮', lat: 23.4369567032046, lng: 120.20240445408929, region: 'south', type: '廟宇', desc: '中洲一帶的在地廟宇，感受地方生活與信仰。' },
    { id: 18, name: '東石御龍宮', lat: 23.44970897654949, lng: 120.18083318477292, region: 'south', type: '廟宇', desc: '社區信仰據點，適合順路停留、感受廟宇文化。' },
    { id: 19, name: '東石三塊厝福靈宮', lat: 23.471113437244725, lng: 120.17215456943187, region: 'south', type: '廟宇', desc: '三塊厝聚落的廟宇景點，行程中可作為文化停靠點。' },
    { id: 20, name: '東石三法宮', lat: 23.490744432868865, lng: 120.20061428662164, region: 'south', type: '廟宇', desc: '地方廟宇之一，適合安排廟宇巡禮路線。' },
    { id: 21, name: '東石臨水宮', lat: 23.454755372022905, lng: 120.1480313442917, region: 'south', type: '廟宇', desc: '在地常見參拜點，周邊可順遊漁港與市街。' },
    { id: 22, name: '東石龍港慶福宮', lat: 23.481463326805468, lng: 120.17943048477359, region: 'south', type: '廟宇', desc: '龍港一帶的信仰中心，適合喜歡廟宇文化的旅人。' },
    { id: 23, name: '洲仔臥龍港代天府', lat: 23.451753173348997, lng: 120.19456734059592, region: 'south', type: '廟宇', desc: '地方廟宇景點，適合串聯周邊景點一起走訪。' },
    { id: 24, name: '東石港大厝內代天娘娘廟', lat: 23.455890620642027, lng: 120.15077904059586, region: 'south', type: '廟宇', desc: '廟宇氛圍樸實，適合順路參拜並拍下在地街景。' },
    { id: 25, name: '東石下楫建安宮', lat: 23.488271756009755, lng: 120.19933248107802, region: 'south', type: '廟宇', desc: '下楫聚落的信仰據點，適合安排廟宇巡禮時停留。' },
    { id: 26, name: '東石洲仔三聖宮', lat: 23.453966182075558, lng: 120.19553195778542, region: 'south', type: '廟宇', desc: '社區型廟宇，感受地方信仰與人情味。' },
    { id: 27, name: '東石港玄聖壇', lat: 23.456979211907957, lng: 120.15145712340652, region: 'south', type: '廟宇', desc: '在地信仰據點之一，適合短暫停留參拜。' },
    { id: 28, name: '東石塭仔慈安宮', lat: 23.43901405782091, lng: 120.17645065593736, region: 'south', type: '廟宇', desc: '塭仔地區的廟宇景點，適合搭配海岸行程順遊。' },
    { id: 29, name: '東石永靈宮', lat: 23.46231421499675, lng: 120.17451452710227, region: 'south', type: '廟宇', desc: '聚落信仰中心之一，適合喜歡人文行程的旅人。' },
    { id: 30, name: '東石型厝寮聖賢廟（仙人宮）', lat: 23.475168740958168, lng: 120.151044157786, region: 'south', type: '廟宇', desc: '地方廟宇與聚落生活緊密相連，適合人文順遊。' },
    { id: 31, name: '普濟寺', lat: 23.47186734248567, lng: 120.1777828507151, region: 'south', type: '廟宇', desc: '清幽寺廟空間，適合想安靜走走、停下來休息的人。' },
    { id: 32, name: '清德寺', lat: 23.461579406760947, lng: 120.21153837312721, region: 'south', type: '廟宇', desc: '寺院氛圍沉靜，適合安排在慢遊行程中停留。' },
    { id: 12, name: '余順豐花生工廠', lat: 23.466568742670425, lng: 120.2229068577857, region: 'north', type: '觀光工廠', desc: '在地特色伴手禮據點，可順路停留採買。' },
  
    // --- 美食 ---
    { id: 101, name: '塭ㄚ烤蚵', lat: 23.437408146464733,  lng: 120.1751983117602, region: 'east', type: '烤蚵', desc: '主打烤蚵等海味料理，適合安排用餐補充體力。' },
    { id: 102, name: '東石蚵王烤鮮蚵吃到飽', lat: 23.459543251096793,  lng: 120.14872018973251, region: 'east', type: '吃到飽', desc: '以烤鮮蚵為主的吃到飽選擇，適合多人聚餐。' },
    { id: 104, name: '吳氏蚵捲', lat: 23.4582499, lng: 120.1526107, region: 'east', type: '餐廳', desc: '在地海味餐點據點，適合順路簡單用餐。' },
    { id: 105, name: '林記蚵餃', lat: 23.4579643, lng: 120.1505725, region: 'east', type: '餐廳', desc: '在地小吃選擇，適合邊走邊吃或快速補給。' },
    { id: 106, name: '東石免煎粿', lat: 23.458164542111128,  lng: 120.15217752525442, region: 'east', type: '小吃', desc: '在地傳統點心，適合當作散步時的小點。' },
    { id: 107, name: '焜島第一家蚵嗲', lat: 23.45867712042206, lng: 120.15299883874823, region: 'east', type: '小吃', desc: '常見的海港小吃類型，適合想嘗點在地口味的人。' },
    { id: 108, name: '牛港魚池 烤蚵吃到飽', lat: 23.47387137016273,  lng: 120.17074348662125, region: 'east', type: '吃到飽', desc: '吃到飽用餐點，適合一群人一起享用海味。' },
    { id: 109, name: '東石秋煌蚵仔包', lat: 23.45787141090971,  lng: 120.15073557127933, region: 'east', type: '小吃', desc: '在地小吃選擇，適合行程中當作點心或外帶。' },
    { id: 110, name: '尚億私房料理', lat: 23.458381878756178,  lng: 120.1498884829253, region: 'east', type: '餐廳', desc: '適合坐下來好好吃一餐的餐廳型據點。' },
    { id: 111, name: '海灃蚵の平價料理', lat: 23.458695330820163,  lng: 120.14885816943134, region: 'east', type: '餐廳', desc: '平價海味料理選擇，適合想簡單吃海鮮的人。' },
    { id: 112, name: '蠔碳嘉烤鮮蚵吃到飽', lat: 23.453475913125104,  lng: 120.13717018662089, region: 'east', type: '吃到飽', desc: '烤鮮蚵吃到飽類型，適合多人聚餐安排。' },
    { id: 113, name: '有夠鮮-烤蚵吃到飽', lat: 23.47635379404708,  lng: 120.16387718292569, region: 'east', type: '吃到飽', desc: '吃到飽用餐選擇，適合大食量或聚會行程。' },
    { id: 114, name: '東石先天宮廟口六十年蚵嗲老店', lat: 23.45654553482781,  lng: 120.14992039641902, region: 'east', type: '小吃', desc: '廟口小吃聚集地之一，適合參拜後順路品嚐點心。' },
    { id: 115, name: '阿英蚵仔煎', lat: 23.45636580838462,  lng: 120.14987639826683, region: 'east', type: '小吃', desc: '在地常見小吃選擇，適合當作行程中的快速一餐。' },
    { id: 116, name: '東石阿德蚵嗲 蚵仔包', lat: 23.458261705183396,  lng: 120.1498071136085, region: 'east', type: '小吃', desc: '小吃攤型據點，適合邊走邊吃補充能量。' },
    { id: 117, name: '蚵老大海鮮碳烤', lat: 23.451965430431514,  lng: 120.13639413264565, region: 'east', type: '餐廳', desc: '海鮮碳烤餐廳選擇，適合安排晚餐或聚餐。' }

    // --- 住宿 ---
    ,{ id: 201, name: '東石湛藍海寓民宿 Azure seaside house', lat: 23.457102133790244,  lng: 120.15173900806506, region: 'stay', type: '民宿', desc: '東石在地住宿選擇，適合安排漁港與周邊景點的小旅行。' }
    ,{ id: 202, name: '東石漁人碼頭愛琴海藝宿文旅', lat: 23.461917755359472,  lng: 120.1519541387483, region: 'stay', type: '民宿', desc: '以海港氛圍為主題的文旅住宿，適合想放慢步調的旅人。' }
    ,{ id: 203, name: '東石兜風民宿', lat: 23.45366543070754,  lng: 120.14087056758356, region: 'stay', type: '民宿', desc: '輕鬆樸實的民宿住宿點，方便當作東石一日或二日遊的落腳處。' }
    ];
  }

  const markersGroup = L.layerGroup().addTo(map);
  const spotsListEl = document.getElementById('spotsList');
  let markers = {};
  let currentFilter = 'all';

  // 取得類型對應的 CSS class
  function getTypeClass(spot) {
    if (spot.region === 'east') return 'food';
    if (spot.region === 'south') return 'temple';
    if (spot.region === 'stay') return 'stay';
    return '';
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const GEO_CACHE_KEY = 'dongshi_geocode_cache_v1';
  function loadGeoCache() {
    try {
      return JSON.parse(localStorage.getItem(GEO_CACHE_KEY) || '{}');
    } catch {
      return {};
    }
  }

  function saveGeoCache(cache) {
    try {
      localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(cache));
    } catch {
      // ignore
    }
  }

  async function geocodeInDongshi(name) {
    const q = `${name} 東石鄉 嘉義縣`;
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=zh-TW&countrycodes=tw&viewbox=120.05,23.55,120.25,23.35&bounded=1&q=${encodeURIComponent(q)}`;
    const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!resp.ok) return null;
    const data = await resp.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const lat = Number(data[0].lat);
    const lng = Number(data[0].lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    const latlng = L.latLng(lat, lng);
    if (!bounds.contains(latlng)) return null;
    return { lat, lng };
  }

  async function fillMissingCoords() {
    const cache = loadGeoCache();
    let updatedAny = false;

    for (const spot of spots) {
      const needs = typeof spot.lat !== 'number' || typeof spot.lng !== 'number';
      if (!needs) continue;

      const cached = cache[spot.name];
      if (cached && typeof cached.lat === 'number' && typeof cached.lng === 'number') {
        spot.lat = cached.lat;
        spot.lng = cached.lng;
        if (spot.desc === '座標待確認') spot.desc = '';
        updatedAny = true;
        continue;
      }

      try {
        const r = await geocodeInDongshi(spot.name);
        if (r) {
          spot.lat = r.lat;
          spot.lng = r.lng;
          cache[spot.name] = r;
          if (spot.desc === '座標待確認') spot.desc = '';
          saveGeoCache(cache);
          updatedAny = true;
        } else {
          if (!spot.desc) spot.desc = '座標待確認';
        }
      } catch {
        if (!spot.desc) spot.desc = '座標待確認';
      }

      // 基本節流：避免連續打太快
      await sleep(1100);
    }

    if (updatedAny) {
      renderMarkers(currentFilter);
      renderSpotsList(currentFilter);
    }
  }

  function showSpotInfo(spot){
    const panel = document.getElementById('spotInfoPanel');
    if (!panel) return;
    document.getElementById('spotName').textContent = spot.name;
    document.getElementById('spotRegion').textContent = spot.type;
    const descEl = document.getElementById('spotDesc');
    if (descEl) descEl.textContent = spot.desc || '';
    panel.classList.add('active');

    const weatherEl = document.getElementById('spotWeather');
    if (weatherEl && window.weatherAPI){
      weatherEl.innerHTML = '載入天氣中...';
      window.weatherAPI.getWeatherSummary(spot.name).then(txt => {
        weatherEl.innerHTML = txt;
      }).catch(()=>{
        weatherEl.textContent = '天氣資料暫不可用';
      });
    }

    // 設定「了解更多」按鈕行為：開啟 Google 搜尋該地點
    const moreBtn = panel.querySelector('.btn-primary');
    if (moreBtn) {
      moreBtn.onclick = () => {
        // 組合搜尋關鍵字：地點名稱 + 嘉義東石
        const query = encodeURIComponent(`${spot.name} 嘉義東石`);
        // 開啟 Google 搜尋結果
        window.open(`https://www.google.com/search?q=${query}`, '_blank');
      };
    }
  }

  // 高亮選中的景點卡片
  function highlightCard(spotId) {
    document.querySelectorAll('.spot-card').forEach(card => {
      card.classList.remove('active');
    });
    const activeCard = document.querySelector(`.spot-card[data-id="${spotId}"]`);
    if (activeCard) {
      activeCard.classList.add('active');
      activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // 渲染左側景點列表
  function renderSpotsList(filterRegion) {
    if (!spotsListEl) return;
    spotsListEl.innerHTML = '';
    
    const filteredSpots = spots.filter(s => !filterRegion || filterRegion === 'all' || s.region === filterRegion);
    
    if (filteredSpots.length === 0) {
      spotsListEl.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">沒有符合的景點</p>';
      return;
    }

    filteredSpots.forEach(s => {
      const card = document.createElement('div');
      const isMissingLatLng = typeof s.lat !== 'number' || typeof s.lng !== 'number';
      card.className = isMissingLatLng ? 'spot-card disabled' : 'spot-card';
      card.dataset.id = s.id;
      const metaText = (s.desc || '').trim();
      card.innerHTML = `
        <div class="spot-card-info">
          <span class="spot-type ${getTypeClass(s)}">${s.type}</span>
          <h4>${s.name}</h4>
          ${metaText ? `<p>${metaText}</p>` : ''}
        </div>
      `;
      
      // 點擊卡片時，地圖飛到該點並顯示資訊
      if (!isMissingLatLng) {
        card.addEventListener('click', () => {
          map.flyTo([s.lat, s.lng], 14, { duration: 0.8 });
          if (markers[s.id]) {
            markers[s.id].openPopup();
          }
          showSpotInfo(s);
          highlightCard(s.id);
        });
      }
      
      spotsListEl.appendChild(card);
    });
  }

  function renderMarkers(filterRegion){
    markersGroup.clearLayers();
    markers = {};
    
    spots.filter(s => !filterRegion || filterRegion === 'all' || s.region === filterRegion)
      .forEach(s => {
        if (typeof s.lat !== 'number' || typeof s.lng !== 'number') {
          return;
        }
        const latlng = L.latLng(s.lat, s.lng);
        if (!bounds.contains(latlng)) {
          console.warn('[map] 座標不在東石範圍內，已略過：', s.name, s.lat, s.lng);
          return;
        }
        const marker = L.marker([s.lat, s.lng]).addTo(markersGroup);
        marker.bindPopup(`<strong>${s.name}</strong><br>${s.type}`);
        marker.on('click', () => {
          showSpotInfo(s);
          highlightCard(s.id);
        });
        markers[s.id] = marker;
      });
  }

  // 篩選按鈕
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.region;
      renderMarkers(currentFilter);
      renderSpotsList(currentFilter);
    });
  });

  // 關閉面板
  const closeBtn = document.querySelector('.close-btn');
  if (closeBtn){
    closeBtn.addEventListener('click', () => {
      document.getElementById('spotInfoPanel')?.classList.remove('active');
      document.querySelectorAll('.spot-card').forEach(card => card.classList.remove('active'));
    });
  }

  // 處理從轉盤頁面跳轉過來的參數
  function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const spotId = urlParams.get('spotId');
    
    if (spotId) {
      const spot = spots.find(s => s.id === parseInt(spotId));
      if (spot && typeof spot.lat === 'number' && typeof spot.lng === 'number') {
        // 延遲執行以確保地圖和標記已載入
        setTimeout(() => {
          // 移動地圖到該景點
          map.setView([spot.lat, spot.lng], 15);
          
          // 打開該景點的 popup
          const marker = markers[spot.id];
          if (marker) {
            marker.openPopup();
          }
          
          // 顯示景點資訊面板
          showSpotInfo(spot);
          
          // 高亮該景點卡片
          highlightCard(spot.id);
          
          // 清除 URL 參數（避免重新整理時重複觸發）
          window.history.replaceState({}, document.title, window.location.pathname);
        }, 500);
      }
    }
  }

  // 初始
  renderMarkers('all');
  renderSpotsList('all');

  // 處理 URL 參數（從轉盤跳轉）
  handleUrlParams();

  // 背景自動查詢缺少的座標，查到就自動補點（查不到維持 disabled 避免錯標）
  fillMissingCoords();
})();
