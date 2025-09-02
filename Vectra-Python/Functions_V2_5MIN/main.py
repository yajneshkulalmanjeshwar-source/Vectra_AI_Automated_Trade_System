from PreProcessData_V2 import preProcessData_v2
from buildModels_V2 import buildModelV2
from trainModelV2 import trainModelV2
from PredictModel_V2 import PredictPrice
import pandas as pd
from tensorflow.keras.models import save_model
import pickle


data = pd.read_csv('../../datasets/trainsets/train_data_31181.csv')


X_train, y_train, scaler=preProcessData_v2(data)
with open('./Scaler/scaler_31181.pkl', 'wb') as f:
    pickle.dump(scaler, f)

model=buildModelV2(X_train)
trainModelV2(model,X_train, y_train)













