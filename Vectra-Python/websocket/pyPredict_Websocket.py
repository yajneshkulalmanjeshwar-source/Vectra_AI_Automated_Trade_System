import asyncio
import websockets
import numpy as np
import pandas as pd
import json
import matplotlib.pyplot as plt
import threading

from Functions_V2.PredictModel_V2 import PredictPrice
# from Functions_V2_5MIN.PredictModel_V2 import PredictPrice_5min


real_prices=[]
price1=[]
price2=[]
flagFirst=True
dataFirst=0



async def handle_client(websocket):
        global real_prices,price1,price2,flagFirst,dataFirst
        print("Client connected")
    # try:
        async for message in websocket:
            data = json.loads(message)
            dataPass=data['data']
            
            
            columns = ['Timestamp', 'Open', 'High', 'Low', 'Close', 'Volume']
            df = pd.DataFrame(dataPass, columns=columns)
            print(df)
            #1 min prediction
            price_preProcess_scaler,price_loaded_scaler=PredictPrice(df,data['stockToken'])

            # 5 Min prediction
            # price_preProcess_scaler,price_loaded_scaler=PredictPrice_5min(df,data['stockToken'])


            if flagFirst:
                dataFirst=df.iloc[-1, 3]
                flagFirst=False
            else:
                price1.append(price_preProcess_scaler)
                price2.append(price_loaded_scaler)
                real_prices.append(dataFirst)
                dataFirst=df.iloc[-1, 3]
                    
                
                
            array=np.array([real_prices,price1,price2])
            np.save('./websocket/chart_array.npy', array)
                
                

            
            print('price:',price_preProcess_scaler,price_loaded_scaler)
            response = json.dumps({'price': [price_preProcess_scaler,price_loaded_scaler]})
            await websocket.send(response)

    # except Exception as e:
    #     print(f"Error: {e}")

async def main():
    print("Python WebSocket Server is running on ws://localhost:8766...")
    async with websockets.serve(handle_client, "localhost", 8766):
        await asyncio.Future()  # Run forever

# Run the main function using asyncio.run()
if __name__ == "__main__":
    asyncio.run(main())
