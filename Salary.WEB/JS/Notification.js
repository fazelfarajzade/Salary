function PushSubscription() {
    var self = this;

    var pushApiKey = manifestFileJSON.pushApiKey;
    var BASE_URL = manifestFileJSON.pushManager;
    var REGISTRATION_ENDPOINT = BASE_URL + '/register';
    var UNREGISTRATION_ENDPOINT = BASE_URL + '/unregister';

    this.init = function () {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                Notification.requestPermission(function (status) {
                    navigator.serviceWorker.ready.then(function () {
                        self.subscribeUser();
                    });
                });
            } catch (e) {
                console.log(e.message);
            }
        }
    };

    this.getPushKey = function () {
        return manifestFileJSON.pushPublicKey;
    };


    this.urlB64ToUint8Array = function (base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

        var rawData = window.atob(base64);
        var outputArray = new Uint8Array(rawData.length);

        for (var i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    this.subscribeUser = async function () {
        var applicationServerKey = self.urlB64ToUint8Array(self.getPushKey());
        navigator.serviceWorker.ready.then(async function (serviceWorkerRegistration) {
            var subscription = await serviceWorkerRegistration.pushManager.getSubscription();
            if (!subscription) {
                subscription = await serviceWorkerRegistration.pushManager.subscribe(
                    { userVisibleOnly: true, applicationServerKey: applicationServerKey });
                subscription = JSON.parse(JSON.stringify(subscription));

                var endpoint = subscription.endpoint;
                var key = subscription.keys.p256dh;
                var auth = subscription.keys.auth;

                self.updateSubscriptionOnServer(endpoint, key, auth, REGISTRATION_ENDPOINT, localStorage.getItem("ticket"), "");

            }
        });
    };

    //this.subscribeUserToFCM = function (endpoint, key, auth) {
    //    return fetch("https://fcm.googleapis.com/fcm/connect/subscribe", {
    //        headers: {
    //            "Content-Type": "application/x-www-form-urlencoded",
    //        },
    //        body: `authorized_entity=${SENDER_ID}` +
    //            `&endpoint=${endpoint}` +
    //            `&encryption_key=${key}` +
    //            `&encryption_auth=${auth}` +
    //            `&application_pub_key=${self.getPushKey()}`,
    //        "method": "POST"
    //    }).then(response => {
    //        if (response.ok) {
    //            return response.text().then(txt => {
    //                var json = JSON.parse(txt);
    //                return json;
    //            });
    //        }
    //        else {
    //            return new Promise((resolve, reject) => { reject(response.statusText) });
    //        }
    //    }).catch(error => {
    //        return new Promise((resolve, reject) => { reject(error) });
    //    });
    //}

    this.unsubscribeUser = async function () {
        var subscriptionID = localStorage.getItem("subscriptionID");
        var ticket = localStorage.getItem("ticket");
        var serviceWorkerRegistration = await navigator.serviceWorker.ready;
        await serviceWorkerRegistration.pushManager.getSubscription().then(async (subscription) => {
            if (subscription) {
                await subscription.unsubscribe().then(async unsubscribed => {
                    if (unsubscribed) {
                        await self.updateSubscriptionOnServer(
                            subscription.endpoint,
                            subscription.getKey('p256dh'),
                            subscription.getKey('auth'),
                            UNREGISTRATION_ENDPOINT,
                            ticket,
                            subscriptionID
                        );
                    }
                });
            }
        });
    };

    this.updateSubscriptionOnServer = async function (endpoint, key, auth, url, ticket, subscriptionID) {
        if (!endpoint && !key && !auth)
            return;

        var subscribeObj;
        if (url === REGISTRATION_ENDPOINT)
            subscribeObj = {
                navigatorUserAgent: navigator.userAgent,
                navigatorLanguages: JSON.stringify(navigator.languages),
                navigatorPlatform: navigator.platform,
                navigatorPlugins: JSON.stringify(navigator.plugins),
                screenSize: window.screen.availWidth + "x" + window.screen.availHeight,
                pushFingerPrint: (new PushFingerPrint()).init(),
                subscriptionEndPoint: endpoint,
                subscriptionP256DH: key,
                subscriptionAuth: auth,
                navigatorJavaEnabled: navigator.javaEnabled(),
                navigatorCookieEnabled: navigator.cookieEnabled,
                navigatorOnline: navigator.onLine,
                browserHistoryLength: history.length,
                referrer: document.referrer,
                timeZone: (new Date()).getTimezoneOffset() / 60,
                pushApiKey: pushApiKey,
                applicationName: window.location.href,
                ticket: ticket
            };
        else {
            subscribeObj = {
                applicationName: window.location.href,
                subscriptionID: subscriptionID,
                ticket: ticket
            };
        }
        //if (url !== REGISTRATION_ENDPOINT)
        //    showLoader();
        var notSubscribedMessage = "ارتباط با سرویس نوتیفیکیشن نرم افزار بدرستی انجام نگرفت.\r\nدر این شرایط عملکرد نرم افزار دچار اختلال نمیگردد ولی نوتیفیکیشن ها را دریافت نخواهید کرد";
        try {
            return await fetch(url, {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(subscribeObj), // data can be `string` or {object}!
            })
                .then(response => {
                    //hideLoader();
                    //response.text().then(a => console.log(a));
                    return response.clone().json();

                }).then(json => {
                    if (url === REGISTRATION_ENDPOINT) {
                        if (json.success === true) {
                            if (json.subscriptionID)
                                localStorage.setItem("subscriptionID", json.subscriptionID);
                            else {
                                alert(notSubscribedMessage);
                                console.warn('err', json);
                            }
                        }
                        else {
                            alert(notSubscribedMessage + "\r\n" + json.message);
                        }

                    }
                })
                .catch(err => {
                    if (url === REGISTRATION_ENDPOINT)
                        alert(err.message || err);
                    console.warn('err', err.message);
                })
                .catch(err => {

                    //hideLoader();
                    if (url === REGISTRATION_ENDPOINT)
                        alert(err.message || err);
                    console.warn('err', err.message);
                });

        } catch (err) {

            //hideLoader();
            if (url === REGISTRATION_ENDPOINT)
                alert(err.message || err);
            console.warn('Error:', err);
        }
    };
}



function PushFingerPrint(options) {
    var nativeForEach, nativeMap;
    nativeForEach = Array.prototype.forEach;
    nativeMap = Array.prototype.map;

    this.each = function (obj, iterator, context) {
        if (obj === null) {
            return;
        }
        if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (iterator.call(context, obj[i], i, obj) === {}) return;
            }
        } else {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (iterator.call(context, obj[key], key, obj) === {}) return;
                }
            }
        }
    };

    this.map = function (obj, iterator, context) {
        var results = [];
        // Not using strict equality so that this acts as a
        // shortcut to checking for `null` and `undefined`.
        if (obj == null) return results;
        if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
        this.each(obj, function (value, index, list) {
            results[results.length] = iterator.call(context, value, index, list);
        });
        return results;
    };

    this.init = function () {
        if (typeof options == 'object') {
            this.hasher = options.hasher;
            this.screen_resolution = options.screen_resolution;
            this.screen_orientation = options.screen_orientation;
            this.canvas = options.canvas;
            this.ie_activex = options.ie_activex;
        } else if (typeof options == 'function') {
            this.hasher = options;
        }
        var keys = [];
        keys.push(navigator.userAgent);
        keys.push(navigator.language);
        keys.push(screen.colorDepth);
        if (this.screen_resolution) {
            var resolution = this.getScreenResolution();
            if (typeof resolution !== 'undefined') { // headless browsers, such as phantomjs
                keys.push(resolution.join('x'));
            }
        }
        keys.push(new Date().getTimezoneOffset());
        keys.push(this.hasSessionStorage());
        keys.push(this.hasLocalStorage());
        keys.push(!!window.indexedDB);
        //body might not be defined at this point or removed programmatically
        if (document.body) {
            keys.push(typeof (document.body.addBehavior));
        } else {
            keys.push(typeof undefined);
        }
        keys.push(typeof (window.openDatabase));
        keys.push(navigator.cpuClass);
        keys.push(navigator.platform);
        keys.push(navigator.doNotTrack);
        keys.push(this.getPluginsString());
        if (this.canvas && this.isCanvasSupported()) {
            keys.push(this.getCanvasFingerprint());
        }
        if (this.hasher) {
            return this.hasher(keys.join('###'), 31);
        } else {
            return this.murmurhash3_32_gc(keys.join('###'), 31);
        }
    };

    this.murmurhash3_32_gc = function (key, seed) {
        var remainder, bytes, h1, h1b, c1, c2, k1, i;

        remainder = key.length & 3; // key.length % 4
        bytes = key.length - remainder;
        h1 = seed;
        c1 = 0xcc9e2d51;
        c2 = 0x1b873593;
        i = 0;

        while (i < bytes) {
            k1 =
                ((key.charCodeAt(i) & 0xff)) |
                ((key.charCodeAt(++i) & 0xff) << 8) |
                ((key.charCodeAt(++i) & 0xff) << 16) |
                ((key.charCodeAt(++i) & 0xff) << 24);
            ++i;

            k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

            h1 ^= k1;
            h1 = (h1 << 13) | (h1 >>> 19);
            h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
            h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
        }

        k1 = 0;

        switch (remainder) {
            case 3:
                k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
            case 2:
                k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
            case 1:
                k1 ^= (key.charCodeAt(i) & 0xff);

                k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
                k1 = (k1 << 15) | (k1 >>> 17);
                k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
                h1 ^= k1;
        }

        h1 ^= key.length;

        h1 ^= h1 >>> 16;
        h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
        h1 ^= h1 >>> 13;
        h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
        h1 ^= h1 >>> 16;

        return h1 >>> 0;
    };

    // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
    this.hasLocalStorage = function () {
        try {
            return !!window.localStorage;
        } catch (e) {
            return true; // SecurityError when referencing it means it exists
        }
    };

    this.hasSessionStorage = function () {
        try {
            return !!window.sessionStorage;
        } catch (e) {
            return true; // SecurityError when referencing it means it exists
        }
    };

    this.isCanvasSupported = function () {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    this.isIE = function () {
        if (navigator.appName === 'Microsoft Internet Explorer') {
            return true;
        } else if (navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent)) {// IE 11
            return true;
        }
        return false;
    };

    this.getPluginsString = function () {
        if (this.isIE() && this.ie_activex) {
            return this.getIEPluginsString();
        } else {
            return this.getRegularPluginsString();
        }
    };

    this.getRegularPluginsString = function () {
        return this.map(navigator.plugins, function (p) {
            var mimeTypes = this.map(p, function (mt) {
                return [mt.type, mt.suffixes].join('~');
            }).join(',');
            return [p.name, p.description, mimeTypes].join('::');
        }, this).join(';');
    };

    this.getIEPluginsString = function () {
        if (window.ActiveXObject) {
            var names = ['ShockwaveFlash.ShockwaveFlash',//flash plugin
                'AcroPDF.PDF', // Adobe PDF reader 7+
                'PDF.PdfCtrl', // Adobe PDF reader 6 and earlier, brrr
                'QuickTime.QuickTime', // QuickTime
                // 5 versions of real players
                'rmocx.RealPlayer G2 Control',
                'rmocx.RealPlayer G2 Control.1',
                'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
                'RealVideo.RealVideo(tm) ActiveX Control (32-bit)',
                'RealPlayer',
                'SWCtl.SWCtl', // ShockWave player
                'WMPlayer.OCX', // Windows media player
                'AgControl.AgControl', // Silverlight
                'Skype.Detection'];

            // starting to detect plugins in IE
            return this.map(names, function (name) {
                try {
                    new ActiveXObject(name);
                    return name;
                } catch (e) {
                    return null;
                }
            }).join(';');
        } else {
            return ""; // behavior prior version 0.5.0, not breaking backwards compat.
        }
    };

    this.getScreenResolution = function () {
        var resolution;
        if (this.screen_orientation) {
            resolution = (screen.height > screen.width) ? [screen.height, screen.width] : [screen.width, screen.height];
        } else {
            resolution = [screen.height, screen.width];
        }
        return resolution;
    };

    this.getCanvasFingerprint = function () {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        // https://www.browserleaks.com/canvas#how-does-it-work
        var txt = 'http://valve.github.io';
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.fillText(txt, 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText(txt, 4, 17);
        return canvas.toDataURL();
    };

}
