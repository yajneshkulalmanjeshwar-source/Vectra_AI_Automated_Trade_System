
from sklearn.preprocessing import MinMaxScaler
import numpy as np

def preProcessData(data):

    # Scale data using MinMaxScaler
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(data)

    
    sequence_length = 60  # Number of time steps in each sequence
    x = []
    y = []

    for i in range(sequence_length, len(scaled_data)):
        x.append(scaled_data[i-sequence_length:i])  # Input sequence
        y.append(scaled_data[i][3])  # Target is the 'close' value 

    X_train = np.array(x)
    y_train = np.array(y)

   
    X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], X_train.shape[2]))
    y_train = np.reshape(y_train, (y_train.shape[0]))
    

    return X_train, y_train