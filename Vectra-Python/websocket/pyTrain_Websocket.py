import asyncio
import websockets
import numpy as np
import pandas as pd
import json
from Functions_V2.PreProcessData_V2 import preProcessData_v2
import pickle
from Functions_V2.buildModels_V2 import build_lstm_model
from Functions_V2.trainModelV2 import trainModelV2
import zlib

from Functions_V2_5MIN.PreProcessData_V2 import preProcessData_v2_5min
from Functions_V2_5MIN.buildModels_V2 import buildModelV2_5min
from Functions_V2_5MIN.trainModelV2 import trainModelV2_5min

async def handle_client(websocket):
        print("Client connected")
    # try:
        async for message in websocket:
            decompressed_data = zlib.decompress(message, wbits=zlib.MAX_WBITS | 16)
            data = json.loads(decompressed_data)
            dataPass=data['data']
            columns = ['Timestamp', 'Open', 'High', 'Low', 'Close', 'Volume']
            df = pd.DataFrame(dataPass, columns=columns)
            print('***********************',df.size)
            #***************** 1MIN data training ****************
            X, y, rewards =preProcessData_v2(df[['Timestamp','Open', 'High', 'Low', 'Close', 'Volume']],data['stockToken'])
            print(f'Sequences: {X.shape}, Labels: {y.shape}, Rewards: {rewards.shape}')

            # Define input shape
            input_shape = (X.shape[1], X.shape[2])
            
            model=build_lstm_model(input_shape)
            trainModelV2(model,X, y,data['stockToken'])




            # #***************** 5MIN data training ****************
            # X_train, y_train, scaler=preProcessData_v2_5min(df[['Open', 'High', 'Low', 'Close', 'Volume']],data['stockToken'])
            
            # model=buildModelV2_5min(X_train)
            # trainModelV2_5min(model,X_train, y_train,data['stockToken'])


            

            

            response = json.dumps({'status': 'SUCCESS'})
            await websocket.send(response)

    # except Exception as e:
    #     print(f"Error: {e}")

async def main():
    print("Python WebSocket Server is running on ws://localhost:8765...")
    async with websockets.serve(handle_client, "localhost", 8765,max_size=10 * 1024 * 1024):
        await asyncio.Future()  # Run forever

# Run the main function using asyncio.run()
if __name__ == "__main__":
    asyncio.run(main())
