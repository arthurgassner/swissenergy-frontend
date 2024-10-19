# Swiss Energy Forecast


<div id="last-updated"></div>
<div id="plotly-chart" style="width: 100%; height: 400px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);"></div>

<script>
    async function fetchLastUpdated() {
        try {
            const response = await fetch('https://vps.arthurgassner.ch/latest-forecast-ts');
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

  // Create Plotly traces with 24h future time adjustment
  function createTraces(forecastData, entsoeData) {
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

    const actualLoadTrace = {
      x: entsoeData.timestamps.map(t => new Date(new Date(t).getTime() + oneDayInMilliseconds)), // Shift 24h into the future
      y: entsoeData['24h_later_load'],
      mode: 'lines',
      type: 'scatter',
      name: 'Actual Load [MW]'
    };

    const officialForecastTrace = {
      x: entsoeData.timestamps.map(t => new Date(new Date(t).getTime() + oneDayInMilliseconds)), // Shift 24h into the future
      y: entsoeData['24h_later_forecast'],
      mode: 'lines',
      type: 'scatter',
      name: 'ENTSO-E\'s previous-day forecasted load [MW]',
      opacity: 0.5,
      line: { dash: 'dash' } // Dashed line
    };

    const ourForecastTrace = {
      x: forecastData.timestamps.map(t => new Date(new Date(t).getTime() + oneDayInMilliseconds)), // Shift 24h into the future
      y: forecastData.predicted_24h_later_load.map(y => Math.round(y)),
      mode: 'lines',
      type: 'scatter',
      name: 'Our previous-day forecasted load [MW]'
    };

    return [actualLoadTrace, officialForecastTrace, ourForecastTrace];
  }

  // Create Plotly layout with the vertical line and "Now" text
  function createLayout() {
      const currentTime = new Date(); // Get current time
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
          },
          shapes: [
              {
                  type: 'line',
                  x0: currentTime,   // Start point of the line (current time)
                  x1: currentTime,   // End point of the line (same, to make it vertical)
                  y0: 0,             // Y-axis start (bottom of the plot)
                  y1: 1,             // Y-axis end (top of the plot, in relative units)
                  xref: 'x',         // Reference to the x-axis
                  yref: 'paper',     // Reference to the full plot height
                  line: {
                      color: 'rgba(255, 0, 0, 0.5)', // Red color with 50% opacity
                      width: 2,
                      dash: 'dot'                   // Dashed line style
                  }
              }
          ],
          annotations: [
              {
                  x: currentTime,         // Position the annotation at the current time on the x-axis
                  y: 0,                   // Position near the bottom of the plot
                  xref: 'x',              // X-axis reference
                  yref: 'paper',          // Y-axis reference in plot height units
                  text: 'Now',            // The label text
                  showarrow: false,       // No arrow pointing to the label
                  xanchor: 'left',        // Anchor text to the left of the point
                  yanchor: 'bottom',      // Anchor text to the bottom
                  font: {
                      color: 'rgba(255, 0, 0, 0.9)', // Slightly more opaque red for the text
                      size: 12                       // Font size for the label
                  }
              }
          ]
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
      console.log(forecastData)
      console.log(entsoeData)
      renderChart(forecastData, entsoeData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Initialize when DOM content is loaded
  document.addEventListener("DOMContentLoaded", main);
</script>


<div id="plotly-bar-chart"></div>

<script>
// Fetch MAPE data (GET request)
async function fetchMapeData() {
    const response = await fetch('https://vps.arthurgassner.ch/latest-mape');
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
    }
    return response.json();
}

// Create Plotly traces for the bar plot
function createBarTraces(mapeData) {
    // Extract durations and MAPE values
    const durationsEntsoe = Object.keys(mapeData.entsoe_model).map(duration => {
        if (duration === '7d') return '1 week';
        if (duration === '4w') return '1 month';
        return duration;
    }); // ['1h', '24h', '1 week', '1 month']
    
    const mapeEntsoe = Object.values(mapeData.entsoe_model);    // Corresponding MAPE values

    const durationsOurModel = Object.keys(mapeData.our_model).map(duration => {
        if (duration === '7d') return '1 week';
        if (duration === '4w') return '1 month';
        return duration;
    });  // ['1h', '24h', '1 week', '1 month']
    
    const mapeOurModel = Object.values(mapeData.our_model);     // Corresponding MAPE values

    // Trace for ENTSOE model
    const entsoeTrace = {
        x: durationsEntsoe,
        y: mapeEntsoe,
        name: 'ENTSO-E Model',
        type: 'bar'
    };

    // Trace for Our model
    const ourModelTrace = {
        x: durationsOurModel,
        y: mapeOurModel,
        name: 'Our Model',
        type: 'bar'
    };

    return [entsoeTrace, ourModelTrace];
}

// Create layout for the bar plot
function createBarLayout() {
    return {
        title: 'MAPE comparision between ENTSO-E\'s model and our model',
        xaxis: { title: 'Duration' },
        yaxis: { title: 'MAPE (%)' },
        barmode: 'group', // Group bars for comparison
        plot_bgcolor: '#1e1e1e', // Dark background for the plot area
        paper_bgcolor: '#1e1e1e', // Dark background for the plot area
        font: { color: '#ffffff' }, // White font for better contrast
        legend: {
            xanchor: 'center',
            yanchor: 'top',
            y: 1.15,
            x: 0.5,
            orientation: 'h'
        }
    };
}

// Render the Plotly chart
function renderBarChart(mapeData) {
    const traces = createBarTraces(mapeData);
    const layout = createBarLayout();
    Plotly.newPlot('plotly-bar-chart', traces, layout);
}

// Main function to fetch data and render chart
async function main() {
    try {
        const mapeData = await fetchMapeData();
        renderBarChart(mapeData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Initialize when DOM content is loaded
document.addEventListener("DOMContentLoaded", main);
</script>