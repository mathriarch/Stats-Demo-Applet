// Updated datasets


function exportChart(chart, filename) {
    if (chart) {
        const image = chart.toBase64Image();
        const link = document.createElement('a');
        link.href = image;
        link.download = filename;
        link.click();
    } else {
        alert('No chart available to export.');
    }
}

Chart.register({
    id: 'whiteBackground',
    beforeDraw: (chart) => {
        const ctx = chart.canvas.getContext('2d');
        ctx.save();
        ctx.fillStyle = '#ffffff'; // Set the background color to white
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
    },
});

// Summary Statistics Functions
function calculateMean(data) {
    return data.reduce((sum, val) => sum + val, 0) / data.length;
}

function calculateMedian(data) {
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
}

function calculateMin(data) {
    return Math.min(...data);
}

function calculateMax(data) {
    return Math.max(...data);
}

function calculateQuartiles(data) {
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const lowerHalf = sorted.slice(0, mid);
    const upperHalf = sorted.length % 2 === 0 ? sorted.slice(mid) : sorted.slice(mid + 1);

    return {
        q1: calculateMedian(lowerHalf),
        q3: calculateMedian(upperHalf),
    };
}

function calculateIQR(data) {
    const { q1, q3 } = calculateQuartiles(data);
    return q3 - q1;
}

function calculateRange(data) {
    return calculateMax(data) - calculateMin(data);
}

function calculateStandardDeviation(data) {
    const mean = calculateMean(data);
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (data.length - 1);
    return Math.sqrt(variance);
}

function calculateSkewness(data) {
    const n = data.length;
    const mean = calculateMean(data);
    const stdDev = calculateStandardDeviation(data);
    return (
        (n / ((n - 1) * (n - 2))) *
        data.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 3), 0)
    );
}

function calculateKurtosis(data) {
    const n = data.length;
    const mean = calculateMean(data);
    const stdDev = calculateStandardDeviation(data);
    return (
        (n * (n + 1)) /
        ((n - 1) * (n - 2) * (n - 3)) *
        data.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 4), 0) -
        (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3))
    );
}

function calculateSummaryStatistics(data) {
    const mean = calculateMean(data);
    const median = calculateMedian(data);
    const min = calculateMin(data);
    const max = calculateMax(data);
    const { q1, q3 } = calculateQuartiles(data);
    const range = calculateRange(data);
    const iqr = calculateIQR(data);
    const stdDev = calculateStandardDeviation(data);
    const skewness = calculateSkewness(data);
    const kurtosis = calculateKurtosis(data);

    return {
        mean,
        median,
        min,
        max,
        q1,
        q3,
        range,
        iqr,
        stdDev,
        skewness,
        kurtosis,
    };
}


// Utility function to generate normally distributed values using the Box-Muller transform
function generateNormalData(mean, stdDev, size) {
    const data = [];
    for (let i = 0; i < size; i++) {
        let u1 = Math.random();
        let u2 = Math.random();
        let z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        data.push(mean + z * stdDev);
    }
    return data;
}

const datasets = {
    weights: generateNormalData(70, 10, 1000), // Mean 70, SD 10
    house_prices: generateNormalData(150000, 25000, 1000), // Mean $150k, SD $25k
    exam_scores: generateNormalData(80, 10, 1000), // Mean 80, SD 10
    heights: generateNormalData(165, 10, 1000), // Mean 165 cm, SD 10
    salaries: generateNormalData(50000, 15000, 1000), // Mean $50k, SD $15k
    ages: generateNormalData(35, 10, 1000), // Mean 35 years, SD 10

    household_incomes: Array.from({ length: 1000 }, () => Math.pow(Math.random(), 3) * 50000 + 20000), // Skewed toward lower values
    property_values: Array.from({ length: 1000 }, () => 200000 - Math.pow(Math.random(), 3) * 50000), // Skewed toward higher values
    city_population_growth: Array.from({ length: 1000 }, () => Math.pow(Math.random(), 2) * 50), // Rapid initial growth, slow later
    company_profits: Array.from({ length: 1000 }, () => Math.pow(Math.random(), 2) * 100000), // Higher concentration at lower profits
    rainfall_levels: Array.from({ length: 1000 }, () => 10 + Math.pow(Math.random(), 3) * 40), // Most values at lower end

    // New datasets
    running_speeds: generateNormalData(15, 2.5, 1000), // Normal distribution: Running speeds (km/h)
    blood_pressure: generateNormalData(120, 15, 1000), // Normal distribution: Blood pressure (mmHg)
    air_quality_index: Array.from({ length: 1000 }, () => Math.pow(Math.random(), 2) * 300), // Skewed: AQI values
    sales_figures: Array.from({ length: 1000 }, () => 10000 + Math.pow(Math.random(), 2) * 20000), // Skewed: Sales figures (USD)
    reaction_times: generateNormalData(0.5, 0.1, 1000), // Normal distribution: Reaction times (seconds)
};



// Shuffle datasets
const shuffledDatasets = Object.entries(datasets).sort(() => Math.random() - 0.5);
const mixedDatasets = Object.fromEntries(shuffledDatasets);

