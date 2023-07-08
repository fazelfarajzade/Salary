// add to prototype
String.prototype.isJSON = function () {
    try {
        var ok = JSON.parse(this);
        return true;
    }
    catch (err) {
        return false;
    }
}
String.prototype.toElements = function () {
    return (new DOMParser()).parseFromString(this, 'text/html').body.childNodes;
}
String.prototype.toEnglishNumbers = function () {
    var
        persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
        arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"],
        fixNumbers = function (str) {
            for (var i = 0; i < 10; i++) {
                str = str.replaceAll(persianNumbers[i], i).replaceAll(arabicNumbers[i], i);
            }
            return str;
        };
    return fixNumbers(this);
}
String.prototype.limitCharacters = function (num) {
    var str = this;
    if (str.length > num) {
        str = str.slice(0, num - 3) + "...";
    }
    return str;
}
String.prototype.toPersianUniCode = function () {
    return this.replaceAll("ی", "ي")
        .replaceAll("آ", "ا")
        .replaceAll("ۀ", "ه")
        .replaceAll("ة", "ه")
        .replaceAll("ؤ", "و")
        .replaceAll("إ", "ا")
        .replaceAll("أ", "ا")
        .replaceAll("ء", "و")
        .replaceAll("ك", "ک")
        .replaceAll("ڪ", "ک")
        .replaceAll("الله", "اله")
        .replaceAll("ا...", "اله");
}
String.prototype.toMoney = function () {
    var separator = ",";
    var negativeDefiner = "";
    var baseValue = this;
    if (!baseValue)
        return "";
    if (baseValue.substr(0, 1) === "-") {
        negativeDefiner = "-";
        baseValue = baseValue.substr(1, baseValue.length - 1);
    }
    var decimalINDX = baseValue.indexOf(".");
    var decimalValue = "";
    if (decimalINDX > -1) {
        decimalValue = baseValue.substr(decimalINDX);
        baseValue = baseValue.substr(0, decimalINDX);
    }
    var newvalue = "";
    if (separator.length > 0) {
        while (baseValue.indexOf(separator) > -1)
            baseValue = baseValue.replace(separator, '');
        var counter = 0;
        for (var i = baseValue.length; i > 0; i--) {
            if (counter === 3) {
                newvalue = separator + newvalue;
                counter = 0;
            }
            newvalue = baseValue.substr(i - 1, 1) + newvalue;
            counter++;
        }
    }
    return negativeDefiner + (newvalue + decimalValue);
}
String.prototype.replaceAll = function (searchValue, replaceValue) {
    var baseValue = this.toString();
    while (baseValue.indexOf(searchValue) > -1)
        baseValue = baseValue.replace(searchValue, replaceValue);
    return baseValue.toString();
}
Element.prototype.tabs = function () {
    var tabNumbers = this.querySelectorAll('.tab-list li').length,
        element = this,
        tabWidth = 100 / tabNumbers,
        clickedTab = null,
        clickedTabID = null;
    element.querySelectorAll('.tab-list li').forEach(function (item) {
        item.style.width = tabWidth + "%";
        item.addEventListener('click', (e) => {
            e.preventDefault();
            clickedTab = e.target;
            clickedTabID = clickedTab.href.substring(clickedTab.href.lastIndexOf('#'));
            if (!clickedTab.classList.contains("active")) {
                element.querySelectorAll('.tab-link').forEach(function (el) {
                    el.classList.remove("active");
                });
                clickedTab.classList.add("active");


                element.querySelectorAll('.tab-content').forEach(function (el) {
                    el.classList.remove("active");
                });
                element.querySelector(clickedTabID).classList.add("active");
            }
        });
    });
}
Element.prototype.toMoney = function () {
    var inputEl = this;
    inputEl.onkeyup = formatMoney;
    inputEl.onload = attachEvent;
    inputEl.onfocus = attachEvent;

    function attachEvent() {
        if (AttachNumericBoxCheckEvent) {
            if (!this.NumericBoxCheckEventAttached) {
                AttachNumericBoxCheckEvent(this.id);
                this.NumericBoxCheckEventAttached = true;
            };
        }
    }
    function formatMoney() {
        inputEl.value = inputEl.value.toMoney();
    }
}
FileInput = function (el, multiple = false) {
    var _this = this;
    _this.choosedFiles = [];
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    multiple ? fileInput.setAttribute("multiple", "") : "";
    fileInput.style.display = "none";
    var choosedFile = '<span class="choosedFile"></span>'.toElements()[0];

    insertAfter(choosedFile, el);
    insertAfter(fileInput, el);

    fileInput.onchange = function () {
        var fileNames = "";
        _this.choosedFiles = [];
        for (var i = 0; i < this.files.length; ++i) {
            var name = this.files.item(i).name;
            fileNames += name + "<br>";
        }
        _this.choosedFiles = this.files;
        choosedFile.innerHTML = fileNames;
    }
    el.onclick = () => {
        fileInput.click();
    }
}
Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
}
Element.prototype.enter = function (callBack) {
    this.onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            if (callBack)
                callBack(e, e.currentTarget);
        }
    }
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}
String.prototype.getXmlNodesByTagName = function (tagName) {
    return getXmlNodesByTagName(this, tagName);
}
Array.prototype.search = function (key, fieldName) {
    array = this;
    resArray = [];
    if (Array.isArray(this))
        for (var i = 0; i < array.length; i++) {
            if (array[i][fieldName] === key) {
                resArray.push(array[i]);
            }
        }
    return resArray.length == 0 ? null : (resArray.length == 1 ? resArray[0] : resArray);
}
Array.prototype.distinct = function (prop) {
    var flags = [], output = [], l = this.length, i;
    for (i = 0; i < l; i++) {
        if (flags[this[i][prop]]) continue;
        flags[damages[i][prop]] = true;
        output.push(damages[i]);
    }
    return output;
}
Array.prototype.groupBy = function (keyGetter) {
    const grouped = {};
    this.forEach((item) => {
        const key = keyGetter(item);
        const collection = grouped[key];
        if (!collection) {
            grouped[key] = [item];
        } else {
            collection.push(item);
        }
    });
    return grouped;
}
function getXmlNodesByTagName(xml, tagName) {
    tagName = tagName.toLowerCase();
    var lowerXML = xml.toLowerCase();
    var nodes = nodes = new Array();
    var begin = 0;
    var _true = true;
    while (_true) {
        begin = lowerXML.indexOf('<' + tagName + '>', begin);
        if (begin > -1)
            begin += tagName.length + 2;
        else
            break;
        var end = lowerXML.indexOf('</' + tagName + '>', begin);
        nodes.push(xml.substring(begin, end));
    }
    return nodes;
}
/**
 * resize image
 */
