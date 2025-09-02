from keras.callbacks import EarlyStopping
from tensorflow.keras.models import save_model



def trainModelV2_5min(model,X_train,y_train,stockName):
    early_stopping = EarlyStopping(monitor='loss', patience=8, restore_best_weights=True)
    history = model.fit(X_train, y_train, epochs=1000, batch_size=32, callbacks=[early_stopping])
    print(history)
    save_model(model,'./Functions_V2_5MIN/Models/LSTM_'+stockName+'_5MIN.h5')




