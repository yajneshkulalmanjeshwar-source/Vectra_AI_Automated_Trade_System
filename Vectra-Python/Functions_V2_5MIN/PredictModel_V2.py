import numpy as np
from tensorflow.keras.models import load_model
import pickle
from predict_PreProcess import preProcessData_v2_5min

def PredictPrice_5min(latest_data,scaler,stockName):
    

    latest_data, y_train, scaler=preProcessData_v2_5min(latest_data[['Open', 'High', 'Low', 'Close', 'Volume']])
    # Reshape to match the input shape expected by the model
    latest_data = np.expand_dims(latest_data, axis=0)
    model=load_model('./Models/LSTM_'+stockName+'_5MIN.h5')



    # Predict the next day's closing price
    next_day_predicted = model.predict(latest_data)

    # Convert back to original scale
    price_preProcess_scaler = scaler.inverse_transform([[0, 0, 0, next_day_predicted[0, 0], 0]])[0, 3]
    print(f"Predicted Next Day's Closing Price: {price_preProcess_scaler}")

    with open('./Scaler/scaler_'+stockName+'_5MIN.pkl', 'rb') as f:
        loaded_scaler = pickle.load(f)
    
    price_loaded_scaler = loaded_scaler.inverse_transform([[0, 0, 0, next_day_predicted[0, 0], 0]])[0, 3]
    print(f"Predicted Next Day's Closing Price: {price_loaded_scaler}")

    return price_preProcess_scaler,price_loaded_scaler


    