const datasetDescriptions = {
    weights: `
        <strong>Body Weights of Individuals (in kilograms):</strong> 
        This dataset includes body weights of participants in a national health and fitness survey. 
        The survey aimed to analyze the impact of different fitness routines, diets, and lifestyle 
        changes on weight over six months. This data is crucial for public health studies, 
        helping researchers identify obesity trends and assess the effectiveness of intervention programs.
        <br><strong>Source:</strong> Inspired by population health surveys and wellness programs.
        <br><strong>Statistical Relevance:</strong> Useful for studying central tendency and variability 
        in health metrics.
    `,
    house_prices: `
        <strong>House Prices (in USD):</strong> 
        This dataset represents selling prices of residential properties in suburban areas 
        over the past year. Each price reflects market conditions, neighborhood amenities, 
        and property features such as size and location. The dataset is used in real estate 
        market analysis to identify factors influencing property values.
        <br><strong>Source:</strong> Simulated data based on real estate reports.
        <br><strong>Statistical Relevance:</strong> Key for regression analysis and understanding 
        the spread of property values.
    `,
    exam_scores: `
        <strong>Exam Scores (out of 100):</strong> 
        This dataset contains scores from a standardized math exam administered to high school students 
        across various districts. It reveals the impact of socioeconomic factors, school resources, 
        and study habits on academic performance.
        <br><strong>Source:</strong> Simulated scores based on educational assessments.
        <br><strong>Statistical Relevance:</strong> Ideal for comparing distributions and testing hypotheses 
        related to education outcomes.
    `,
    heights: `
        <strong>Heights of Individuals (in centimeters):</strong> 
        This dataset comprises height measurements collected from a demographic survey. It highlights 
        variations across gender, age, and ethnic groups, providing valuable insights for studies in 
        anthropometry and ergonomics.
        <br><strong>Source:</strong> Derived from national demographic and health surveys.
        <br><strong>Statistical Relevance:</strong> Useful for studying normal distribution and variability 
        in physical attributes.
    `,
    salaries: `
        <strong>Annual Salaries (in USD):</strong> 
        This dataset includes income data for professionals across various industries and experience levels. 
        It sheds light on wage disparities, industry growth, and the influence of education on earning potential.
        <br><strong>Source:</strong> Simulated data based on labor market trends.
        <br><strong>Statistical Relevance:</strong> Critical for analyzing income distribution and 
        conducting correlation studies.
    `,
    ages: `
        <strong>Ages of Individuals (in years):</strong> 
        This dataset captures the ages of participants in a regional census, spanning children to seniors. 
        It reflects population age distribution trends, workforce demographics, and social service needs.
        <br><strong>Source:</strong> Census-inspired data.
        <br><strong>Statistical Relevance:</strong> Foundational for demographic studies and trend analysis.
    `,
    household_incomes: `
        <strong>Annual Household Incomes (in USD):</strong> 
        This dataset highlights household income distributions in urban and rural regions, skewed towards 
        lower income brackets. It provides insights into economic inequality, the impact of wage policies, 
        and consumer spending patterns.
        <br><strong>Source:</strong> Simulated data derived from economic studies.
        <br><strong>Statistical Relevance:</strong> Ideal for skewness analysis and policy impact studies.
    `,
    property_values: `
        <strong>Property Values (in USD):</strong> 
        This dataset consists of appraised values of residential properties in urban centers, emphasizing 
        high-value properties. It is essential for urban planning, real estate investment strategies, 
        and understanding housing market dynamics.
        <br><strong>Source:</strong> Based on real estate trends.
        <br><strong>Statistical Relevance:</strong> Useful for skewness studies and regression models.
    `,
    city_population_growth: `
        <strong>City Population Growth (in percentage):</strong> 
        This dataset tracks annual growth rates of cities, showcasing trends in emerging and mature urban 
        areas. It supports infrastructure planning and economic development strategies.
        <br><strong>Source:</strong> Simulated data inspired by global urbanization reports.
        <br><strong>Statistical Relevance:</strong> Crucial for trend analysis and predictive modeling.
    `,
    company_profits: `
        <strong>Annual Company Profits (in USD):</strong> 
        This dataset highlights net profits of businesses across industries, emphasizing small-to-medium 
        enterprises. It reflects market challenges, operational efficiency, and industry growth patterns.
        <br><strong>Source:</strong> Inspired by financial performance reports.
        <br><strong>Statistical Relevance:</strong> Key for studying profit distributions and economic health.
    `,
    rainfall_levels: `
        <strong>Annual Rainfall Levels (in centimeters):</strong> 
        This dataset provides rainfall measurements from tropical regions, showcasing annual variations 
        and their effects on agriculture and water resources.
        <br><strong>Source:</strong> Simulated based on meteorological data.
        <br><strong>Statistical Relevance:</strong> Essential for environmental modeling and trend analysis.
    `,
    running_speeds: `
        <strong>Running Speeds (in km/h):</strong> 
        This dataset contains average running speeds of athletes during training sessions, offering 
        insights into performance variations and training impacts.
        <br><strong>Source:</strong> Simulated athletic performance data.
        <br><strong>Statistical Relevance:</strong> Ideal for examining variability and fitness trends.
    `,
    blood_pressure: `
        <strong>Blood Pressure (in mmHg):</strong> 
        This dataset includes systolic blood pressure readings from clinical trials, helping to study 
        hypertension trends and treatment impacts.
        <br><strong>Source:</strong> Modeled after medical research studies.
        <br><strong>Statistical Relevance:</strong> Key for normal distribution analysis and health research.
    `,
    air_quality_index: `
        <strong>Air Quality Index:</strong> 
        This dataset tracks AQI measurements from urban and rural monitoring stations, highlighting pollution 
        trends and environmental health.
        <br><strong>Source:</strong> Based on global environmental monitoring data.
        <br><strong>Statistical Relevance:</strong> Crucial for studying skewed distributions and identifying trends.
    `,
    sales_figures: `
        <strong>Retail Sales Figures (in USD):</strong> 
        This dataset records monthly sales of retail stores, enabling the study of seasonal trends, 
        consumer behavior, and marketing effectiveness.
        <br><strong>Source:</strong> Derived from retail industry reports.
        <br><strong>Statistical Relevance:</strong> Useful for time series analysis and seasonality studies.
    `,
    reaction_times: `
        <strong>Reaction Times (in seconds):</strong> 
        This dataset captures cognitive reaction times from psychological experiments, providing insights 
        into cognitive processing speeds under different conditions.
        <br><strong>Source:</strong> Inspired by neuroscience studies.
        <br><strong>Statistical Relevance:</strong> Ideal for normal distribution analysis and hypothesis testing.
    `
};


