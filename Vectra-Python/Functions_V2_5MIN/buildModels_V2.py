from keras.models import Sequential
from keras.layers import Dense, LSTM, Dropout




def buildModelV2_5min(X_train):
    model = Sequential()

    # Add LSTM layers with Dropout
    model.add(LSTM(units=30, activation='relu', return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])))
    model.add(Dropout(0.1))
    model.add(LSTM(units=40, activation='relu', return_sequences=True))
    model.add(Dropout(0.1))
    model.add(LSTM(units=50, activation='relu', return_sequences=True))
    model.add(Dropout(0.1))
    model.add(LSTM(units=60, activation='relu'))
    model.add(Dropout(0.1))

    # Add Dense layer for output
    model.add(Dense(units=5))

    # Compile the model
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model