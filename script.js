        div.innerHTML = `<strong>${prayerNames[prayer]}:</strong> ${timings[prayer]}`;
        prayerTimesDiv.appendChild(div);
    }

    if (nextPrayer) {
        document.getElementById("next-prayer").innerText = `🕰️ الصلاة القادمة: ${nextPrayer.name} بعد ${formatTimeLeft(minDiff)}`;
    } else {
        document.getElementById("next-prayer").innerText = "✅ لا توجد صلاة قريبة حاليًا";
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