// Event listener for updating dataset description
document.getElementById('dataset-selector').addEventListener('change', () => {
    const datasetName = document.getElementById('dataset-selector').value;
    const population = datasets[datasetName];

    if (!population) {
        alert('Invalid dataset selected.');
        return;
    }

    // Update dataset description
    const description = datasetDescriptions[datasetName] || "<strong>Description:</strong> No description available.";
    document.getElementById('dataset-description').innerHTML = description;

    // Plot the population distribution
    plotPopulationDistribution(population);

    // Calculate and display population mean
    const populationMean = population.reduce((sum, value) => sum + value, 0) / population.length;
    document.getElementById('population-mean-value').textContent = populationMean.toFixed(2);
});


// Integrate Summary Statistics into Population Distribution
function plotPopulationDistribution(dataset) {
    const ctx = document.getElementById('population-chart').getContext('2d');

    if (window.populationChart) {
        window.populationChart.destroy(); // Destroy existing chart
    }

    const color = document.getElementById('population-color').value; // Get user-selected color

    // Generate histogram bins
    const min = Math.min(...dataset);
    const max = Math.max(...dataset);
    const bins = 10;
    const binWidth = (max - min) / bins;
    const frequencies = Array(bins).fill(0);

    dataset.forEach(value => {
        const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
        frequencies[binIndex]++;
    });

    const labels = Array.from({ length: bins }, (_, i) => (min + i * binWidth).toFixed(2));

    window.populationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Frequency',
                data: frequencies,
                backgroundColor: color,
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                x: { title: { display: true, text: 'Value' } },
                y: { title: { display: true, text: 'Frequency' } },
            },
        },
    });

    // Calculate and display summary statistics
    const stats = calculateSummaryStatistics(dataset);
    document.getElementById('population-mean-value').textContent = stats.mean.toFixed(2);

    document.getElementById('population-summary').innerHTML = `
        <h3>Population Summary Statistics</h3>
        <p>Mean: ${stats.mean.toFixed(2)}</p>
        <p>Median: ${stats.median.toFixed(2)}</p>
        <p>Min: ${stats.min.toFixed(2)}</p>
        <p>Max: ${stats.max.toFixed(2)}</p>
        <p>Q1: ${stats.q1.toFixed(2)}</p>
        <p>Q3: ${stats.q3.toFixed(2)}</p>
        <p>Range: ${stats.range.toFixed(2)}</p>
        <p>IQR: ${stats.iqr.toFixed(2)}</p>
        <p>Standard Deviation: ${stats.stdDev.toFixed(2)}</p>
        <p>Skewness: ${stats.skewness.toFixed(2)}</p>
        <p>Kurtosis: ${stats.kurtosis.toFixed(2)}</p>
    `;
}



// Population Distribution
document.getElementById('apply-population-color').addEventListener('click', () => {
    const datasetName = document.getElementById('dataset-selector').value;
    const population = datasets[datasetName];

    if (population) {
        plotPopulationDistribution(population); // Re-render chart
    }
});

// Generate a random sample and display statistics
document.getElementById('generate-sample').addEventListener('click', () => {
    const datasetName = document.getElementById('dataset-selector').value;
    const sampleSize = parseInt(document.getElementById('sample-size-selector').value, 10);
    const population = datasets[datasetName];

    if (!population || sampleSize <= 0) {
        alert('Please select a valid dataset and sample size.');
        return;
    }

    const sample = drawRandomSample(population, sampleSize);
    displaySampleStatistics(sample);
});


