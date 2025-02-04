const API_URL = "https://admin.awqatsalah.com/api/PlaceAPI/GetByDailyCityId?latitude=52.6755&longitude=7.4767";

const prayerNames = {
    Fajr: "الفجر",
    Sunrise: "الضحى",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء"
};

async function fetchPrayerTimes(dateOffset = 0) {
    try {
        let apiUrl = API_URL;
        if (dateOffset === 1) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const formattedDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
            apiUrl = `https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=Meppen&country=Germany&method=2`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();
        displayPrayerTimes(data, dateOffset);
    } catch (error) {
        console.error("خطأ في جلب أوقات الصلاة:", error);
    }
}

function displayPrayerTimes(data, dateOffset) {
    const timings = data.data.timings;
    const date = data.data.date.readable;
    document.getElementById("date").innerText = `📅 التاريخ: ${date}`;

    const prayerTimesDiv = document.getElementById("prayer-times");
    prayerTimesDiv.innerHTML = "";

    let nextPrayer = null;
    let minDiff = Infinity;
    let currentTime = new Date();
    
    for (let prayer in prayerNames) {
        const prayerTime = convertTo24HourFormat(timings[prayer]);
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
        div.innerHTML = `<strong>${prayerNames[prayer]}:</strong> ${timings[prayer]}`;
        prayerTimesDiv.appendChild(div);
    }

    if (nextPrayer) {
        document.getElementById("next-prayer").innerText = `🕰️ الصلاة القادمة: ${nextPrayer.name} بعد ${formatTimeLeft(minDiff)}`;
    } else {
        if (dateOffset === 0) {
            fetchPrayerTimes(1); // جلب أوقات اليوم التالي
        } else {
            const fajrTime = convertTo24HourFormat(timings["Fajr"]); // جلب وقت الفجر لليوم التالي
            const fajrDate = new Date();
            const [fajrHours, fajrMinutes] = fajrTime.split(":").map(Number);
            fajrDate.setHours(fajrHours, fajrMinutes, 0);

            const diffToFajr = (fajrDate - currentTime) / 1000 / 60 ;
            document.getElementById("next-prayer").innerText = `🕰️ الصلاة القادمة: الفجر بعد ${formatTimeLeft(diffToFajr)}`;
        }
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
