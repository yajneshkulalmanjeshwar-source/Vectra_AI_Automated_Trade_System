import numpy as np

import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler

from Functions_V2.TechnicalIndicators_V2 import TechnicalIndicators
import pickle


def predictPreProcessData(data):


    # Fill missing values (if any)
    data.fillna(method='ffill', inplace=True)

   # Select relevant columns
    features = ['Open', 'High', 'Low', 'Close', 'Volume']
    technical_indicators = ['SMA', 'MACD', 'RSI' , 'RSI_14' , 'RSI_7' , 'RSI_28']
    additional_featurs=['ATR', 'Short_Term_SD', 'Long_Term_SD' , '%K' , '%D' , 'Williams_%R' , 'Parabolic_SAR' , 'PSAR_Signal' , 'PSAR_Reversal' , 'BB_Middle' , 'BB_Upper' , 'BB_Lower' , 'BB_Distance' , 'BB_Bandwidth' , 'OBV' , 'VWAP']
    lags_featurs=['Open_Lag_1' , 'Open_Lag_2' , 'Open_Lag_3' , 'High_Lag_1' , 'High_Lag_2' , 'High_Lag_3' , 'Low_Lag_1' , 'Low_Lag_2' , 'Low_Lag_3' , 'Close_Lag_1' , 'Close_Lag_2' , 'Close_Lag_3' , 'Volume_Lag_1' , 'Volume_Lag_2' , 'Volume_Lag_3']
    timestamp_feature=['Sin_Hour' , 'Cos_Hour' , 'Sin_Day_of_Week' , 'Cos_Day_of_Week' , 'Sin_Day_of_Year' , 'Cos_Day_of_Year']


    

    completeData=TechnicalIndicators(data)
    
    # Scale the data
    scaler = MinMaxScaler(feature_range=(0, 1))

    
    data_scaled = scaler.fit_transform(completeData[features + technical_indicators + additional_featurs + additional_featurs + lags_featurs + timestamp_feature])

    # X, y = [], []
    # for i in range(step, len(data_scaled)):
    #     X.append(data_scaled[i - step:i,:])  # Use `step` days for prediction
    #     y.append(data_scaled[i, 3])

    X_train =np.array(data_scaled)
    

    return X_train.reshape(-1, 60, 64), scaler

