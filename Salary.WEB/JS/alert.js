window.alert = function (message, title, options) {
    //fazel
    if (enableControls) {
        enableControls();
    }
    //-fazel
    if (message && typeof message === "string")
        while (message.includes("\r\n"))
            message = message.replace("\r\n", "<br/>");
    if (typeof (options) != 'object') { options = {}; }
    if (options.delay != undefined) {
        options.delay++;
        options.delay--;
    } else { options.delay = 300; }
    if (!window.smile_alert) {
        var smile_obj = { selecter: 'smile-alert', element: null, filter: 30, cancelElement: null, confirmElement: null };
        smile_obj.element = document.querySelector(smile_obj.selecter);
    } else {
        if (window.smile_alert.cancel) { window.smile_alert.cancelElement.style = ''; }
        if (window.smile_alert.confirm) { window.smile_alert.confirmElement.style = ''; }
        window.smile_alert.element.style.display = "block";
        smile_obj = window.smile_alert;
    }
    // For this project

    var head = document.querySelector('.header'),
        dvcontent = document.querySelector('#dvContent');

    if (dvcontent) {
        dvcontent.style.filter = "blur(2px)";
    }
    if (head) {
        head.style.filter = "blur(2px)";
    }
    //--
    smile_obj.cancel = options.cancel != undefined ? options.cancel : false;
    smile_obj.cancelText = options.cancelText != undefined ? options.cancelText : 'انصراف';

    smile_obj.cancelCallBack = function (event) {
        window.smile_alert.cancelElement.style = "background-color:#999;color:#000;filter:alpha(opacity=" + (window.smile_alert.filter) + ");-moz-opacity:" + (window.smile_alert.filter / 100) + ";-khtml-opacity: " + (window.smile_alert.filter / 100) + ";opacity: " + (window.smile_alert.filter / 100) + ";";
        setTimeout(function () {
            window.smile_alert.element.style.display = "none";
            if (typeof (options.cancelCallBack) == 'function') { options.cancelCallBack(event); }
            return true;
        }, window.smile_alert.delay);
        // For this project

        var head = document.querySelector('.header'),
            dvcontent = document.querySelector('#dvContent');

        if (dvcontent) {
            dvcontent.style.filter = "none";
        }
        if (head) {
            head.style.filter = "none";
        }
        //--
        //console.log('concel'); 
    };
    smile_obj.message = message;
    smile_obj.title = title;
    smile_obj.confirm = options.confirm != undefined ? options.confirm : true;
    smile_obj.confirmText = options.confirmText != undefined ? options.confirmText : 'متوجه شدم';
    smile_obj.confirmCallBack = function (event) {
        window.smile_alert.confirmElement.style = "background-color:#999;color:#04BE02;filter:alpha(opacity=" + (window.smile_alert.filter) + ");-moz-opacity:" + (window.smile_alert.filter / 100) + ";-khtml-opacity: " + (window.smile_alert.filter / 100) + ";opacity: " + (window.smile_alert.filter / 100) + ";";
        setTimeout(function () {
            window.smile_alert.element.style.display = "none";
            if (typeof (options.confirmCallBack) == 'function') { options.confirmCallBack(event); }
            return true;
        }, window.smile_alert.delay);
        // For this project

        var head = document.querySelector('.header'),
            dvcontent = document.querySelector('#dvContent');

        if (dvcontent) {
            dvcontent.style.filter = "none";
        }
        if (head) {
            head.style.filter = "none";
        }
        //console.log('confirm');
    };
    if (!smile_obj.element) {
        smile_obj.html = '<div class="' + smile_obj.selecter + '" id="' + smile_obj.selecter + '">' +
            '<div class="' + smile_obj.selecter + '-mask"></div>' +
            '<div class="' + smile_obj.selecter + '-message-body">' +
            '<div class="' + smile_obj.selecter + '-message-tbf ' + smile_obj.selecter + '-message-title"><strong class="' + smile_obj.selecter + '-message-tbf ">' + smile_obj.title + '</strong></div>' +
            '<div class="' + smile_obj.selecter + '-message-tbf ' + smile_obj.selecter + '-message-content">' + smile_obj.message + '</div>' +
            '<div class="' + smile_obj.selecter + '-message-tbf ' + smile_obj.selecter + '-message-button">';
        if (smile_obj.cancel || true) { smile_obj.html += '<a href="javascript:;" class="' + smile_obj.selecter + '-message-tbf ' + smile_obj.selecter + '-message-button-cancel">' + smile_obj.cancelText + '</a>'; }
        if (smile_obj.confirm || true) { smile_obj.html += '<a href="javascript:;" class="' + smile_obj.selecter + '-message-tbf ' + smile_obj.selecter + '-message-button-confirm">' + smile_obj.confirmText + '</a>'; }
        smile_obj.html += '</div>' +
            '</div>' +
            '</div>';
        element = document.createElement('div');
        element.id = smile_obj.selecter + '-wrap';
        element.innerHTML = smile_obj.html;
        document.body.appendChild(element);
        smile_obj.element = document.querySelector('.' + smile_obj.selecter);
        smile_obj.cancelElement = document.querySelector('.' + smile_obj.selecter + '-message-button-cancel');
        if (smile_obj.cancel) { document.querySelector('.' + smile_obj.selecter + '-message-button-cancel').style.display = 'block'; } else { document.querySelector('.' + smile_obj.selecter + '-message-button-cancel').style.display = 'none'; }
        smile_obj.confirmElement = document.querySelector('.' + smile_obj.selecter + '-message-button-confirm');
        if (smile_obj.confirm) { document.querySelector('.' + smile_obj.selecter + '-message-button-confirm').style.display = 'block'; } else { document.querySelector('.' + smile_obj.selecter + '-message-button-confirm').style.display = 'none'; }
        smile_obj.cancelElement.onclick = smile_obj.cancelCallBack;
        smile_obj.confirmElement.onclick = smile_obj.confirmCallBack;
        window.smile_alert = smile_obj;
        //console.log(smile_alert);
    }
    document.querySelector('.' + smile_obj.selecter + '-message-body').className = smile_obj.selecter + '-message-body';
    document.querySelector('.' + smile_obj.selecter + '-message-body').classList.add(options.type);
    document.querySelector('.' + smile_obj.selecter + '-message-title').innerHTML = '';
    document.querySelector('.' + smile_obj.selecter + '-message-content').innerHTML = '';
    document.querySelector('.' + smile_obj.selecter + '-message-button-cancel').innerHTML = smile_obj.cancelText;
    document.querySelector('.' + smile_obj.selecter + '-message-button-confirm').innerHTML = smile_obj.confirmText;
    smile_obj.cancelElement = document.querySelector('.' + smile_obj.selecter + '-message-button-cancel');
    if (smile_obj.cancel) { document.querySelector('.' + smile_obj.selecter + '-message-button-cancel').style.display = 'block'; } else { document.querySelector('.' + smile_obj.selecter + '-message-button-cancel').style.display = 'none'; }
    smile_obj.confirmElement = document.querySelector('.' + smile_obj.selecter + '-message-button-confirm');
    if (smile_obj.confirm) { document.querySelector('.' + smile_obj.selecter + '-message-button-confirm').style.display = 'block'; } else { document.querySelector('.' + smile_obj.selecter + '-message-button-confirm').style.display = 'none'; }
    smile_obj.cancelElement.onclick = smile_obj.cancelCallBack;
    smile_obj.confirmElement.onclick = smile_obj.confirmCallBack;
    if (smile_obj.title && smile_obj.message) {
        document.querySelector('.' + smile_obj.selecter + '-message-title').innerHTML = smile_obj.title
        document.querySelector('.' + smile_obj.selecter + '-message-content').innerHTML = smile_obj.message;
    } else if (smile_obj.message) { document.querySelector('.' + smile_obj.selecter + '-message-content').innerHTML = smile_obj.message; } else if (smile_obj.title) { document.querySelector('.' + smile_obj.selecter + '-message-title').innerHTML = smile_obj.title; }
    window.smile_alert = smile_obj;
    document.querySelector('.' + smile_obj.selecter + '-message-button-confirm').focus();
};