// Draw a random sample from the population
function drawRandomSample(population, size) {
    const sample = [];
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * population.length);
        sample.push(population[randomIndex]);
    }
    return sample;
}

// Integrate Summary Statistics into Sample Statistics
function displaySampleStatistics(sample) {
    const stats = calculateSummaryStatistics(sample);

    document.getElementById('sample-output').innerHTML = `
        <h3>Sample Summary Statistics</h3>
        <p>Sample Size: ${sample.length}</p>
        <p>Mean: ${stats.mean.toFixed(2)}</p>
        <p>Median: ${stats.median.toFixed(2)}</p>
        <p>Min: ${stats.min.toFixed(2)}</p>
        <p>Max: ${stats.max.toFixed(2)}</p>
        <p>Q1: ${stats.q1.toFixed(2)}</p>
        <p>Q3: ${stats.q3.toFixed(2)}</p>
        <p>Range: ${stats.range.toFixed(2)}</p>
        <p>IQR: ${stats.iqr.toFixed(2)}</p>
        <p>Standard Deviation: ${stats.stdDev.toFixed(2)}</p>
        <p>Skewness: ${stats.skewness.toFixed(2)}</p>
        <p>Kurtosis: ${stats.kurtosis.toFixed(2)}</p>
    `;
}

// Sampling Distribution Implementation
document.getElementById('generate-sampling-distribution').addEventListener('click', () => {
    const datasetName = document.getElementById('dataset-selector').value;
    const numSamples = parseInt(document.getElementById('num-samples').value, 10);
    const sampleSize = parseInt(document.getElementById('sample-size').value, 10);
    const population = datasets[datasetName];

    if (!population || numSamples <= 0 || sampleSize <= 0 || sampleSize > population.length) {
        alert('Invalid inputs. Ensure sample size is less than population size.');
        return;
    }

    const sampleMeans = [];
    for (let i = 0; i < numSamples; i++) {
        const sample = drawRandomSample(population, sampleSize);
        const mean = sample.reduce((sum, value) => sum + value, 0) / sample.length;
        sampleMeans.push(mean);
    }

    displaySamplingDistribution(sampleMeans);
    displaySamplingSummary(sampleMeans);
});


function displaySamplingDistribution(sampleMeans) {
    const ctx = document.getElementById('sampling-chart').getContext('2d');

    if (window.samplingChart) {
        window.samplingChart.destroy(); // Destroy existing chart
    }

    const color = document.getElementById('sampling-color').value; // Get user-selected color

    // Generate histogram bins
    const min = Math.min(...sampleMeans);
    const max = Math.max(...sampleMeans);
    const bins = 10;
    const binWidth = (max - min) / bins;
    const frequencies = Array(bins).fill(0);

    sampleMeans.forEach(mean => {
        const binIndex = Math.min(Math.floor((mean - min) / binWidth), bins - 1);
        frequencies[binIndex]++;
    });

    const labels = Array.from({ length: bins }, (_, i) => (min + i * binWidth).toFixed(2));

    window.samplingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Frequency',
                data: frequencies,
                backgroundColor: color,
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                x: { title: { display: true, text: 'Sample Means' } },
                y: { title: { display: true, text: 'Frequency' } },
            },
        },
    });
}


// Sampling Distribution
document.getElementById('apply-sampling-color').addEventListener('click', () => {
    const sampleMeans = window.sampleMeans || [];

    if (sampleMeans.length > 0) {
        displaySamplingDistribution(sampleMeans); // Re-render chart
    } else {
        alert('Generate a sampling distribution first.');
    }
});


function plotDensityCurve(sampleMeans) {
    const ctx = document.getElementById('density-chart').getContext('2d');

    // Destroy any existing chart
    if (window.densityChart) {
        window.densityChart.destroy();
    }

    // Compute density curve data
    const mean = sampleMeans.reduce((sum, value) => sum + value, 0) / sampleMeans.length;
    const variance = sampleMeans.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (sampleMeans.length - 1);
    const stdDev = Math.sqrt(variance);

    const densityData = [];
    const xValues = [];
    const minX = Math.min(...sampleMeans) - 2 * stdDev;
    const maxX = Math.max(...sampleMeans) + 2 * stdDev;
    const step = (maxX - minX) / 100;

    for (let x = minX; x <= maxX; x += step) {
        const density = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
        densityData.push(density);
        xValues.push(x.toFixed(2)); // Round to two decimal places
    }

    // Create the chart
    window.densityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [
                {
                    label: 'Density Curve',
                    data: densityData,
                    borderColor: '#ff5722',
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: 'Sample Means' },
                },
                y: {
                    title: { display: true, text: 'Density' },
                },
            },
        },
    });
}


