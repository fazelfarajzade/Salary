var JsonFields = {}


const API = function (method, url, data, isBackground) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (API.Ticket)
        myHeaders.append("Authorization", "Bearer " + API.Ticket);
    return fetch(url,
        {
            method: method.toUpperCase(), // *GET, POST, PUT, DELETE, etc.
            //mode: "no-cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: API.credentials, // include, *same-origin, omit
            headers: myHeaders,  // extend the headers
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: (data ? JSON.stringify(data) : null), // body data type must match "Content-Type" header
        }
    ).then((response) => {

        return response.ok ? response.text() : new Promise((resolve, reject) => { reject(response) });
    }).catch(error => {
        if (error.message) {
            if (error.message.toLowerCase() == "failed to fetch") {
                var msg = "دریافت اطلاعات از سرور بدرستی انجام نگردید.<br/>لطفا دقایقی دیگر دوباره امتحان نمایید.";
                if (!isBackground) {
                    //alert(msg);
                    return new Promise((resolve, reject) => { reject(msg) });
                }
            }
        }
        if (!isBackground)
            return new Promise((resolve, reject) => { reject(error) })
    });
};
API.Ticket = null;
var toScript = function (content) {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.innerHTML = content;
    document.head.appendChild(script);
};
var toCSS = function (content) {
    var elem = document.createElement("style");
    elem.setAttribute("type", "text/css");
    elem.innerHTML = content;
    document.head.appendChild(elem);
};
// Defaults that can be globally overwritten
API.credentials = 'omit'; // to keep the session on the request

API.getheaders = {
    'csrf-token': window.csrf || '',    // only if globally set, otherwise ignored
    'Accept': '*',       // application/json
    'Content-Type': 'application/json;charset=UTF-8',//"application/x-www-form-urlencoded; charset=UTF-8"//'application/json;charset=UTF-8'  // send json
};
API.postheaders = {
    'Content-Type': 'application/json'
};

// Convenient methods
['get', 'post', 'put', 'delete'].forEach(method => {
    API[method] = API.bind(null, method);
});
function isIOS() {
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        return true;
    }
    return false;
}
function isAndroid() {
    var android = false;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("android") > -1) {
        android = true;
    }
    return android;
}
var ClientPlatform = { Name: "MOBILE", OS: isIOS() ? "IOS" : isAndroid() ? "ANDROID" : "OTHER" };
API.callMethods = function (methods, data, useCache, insertsData, isImmediately = false) {
    showLoader(isImmediately);
    var promisses = [];
    methods.forEach((method, i) => {
        //var promise = new Promise(function (resolve, reject) {
        var p;
        if (Object.keys(JsonFields).includes(method)) {
            if (JsonFields[method].isNetworkFirst && navigator.onLine) {
                data[i].ClientPlatform = ClientPlatform;
                p = sendRequest(method, data[i], insertsData);
            } else {
                p = readCachedData(method, data[i], insertsData);
            }
        }
        else {
            data[i].ClientPlatform = ClientPlatform;
            p = sendRequest(method, data[i], insertsData);//.then(res => resolve(res)).catch(err => reject(err));
        }
        //});
        promisses.push(p);
    });

    var res = Promise.all(promisses);
    res.then(() => {
        hideLoader();
    }).catch(() => {
        hideLoader()
    });

    return res;
}
API.callMethodsInBackground = function (methods, data) {
    data = data || [];
    if (navigator.onLine) {
        var promises = methods.map((method, i) => {

            data[i] = data[i] || { Ticket: localStorage.getItem("ticket") };
            data[i].ClientPlatform = ClientPlatform;
            return sendRequest(method, data[i], false, true);
        });
        return Promise.all(promises);
    } else {
        return Promise.reject("no Internet");
    }

};
function readCachedData(method, data, insertsData, isBackground = false) {

    return dbman.SelectData(JsonFields[method].name).then(dbData => {

        var result = {};
        result[JsonFields[method].name] = dbData;
        result.success = true;

        if (dbData.length > 0 || !navigator.onLine) {
            return Promise.resolve(result);
        } else {
            data.ClientPlatform = ClientPlatform;
            return sendRequest(method, data, insertsData, isBackground, false).then(res => Promise.resolve(res)).catch(err => Promise.reject(err));
        }
    });
}
function sendRequest(method, data, insertsData = false, isBackground = false, useCacheIfNotAvalible = true) {
    if (navigator.onLine) {
        return new Promise((resolve, reject) => {
            API.post(APIRoot + method, data, isBackground)
                .then(function (result) {
                    try {
                        result = JSON.parse(result);
                    } catch (e) {
                        if (!isBackground)
                            return reject(e.message, "UnKnown");
                    }

                    if (result.success) {
                        if (Object.keys(JsonFields).includes(method)) {
                            var data = result[JsonFields[method].name];
                            if (typeof data === 'string' || data instanceof String) {
                                if (data.isJSON) {
                                    data = JSON.parse(data);
                                }
                            }
                            if ("dbman" in window)
                                dbman.InsertData(JsonFields[method].name, data).then(a => {
                                    //console.warn(a);
                                }).catch(a => {
                                    console.warn(a);
                                });
                        }
                        return resolve(result);
                    }
                    else {

                        return reject(result);
                    }
                })
                .catch(e => {

                    if (!isBackground) {
                        if (JsonFields[method] && JsonFields[method].isNetworkFirst) {
                            if (useCacheIfNotAvalible) {
                                readCachedData(method, data, false, false).then(res => {
                                    return resolve(res);
                                }).catch(err => {
                                    return reject(e);
                                })
                            } else {
                                return reject(e);
                            }
                        } else {
                            return reject(e);
                        }
                    }
                });
        });
    }
    /*    else if (insertsData) {
            dbman.InsertData("InsertQueue", { Method: method, Data: data, Time: Date.now() });
            return Promise.reject("به دلیل نبود اتصال به اینترنت درخواست شما هنوز ارسال نشده است.<br> با اولین اتصال به اینترنت درخواست ارسال خواهد شد.");
        }*/
    else {
        if (!isBackground)
            return Promise.reject("ارتباط اینترنتی شما قطع می باشد.\r\nلطفا وضعیت اینترنت دستگاه خود را بررسی نمایید.");
    }

}
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    });
}