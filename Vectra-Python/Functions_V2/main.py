lags=[1,2,3,4,5,6,7,8,9,10]  # Lag intervals
for lag in lags:
        # data[f'Close_Lag_{lag}'] = data['close'].shift(lag)
        # data[f'Volume_Lag_{lag}'] = data['volume'].shift(lag)
        # # Add lags for any technical indicators as needed
        # data[f'RSI_Lag_{lag}'] = data['RSI'].shift(lag)
        # data[f'MACD_Lag_{lag}'] = data['MACD'].shift(lag)
        print(f'\'RSI_Lag_{lag}\',')



        #   data[f'ATR_Lag_{lag}'] = data['ATR'].shift(lag)
        # data[f'Volume_pct_change_Lag_{lag}'] = data['Volume_pct_change'].shift(lag)
        # data[f'Volume_Lag_{lag}'] = data['Volume'].shift(lag)
        # data[f'MACD_Lag_{lag}'] = data['MACD'].shift(lag)
        # data[f'RSI_Lag_{lag}'] = data['RSI'].shift(lag)
