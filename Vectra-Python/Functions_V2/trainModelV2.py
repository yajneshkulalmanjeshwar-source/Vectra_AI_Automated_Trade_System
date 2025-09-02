# from keras.callbacks import EarlyStopping
# from tensorflow.keras.models import save_model
# import tensorflow as tf




# def trainModelV2(model,X_train,y_train,stockToken):
#     print('[INFO] train model using GPU')
#     early_stopping = EarlyStopping(monitor='loss', patience=8, restore_best_weights=True)
#     model.fit(X_train, y_train, epochs=1000, batch_size=32, callbacks=[early_stopping])
#     save_model(model,'./Functions_V2/Models/LSTM_'+stockToken+'_1MIN.h5')


from keras.callbacks import EarlyStopping
from tensorflow.keras.models import save_model
from sklearn.model_selection import train_test_split
import tensorflow as tf




def trainModelV2(model,X,y,stockToken):
    print('[INFO] train model using GPU')
    # Set a memory growth limit for the CPU
    

    # Split data into training and validation sets
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42, shuffle=False)

    # Early stopping to prevent overfitting
    early_stop = EarlyStopping(monitor='val_loss', patience=20, restore_best_weights=True)

    # Train the model
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=1000,
        batch_size=2048,
        callbacks=[early_stop],
        verbose=1
    )
    print(history)
    save_model(model,'./Functions_V2/Models/LSTM_'+stockToken+'_1MIN.h5')



