var JsonFields = {};

const API = function (method, url, data, isBackground) {
    return fetch(url, {
        method: method.toUpperCase(), // *GET, POST, PUT, DELETE, etc.
        //mode: "no-cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: API.credentials, // include, *same-origin, omit
        headers: API.headers, // extend the headers
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: method == "get" ? null : data ? JSON.stringify(data) : null, // body data type must match "Content-Type" header
    })
        .then(async (response) => {
            // console.log(response);
            if (!response.ok) {
                if (response.status == 403) {
                    alert('دسترسی به سرویس ممکن نیست.')
                }
            }

            if (response.status == 401) signOut();
            var text = await response.text();

            return response.ok
                ? text
                : new Promise((resolve, reject) => reject(text));
        })
        .catch((error) => {
            if (error.message) {
                if (error.message.toLowerCase() == "failed to fetch") {
                    var msg =
                        "دریافت اطلاعات از سرور بدرستی انجام نگردید.<br/>لطفا دقایقی دیگر دوباره امتحان نمایید.";
                    if (!isBackground) {
                        //alert(msg);
                        return new Promise((resolve, reject) => {
                            reject(msg);
                        });
                    }
                }
            }
            if (!isBackground)
                return new Promise((resolve, reject) => {
                    reject(error);
                });
        });
};
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
API.credentials = "omit"; // to keep the session on the request

API.headers = {
    "Content-Type": "application/json",
    Insurancer: null,
};

// Convenient methods
["get", "post", "put", "delete"].forEach((method) => {
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
var ClientPlatform = { Name: "WEB", OS: "OTHER" };
API.callMethods = function (methods, data, httpMethod, isImmediately = false) {
    showLoader(isImmediately);
    var promisses = [];
    methods.forEach((method, i) => {
        //var promise = new Promise(function (resolve, reject) {
        var p;
        if (Object.keys(JsonFields).includes(method)) {
            if (JsonFields[method].isNetworkFirst && navigator.onLine) {
                if (httpMethod != "get") data[i].ClientPlatform = ClientPlatform;
                p = sendRequest(method, data[i], httpMethod);
            } else {
                p = readCachedData(method, data[i], httpMethod);
            }
        } else {
            if (httpMethod != "get") data[i].ClientPlatform = ClientPlatform;
            p = sendRequest(method, data[i], httpMethod); //.then(res => resolve(res)).catch(err => reject(err));
        }
        //});
        promisses.push(p);
    });

    var res = Promise.all(promisses);
    res
        .then(() => {
            hideLoader();
        })
        .catch(() => {
            hideLoader();
        });

    return res;
};
API.callMethodsInBackground = function (methods, data, httpMethod) {
    data = data || [];
    if (navigator.onLine) {
        var promises = methods.map((method, i) => {
            data[i] = data[i] || { Ticket: localStorage.getItem("ticket") };
            data[i].ClientPlatform = ClientPlatform;
            return sendRequest(method, data[i], httpMethod, true);
        });
        return Promise.all(promises);
    } else {
        return Promise.reject("no Internet");
    }
};
function readCachedData(method, data, insertsData, isBackground = false) {
    return dbman.SelectData(JsonFields[method].name).then((dbData) => {
        var result = {};
        result[JsonFields[method].name] = dbData;

        if (dbData.length > 0 || !navigator.onLine) {
            return Promise.resolve(result);
        } else {
            if (httpMethod != "get") data.ClientPlatform = ClientPlatform;
            return sendRequest(method, data, httpMethod, isBackground, false)
                .then((res) => Promise.resolve(res))
                .catch((err) => Promise.reject(err));
        }
    });
}

function sendRequest(
    method,
    data,
    httpMethod,
    isBackground = false,
    useCacheIfNotAvalible = true
) {
    if (navigator.onLine) {
        return new Promise((resolve, reject) => {
            var queryString = "";
            if (httpMethod == "get") {
                if (data && Object.keys(data).length > 0) {
                    queryString = "?";
                    Object.keys(data).forEach((key) => {
                        queryString += `${key}=${data[key]}&`;
                    });
                }
            }
            API(
                httpMethod,
                Config.APIRootAddress + method + queryString,
                data,
                isBackground
            )
                .then(function (result) {
                    try {
                        result = JSON.parse(result);
                    } catch (e) {
                        // if (!isBackground)
                        //     return reject(e.message, "UnKnown");
                        return resolve({});
                    }
                    //if (
                    //    !isBackground &&
                    //    "IsAuthenticated" in result &&
                    //    !result.IsAuthenticated
                    //) {
                    //    signOut();
                    //    return reject(
                    //        "متاسفانه سامانه مجددا به اعتبارسنجی وضعیت کاربری شما نیاز پیدا کرده است، لطفا دوباره وارد نرم افزار شوید"
                    //    );
                    //}
                    if (Object.keys(JsonFields).includes(method)) {
                        var data = result[JsonFields[method].name];
                        if (typeof data === "string" || data instanceof String) {
                            if (data.isJSON) {
                                data = JSON.parse(data);
                            }
                        }
                        dbman
                            .InsertData(JsonFields[method].name, data)
                            .then((a) => {
                                //console.warn(a);
                            })
                            .catch((a) => {
                                console.warn(a);
                            });
                    }
                    return resolve(result);
                })
                .catch((e) => {
                    try {
                        e = JSON.parse(e);
                    } catch { }
                    if (!isBackground) {
                        if (JsonFields[method] && JsonFields[method].isNetworkFirst) {
                            if (useCacheIfNotAvalible) {
                                readCachedData(method, data, false, false)
                                    .then((res) => {
                                        return resolve(res);
                                    })
                                    .catch((err) => {
                                        alert(err);
                                        return reject(e);
                                    });
                            } else {
                                alert(e);
                                return reject(e);
                            }
                        } else {
                            alert(e);
                            return reject(e);
                        }
                    }
                });
        });
    } else {
        /*    else if (insertsData) {
                  dbman.InsertData("InsertQueue", { Method: method, Data: data, Time: Date.now() });
                  return Promise.reject("به دلیل نبود اتصال به اینترنت درخواست شما هنوز ارسال نشده است.<br> با اولین اتصال به اینترنت درخواست ارسال خواهد شد.");
              }*/
        if (!isBackground)
            return Promise.reject(
                "ارتباط اینترنتی شما قطع می باشد.\r\nلطفا وضعیت اینترنت دستگاه خود را بررسی نمایید."
            );
    }
}
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
