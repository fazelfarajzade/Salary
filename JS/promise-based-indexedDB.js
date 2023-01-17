function databaseManager(dbName, dbVersion, dbStructure = null) {
    while(dbVersion.includes(".") || dbVersion.includes("-"))
        dbVersion = dbVersion.replace(".","0").replace("-","0");
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    OpenDatabase = () => {
        return new Promise((resolve, reject) => {
            //TODO change version ?
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                reject("DB error: " + event.target.error);
            };
            request.onupgradeneeded = (event) => {
                const Database = event.target.result;
                InitializeDB(Database, dbStructure);
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
        });
    }
    function InitializeDB(Database, dbStructure) {

        dbStructure.forEach(table => {
            if (!Database.objectStoreNames.contains(table.name)) {
                var objectStore = Database.createObjectStore(table.name, { keyPath: table.key });
                if (table.indexes && table.indexes.length > 0) {
                    table.indexes.forEach(index => {
                        objectStore.createIndex(index, index);
                    });
                }
            }
        });
    }
    function openTable(Database, TableName, transactionMode, indexName = null) {
        var objectStore = Database.transaction(TableName, transactionMode).objectStore(TableName);
        if (!indexName)
            return objectStore;
               
        return objectStore.index(indexName);
    };
    this.InsertData = function (TableName, JsonData) {
        return new Promise((resolve, reject) => {
            OpenDatabase().then(Database => {
                var transaction = openTable(Database, TableName, "readwrite");
                if (Array.isArray(JsonData)) {
                    JsonData.forEach(function (item) {
                        var IDBRequest = transaction.put(item);
                        IDBRequest.onerror = e => { console.warn(e) }
                    });
                } else {
                    var IDBRequest = transaction.put(JsonData);
                    IDBRequest.onerror = e => { console.warn(e) }
                }
                transaction.onsuccess = resolve;
            }).catch(reason => {
                console.log(reason);
                reject(reason);
            });
        });
    }
    this.UpdateData = function (TableName, KeyValue, JsonData) {
        return new Promise((resolve, reject) => {
            OpenDatabase().then(Database => {
                var transaction = openTable(Database, TableName, "readwrite");
                transaction.openCursor(IDBKeyRange.only(KeyValue)).onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        if (cursor.key === KeyValue) {
                            cursor.update(JsonData).onsuccess = () => { return resolve();}
                        } else {
                            cursor.continue();
                        }
                    } else {
                        return reject(`No object store found for '${TableName}'`);
                    }
                }
            }).catch(reason => reject(reason));
        });
    }
    this.DeleteData = function (TableName, KeyValue) {
        return new Promise((resolve, reject) => {
            OpenDatabase().then(Database => {
                openTable(Database, TableName, "readwrite")
                    .delete(KeyValue)
                    .onsuccess = resolve;
            }).catch(reason => reject(reason));
        });
    }
    this.SelectData = function (TableName, KeyValue, indexName) {
        return new Promise((resolve, reject) => {
            OpenDatabase().then(Database => {
                var transaction = openTable(Database, TableName, "readwrite", indexName);
                if (KeyValue) {
                    transaction.get(KeyValue).onsuccess = function (event) {
                        resolve(event.target.result);
                    };
                } else {
                    var resultArray = [];
                    transaction.openCursor(null).onsuccess = (event) => {
                        var cursor = event.target.result;
                        if (cursor) {
                            resultArray.push(cursor.value);
                            cursor.continue();
                        } else {
                            resolve(resultArray);
                        }
                    }
                }
            }).catch(reason => { reject(reason) });
        });
    }
    this.SelectDataLowerThan = function (TableName, bound, open = false) {
        return new Promise((resolve, reject) => {
            OpenDatabase().then(Database => {
                var transaction = openTable(Database, TableName, "readwrite");
                var resultArray = [];

                transaction.openCursor(IDBKeyRange.upperBound(bound, open)).onsuccess = (event) => {
                    var cursor = event.target.result;
                    if (cursor) {
                        if (cursor.key === KeyValue) {
                            resultArray.push(cursor.value);
                        }
                        cursor.continue();
                    } else {
                        resolve(resultArray);
                    }
                }
            }).catch(reason => reject(reason));
        });
    }
    this.removeDB = function() {
        indexedDB.deleteDatabase(this.dbName);
    }
}




