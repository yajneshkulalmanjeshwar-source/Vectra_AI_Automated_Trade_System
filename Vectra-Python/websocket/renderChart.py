from flask import Flask, render_template_string
import pandas as pd
import altair as alt
import numpy as np
import json
import os


app = Flask(__name__)

def load_shared_data():
    """Load chart data from the shared JSON file."""
    if os.path.exists("chart_array.npy"):
        data= np.load('chart_array.npy')
        return data[0], data[1], data[2]
    return [], [], []

def generate_chart(real_prices, predicted_prices_1,  predicted_prices_2):
    """Generate Altair chart."""
    if real_prices.size == 0 or predicted_prices_1.size == 0 or predicted_prices_2.size == 0:
        return "No data available to plot yet."
    
    data = pd.DataFrame({
        "Time": range(len(real_prices)),
        "Real_Prices": real_prices.flatten(),
        "Predicted_Prices_1": predicted_prices_1.flatten(),
        "Predicted_Prices_2": predicted_prices_2.flatten()
    })

    real_line = alt.Chart(data).mark_line(color="green").encode(
        x="Time",
        y="Real_Prices"
    )

    predicted_line_1 = alt.Chart(data).mark_line(color="blue").encode(
        x="Time",
        y="Predicted_Prices_1"
    )
    predicted_line_2 = alt.Chart(data).mark_line(color="red").encode(
        x="Time",
        y="Predicted_Prices_2"
    )
    # Points with tooltips
    real_points = alt.Chart(data).mark_point(color="green", size=10).encode(
        x="Time",
        y="Real_Prices",
        tooltip=["Time", "Real_Prices"]
    )

    predicted_points_1 = alt.Chart(data).mark_point(color="blue", size=10).encode(
        x="Time",
        y="Predicted_Prices_1",
        tooltip=["Time", "Predicted_Prices_1"]
    )

    predicted_points_2 = alt.Chart(data).mark_point(color="red", size=10).encode(
        x="Time",
        y="Predicted_Prices_2",
        tooltip=["Time", "Predicted_Prices_2"]
    )




    return (real_line + predicted_line_1 + predicted_line_2 + real_points + predicted_points_1 + predicted_points_2).properties(
        title="Predicted vs Real Prices",
        width=1400,
        height=750
    ).add_selection(
        alt.selection_interval(bind="scales", encodings=["y"])  # Enable zooming only on y-axis
    ).to_html()

@app.route("/")
def index():
    real_prices, predicted_prices_1,  predicted_prices_2= load_shared_data()
    chart_html = generate_chart(real_prices, predicted_prices_1,  predicted_prices_2)
    html_template = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Stock Prices</title>
        <!-- <meta http-equiv="refresh" content="60">  Refresh every minute -->
    </head>
    <body>
        <h1>Predicted vs Real Prices</h1>
        {chart_html}
    </body>
    </html>
    """
    return render_template_string(html_template)

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
