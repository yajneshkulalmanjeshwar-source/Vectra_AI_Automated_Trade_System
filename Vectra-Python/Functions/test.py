import yfinance as yf

def fetch():
    # Fetch intraday data for 1-minute intervals
    stock_symbol = "TSLA"
    data = yf.download(stock_symbol, interval="1m", start="2024-11-29", end="2024-12-02")
    data = data[['Open', 'High', 'Low', 'Close', 'Volume']]
    data.head()
    return data

