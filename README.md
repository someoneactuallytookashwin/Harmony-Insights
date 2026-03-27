# Harmony Insights 

**Harmony Insights** is a powerful data analysis tool designed to provide valuable insights into personalized Spotify music trends and user behavior. This interactive web-based dashboard, developed using **D3.js**, aims to serve **Spotify's management, users, and artists** by analyzing streaming history and understanding user activity.

## Features
- **Personalized Insights**: Analyzes Spotify user listening habits and preferences. **(In this case i used my own spotify data)**
- **Interactive Visualizations**: Utilizes D3.js for **line charts, bar charts, and bubble plots**.
- **Spotify Data Analysis**: Extracts insights from **streaming timestamps, song metadata, and user behavior**.
- **User Engagement**: Enhances the Spotify experience by helping understand their own music taste a bit better. 

## Project Structure
- **index.html**: Main Dashboard entry point.
- **style.css**: Stylesheet for the UI Design.
- **main.js**: Core logic for the Dashboard.
- **LineChart.js**: Line chart for streaming trends.
- **verticalChart.js**: Vertical bar chart for activity insights.
- **horizontalChart.js**: Horizontal bar chart for user analysis.
- **BubblePlot.js**: Bubble plot for track popularity.
- **data/merged_streamingHistory.csv**: Combined Spotify streaming history used by the dashboard.

## Data Processing Pipeline
1. **Data Collection**: Spotify streaming history dataset with timestamps, song metadata, and user details.
2. **Data Cleaning & Integration**: Extracting meaningful insights through **feature engineering**.
3. **Prototyping**: Initial **Tableau mockups** refined into **low-fidelity prototypes**.
4. **Final Implementation**: Interactive **D3.js** dashboard.

## Key Visualizations
- **Top Artists Dashboard**: Highlights user’s **most-played** artists (e.g., The Weeknd, Drake).
- **Monthly Streaming Patterns**: Shows peaks and dips in music activity.
- **Bubble Chart**: Visualizes track popularity using bubble sizes.
- **Listening Behavior Analysis**: Extracts trends to improve **personalized recommendations**.

## Installation & Usage
1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/Harmony-Insights-3.git
   ```
2. **Navigate to the project directory:**
   ```sh
   cd Harmony-Insights-3
   ```
3. **Host locally (recommended):**
   ```sh
   python3 -m http.server 8000
   ```
4. **Open the dashboard in your browser:**
   - [http://localhost:8000](http://localhost:8000)

### Why local hosting is required
The dashboard loads CSV data with D3 (`d3.csv(...)`). Most browsers block local file data requests when opened via `file://`, so opening `index.html` directly can result in empty charts.

### Stop the local server
In the same terminal running the server, press `Ctrl + C`.

## Dependencies
- **D3.js v7** (for interactive visualizations)
- Modern Web Browser (Chrome, Firefox, etc.)

## Harmony Insights Poster
[📄 Harmony Insights Poster](Poster.pdf)

