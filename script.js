const API_URL = "https://admin.awqatsalah.com/api/PlaceAPI/GetByDailyCityId?latitude=52.6755&longitude=7.4767";

const prayerNames = {
    fajr: "الفجر",
    sunrise: "الشروق",
    dhuhr: "الظهر",
    asr: "العصر",
    maghrib: "المغرب",
    isha: "العشاء"
};

async function fetchPrayerTimes() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (!data.daily || !data.daily.data || data.daily.data.length === 0) {
            throw new Error("استجابة غير صالحة من API");
        }
        displayPrayerTimes(data.daily.data[0]);
    } catch (error) {
        console.error("خطأ في جلب أوقات الصلاة:", error);
    }
}

function displayPrayerTimes(prayerData) {
    document.getElementById("date").innerText = `📅 التاريخ: ${prayerData.gregorianDateShort}`;

    const prayerTimesDiv = document.getElementById("prayer-times");
    prayerTimesDiv.innerHTML = "";

    let nextPrayer = null;
    let minDiff = Infinity;
    let currentTime = new Date();
    
    for (let prayer in prayerNames) {
        if (!prayerData[prayer]) continue; // تخطي القيم غير المتاحة
        
        const prayerTime = convertTo24HourFormat(prayerData[prayer]);
        const prayerDate = new Date(currentTime);
        const [hours, minutes] = prayerTime.split(":").map(Number);
        prayerDate.setHours(hours, minutes, 0);

        const diff = (prayerDate - currentTime) / 1000 / 60; // الفرق بالدقائق
        if (diff > 0 && diff < minDiff) {
            minDiff = diff;
            nextPrayer = { name: prayerNames[prayer], time: prayerTime };
        }

        const div = document.createElement("div");
        div.classList.add("prayer-time");
        div.innerHTML = `<strong>${prayerNames[prayer]}:</strong> ${prayerTime}`;
        prayerTimesDiv.appendChild(div);
    }

    if (nextPrayer) {
        document.getElementById("next-prayer").innerText = `🕰️ الصلاة القادمة: ${nextPrayer.name} بعد ${formatTimeLeft(minDiff)}`;
    }
    
    updateClock();
    setInterval(updateClock, 1000); // تحديث الساعة كل ثانية
}

function convertTo24HourFormat(time) {
    let [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
}

function formatTimeLeft(minutes) {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hrs} ساعة و ${mins} دقيقة`;
}

function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById("current-time").innerText = `⏰ الساعة الآن: ${hours}:${minutes}:${seconds}`;
}

fetchPrayerTimes();
