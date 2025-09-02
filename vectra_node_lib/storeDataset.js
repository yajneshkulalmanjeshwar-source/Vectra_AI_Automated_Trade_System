const fs = require('fs');


class DataService {
   
    constructor() {
        this.arrayData=[];
        if (!DataService.instance) {
            
            DataService.instance = this; // Singleton instance
        }
        return DataService.instance;
    }

    saveData(stockToken) {
        let filePath ='../example/Datasets/'+stockToken+'_data.json';
       console.log(this.arrayData.length)
        const currentData = this.readData(filePath);
        
        let combinedArray=currentData.concat(this.arrayData);
        
        fs.writeFileSync(filePath, JSON.stringify(combinedArray, null, 2), 'utf8');
        console.log('Data saved successfully.');
    }

    readData(filePath) {
        try {
            
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
            }
            const fileData = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(fileData);
        } catch (error) {
            console.error('Failed to read data:', error.message);
            return [];
        }
    }
}

// Export a single instance of DataService
const instance = new DataService();
Object.freeze(instance); // Ensure it's immutable
module.exports = instance;
