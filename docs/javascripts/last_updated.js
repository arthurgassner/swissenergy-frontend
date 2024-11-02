async function fetchLastUpdated() {
    try {
        const response = await fetch('https://swissenergy-backend.arthurgassner.ch/latest-forecast-ts');
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json();
        displayLastUpdated(data.latest_forecast_ts);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('last-updated').textContent = 'Error fetching last updated time.';
    }
}

function displayLastUpdated(timestamp) {
    const lastUpdatedDate = new Date(timestamp * 1000); // Convert from seconds to milliseconds
    const timeAgo = timeSince(lastUpdatedDate);
    document.getElementById('last-updated').textContent = `Last update: ${timeAgo} ago`;
}

function timeSince(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) return interval + " years";
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + " months";
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return interval + " days";
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return interval + " hours";
    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + " minutes";
    return seconds + " seconds";
}

// Fetch the last updated timestamp when the DOM content is loaded
document.addEventListener("DOMContentLoaded", fetchLastUpdated);