// Call this after generating the sampling distribution
document.getElementById('generate-sampling-distribution').addEventListener('click', () => {
    const datasetName = document.getElementById('dataset-selector').value;
    const numSamples = parseInt(document.getElementById('num-samples').value, 10);
    const sampleSize = parseInt(document.getElementById('sample-size').value, 10);
    const population = datasets[datasetName];

    if (!population || numSamples <= 0 || sampleSize <= 0) {
        alert('Please select valid inputs.');
        return;
    }

    const sampleMeans = [];
    for (let i = 0; i < numSamples; i++) {
        const sample = drawRandomSample(population, sampleSize);
        const mean = sample.reduce((sum, value) => sum + value, 0) / sample.length;
        sampleMeans.push(mean);
    }

    window.sampleMeans = sampleMeans; // Save sample means for density curve
    displaySamplingDistribution(sampleMeans);
    displaySamplingSummary(sampleMeans);
    enableExport(sampleMeans);
    plotDensityCurve(sampleMeans); // Plot density curve
});


// Integrate Summary Statistics into Sampling Distribution
function displaySamplingSummary(sampleMeans) {
    const stats = calculateSummaryStatistics(sampleMeans);

    document.getElementById('sampling-summary').innerHTML = `
        <h3>Sampling Distribution Summary</h3>
        <p>Mean of Sample Means: ${stats.mean.toFixed(2)}</p>
        <p>Median: ${stats.median.toFixed(2)}</p>
        <p>Min: ${stats.min.toFixed(2)}</p>
        <p>Max: ${stats.max.toFixed(2)}</p>
        <p>Q1: ${stats.q1.toFixed(2)}</p>
        <p>Q3: ${stats.q3.toFixed(2)}</p>
        <p>Range: ${stats.range.toFixed(2)}</p>
        <p>IQR: ${stats.iqr.toFixed(2)}</p>
        <p>Standard Deviation: ${stats.stdDev.toFixed(2)}</p>
        <p>Skewness: ${stats.skewness.toFixed(2)}</p>
        <p>Kurtosis: ${stats.kurtosis.toFixed(2)}</p>
    `;
}

// Call this function after generating the sampling distribution
document.getElementById('generate-sampling-distribution').addEventListener('click', () => {
    const datasetName = document.getElementById('dataset-selector').value;
    const numSamples = parseInt(document.getElementById('num-samples').value, 10);
    const sampleSize = parseInt(document.getElementById('sample-size').value, 10);
    const population = datasets[datasetName];

    if (!population || numSamples <= 0 || sampleSize <= 0) {
        alert('Please select valid inputs.');
        return;
    }

    const sampleMeans = [];
    for (let i = 0; i < numSamples; i++) {
        const sample = drawRandomSample(population, sampleSize);
        const mean = sample.reduce((sum, value) => sum + value, 0) / sample.length;
        sampleMeans.push(mean);
    }

    displaySamplingDistribution(sampleMeans);
    displaySamplingSummary(sampleMeans); // Call to display summary statistics
    enableExport(sampleMeans);
});

// Function to calculate the z-score for a confidence level
function getZScore(confidenceLevel) {
    const alpha = 1 - confidenceLevel / 100;
    return -1 * jStat.normal.inv(alpha / 2, 0, 1); // Using jStat for precision
}

// Calculate CI for the sampling distribution
document.getElementById('calculate-sampling-ci').addEventListener('click', () => {
    const samplingConfidenceLevel = parseFloat(
        document.getElementById('sampling-confidence-level').value
    );

    if (!window.sampleMeans || samplingConfidenceLevel <= 0 || samplingConfidenceLevel > 100) {
        alert('Generate a sampling distribution first and enter a valid confidence level.');
        return;
    }

    // Compute mean and standard deviation of the sampling distribution
    const mean = window.sampleMeans.reduce((sum, value) => sum + value, 0) / window.sampleMeans.length;
    const variance = window.sampleMeans.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (window.sampleMeans.length - 1);
    const stdDev = Math.sqrt(variance);

    // Compute confidence interval
    const zScore = getZScore(samplingConfidenceLevel);
    const marginOfError = zScore * (stdDev / Math.sqrt(window.sampleMeans.length));
    const lowerBound = mean - marginOfError;
    const upperBound = mean + marginOfError;

    // Display the confidence interval
    document.getElementById('sampling-ci-output').innerHTML = `
        <p>Confidence Level: ${samplingConfidenceLevel}%</p>
        <p>Mean of Sample Means: ${mean.toFixed(2)}</p>
        <p>Margin of Error: ${marginOfError.toFixed(2)}</p>
        <p>Confidence Interval: (${lowerBound.toFixed(2)}, ${upperBound.toFixed(2)})</p>
    `;

    // Plot the confidence interval
    plotSamplingConfidenceInterval(mean, lowerBound, upperBound);
});

