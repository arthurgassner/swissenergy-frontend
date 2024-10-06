# Swiss Energy Forecast


<div id="last-updated"></div>
<div id="plotly-chart" style="width: 100%; height: 400px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);"></div>

<script>
    async function fetchLastUpdated() {
        try {
            const response = await fetch('https://vps.arthurgassner.ch/latest-model-training-ts');
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }

            const data = await response.json();
            displayLastUpdated(data.latest_model_training_ts);
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('last-updated').textContent = 'Error fetching last updated time.';
        }
    }

    function displayLastUpdated(timestamp) {
        const lastUpdatedDate = new Date(timestamp * 1000); // Convert from seconds to milliseconds
        const timeAgo = timeSince(lastUpdatedDate);
        document.getElementById('last-updated').textContent = `Last updated ${timeAgo} ago`;
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
</script>

<script>
  // Fetch latest forecast data (GET request)
  async function fetchForecastData() {
    const response = await fetch('https://vps.arthurgassner.ch/latest-forecast');
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    return response.json();
  }

  // Fetch ENTSOE loads data (POST request)
  async function fetchEntsoeLoads() {
    const response = await fetch('https://vps.arthurgassner.ch/entsoe-loads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "n_days": 3, "n_hours": 1 })
    });
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    return response.json();
  }

  // Create Plotly traces
  function createTraces(forecastData, entsoeData) {
    const actualLoadTrace = {
      x: entsoeData.timestamps,
      y: entsoeData['24h_later_load'],
      mode: 'lines',
      type: 'scatter',
      name: 'Actual Load [MW]'
    };

    const officialForecastTrace = {
      x: entsoeData.timestamps,
      y: entsoeData['24h_later_forecast'],
      mode: 'lines',
      type: 'scatter',
      name: 'ENTSO-E\'s previous-day forecasted load [MW]',
      opacity: 0.5,
      line: { dash: 'dash' } // Dashed line
    };

    const ourForecastTrace = {
      x: forecastData.timestamps,
      y: forecastData.predicted_24h_later_load,
      mode: 'lines',
      type: 'scatter',
      name: 'Our previous-day forecasted load [MW]'
    };

    return [actualLoadTrace, officialForecastTrace, ourForecastTrace];
  }

  // Create Plotly layout
  function createLayout() {
    return {
      title: 'Load and forecasted load [MW]',
      xaxis: { title: 'Time' },
      yaxis: { title: 'Load [MW]' },
      plot_bgcolor: '#1e1e1e', // Dark background for the plot area
      paper_bgcolor: '#1e1e1e', // Dark background for the plot area
      font: { color: '#ffffff' }, // White font for better contrast
      legend: {
        orientation: 'h',
        yanchor: 'top',
        y: 1.2,
        xanchor: 'center',
        x: .85
      }
    };
  }

  // Render the Plotly chart
  function renderChart(forecastData, entsoeData) {
    const traces = createTraces(forecastData, entsoeData);
    const layout = createLayout();
    Plotly.newPlot('plotly-chart', traces, layout);
  }

  // Main function to fetch data and render chart
  async function main() {
    try {
      const forecastData = await fetchForecastData();
      const entsoeData = await fetchEntsoeLoads();
      renderChart(forecastData, entsoeData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Initialize when DOM content is loaded
  document.addEventListener("DOMContentLoaded", main);
</script>


TODO add bareplot MAPE values