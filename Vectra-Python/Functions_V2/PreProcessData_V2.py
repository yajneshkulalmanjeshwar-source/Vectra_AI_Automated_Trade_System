import numpy as np

import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler

from Functions_V2.TechnicalIndicators_V2 import TechnicalIndicators
import pickle


def preProcessData_v2(data,stockName):


    # Fill missing values (if any)
    data.fillna(method='ffill', inplace=True)

    # Select relevant columns
    features = ['Open', 'High', 'Low', 'Close', 'Volume']
    Technical_Indicators= ['rsi', 'macd', 'bollinger_width', 'atr', 'price_change_pct', 'volume_change_pct']
    Support_Resistance_Levels= ['dist_to_resistance', 'rolling_min']
    profit_loss_pct_lagged= ['profit_loss_pct_lagged']


    

    completeData=TechnicalIndicators(data)
    completeData.to_csv("./Functions_V2/data_pre.csv", index=False)
    print('*****************:',completeData.size)
    


    # Scale the data
    scaler = MinMaxScaler(feature_range=(0, 1))
    data_scaled = scaler.fit_transform(completeData[features + Technical_Indicators + Support_Resistance_Levels + profit_loss_pct_lagged])



    # Create LSTM sequences
    seq_length=10  # Adjusted seq_length to 10 for better responsiveness
    sequences, labels, rewards = [], [], []
    for i in range(len(data_scaled) - seq_length):
        sequences.append(data_scaled.iloc[i:i+seq_length].drop(columns=['label', 'reward']).values)
        labels.append(data_scaled.iloc[i+seq_length]['label'])
        rewards.append(data_scaled.iloc[i+seq_length]['reward'])
    return np.array(sequences), np.array(labels), np.array(rewards)


    