var resizeImage = function (settings) {
    var file = settings.file;
    var maxSize = settings.maxSize;
    var reader = new FileReader();
    var image = new Image();
    var canvas = document.createElement('canvas');
    var dataURItoBlob = function (dataURI) {
        var bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
            atob(dataURI.split(',')[1]) :
            unescape(dataURI.split(',')[1]);
        var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var max = bytes.length;
        var ia = new Uint8Array(max);
        for (var i = 0; i < max; i++)
            ia[i] = bytes.charCodeAt(i);
        return new Blob([ia], { type: mime });
    };
    var resize = function () {
        var width = image.width;
        var height = image.height;
        if (width > height) {
            if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
            }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        var dataUrl = canvas.toDataURL('image/jpeg');
        return dataURItoBlob(dataUrl);
    };
    return new Promise(function (ok, no) {
        if (!file.type.match(/image.*/)) {
            no(new Error("Not an image"));
            return;
        }
        reader.onload = function (readerEvent) {
            image.onload = function () { return ok(resize()); };
            image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    });
};
function resizeImages(files, maxSize) {
    var promisses = [];
    for (var i = 0; i < files.length; i++) {
        promisses.push(resizeImage({
            file: files[i],
            maxSize: maxSize
        }));
    }
    return Promise.all(promisses);
}
// base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};
function convertAllToBase64(fileList) {
    var promises = [];
    for (var i = 0; i < fileList.length; i++) {
        promises.push(convertToBase64(fileList[i]));
    }
    return Promise.all(promises);
}
/*
 * numeric box
 */
function CheckNumeric(e, sender) {
    var engNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    var arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    var key = window.event ? e.keyCode : e.which;



    var keychar = String.fromCharCode(key);
    for (var i = 0; i <= persianNumbers.length; i++)
        if (keychar === persianNumbers[i] || keychar === arabicNumbers[i])
            keychar = engNumbers[i];
    var reg = /\d/;
    var valid = reg.test(keychar);
    if (valid == false) {
        if (keychar == "." || key == 0 || key == 8 || key == 9 || key == 13 || key == 27)
            valid = true;
    }
    if (valid) {
        var separator = sender.getAttribute("DigitSeparator");
        if (separator && separator.length > 0) {
            setTimeout(function () {
                var baseValue = sender.value;
                while (baseValue.indexOf(separator) > -1)
                    baseValue = baseValue.replace(separator, '');
                var newvalue = "";
                var counter = 0;
                for (var i = baseValue.length; i > 0; i--) {
                    if (counter == 3) {
                        newvalue = separator + newvalue;
                        counter = 0;
                    }
                    newvalue = baseValue.substr(i - 1, 1) + newvalue;
                    counter++;
                }
                sender.value = newvalue;
            }, 0);
        }
    }
    return valid;
}
function keyRestrict(e, validchars) {
    var key = window.event ? e.keyCode : e.which;
    var keychar = String.fromCharCode(key).toLowerCase();
    validchars = validchars.toLowerCase();
    if (validchars.indexOf(keychar) > -1) return true;
    if (key == "." || key == 0 || key == 8 || key == 9 || key == 13 || key == 27) return true;
    return false;
}
function AttachNumericBoxCheckEvent(sender) {
    if (typeof sender == 'string')
        sender = document.getElementById(sender);
    if (sender.addEventListener)
        sender.addEventListener('keypress', function (event) { if (CheckNumeric(event, sender) == false) { event.preventDefault(); return false; } }, false);
    else if (obj.attachEvent)
        obj.attachEvent('onkeypress', function (event) { if (CheckNumeric(event, sender) == false) { event.preventDefault(); return false; } });
}
function AttachNationalCodeCheckEvent(sender, ReplaceWithValidNationalCode) {
    if (typeof sender == 'string')
        sender = document.getElementById(sender);
    if (sender.addEventListener)
        sender.addEventListener('blur', function (event) { if (CheckNumericBoxNationalCode(sender, ReplaceWithValidNationalCode, true) == false) { event.preventDefault(); return false; } }, false);
    else if (obj.attachEvent)
        obj.attachEvent('blur', function (event) { if (CheckNumericBoxNationalCode(sender, ReplaceWithValidNationalCode, true) == false) { event.preventDefault(); return false; } });
}
function AttachNationalCodeFocusEvent(sender, handler) {
    if (typeof sender == 'string')
        sender = document.getElementById(sender);
    if (sender.addEventListener)
        sender.addEventListener('focus', handler);
    else if (obj.attachEvent)
        obj.attachEvent('focus', handler);
}
function checkNatinalCode(code) {
    code = code.toString();
    var isValid = false;
    var L = code.length;
    var s;
    if (L > 10)
        isValid = false;
    else if (L < 8 || parseInt(code, 10) == 0) {
        isValid = false;
    }
    else {
        code = ('0000' + code).substr(L + 4 - 10);
        if (parseInt(code.substr(3, 6), 10) == 0) {
            isValid = false;
        }
        else {
            var c = parseInt(code.substr(9, 1), 10);
            s = 0;
            for (var i = 0; i < 9; i++)
                s += parseInt(code.substr(i, 1), 10) * (10 - i);
            s = s % 11;
            isValid = (s < 2 && c == s) || (s >= 2 && c == (11 - s));
        }
    }
    return isValid;
}
function CheckNumericBoxNationalCode(sender, ReplaceWithValidNationalCode, ChangeToInvalidCssClass) {
    var isValid = false;
    var code = sender.value;
    var s;
    isValid = checkNatinalCode(code);
    if (isValid == false && ReplaceWithValidNationalCode == true) {
        var newNationalCode = code.substring(0, 9);
        for (var c = 0; c < 10; c++) {
            if ((s < 2 && c == s) || (s >= 2 && c == (11 - s)) == true) {
                newNationalCode += c;
                break;
            }
        }
        var con = confirm('کد ملی وارد شده معتبر نیست، آیا میخواهید به جای کد وارد شده از ' + newNationalCode + ' استفاده نمایید؟');
        if (con == true) {
            isValid = true;
            sender.value = newNationalCode;
        }
    }
    if (ChangeToInvalidCssClass == true) {
        sender.className = sender.className.replace(" Invalid", "");
        if (isValid == false && sender.value.length > 0)
            sender.className = sender.className + " Invalid";
        AttachNationalCodeFocusEvent(sender, function () { sender.className = sender.className.replace(" Invalid", ""); });
    }
    return isValid;
}
/*
 * numeric box
 */
function isValidIBAN(IBAN) {
    if (IBAN === null || IBAN === "")
        return true;

    if (IBAN.toLowerCase().indexOf("ir") > -1)
        IBAN = IBAN.substr(2, IBAN.length - 2);

    if (IBAN.length !== 24 || IBAN.indexOf(" ") > -1 || isNumeric(IBAN) === false)
        return false;

    if (typeof (bigInt) === "undefined")
        return true;

    IBAN = IBAN.substr(2, IBAN.length - 2) + "1827" + IBAN.substr(0, 2);
    var modRes = bigInt(IBAN).mod(97);
    return modRes === 1 || modRes.value === 1;
    //return parseFloat(IBAN) % 97 == 1;
}
function isNumeric(str) {
    return /^\d+$/.test(str);
}
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
var includesLike = function (data, text, key) {
    var similars = [];
    data.forEach(function (item) {
        if (item[key].toPersianUniCode().includes(text.toPersianUniCode()))
            similars.push(item);
    });

    return similars;
}
//pad
String.prototype.padLeft = function (n, pad) {
    t = '';
    if (n > this.length) {
        for (i = 0; i < n - this.length; i++) {
            t += pad;
        }
    }
    return t + this;
}
String.prototype.padRight = function (n, pad) {
    t = this;
    if (n > this.length) {
        for (i = 0; i < n - this.length; i++) {
            t += pad;
        }
    }
    return t;
}
/* geo to solar */
var dkSolar = 0;
var dkGregorian = 1;
function IsLeapYear(DateKind, Year) {
    if (DateKind == dkSolar)
        return ((((Year + 38) * 31) % 128) <= 30);
    else
        return (((Year % 4) == 0) && (((Year % 100) != 0) || ((Year % 400) == 0)));
}
var GREGORIAN_EPOCH = 1721425.5;
var PERSIAN_EPOCH = 1948320.5;
function mod(a, b) {
    return a - (b * Math.floor(a / b));
}
function persian_to_jd(year, month, day) {
    var epbase, epyear;

    epbase = year - ((year >= 0) ? 474 : 473);
    epyear = 474 + mod(epbase, 2820);
    return day +
        ((month <= 7) ?
            ((month - 1) * 31) :
            (((month - 1) * 30) + 6)
        ) +
        Math.floor(((epyear * 682) - 110) / 2816) +
        (epyear - 1) * 365 +
        Math.floor(epbase / 2820) * 1029983 +
        (PERSIAN_EPOCH - 1);
}
function gregorian_to_jd(year, month, day) {
    return (GREGORIAN_EPOCH - 1) +
        (365 * (year - 1)) +
        Math.floor((year - 1) / 4) +
        (-Math.floor((year - 1) / 100)) +
        Math.floor((year - 1) / 400) +
        Math.floor((((367 * month) - 362) / 12) +
            ((month <= 2) ? 0 :
                (IsLeapYear(dkGregorian, year) ? -1 : -2)
            ) +
            day);
}
function jd_to_persian(jd) {
    var year, month, day, depoch, cycle, cyear, ycycle,
        aux1, aux2, yday;


    jd = Math.floor(jd) + 0.5;

    depoch = jd - persian_to_jd(475, 1, 1);
    cycle = Math.floor(depoch / 1029983);
    cyear = mod(depoch, 1029983);
    if (cyear == 1029982) {
        ycycle = 2820;
    } else {
        aux1 = Math.floor(cyear / 366);
        aux2 = mod(cyear, 366);
        ycycle = Math.floor(((2134 * aux1) + (2816 * aux2) + 2815) / 1028522) +
            aux1 + 1;
    }
    year = ycycle + (2820 * cycle) + 474;
    if (year <= 0) {
        year--;
    }
    yday = (jd - persian_to_jd(year, 1, 1)) + 1;
    month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
    day = (jd - persian_to_jd(year, month, 1)) + 1;
    return new Array(year, month, day);
}
function GregorianToSolar(gYear, gMonth, gDay) {
    if (gDay == 0 && gMonth == 0 && gYear == 0) {
        dDate = new Date();
        gDay = dDate.getDate();
        gMonth = dDate.getMonth() + 1;
        gYear = dDate.getFullYear();
    }
    var _jd = gregorian_to_jd(gYear, gMonth, gDay);
    var persianDate = jd_to_persian(_jd);
    this.gYear = persianDate[0];
    this.gMonth = parseInt(persianDate[1]) - 1;
    this.gDay = persianDate[2]
    this.getDate = function () { return this.gDay; };
    this.getMonth = function () { return this.gMonth; };
    this.getYear = function () { return this.gYear; };
    this.getFullYear = function () { return this.gYear; };
}
function SolarToGregorian(sYear, sMonth, sDay) {
    if (sDay === 0 && sMonth === 0 && sYear === 0) {
        dDate = new Date();
        return dDate;
    }
    //'******************* Leap year
    if (sYear === 1378) {
        if (sMonth === 12 && sDay === 10) { sYear = 2000; sMonth = 2; sDay = 29; return; }

        if (sMonth === 12 && sDay > 10)
            sDay--;
    }
    else
        if (sYear === 1379) {
            sDay--;

            if (sDay === 0) {
                sMonth--;
                if (sMonth > 0 && sMonth < 7) sDay = 31;
                if (sMonth > 6) sDay = 30;
                if (sMonth === 0) {
                    sDay = 29;
                    sMonth = 12;
                    sYear--;
                }
            }
        }
    //'*******************

    if (sMonth < 10 || (sMonth === 10 && sDay < 11))
        sYear += 621;
    else
        sYear += 622;

    switch (sMonth) {
        case 1: (sDay < 12) ? (sMonth = 3, sDay += 20) : (sMonth = 4, sDay -= 11); break;
        case 2: (sDay < 11) ? (sMonth = 4, sDay += 20) : (sMonth = 5, sDay -= 10); break;
        case 3: (sDay < 11) ? (sMonth = 5, sDay += 21) : (sMonth = 6, sDay -= 10); break;
        case 4: (sDay < 10) ? (sMonth = 6, sDay += 21) : (sMonth = 7, sDay -= 9); break;
        case 5:
        case 6:
        case 8: (sDay < 10) ? (sMonth += 2, sDay += 22) : (sMonth += 3, sDay -= 9); break;
        case 7: (sDay < 9) ? (sMonth = 9, sDay += 22) : (sMonth = 10, sDay -= 8); break;
        case 9: (sDay < 10) ? (sMonth = 11, sDay += 21) : (sMonth = 12, sDay -= 9); break;
        case 10: (sDay < 11) ? (sMonth = 12, sDay += 21) : (sMonth = 1, sDay -= 10); break;
        case 11: (sDay < 12) ? (sMonth = 1, sDay += 20) : (sMonth = 2, sDay -= 11); break;
        case 12: (sDay < 10) ? (sMonth = 2, sDay += 19) : (sMonth = 3, sDay -= 9); break;
    }

    var retDate = new Date(sYear, sMonth - 1, sDay);//در جاوا، ماه ها از صفر شروع می شوند
    var dateStr = sYear.toString() + "/" + sMonth.toString().padLeft(2, "0") + "/" + sDay.toString().padLeft(2, "0");
    return { Date: retDate, Year: sYear, Month: sMonth, Day: sDay, DateStr: dateStr };
}
/* end */
function formatDate(serverTime) {
    var timeStamp = serverTime;
    if (serverTime.toString().includes(')'))
        timeStamp = timeStamp.substring(
            serverTime.lastIndexOf("(") + 1,
            serverTime.lastIndexOf(")")
        );
    var dateTime = new Date(parseInt(timeStamp));
    var gDateTime = new GregorianToSolar(dateTime.getFullYear(), dateTime.getMonth() + 1, dateTime.getDate());
    var year = gDateTime.getFullYear();
    var month = gDateTime.getMonth();
    var date = gDateTime.getDate();
    var hour = dateTime.getHours();
    var min = dateTime.getMinutes();
    var sec = dateTime.getSeconds();

    var dateString = year + '/' + month + '/' + date;
    var timeString = hour + ':' + min + ':' + sec;
    return [dateString, timeString];
}
function ticketExpired() {
    signOut();
    alert("متاسفانه سامانه مجددا به اعتبارسنجی وضعیت کاربری شما نیاز پیدا کرده است، لطفا دوباره وارد نرم افزار شوید۱");
}
async function clearCachedData() {
    try {
        //await dbman.removeDB();
        server = null;
        await localStorage.clear();
        partialViewNavigation = [];
        currentPartial = null;
        if (socket)
            await socket.Close();
        socket = null;
    } catch { };
}
async function signOut() {
    showLoader(true);
    await clearCachedData();
    document.location.reload();
    hideLoader();
}
async function unregisterSW() {
    try {
        var reg = await navigator.serviceWorker.getRegistration();
        reg.unregister();
    } catch (e) {
        console.error(e.message);
    }
}
function socketMessageHandler(message) {
    message = JSON.parse(message);
    if (message.Method === "ReceptionUsingInCashDesk") {
        if (currentPartial[0].Content == PartialViewTemplates.CashDesk.Content) {
            hideRow(message.Data.ReceptionID);
        }
    }
    if (message.Method === "ReceptionFreeInCashDesk") {
        if (currentPartial[0].Content == PartialViewTemplates.CashDesk.Content) {
            showRow(message.Data.ReceptionID);
        }
    } else {
        console.log("Unknown Method", message);
    }
}
function ApplyFocusOnKeyPress(AutoFocusArray) {
    1
    for (var i = 0; i < AutoFocusArray.length; i++) {
        var obj;
        if (!Array.isArray(AutoFocusArray[i]))
            obj = AutoFocusArray[i];
        else
            obj = AutoFocusArray[i][0];

        obj.AutoFocusArray = AutoFocusArray;
        obj.IndexOnArray = i;
        if (i < AutoFocusArray.length - 1) {
            obj.addEventListener("keypress", function (e) {
                var keycode = e.keyCode ? e.keyCode : e.which;
                if (keycode === 13) {
                    if (this.AutoFocusArray) {
                        this.targetIndex = this.IndexOnArray;
                        if (this.tagName.toLowerCase() === 'select')
                            e.preventDefault();
                        do {
                            this.targetIndex = this.targetIndex + 1;
                            if (this.targetIndex >= this.AutoFocusArray.length)
                                this.targetIndex = 0;
                            var _obj;
                            var _AutoClick
                            if (!Array.isArray(this.AutoFocusArray[this.targetIndex]))
                                _obj = this.AutoFocusArray[this.targetIndex];
                            else {
                                _obj = this.AutoFocusArray[this.targetIndex][0];
                                _AutoClick = this.AutoFocusArray[this.targetIndex][1];
                            }
                            if (_obj.disabled === false) {
                                _obj.focus();
                                if (typeof _obj.select === "function")
                                    _obj.select();
                                if (_AutoClick === true)
                                    _obj.click();
                                break;
                            }
                        }
                        while (this.targetIndex !== this.IndexOnArray)
                    }
                    if (this.tagName.toLowerCase() === 'input' && this.getAttribute("type") == "button")
                        return true;
                    else {
                        e.preventDefault();
                        return false;
                    }
                }
            });
        }
    }
}
function initiateCollapseList() {
    var d = document,
        accordionToggles = d.querySelectorAll('.js-accordionTrigger'),
        setAria,
        setAccordionAria,
        switchAccordion,
        touchSupported = ('ontouchstart' in window),
        pointerSupported = ('pointerdown' in window);

    skipClickDelay = function (e) {
        e.preventDefault();
        e.target.click();
    }

    setAriaAttr = function (el, ariaType, newProperty) {
        el.setAttribute(ariaType, newProperty);
    };
    setAccordionAria = function (el1, el2, expanded) {
        switch (expanded) {
            case "true":
                setAriaAttr(el1, 'aria-expanded', 'true');
                setAriaAttr(el2, 'aria-hidden', 'false');
                break;
            case "false":
                setAriaAttr(el1, 'aria-expanded', 'false');
                setAriaAttr(el2, 'aria-hidden', 'true');
                break;
            default:
                break;
        }
    };
    //function
    switchAccordion = function (e) {
        e.preventDefault();
        var el = e.target.closest(".js-accordionTrigger");
        var svg = el.querySelector('.fa-chevron-left');
        var thisAnswer = el.parentNode.nextElementSibling;
        var thisQuestion = el;

        if (thisAnswer.classList.contains('is-collapsed')) {
            setTimeout(() => {
                window.scroll(0, thisAnswer.offsetTop - 100);
            }, 200);
            setAccordionAria(thisQuestion, thisAnswer, 'true');
        } else {
            setAccordionAria(thisQuestion, thisAnswer, 'false');
        }
        thisQuestion.classList.toggle('is-collapsed');
        thisQuestion.classList.toggle('is-expanded');
        thisAnswer.classList.toggle('is-collapsed');
        thisAnswer.classList.toggle('is-expanded');
        svg.classList.toggle('rotate-270');

        thisAnswer.classList.toggle('animateIn');
    };
    for (var i = 0, len = accordionToggles.length; i < len; i++) {
        accordionToggles[i].addEventListener('click', switchAccordion, false);
    }
}
function is_image(url) {
    var imgRegex = /(http?:\/\/.*\.(?:png|jpg))/i;
    return imgRegex.test(url);
}

/*async function createUnSeenNotificationsBadge() {
    var result = await getSavedNotifications();

    if (result && result.length > 0) {
        var unseen = result.filter(notify => notify.seen === false);
        var badge = document.querySelector('#menu_unseen_num');
        if (unseen.length > 0) {
            badge.innerHTML = unseen.length;
            badge.className = "badge show";
        }
        else {
            badge.innerHTML = "";
            badge.className = "badge close";
        }
    }
}*/


function FooterMenuToggle(show, isFullMenu = false, html = "") {
    document.getElementById('footer-menu-content').innerHTML = "";
    var dvPane = document.getElementById('footer-menu-container');
    var footerMenu = document.getElementById("footer-menu");
    dvPane.className = "footerMenuPane " + (show ? "open" : "close") + " " + (show ? (isFullMenu ? "full" : "half") : "");
    if (show) {
        if (typeof html == 'object') {
            document.getElementById('footer-menu-content').appendChild(html);
        } else {
            document.getElementById('footer-menu-content').innerHTML = html;
        }
        document.getElementById('footer-menu-container').onclick = function (e) {
            if (e.target === this)
                FooterMenuToggle(false, false, "");
        };

        document.getElementById('footer-menu-header').onclick = function () { FooterMenuToggle(false, false, ""); }
        footerMenu.ontouchstart = function (e) {
            footerMenu.prevScreenX = e.touches[0].clientX;
            footerMenu.prevScreenY = e.touches[0].clientY;
            footerMenu.prevMoveTime = Date.now();
        }
        footerMenu.ontouchend = function (e) {
            delete footerMenu.prevScreenX;
            delete footerMenu.prevScreenY;
        }
        footerMenu.ontouchmove = function (e) {
            var screenX = e.touches[0].clientX;
            var screenY = e.touches[0].clientY;
            var changeY = screenY - footerMenu.prevScreenY;
            if ((footerMenu.scrollTop > 0 && changeY >= 0) || (footerMenu.clientHeight + footerMenu.scrollTop !== footerMenu.scrollHeight && changeY <= 0))
                return;

            if (Date.now() - footerMenu.prevMoveTime < 500 && changeY >= 30) {
                footerMenu.ontouchmove = null;
                return FooterMenuToggle(false);
            }
            footerMenu.prevMoveTime = Date.now();




            var newTop = ((parseInt(footerMenu.style.top) || 0) + changeY);
            newTop = newTop > 0 ? newTop : 0;
            var newHeight = window.innerHeight - newTop;

            if (newHeight < 150) {
                footerMenu.ontouchmove = null;
                return FooterMenuToggle(false);
            }

            footerMenu.style.top = newTop + "px";
            footerMenu.style.height = newHeight + "px";


            footerMenu.prevScreenX = screenX;
            footerMenu.prevScreenY = screenY;
        }
    }
    else {
        footerMenu.style.top = "";
        footerMenu.style.height = "";
    }
}

async function pingServer() {
    try {
        var res = await fetch(APIRoot,
            {
                method: "GET",
                cache: "no-cache",
                credentials: "omit",
                redirect: "follow",
                referrer: "no-referrer"
            });
        return res.ok;
    } catch (e) {
        return false;
    }
}
document.body.controlsDisabled = false;
function disableControls() {
    document.body.classList.add("disabledBox");
    document.body.controlsDisabled = true;
}
function enableControls() {
    document.body.controlsDisabled = false;
    document.body.classList.remove("disabledBox");
}