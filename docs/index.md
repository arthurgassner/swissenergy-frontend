# Swiss Energy Forecast

<div id="plotly-chart" style="width: 100%; height: 400px;"></div> <!-- Container for the Plotly chart -->

<script>
  document.addEventListener("DOMContentLoaded", function() {
    // First fetch the latest forecast data (GET request)
    fetch('http://127.0.0.1:8080/latest-forecast')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
      })
      .then(forecastData => {
        // Next, fetch the ENTSOE loads data (POST request)
        return fetch('http://127.0.0.1:8080/entsoe-loads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({"n_days": 3, "n_hours": 1})
        }).then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
          }
          return response.json();
        }).then(entsoeData => {
          var actual_load_trace = {
            x: entsoeData.timestamps, 
            y: entsoeData['24h_later_load'], 
            mode: 'lines',
            type: 'scatter',
            name: 'Actual Load [MW]' 
          };

          var official_forecast_trace = {
            x: entsoeData.timestamps, 
            y: entsoeData['24h_later_forecast'], 
            mode: 'lines',
            type: 'scatter+dash',
            name: 'ENTSO-E\'s previous-day forecasted load [MW]',
            opacity: 0.5,
            line: {
              dash: 'dash', // Set line style to dashed
            }
          };

          var our_forecast_trace = {
            x: forecastData.timestamps, 
            y: forecastData.predicted_24h_later_load, 
            mode: 'lines',
            type: 'scatter',
            name: 'Our previous-day forecasted load [MW]' 
          };

          var layout = {
            title: 'Load and forecasted load [MW]',
            xaxis: {
              title: 'Time', 
            },
            yaxis: {
              title: 'Load [MW]', 
            },
            plot_bgcolor: '#1e1e1e', // Dark background for the plot area
            paper_bgcolor: '#1e1e1e', // Dark background for the plot area
            font: {
              color: '#ffffff' // White font color for better contrast
            },
            legend: {
              orientation: 'h', // Horizontal orientation
              yanchor: 'top', // Anchor the legend to the top of the chart
              y: 1.2, // Position it slightly below the chart
              xanchor: 'center', // Center the legend
              x: .85 // Center it horizontally
            }
          };

          var plotData = [actual_load_trace, official_forecast_trace, our_forecast_trace]; 

          Plotly.newPlot('plotly-chart', plotData, layout);
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  });
</script>


TODO add bareplot MAPE values

TODO add last fetch
