from Functions.test import fetch
from Functions.Pre_Process import preProcessData
from Models.LSTM_Model import LSTM_Model
from Functions.Evaluate_and_Visualize import Evaluate_and_Visualize


data=fetch()
X_train, X_test, y_train, y_test, scaler, data_scaled=preProcessData(data)
model=LSTM_Model(X_train, y_train)
Evaluate_and_Visualize(model,X_test,y_test,scaler)
sequence_length = 60

print("starting the prediction:::::::")

last_60_minutes = data_scaled[-sequence_length:]
last_60_minutes = last_60_minutes.reshape(1, -1, 1)

# Predict the next minute's price
next_minute_prediction = model.predict(last_60_minutes)
next_minute_price = scaler.inverse_transform(next_minute_prediction)
print(f"Predicted next minute's closing price: {next_minute_price[0][0]}")


