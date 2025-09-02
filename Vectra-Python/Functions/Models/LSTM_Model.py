from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

def LSTM_Model(X_train, y_train):
        
        print(X_train.shape)
        print(y_train.shape)
        input_shape = (X_train.shape[1],X_train.shape[2])  # (timesteps, features)
        # Define the LSTM model
        model = Sequential([
        LSTM(50, activation='relu', return_sequences=True, input_shape=input_shape),
        LSTM(50, activation='relu'),
        Dense(1)  # Output layer with one neuron for next value prediction
        ])

        # Compile the model
        model.compile(optimizer='adam', loss='mse')
    
        # Train the model
        print("Training LSTM model...")
        model.fit(X_train, y_train, epochs=50, batch_size=32, verbose=1)
        return model