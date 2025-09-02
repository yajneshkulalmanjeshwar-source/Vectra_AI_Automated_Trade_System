import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, LSTM, Dropout
from keras.callbacks import EarlyStopping
from Functions_V2.TechnicalIndicators_V2 import TechnicalIndicators
import pickle


def preProcessData_v2_5min(data,stockName):

    
    # Fill missing values (if any)
    data.fillna(method='ffill', inplace=True)

    # Select relevant columns
    features = ['Open', 'High', 'Low', 'Close', 'Volume']
    technical_indicators = ['SMA', 'MACD', 'RSI']
    data = data[features]

    completeData=TechnicalIndicators(data)
    
    # Scale the data
    scaler = MinMaxScaler(feature_range=(0, 1))

    
    data_scaled = scaler.fit_transform(completeData[features + technical_indicators])
    step=60
    future_steps=5 # predicting next 5 price

    X, y = [], []
    for i in range(step, len(data) - future_steps + 1):
        X.append(data_scaled[i - step:i])  # Use the past `step` time steps
        y.append(data_scaled[i:i + future_steps, 3])  # Predict the next `future_steps` closing prices
    X_train, y_train =np.array(X), np.array(y)

    with open('./Functions_V2_5MIN/Scaler/scaler_'+stockName+'_5MIN.pkl', 'wb') as f:
                pickle.dump(scaler, f)


    return X_train, y_train, scaler

