// 天氣 API 功能 - 串接中央氣象署開放資料平台

const weatherAPI = {
    // 中央氣象署 API 設定
    apiKey: 'CWA-D9E68367-C1EB-4443-B67C-C6259C920200',
    baseURL: 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/',

    // 取得潮汐資料
    getTideData: async function() {
        try {
            const tideURL = `${this.baseURL}F-A0021-001?Authorization=${this.apiKey}`;
            console.log('正在請求潮汐資料...');
            
            const response = await fetch(tideURL);
            
            if (!response.ok) {
                throw new Error(`潮汐 API 請求失敗: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('========== 潮汐 API 完整資料 ==========');
            console.log(JSON.stringify(data, null, 2));
            console.log('======================================');
            
            // 檢查資料結構
            if (data.records) {
                console.log('records 結構:', Object.keys(data.records));
                
                if (data.records.TideForecasts) {
                    const forecasts = data.records.TideForecasts;
                    console.log('找到的潮位站數量:', forecasts.length);
                    
                    // 顯示所有潮位站名稱
                    forecasts.forEach((forecast, idx) => {
                        console.log(`潮位站 ${idx}: ${forecast.Location.LocationName}`);
                    });
                    
                    // 固定尋找嘉義縣布袋站
                    let station = forecasts.find(forecast => 
                        forecast.Location.LocationName.includes('布袋')
                    );
                    
                    if (station) {
                        console.log('選用潮位站:', station.Location.LocationName);
                        console.log('該潮位站的完整資料:', JSON.stringify(station, null, 2));
                        return this.parseTideData(station);
                    } else {
                        console.error('找不到嘉義縣布袋站的潮汐資料');
                    }
                }
            }
            
            return null;
            
        } catch (error) {
            console.error('取得潮汐資料失敗:', error);
            return null;
        }
    },

    // 解析潮汐資料
    parseTideData: function(forecast) {
        try {
            // 使用本地時間而非 UTC 時間
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;
            
            console.log('今天日期:', todayStr);
            console.log('forecast 結構:', forecast);
            
            const dailyData = forecast.Location.TimePeriods.Daily;
            
            if (!dailyData || !Array.isArray(dailyData)) {
                console.error('Daily 資料不存在或格式錯誤');
                return null;
            }
            
            console.log('每日潮汐資料筆數:', dailyData.length);
            
            // 顯示所有資料的日期
            dailyData.forEach((d, idx) => {
                console.log(`日期 ${idx}:`, d.Date);
            });
            
            // 尋找今天或最接近的未來日期
            let todayData = dailyData.find(d => d.Date === todayStr);
            
            if (!todayData) {
                console.warn('找不到今天的潮汐資料，尋找最接近的未來日期');
                
                // 找出大於等於今天的最近日期
                const futureDates = dailyData
                    .filter(d => d.Date >= todayStr)
                    .sort((a, b) => a.Date.localeCompare(b.Date));
                
                if (futureDates.length > 0) {
                    todayData = futureDates[0];
                    console.log(`使用日期: ${todayData.Date}`);
                } else {
                    // 如果沒有未來日期，使用第一筆資料
                    todayData = dailyData[0];
                    console.log(`使用第一筆資料，日期: ${todayData.Date}`);
                }
            }
            
            if (!todayData || !todayData.Time) {
                console.error('無法取得有效的潮汐時間資料');
                return null;
            }
            
            console.log('使用的潮汐資料:', JSON.stringify(todayData, null, 2));
            
            return this.extractTideTime(todayData, forecast.Location.LocationName);
            
        } catch (error) {
            console.error('解析潮汐資料錯誤:', error);
            return null;
        }
    },
    
    // 提取潮汐時間
    extractTideTime: function(dayData, locationName) {
        const highTides = [];
        const lowTides = [];
        
        if (dayData.Time && Array.isArray(dayData.Time)) {
            dayData.Time.forEach(t => {
                const time = t.DateTime.split('T')[1].substring(0, 5);
                
                if (t.Tide === '滿潮') {
                    highTides.push(time);
                } else if (t.Tide === '乾潮') {
                    lowTides.push(time);
                }
            });
        }
        
        console.log('最終解析結果 - 滿潮:', highTides, '乾潮:', lowTides);
        
        if (highTides.length > 0 && lowTides.length > 0) {
            return {
                highTide: highTides.join(' / '),
                lowTide: lowTides.join(' / '),
                station: locationName
            };
        }
        
        return null;
    },

    // 取得日出日落資料
    getSunData: async function() {
        try {
            // 使用 Sunrise-Sunset.org API（東石鄉經緯度）
            const lat = 23.4609;
            const lng = 120.1444;
            const today = new Date();
            const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
            
            const sunURL = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${dateStr}&formatted=0`;
            console.log('正在請求日出日落資料...', sunURL);
            
            const response = await fetch(sunURL);
            
            if (!response.ok) {
                throw new Error(`日出日落 API 請求失敗: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('日出日落 API 原始資料:', data);
            
            if (data.status === 'OK' && data.results) {
                return this.parseSunData(data.results, dateStr);
            }
            
            return null;
            
        } catch (error) {
            console.error('取得日出日落資料失敗:', error);
            return null;
        }
    },

    // 解析日出日落資料
    parseSunData: function(results, dateStr) {
        try {
            console.log('開始解析日出日落資料');
            
            // Sunrise-Sunset API 回傳 UTC 時間，需轉換為台灣時間（UTC+8）
            const convertToLocalTime = (utcTimeStr) => {
                const date = new Date(utcTimeStr);
                // 轉換為台灣時區（UTC+8）
                const taiwanTime = new Date(date.getTime());
                const hours = taiwanTime.getHours().toString().padStart(2, '0');
                const minutes = taiwanTime.getMinutes().toString().padStart(2, '0');
                return `${hours}:${minutes}`;
            };
            
            const sunrise = convertToLocalTime(results.sunrise);
            const sunset = convertToLocalTime(results.sunset);
            
            console.log('解析結果 - 日出:', sunrise, '日落:', sunset);
            
            const result = {
                today: {
                    date: dateStr,
                    sunrise: sunrise,
                    sunset: sunset
                },
                location: '東石鄉'
            };
            
            return result;
            
        } catch (error) {
            console.error('解析日出日落資料錯誤:', error);
            return null;
        }
    },

    // 取得天氣資料
    getWeatherData: async function(location) {
        try {
            // 取得觀測資料 (O-A0003-001: 自動氣象站-氣象觀測資料)
            const observationURL = `${this.baseURL}O-A0003-001?Authorization=${this.apiKey}`;
            
            console.log('正在請求嘉義地區天氣資料...');
            
            const response = await fetch(observationURL);
            
            if (!response.ok) {
                console.error(`API 請求失敗: ${response.status}`);
                throw new Error(`API 請求失敗: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success === 'true' && data.records?.Station && data.records.Station.length > 0) {
                // 尋找東石測站或嘉義地區測站
                let stationData = data.records.Station.find(s => 
                    s.StationName === '東石' || 
                    (s.GeoInfo?.CountyName === '嘉義縣' && s.GeoInfo?.TownName?.includes('東石'))
                );
                
                // 找不到東石，使用嘉義市或嘉義縣任一測站
                if (!stationData) {
                    stationData = data.records.Station.find(s => 
                        s.GeoInfo?.CountyName === '嘉義市' || s.GeoInfo?.CountyName === '嘉義縣'
                    );
                }
                
                if (stationData) {
                    console.log(`✓ ${location} 使用測站: ${stationData.StationName}`);
                    return this.parseWeatherData(stationData, location);
                } else {
                    console.warn(`找不到嘉義地區測站`);
                    return null;
                }
            } else {
                console.warn('API 回應無資料');
                return null;
            }
            
        } catch (error) {
            console.error('取得天氣資料失敗:', error);
            return null;
        }
    },

    // 解析中央氣象署資料
    parseWeatherData: async function(stationData, displayName) {
        console.log('解析測站資料:', stationData.StationName);
        const weatherElement = stationData.WeatherElement;
        
        const temp = weatherElement.AirTemperature || '--';
        const weather = weatherElement.Weather || '晴朗';
        const windSpeed = weatherElement.WindSpeed || '--';
        const humidity = weatherElement.RelativeHumidity || '--';
        
        console.log('解析結果 - 溫度:', temp, '天氣:', weather, '風速:', windSpeed, '濕度:', humidity);
        
        const icon = this.getWeatherIcon(weather);
        const aqi = await this.getAQIData('嘉義縣');
        
        return {
            temp: temp !== '--' ? Math.round(parseFloat(temp)) : '--',
            condition: weather || '資料更新中',
            windSpeed: windSpeed !== '--' ? Math.round(parseFloat(windSpeed) * 3.6) : '--',
            humidity: humidity !== '--' ? Math.round(parseFloat(humidity)) : '--',
            icon: icon,
            aqi: aqi
        };
    },

    // 根據天氣描述返回對應圖示
    getWeatherIcon: function(weather) {
        // 優先檢查特殊天氣現象（霾、霧、靄等能見度不良）
        if (weather.includes('霾') || weather.includes('靄') || weather.includes('霧')) {
            return '<i class="fas fa-smog"></i>';
        }
        // 檢查降水和雷電
        if (weather.includes('雷')) return '<i class="fas fa-bolt"></i>';
        if (weather.includes('雨')) return '<i class="fas fa-cloud-rain"></i>';
        // 檢查雲量
        if (weather.includes('陰')) return '<i class="fas fa-cloud"></i>';
        if (weather.includes('多雲')) return '<i class="fas fa-cloud-sun"></i>';
        if (weather.includes('晴')) return '<i class="fas fa-sun"></i>';
        return '<i class="fas fa-cloud-sun"></i>';
    },

    // 取得空氣品質資料
    getAQIData: async function(county) {
        try {
            const epaURL = `https://data.moenv.gov.tw/api/v2/aqx_p_432?api_key=d5f83c1d-a815-4523-895a-30f176ff9e2b&limit=1000&sort=ImportDate%20desc&format=json`;
            
            const response = await fetch(epaURL);
            
            if (!response.ok) {
                throw new Error(`AQI API 請求失敗: ${response.status}`);
            }
            
            const data = await response.json();
            
            const station = data.records.find(s => 
                s.county === '嘉義縣' && (s.sitename === '朴子' || s.sitename === '新港')
            ) || data.records.find(s => s.county === '嘉義縣');
            
            if (station) {
                const aqiValue = parseInt(station.aqi) || 0;
                console.log(`✓ 空氣品質 (${station.sitename}): AQI ${aqiValue}`);
                return {
                    value: aqiValue,
                    status: this.getAQIStatus(aqiValue),
                    sitename: station.sitename
                };
            }
            
            return { value: '--', status: '資料更新中', sitename: '' };
            
        } catch (error) {
            console.warn('取得空氣品質資料失敗:', error);
            return { value: '--', status: '資料更新中', sitename: '' };
        }
    },

    // 根據AQI數值判斷空氣品質狀態
    getAQIStatus: function(aqi) {
        if (aqi <= 50) return '良好';
        if (aqi <= 100) return '普通';
        if (aqi <= 150) return '對敏感族群不健康';
        if (aqi <= 200) return '不健康';
        if (aqi <= 300) return '非常不健康';
        return '危害';
    },

    // 根據AQI數值取得顏色
    getAQIColor: function(aqi) {
        if (aqi <= 50) return '#00E400';
        if (aqi <= 100) return '#FFFF00';
        if (aqi <= 150) return '#FF7E00';
        if (aqi <= 200) return '#FF0000';
        if (aqi <= 300) return '#8F3F97';
        return '#7E0023';
    },

    // 顯示天氣小工具
    displayWeatherWidget: function(containerId, locations) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '<div class="loading">載入天氣資料中...</div>';

        Promise.all(locations.map(loc => this.getWeatherData(loc)))
            .then(dataArray => {
                container.innerHTML = '';
                
                dataArray.forEach((data, index) => {
                    if (data) {
                        const card = this.createWeatherCard(locations[index], data);
                        container.appendChild(card);
                    }
                });
            })
            .catch(error => {
                container.innerHTML = '<div class="error">無法載入天氣資料</div>';
                console.error(error);
            });
    },

    // 建立天氣資訊卡片（純文字）
    createWeatherCard: function(location, data) {
        const container = document.createElement('div');
        container.className = 'weather-info-text';
        
        const aqiColor = data.aqi && data.aqi.value !== '--' ? this.getAQIColor(data.aqi.value) : '#003d5c';
        
        container.innerHTML = `
            <p style="font-size: 1.4rem; line-height: 2; color: var(--text-color); margin: 0; font-weight: 500;">
                天氣:${data.condition}${data.icon}<br>
                溫度:${data.temp}°C<br>
                <i class="fas fa-wind"></i> 風速: ${data.windSpeed} km/h
                ${data.humidity ? `<br><i class="fas fa-tint"></i> 濕度: ${data.humidity}%` : ''}
                ${data.aqi ? `<br><i class="fas fa-lungs"></i> 空氣品質: <strong style="color: ${aqiColor}">${data.aqi.value}</strong> (${data.aqi.status})` : ''}
            </p>
        `;

        container.style.cssText = `
            text-align: center;
            padding: 20px;
        `;

        return container;
    },

    // 取得單一地點的簡要天氣
    getWeatherSummary: function(location) {
        return this.getWeatherData(location).then(data => {
            if (data) {
                return `${data.icon} ${data.temp}°C, ${data.condition}`;
            }
            return '天氣資料載入中...';
        });
    }
};

// 當頁面載入時初始化天氣小工具（使用 requestIdleCallback 避免阻塞渲染）
document.addEventListener('DOMContentLoaded', function() {
    // 延遲載入天氣資料，讓頁面先渲染完成
    const loadWeatherData = () => {
        const weatherWidget = document.getElementById('weatherWidget');
        if (weatherWidget) {
            // 只顯示一個地點的天氣資訊
            weatherAPI.displayWeatherWidget('weatherWidget', ['東石']);
        }

        // 載入潮汐資料
        const highTideElement = document.getElementById('highTide');
        const lowTideElement = document.getElementById('lowTide');
        if (highTideElement && lowTideElement) {
            weatherAPI.getTideData().then(tideData => {
                if (tideData) {
                    highTideElement.textContent = tideData.highTide;
                    lowTideElement.textContent = tideData.lowTide;
                    console.log('✓ 潮汐資料已更新');
                } else {
                    highTideElement.textContent = '資料載入失敗';
                    lowTideElement.textContent = '資料載入失敗';
                    console.error('✗ 無法取得潮汐資料');
                }
            });
        }
    };

    // 使用 requestIdleCallback 或 setTimeout 延遲載入
    if ('requestIdleCallback' in window) {
        requestIdleCallback(loadWeatherData, { timeout: 2000 });
    } else {
        setTimeout(loadWeatherData, 100);
    }

    // 載入日出日落資料
    const sunriseTodayElement = document.getElementById('sunrise-today');
    const sunsetTodayElement = document.getElementById('sunset-today');
    const sunDateTodayElement = document.getElementById('sun-date-today');
    
    if (sunriseTodayElement && sunsetTodayElement) {
        // 使用系統時間顯示當天日期
        const formatCurrentDate = () => {
            const today = new Date();
            const month = today.getMonth() + 1;
            const day = today.getDate();
            return `<i class="far fa-calendar-alt"></i> ${month}/${day}`;
        };
        
        // 立即更新日期標籤為系統時間
        if (sunDateTodayElement) {
            sunDateTodayElement.innerHTML = formatCurrentDate();
        }
        
        weatherAPI.getSunData().then(sunData => {
            if (sunData) {
                // 更新時間
                sunriseTodayElement.textContent = sunData.today.sunrise;
                sunsetTodayElement.textContent = sunData.today.sunset;
                
                console.log('✓ 日出日落資料已更新');
                console.log('  系統日期:', formatCurrentDate());
                console.log('  API 日期:', sunData.today.date);
                console.log('  日出:', sunData.today.sunrise);
                console.log('  日落:', sunData.today.sunset);
            } else {
                sunriseTodayElement.textContent = '資料載入失敗';
                sunsetTodayElement.textContent = '資料載入失敗';
                console.error('✗ 無法取得日出日落資料');
            }
        });
    }

    // 動態更新今日提醒
    const todayTips = document.getElementById('todayTips');
    if (todayTips) {
        // 根據天氣資料更新提醒內容
        weatherAPI.getWeatherData('東石').then(weatherData => {
            if (weatherData) {
                const tips = [];
                
                // 根據天氣狀況給建議
                if (weatherData.condition.includes('晴')) {
                    tips.push('<i class="fas fa-sun"></i> 今日陽光充足，適合海邊活動');
                    tips.push('<i class="fas fa-spray-can"></i> 記得攜帶防曬用品');
                } else if (weatherData.condition.includes('雨')) {
                    tips.push('<i class="fas fa-umbrella"></i> 今日有雨，建議攜帶雨具');
                    tips.push('<i class="fas fa-water"></i> 注意海邊安全，避免濕滑');
                } else if (weatherData.condition.includes('多雲')) {
                    tips.push('<i class="fas fa-cloud-sun"></i> 今日多雲，適合戶外活動');
                    tips.push('<i class="fas fa-camera"></i> 雲層豐富，適合拍照');
                }
                
                // 根據溫度給建議
                if (weatherData.temp > 28) {
                    tips.push('<i class="fas fa-tint"></i> 天氣炎熱，多補充水分');
                } else if (weatherData.temp < 18) {
                    tips.push('<i class="fas fa-user-tie"></i> 天氣較涼，建議攜帶外套');
                }
                
                // 根據空氣品質給建議
                if (weatherData.aqi && weatherData.aqi.value !== '--') {
                    if (weatherData.aqi.value <= 50) {
                        tips.push('<i class="fas fa-leaf"></i> 空氣品質良好，適合戶外運動');
                    } else if (weatherData.aqi.value > 100) {
                        tips.push('<i class="fas fa-head-side-mask"></i> 空氣品質較差，敏感族群請注意防護');
                    }
                }
                
                tips.push('<i class="fas fa-camera"></i> 傍晚時分是拍攝夕陽的最佳時機');
                
                // 更新提醒列表
                if (tips.length > 0) {
                    todayTips.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
                }
            }
        });
    }

    const spotWeather = document.getElementById('spotWeather');
    if (spotWeather) {
        // 地圖頁面的天氣顯示將由 map.js 處理
    }
});

window.weatherAPI = weatherAPI;
