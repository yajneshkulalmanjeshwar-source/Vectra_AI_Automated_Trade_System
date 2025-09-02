import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam

# Define LSTM Model
def build_lstm_model(input_shape):
    model = Sequential([
        LSTM(64, return_sequences=True, input_shape=input_shape),
        Dropout(0.2),
        LSTM(32, return_sequences=False),
        Dropout(0.2),
        Dense(16, activation='relu'),
        Dense(3, activation='softmax')  # 3 output classes: Buy, Sell, Hold
    ])
    
    model.compile(
        loss='sparse_categorical_crossentropy',
        optimizer=Adam(learning_rate=0.001),
        metrics=['accuracy']
    )
    
    return model
































# # from keras.models import Sequential
# # from keras.layers import Dense, LSTM, Dropout




# # def buildModelV2(X_train):
# #     model = Sequential()

# #     # Add LSTM layers with Dropout
# #     model.add(LSTM(units=30, activation='relu', return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])))
# #     model.add(Dropout(0.1))
# #     model.add(LSTM(units=40, activation='relu', return_sequences=True))
# #     model.add(Dropout(0.1))
# #     model.add(LSTM(units=50, activation='relu', return_sequences=True))
# #     model.add(Dropout(0.1))
# #     model.add(LSTM(units=60, activation='relu'))
# #     model.add(Dropout(0.1))

# #     # Add Dense layer for output
# #     model.add(Dense(units=1))

# #     # Compile the model
# #     model.compile(optimizer='adam', loss='mean_squared_error')
# #     return model





# from keras.models import Sequential
# from keras.layers import Dense, LSTM, Dropout
# from tensorflow.keras.mixed_precision import set_global_policy
# from tensorflow.keras.optimizers.schedules import ExponentialDecay
# import tensorflow as tf




# def buildModelV2(X_train):

#     # Use "mixed_float16" for mixed precision training
#     # set_global_policy('mixed_float16')
    

#     model = Sequential()

#     # Add LSTM layers with Dropout
#     model.add(LSTM(units=30, activation='tanh', return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])))
#     model.add(Dropout(0.1))
#     model.add(LSTM(units=40, activation='tanh',  return_sequences=True))
#     model.add(Dropout(0.1))
#     model.add(LSTM(units=50, activation='tanh',  return_sequences=True))
#     model.add(Dropout(0.1))
#     model.add(LSTM(units=60, activation='tanh'))
#     model.add(Dropout(0.1))

#     # Add Dense layer for output
#     model.add(Dense(units=1))

#     # Optimized Learning Rate
#     # lr_schedule = ExponentialDecay(
#     # initial_learning_rate=1e-3, decay_steps=10000, decay_rate=0.9)
#     # opt = tf.keras.optimizers.Adam(learning_rate=lr_schedule)

#     # Compile the model
#     model.compile(optimizer='adam', loss='mean_squared_error')
#     return model