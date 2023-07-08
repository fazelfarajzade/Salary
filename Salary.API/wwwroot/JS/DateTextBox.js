// specialDates = [
//     {
//         day: [day of month - required],
//         month: [month of year - required],
//         year: [full year - optional - if not set applies for all months],
//         desc: [description - required - defalult ""],
//         selectable: [is valid for date - required - default false]
//     },
// ]
//
// isAppointment = boolean
//
// daysOfWeek = Availible for get appointment in week Exeample: [1, 2, 3] - isAppointment should 
Element.prototype.datePeaker = function (specialDates, isAppointment, daysOfWeek) {
    var _this = this;
    var currentID = this.getAttribute('id');
    // Add a Parent div
    var parent = _this.parentNode;
    var container = document.createElement('div');
    parent.replaceChild(container, _this);
    container.appendChild(_this);
    // Set Parent Styles
    container.style.position = "relative";
    // Add random id to input if has`nt
    if (!currentID) {
        currentID = Math.random().toString(36).substring(7);
        _this.setAttribute('id', currentID);
    }
    // Set input Attributs
    _this.setAttribute("type", "tel");
    _this.setAttribute("maxlength", "10");
    _this.setAttribute("autocomplete", "off");
    _this.setAttribute("calendarformurl", "resources/calendar/DateTextBoxCalendar.htm");
    _this.setAttribute("style", "direction:ltr;text-align:left;");
    _this.setAttribute("oldchangedvalue", "");
    // Add show calendar link and icon
    // -- link
    var link = document.createElement("a");
    link.setAttribute("style", "border:none;outline:none;right: 10%;position:absolute;top: 7px;");
    link.setAttribute("href", "javascript:void(0)");
    link.setAttribute("id", currentID + "Trigger");
    link.setAttribute("tabindex", "-1");
    // -- icon
    var img = document.createElement("img");
    img.setAttribute("style", "border:none;");
    img.setAttribute("name", "popcal");
    img.setAttribute("align", "middle");
    img.setAttribute("src", "Resources/calendar/calbtn.png");
    img.setAttribute("border", "0");
    img.setAttribute("alt", "انتخاب از تقویم");
    link.appendChild(img);
    container.appendChild(link);
    // Set input events
    _this.onfocus = function () {
        DateTextBox_OnFocus(_this);
        if (_this.value == '') {
            link.click();
        };
    }
    _this.onclick = function () {
        DateTextBox_OnFocus(_this, true);
    }
    _this.onkeydown = function () {
        return DateTextBox_KeyPressed(_this, event);
    }
    _this.onblur = function () {
        var __blureddatebox__ = _this;
        setTimeout(function () {
            DateTextBox_Validate(__blureddatebox__, 'OnBlur');
        }, 1);
    }
    _this.isValid = function () { return DateTextBox_Validate(_this, 'IsValidDate'); }
    // Set link events
    link.onclick = function () {
        if (_this.disabled == false) {
            DateTextBox_ShowCalendar(_this, 'bottom', specialDates, isAppointment, daysOfWeek);
        }
        return false;
    }
}
function DateTextBox_OnFocus(field, isClickEvent) {
    if (isClickEvent == true) {
        var startPos = 0;
        try {
            startPos = DateTextBox_GetCaretPosition(field);
        }
        catch (err) {
        }
        if (startPos <= 4)
            DateTextBox_Select(field, 0, 4);
        else if (startPos > 4 && startPos <= 7)
            DateTextBox_Select(field, 5, 7);
        else
            DateTextBox_Select(field, 8, 10);
    }
    else
        DateTextBox_Select(field, 0, 4);
}
function DateTextBox_Select(field, start, end) {
    if (field.createTextRange) {
        var oRange = field.createTextRange();
        oRange.moveStart("character", start);
        oRange.moveEnd("character", -10 + end);
        oRange.select();
    }
    else
        field.setSelectionRange(start, end);
}
function DateTextBox_Validate(field, argument) {
    var valid = true;
    var val = field.value;

    if (val === '____/__/__' || val === "" || val === "          ") {
        if (typeof argument == "string") {
            if (argument === "IsValidDate")
                return false;
            else if (argument === "OnBlur") {
                field.value = "";
                return false;
            }
        }
        return true;
    }

    var year = val.substring(0, 4);
    year = isNaN(year) ? 0 : parseInt(year, 10);

    var month = val.substring(5, 7);
    month = isNaN(month) ? 0 : parseInt(month, 10);

    var day = val.substring(8, 10);
    day = isNaN(day) ? 0 : parseInt(day, 10);

    if (year < 1200 || year > 2100) {
        valid = false;
        DateTextBox_Select(field, 0, 4);
    }
    else if (month < 1 || month > 12) {
        valid = false;
        DateTextBox_Select(field, 5, 7);
    }
    else if (day < 1 || day > 31) {
        valid = false;
        DateTextBox_Select(field, 8, 10);
    }
    if (valid == true) {
        year = '0000' + year.toString();
        month = '00' + month.toString();
        day = '00' + day.toString();
        field.value = year.substring(year.length - 4) + "/" + month.substring(month.length - 2) + "/" + day.substring(day.length - 2);
    }
    else {
        if (typeof compareToValidDate != "undefined" && compareToValidDate === true) {
        }
        else {
            alert("تاریخ وارد شده صحیح نمی باشد، لطفا اصلاح کنید");
            field.value = "";
            field.focus();
        }
    }

    return valid;
}
function DateTextBox_KeyPressed(field, e) {
    if (field.disabled || field.readOnly)
        return true;
    if (field.value.length != 10) {
        field.value = '____/__/__';
        DateTextBox_Select(field, 0, 4);
    }
    var startPos = DateTextBox_GetCaretPosition(field);
    if (startPos > 9)
        return false;
    var ret = false;
    var keyCode = window.event ? e.keyCode : e.which;
    if (keyCode >= 96 && keyCode <= 105)
        keyCode -= 48;
    var newChr = String.fromCharCode(keyCode);
    var endPos, status;
    if (startPos <= 4)
        endPos = 4;
    else if (startPos > 4 && startPos <= 7)
        endPos = 7;
    else
        endPos = 10;
    if (keyCode > 47 && keyCode <= 57) {
        field.value = field.value.substring(0, startPos) + newChr + field.value.substring(startPos + 1, field.value.length);
        if (startPos == 3 || startPos == 6 || startPos == 9)
            DateTextBox_GoRight(field, endPos);
        else
            DateTextBox_Select(field, startPos + 1, endPos);
    }
    else {
        switch (keyCode) {
            case 37: //left arrow
                DateTextBox_GoLeft(field, endPos);
                break;
            case 39: //right arrow
                DateTextBox_GoRight(field, endPos);
                break;
            case 38: //up arrow
                DateTextBox_AddValue(field, endPos, 1);
                break;
            case 40: //down arrow
                DateTextBox_AddValue(field, endPos, -1);
                break;
            case 33: //page up  
            case 34: //page down  
            case 36: //home  
            case 35: //end                  
            case 13: //enter  
                ret = DateTextBox_Validate(field);
                break;
            case 9: //tab  
                //if(DateTextBox_Validate(field) == false)
                //ret = false;
                ret = true;
                break;
            case 27: //esc  
            case 16: //shift  
            case 17: //ctrl  
            case 18: //alt  
            case 20: //caps lock
                break;
            case 8: //backspace  
                field.value = field.value.substring(0, startPos) + '____'.substring(0, endPos - startPos) + field.value.substring(endPos);
                DateTextBox_GoLeft(field, endPos);
                break;
            case 46: //delete
                field.value = field.value.substring(0, startPos) + '____'.substring(0, endPos - startPos) + field.value.substring(endPos);
                DateTextBox_Select(field, startPos, endPos);
                break;
        }
    }
    return ret;
}
function DateTextBox_AddValue(field, endPos, value) {
    var val = field.value;
    var newVal;
    if (endPos == 4) {
        newVal = isNaN(val.substring(0, 4)) ? 1200 : (parseInt(val.substring(0, 4), 10) + value);
        if (newVal < 1200) newVal = 1500;
        if (newVal > 2100) newVal = 1900;
        newVal = '000' + newVal.toString();
        field.value = newVal.substring(newVal.length - 4) + val.substring(4);
        DateTextBox_Select(field, 0, 4);
    }
    else if (endPos == 7) {
        newVal = isNaN(val.substring(5, 7)) ? value : (parseInt(val.substring(5, 7), 10) + value);
        if (newVal > 12) newVal = 1;
        if (newVal < 1) newVal = 12;
        newVal = '0' + newVal.toString();
        field.value = val.substring(0, 5) + newVal.substring(newVal.length - 2) + val.substring(7);
        DateTextBox_Select(field, 5, 7);
    }
    else {
        newVal = isNaN(val.substring(8, 10)) ? value : (parseInt(val.substring(8, 10), 10) + value);
        if (newVal > 31) newVal = 1;
        if (newVal < 1) newVal = 31;
        newVal = '0' + newVal.toString();
        field.value = val.substring(0, 8) + newVal.substring(newVal.length - 2);
        DateTextBox_Select(field, 8, 10);
    }
}
function DateTextBox_GoLeft(field, endPos) {
    if (endPos == 4)
        DateTextBox_Select(field, 8, 10);
    else if (endPos == 7)
        DateTextBox_Select(field, 0, 4);
    else
        DateTextBox_Select(field, 5, 7);
}
function DateTextBox_GoRight(field, endPos) {
    if (endPos == 4)
        DateTextBox_Select(field, 5, 7);
    else if (endPos == 7)
        DateTextBox_Select(field, 8, 10);
    else
        DateTextBox_Select(field, 0, 4);
}
function DateTextBox_GetCaretPosition(field) {
    if (document.selection) {
        var range = document.selection.createRange().duplicate();
        return -range.moveStart("character", -field.value.length);
    }
    else if (field.selectionStart)
        return field.selectionStart;
    return 0;
}
var SpecialDates = null;
var isAppointment = null;
var daysOfWeek = null;
function DateTextBox_ShowCalendar(field, calPosition, specialDates, isapointment, arrDaysOfWeek) {
    SpecialDates = specialDates;
    isAppointment = isapointment;
    daysOfWeek = arrDaysOfWeek;

    if (field.calendar) {
        document.CurrentCalendarField = field;
        field.calendar.show(field, calPosition);
    }
    else {
        var calendar = document.createElement('div');
        var calWidth = 100;
        var calHeight = 100;
        calendar.id = field.id + "_Calendar";
        calendar.style.position = "absolute";
        calendar.style.width = calWidth + "%";
        calendar.style.height = calHeight + "vh";
        calendar.style.background = "rgba(255, 255, 255, 0.3)";
        //calendar.style.backgroundColor = "white";
        calendar.style.borderStyle = "none";
        calendar.style.borderWidth = "0px";
        calendar.style.display = 'none';
        calendar.style.zIndex = '20';
        var dvContent = document.getElementById('dvContent');
        var header = document.querySelector('.header');
        calendar.show = function (field, calPosition) {
            var fieldPosX = getOffset(field, "left");
            var fieldPosY = getOffset(field, "top");
            var fieldPosH = getOffset(field, "height");
            this.style.bottom = "0px";
            this.style.display = 'block';
            dvContent.style.filter = "blur(2px)";
            header.style.filter = "blur(2px)";
        }
        calendar.hide = function () {
            calendar.style.display = 'none';
            dvContent.style.filter = "none";
            header.style.filter = "none";
        }
        calendar.hide();
        calendar.innerHTML =
            "<iframe class='calendarShow' id='" + field.getAttribute('id') + "Calendar' style='width: 50%;height: 50vh; position: absolute;bottom: 25vh; border: none; background: transparent; left: 25%;' src='"
            + field.getAttribute('calendarFormUrl') + "?v=11.23' frameborder='no' scrolling='no' allowTransparency='true'></iframe>";

        field.calendar = calendar;
        document.body.appendChild(field.calendar);
        DateTextBox_ShowCalendar(field, calPosition, specialDates, isapointment, arrDaysOfWeek);
    }
}
function getOffset(obj, dim) {
    var oLeft, oTop, oWidth, oHeight;
    if (dim == "left") {
        oLeft = obj.offsetLeft;
        while (obj.offsetParent != null) {
            oParent = obj.offsetParent;
            oLeft += oParent.offsetLeft;
            obj = oParent;
        }
        return oLeft;
    }
    else if (dim == "top") {
        oTop = obj.offsetTop;
        while (obj.offsetParent != null) {
            oParent = obj.offsetParent;
            oTop += oParent.offsetTop;
            obj = oParent;
        }
        return oTop;
    }
    else if (dim == "width") {
        oWidth = "100%";
        return oWidth;
    }
    else if (dim == "height") {
        oHeight = obj.offsetHeight;
        return oHeight;
    }
    else {
        alert("Error: invalid offset dimension '" + dim + "' in getOffset()");
        return false;
    }
}
