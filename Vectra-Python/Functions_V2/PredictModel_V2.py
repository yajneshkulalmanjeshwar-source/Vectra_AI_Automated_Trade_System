import numpy as np
from tensorflow.keras.models import load_model
import pickle
from Functions_V2.predict_PreProcess import predictPreProcessData

def PredictPrice(data,stockToken):
    
    print('[INFO] Prediction start....')
    latest_data, scaler=predictPreProcessData(data)
    print('[INFO] Preprocess complete....')
    # Reshape to match the input shape expected by the model
    
    
    latest_sample = np.expand_dims(latest_data, axis=0)
    model=load_model('./Functions_V2/Models/LSTM_'+stockToken+'_1MIN.h5')



    # Predict the next day's closing price
    next_day_predicted = model.predict(latest_sample)
    

    #Convert back to original scale

    dummy_features = [0] * 48   # Create an array of zeros with 8 features
    dummy_features[3] = next_day_predicted[0, 0]  # Replace the 'Close' price (index 3)
    dummy_features = np.array(dummy_features).reshape(1, -1)

    price_preProcess_scaler = scaler.inverse_transform(dummy_features)[0, 3]
    print(f"Predicted Next Day's Closing Price: {price_preProcess_scaler}")

    with open('./Functions_V2/Scaler/scaler_'+stockToken+'_1MIN.pkl', 'rb') as f:
        loaded_scaler = pickle.load(f)
    
    price_loaded_scaler = loaded_scaler.inverse_transform(dummy_features)[0, 3]
    print(f"Predicted Next Day's Closing Price: {price_loaded_scaler}")

    return price_preProcess_scaler,price_loaded_scaler


    




