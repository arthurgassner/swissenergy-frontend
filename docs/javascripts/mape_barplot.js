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

    // Calculate error bars for Our Model
    const errorBars = durationsOurModel.map((duration, index) => {
        // Check if the duration is "1 week" or "1 month" and apply 10% error
        if (duration === '1 week' || duration === '1 month') {
            return 0.05 * mapeOurModel[index]; // 10% of the MAPE value
        }
        return 0; // No error for other durations
    });

    // Trace for ENTSOE model
    const entsoeTrace = {
        x: durationsEntsoe,
        y: mapeEntsoe,
        name: "ENTSO-E's Model",
        type: 'bar'
    };

    // Trace for Our model with error bars
    const ourModelTrace = {
        x: durationsOurModel,
        y: mapeOurModel,
        name: 'Our Model',
        type: 'bar',
        error_y: {
            type: 'data', // Error values based on data
            array: errorBars,
            visible: true // Show the error bars
        }
    };

    return [entsoeTrace, ourModelTrace];
}


// Create layout for the bar plot
function createBarLayout() {
    return {
        title: 'MAPE comparision between ENTSO-E\'s model and our model.',
        xaxis: { title: 'Duration' },
        yaxis: { title: 'MAPE (%)' },
        barmode: 'group', // Group bars for comparison
        plot_bgcolor: '#1e1e1e', // Dark background for the plot area
        paper_bgcolor: '#1e1e1e', // Dark background for the plot area
        font: { color: '#ffffff' }, // White font for better contrast
        legend: {
            xanchor: 'center',
            yanchor: 'top',
            y: 1.1,
            x: 0.5,
            orientation: 'h'
        },
        annotations: [
            {
                text: 'Lower MAPE is better.',
                font: { size: 14, color: '#ffffff' },
                showarrow: false,
                x: 0.5,
                y: 1.175,
                xref: 'paper',
                yref: 'paper',
                xanchor: 'center',
                yanchor: 'top'
            }
        ]
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