function plotSamplingConfidenceInterval(mean, lowerBound, upperBound) {
    const ctx = document.getElementById('sampling-ci-chart').getContext('2d');

    // Destroy any existing chart
    if (window.samplingCIChart) {
        window.samplingCIChart.destroy();
    }

    const labels = Array.from({ length: 100 }, (_, i) => i + 1); // Arbitrary x-axis labels for visualization
    const ciLower = Array(labels.length).fill(lowerBound.toFixed(2)); // Lower bound line
    const ciUpper = Array(labels.length).fill(upperBound.toFixed(2)); // Upper bound line
    const meanLine = Array(labels.length).fill(mean.toFixed(2)); // Mean line

    // Create the chart
    window.samplingCIChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Confidence Interval (Upper Bound)',
                    data: ciUpper,
                    borderColor: 'rgba(144, 238, 144, 1)',
                    fill: '+1',
                    backgroundColor: 'rgba(144, 238, 144, 0.2)',
                },
                {
                    label: 'Confidence Interval (Lower Bound)',
                    data: ciLower,
                    borderColor: 'rgba(255, 182, 193, 1)',
                },
                {
                    label: 'Mean',
                    data: meanLine,
                    borderColor: '#0078d7',
                    borderDash: [5, 5],
                },
            ],
        },
        options: {
            responsive: true,
            animation: {
                duration: 1200, // 1.2-second animation
                easing: 'easeOutBounce', // Bouncy easing
            },
            scales: {
                x: {
                    title: { display: true, text: 'Sample Index (Visualization Purpose)' },
                },
                y: {
                    title: { display: true, text: 'Value' },
                    beginAtZero: false,
                },
            },
        },
    });

}

// Function to calculate and update confidence interval based on confidence level
function updateConfidenceLevelComparison(confidenceLevel) {
    if (!window.sampleMeans || window.sampleMeans.length === 0) {
        alert('Please generate a sampling distribution first.');
        return;
    }

    // Compute mean and standard deviation of sample means
    const mean = window.sampleMeans.reduce((sum, value) => sum + value, 0) / window.sampleMeans.length;
    const variance = window.sampleMeans.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (window.sampleMeans.length - 1);
    const stdDev = Math.sqrt(variance);

    // Calculate z-score
    const zScore = getZScore(confidenceLevel);

    // Calculate confidence interval
    const marginOfError = zScore * (stdDev / Math.sqrt(window.sampleMeans.length));
    const lowerBound = mean - marginOfError;
    const upperBound = mean + marginOfError;

    // Update numerical display
    document.getElementById('confidence-level-value').textContent = `${confidenceLevel}%`;
    document.getElementById('confidence-interval').textContent = `(${lowerBound.toFixed(2)}, ${upperBound.toFixed(2)})`;

    // Update chart
    const ctx = document.getElementById('confidence-comparison-chart').getContext('2d');

    // Destroy previous chart if it exists
    if (window.confidenceComparisonChart) {
        window.confidenceComparisonChart.destroy();
    }

    // Create new chart for confidence level comparison
    window.confidenceComparisonChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 100 }, (_, i) => i + 1), // Arbitrary x-axis for visualization
            datasets: [
                {
                    label: 'Confidence Interval (Lower Bound)',
                    data: Array(100).fill(lowerBound.toFixed(2)),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    fill: false,
                },
                {
                    label: 'Confidence Interval (Upper Bound)',
                    data: Array(100).fill(upperBound.toFixed(2)),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    fill: false,
                },
                {
                    label: 'Mean',
                    data: Array(100).fill(mean.toFixed(2)),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderDash: [5, 5],
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Index (Visualization Purpose)' } },
                y: { title: { display: true, text: 'Value' } },
            },
        },
    });
}

// Event listener for confidence level slider
document.getElementById('confidence-level-slider').addEventListener('input', (event) => {
    const confidenceLevel = parseInt(event.target.value, 10);
    updateConfidenceLevelComparison(confidenceLevel);
});

// Initialize the confidence level comparison after sampling distribution is generated
document.getElementById('generate-sampling-distribution').addEventListener('click', () => {
    const slider = document.getElementById('confidence-level-slider');
    updateConfidenceLevelComparison(parseInt(slider.value, 10));
});


function plotHypothesisBellCurve(stdDev, tScoreCriticalLow, tScoreCriticalHigh, tScorePValue, populationMean, testType) {
    const ctx = document.getElementById('hypothesis-bell-curve').getContext('2d');

    // Destroy any existing chart
    if (window.hypothesisBellCurve) {
        window.hypothesisBellCurve.destroy();
    }

    // Generate data for the t-distribution curve
    const tValues = [];
    const yValues = [];
    const step = 0.1; // Step size for t-scores

    for (let t = -4; t <= 4; t += step) {
        const y = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * t ** 2); // Standard normal density
        tValues.push(t.toFixed(2));
        yValues.push(y);
    }

    // Create the chart
    window.hypothesisBellCurve = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tValues, // T-scores on the x-axis
            datasets: [
                {
                    label: 'T-Distribution',
                    data: yValues,
                    borderColor: '#4caf50',
                    fill: false,
                },
                {
                    label: 'Rejection Region',
                    data: tValues.map((t, i) => {
                        if (testType === 'two-tailed') {
                            return t < tScoreCriticalLow || t > tScoreCriticalHigh ? yValues[i] : null;
                        } else if (testType === 'one-tailed-lower') {
                            return t < tScoreCriticalLow ? yValues[i] : null;
                        } else if (testType === 'one-tailed-upper') {
                            return t > tScoreCriticalHigh ? yValues[i] : null;
                        }
                    }),
                    borderColor: 'rgba(255, 99, 132, 0.5)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                },
                {
                    label: 'P-Value Region',
                    data: tValues.map((t, i) => {
                        if (testType === 'two-tailed') {
                            return Math.abs(t) >= Math.abs(tScorePValue) ? yValues[i] : null;
                        } else if (testType === 'one-tailed-lower') {
                            return t <= tScorePValue ? yValues[i] : null;
                        } else {
                            return t >= tScorePValue ? yValues[i] : null;
                        }
                    }),
                    borderColor: 'rgba(0, 123, 255, 0.5)',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    fill: true,
                },
                {
                    label: 'Population Mean (T=0)',
                    data: tValues.map((t, i) =>
                        Math.abs(t) < step ? yValues[i] : null
                    ),
                    borderColor: '#ffa500',
                    borderDash: [5, 5],
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: 'T-Score' },
                },
                y: {
                    title: { display: true, text: 'Density' },
                },
            },
        },
    });
}



document.getElementById('run-hypothesis-test').addEventListener('click', () => {
    if (!window.sampleMeans) {
        alert('Please generate a sampling distribution first.');
        return;
    }

    const nullHypothesisInput = document.getElementById('null-hypothesis').value;
    const testType = document.getElementById('test-type').value;
    const significanceLevel = parseFloat(document.getElementById('significance-level').value);

    // Parse the null hypothesis
    const match = /Mean\s*=\s*([0-9.]+)/i.exec(nullHypothesisInput);
    if (!match) {
        alert('Invalid null hypothesis format. Use "Mean = value".');
        return;
    }
    const nullMean = parseFloat(match[1]);

    // Generate hypothesis statements
    let hypothesisStatement;
    if (testType === 'two-tailed') {
        hypothesisStatement = `
            <p><strong>Null Hypothesis (H₀):</strong> Population mean = ${nullMean}</p>
            <p><strong>Alternative Hypothesis (Hₐ):</strong> Population mean ≠ ${nullMean}</p>
        `;
    } else if (testType === 'one-tailed-lower') {
        hypothesisStatement = `
            <p><strong>Null Hypothesis (H₀):</strong> Population mean ≥ ${nullMean}</p>
            <p><strong>Alternative Hypothesis (Hₐ):</strong> Population mean < ${nullMean}</p>
        `;
    } else {
        hypothesisStatement = `
            <p><strong>Null Hypothesis (H₀):</strong> Population mean ≤ ${nullMean}</p>
            <p><strong>Alternative Hypothesis (Hₐ):</strong> Population mean > ${nullMean}</p>
        `;
    }

    // Calculate sample mean and standard deviation
    const sampleMean = window.sampleMeans.reduce((sum, value) => sum + value, 0) / window.sampleMeans.length;
    const variance = window.sampleMeans.reduce((sum, value) => sum + Math.pow(value - sampleMean, 2), 0) / (window.sampleMeans.length - 1);
    const stdDev = Math.sqrt(variance);
    const se = stdDev / Math.sqrt(window.sampleMeans.length); // Standard error

    // Compute t-scores for critical regions
    const alpha = significanceLevel;
    let tScoreCriticalLow, tScoreCriticalHigh;
    if (testType === 'two-tailed') {
        tScoreCriticalLow = -jStat.studentt.inv(1 - alpha / 2, window.sampleMeans.length - 1);
        tScoreCriticalHigh = jStat.studentt.inv(1 - alpha / 2, window.sampleMeans.length - 1);
    } else if (testType === 'one-tailed-lower') {
        tScoreCriticalLow = -jStat.studentt.inv(1 - alpha, window.sampleMeans.length - 1);
        tScoreCriticalHigh = 0; // No upper rejection region
    } else {
        tScoreCriticalLow = 0; // No lower rejection region
        tScoreCriticalHigh = jStat.studentt.inv(1 - alpha, window.sampleMeans.length - 1);
    }

    // Compute t-score for the sample mean
    const tScorePValue = (sampleMean - nullMean) / se;

    // Visualize the hypothesis test
    plotHypothesisBellCurve(stdDev, tScoreCriticalLow, tScoreCriticalHigh, tScorePValue, nullMean, testType);

    // Display test results
    const rejectNull = tScorePValue < tScoreCriticalLow || tScorePValue > tScoreCriticalHigh;
    document.getElementById('hypothesis-result').innerHTML = `
        <h3>Hypothesis Test Results</h3>
        ${hypothesisStatement}
        <p>Sample Mean: ${sampleMean.toFixed(2)}</p>
        <p>Critical T-Scores: (${tScoreCriticalLow.toFixed(2)}, ${tScoreCriticalHigh.toFixed(2)})</p>
        <p>P-Value: ${jStat.studentt.cdf(tScorePValue, window.sampleMeans.length - 1).toFixed(4)}</p>
        <p>Conclusion: ${rejectNull ? 'Reject' : 'Fail to Reject'} H₀</p>
    `;
});



// Hypothesis Test Functionality
document.getElementById('run-hypothesis-test').addEventListener('click', () => {
    if (!window.sampleMeans) {
        alert('Please generate a sampling distribution first.');
        return;
    }

    const nullHypothesisInput = document.getElementById('null-hypothesis').value;
    const testType = document.getElementById('test-type').value;
    const significanceLevel = parseFloat(document.getElementById('significance-level').value);

    // Parse the null hypothesis
    const match = /Mean\s*=\s*([0-9.]+)/i.exec(nullHypothesisInput);
    if (!match) {
        alert('Invalid null hypothesis format. Use "Mean = value".');
        return;
    }
    const nullMean = parseFloat(match[1]);

    // Calculate sample mean and standard deviation
    const sampleMean = window.sampleMeans.reduce((sum, value) => sum + value, 0) / window.sampleMeans.length;
    const variance = window.sampleMeans.reduce((sum, value) => sum + Math.pow(value - sampleMean, 2), 0) / (window.sampleMeans.length - 1);
    const stdDev = Math.sqrt(variance);

    // Compute t-score
    const tScore = (sampleMean - nullMean) / (stdDev / Math.sqrt(window.sampleMeans.length));

    // Compute p-value based on test type
    let pValue;
    if (testType === 'two-tailed') {
        pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tScore), window.sampleMeans.length - 1));
    } else if (testType === 'one-tailed-lower') {
        pValue = jStat.studentt.cdf(tScore, window.sampleMeans.length - 1);
    } else {
        pValue = 1 - jStat.studentt.cdf(tScore, window.sampleMeans.length - 1);
    }

    // Determine if the null hypothesis is rejected
    const rejectNull = pValue < significanceLevel;

    // Display results
    document.getElementById('hypothesis-result').innerHTML = `
        <h3>Hypothesis Test Results</h3>
        <p>Sample Mean: ${sampleMean.toFixed(2)}</p>
        <p>T-Score: ${tScore.toFixed(2)}</p>
        <p>P-Value: ${pValue.toFixed(4)}</p>
        <p>Significance Level (α): ${significanceLevel}</p>
        <p>Conclusion: ${rejectNull ? 'Reject' : 'Fail to Reject'} H₀</p>
    `;
});


document.getElementById('generate-sampling-distribution').addEventListener('click', () => {
    const datasetName = document.getElementById('dataset-selector').value;
    const numSamples = parseInt(document.getElementById('num-samples').value, 10);
    const sampleSize = parseInt(document.getElementById('sample-size').value, 10);
    const population = datasets[datasetName];

    if (!population || numSamples <= 0 || sampleSize <= 0) {
        alert('Please select valid inputs.');
        return;
    }

    const sampleMeans = [];
    for (let i = 0; i < numSamples; i++) {
        const sample = drawRandomSample(population, sampleSize);
        const mean = sample.reduce((sum, value) => sum + value, 0) / sample.length;
        sampleMeans.push(mean);
    }

    window.sampleMeans = sampleMeans; // Save the sample means for CI calculation
    displaySamplingDistribution(sampleMeans);
    displaySamplingSummary(sampleMeans);
    enableExport(sampleMeans);
});


// Enable export functionality
function enableExport(sampleMeans) {
    const exportButton = document.getElementById('export-data');
    exportButton.style.display = 'block';

    exportButton.addEventListener('click', () => {
        const rows = sampleMeans.map((mean, index) => ({
            Sample: index + 1,
            Mean: mean.toFixed(2),
        }));

        const csvContent = 'data:text/csv;charset=utf-8,' +
            ['Sample,Mean', ...rows.map(row => `${row.Sample},${row.Mean}`)].join('\n');

        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', 'sampling_distribution.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

// Enable export functionality for Sampling Distribution Summary
document.getElementById('export-data').addEventListener('click', () => {
    const summaryBox = document.getElementById('sampling-summary');

    if (!summaryBox || summaryBox.innerHTML.trim() === '') {
        alert('No summary data to export.');
        return;
    }

    const rows = [];
    summaryBox.querySelectorAll('p').forEach((p) => {
        const parts = p.textContent.split(':');
        if (parts.length === 2) {
            rows.push({ key: parts[0].trim(), value: parts[1].trim() });
        }
    });

    const csvContent =
        'data:text/csv;charset=utf-8,' +
        ['Metric,Value', ...rows.map(row => `${row.key},${row.value}`)].join('\n');

    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'sampling_distribution_summary.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});


// Export Population Distribution Chart
document.getElementById('export-population-chart').addEventListener('click', () => {
    if (window.populationChart) {
        exportChart(window.populationChart, 'population_distribution.png');
    } else {
        alert('No population chart to export.');
    }
});

// Export Sampling Distribution Chart
document.getElementById('export-sampling-chart').addEventListener('click', () => {
    if (window.samplingChart) {
        exportChart(window.samplingChart, 'sampling_distribution.png');
    } else {
        alert('No sampling chart to export.');
    }
});

// Export Confidence Interval Chart
document.getElementById('export-ci-chart').addEventListener('click', () => {
    if (window.samplingCIChart) {
        exportChart(window.samplingCIChart, 'confidence_interval.png');
    } else {
        alert('No confidence interval chart to export.');
    }
});

// Export Hypothesis Test Chart
document.getElementById('export-hypothesis-chart').addEventListener('click', () => {
    if (window.hypothesisBellCurve) {
        exportChart(window.hypothesisBellCurve, 'hypothesis_test.png');
    } else {
        alert('No hypothesis test chart to export.');
    }
});
