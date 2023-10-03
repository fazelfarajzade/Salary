Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};
function getHtmlDomByURL(URL, convertToHtml = true) {
    return API.get(URL)
        .then(content => {
            if (convertToHtml) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(content, 'text/html');
                newBody = doc.body;
                var HTMLDOM = document.createElement("div");
                for (var i = 0; i < newBody.childNodes.length; i++) {
                    var node = newBody.childNodes[i];
                    var elem = node.tagName ? document.createElement(node.tagName) : document.createTextNode(node.data);
                    if (node.attributes)
                        for (var j = 0; j < node.attributes.length; j++) {
                            var attr = node.attributes[j];
                            if (attr)
                                elem.setAttribute(attr.name, attr.value);
                        }
                    elem.innerHTML = node.innerHTML ? node.innerHTML : node.data;
                    HTMLDOM.appendChild(elem);
                }
                return Promise.resolve(HTMLDOM);
            }
            return Promise.resolve(content);
        })
        .catch(err => {
            return Promise.reject(err)
        });
}
function resizeIFrameToFitContent(iFrame) {

    iFrame.width = iFrame.contentWindow.document.body.scrollWidth;
    iFrame.height = iFrame.contentWindow.document.body.scrollHeight;
}
var dialogs = [];
function showDialog(dataSource, title = "", options = {}) {
    options.dialogWidth = options.dialogWidth || "90%";

    var dialog = document.getElementById('dvDialog').cloneNode(true);
    var container = document.querySelector('#dvContent .page .pageContent') || document.querySelector('#dvContent');
    //var container = document.querySelector('#dvContent');
    container.appendChild(dialog);
    dialogs.push(dialog);
    var dvDialogBody = dialog.querySelector('.dialogBody');
    dvDialogBody.innerHTML = "";
    if (typeof dataSource == "string") {
        if (options.url) {
            getHtmlDomByURL(dataSource).then(dom => {
                dvDialogBody.appendChild(dom);
            });
        } else {
            dataSource = dataSource.toElements();
            dataSource.forEach(el => {
                dvDialogBody.appendChild(el);
            });
        }
    }
    else if (dataSource instanceof HTMLElement || dataSource instanceof Text) {
        dvDialogBody.appendChild(dataSource);
    }
    dialog.querySelector('.dialogTitle').innerHTML = title;

    var btnDialogClose = dialog.querySelector('.btnDialogClose');
    dialog.querySelector(".dialog").style.width = options.dialogWidth;
    dialog.style.display = "block";
    if (!options.preventClose) {
        dialog.onclick = e => {
            if (e.target == e.currentTarget) {
                closeDialog();
            }
        }
        btnDialogClose.onclick = closeDialog;
        btnDialogClose.style.display = "block";
    }
    else {
        dialog.onclick = null;
    }
}
function closeDialog() {
    var dialog = dialogs.pop();
    dialog.remove();
}

//-----------
function callService(name, data = {}, httpMethod = "post") {
    return new Promise(async (resolve, reject) => {
        API.headers.Authorization = "Bearer " + localStorage.getItem("ticket");
        API.callMethods([name], [data], httpMethod)
            .then((values) => {
                var result = values[0];
                //if ("IsAuthenticated" in result && !result.IsAuthenticated) signOut();
                return resolve(result);
            })
            .catch((e) => {
                return reject(e.message || e);
            });
    });
}
function callServices(names, data = [{}], httpMethod = "post") {
    return new Promise(async (resolve, reject) => {
        API.headers.Authorization = "Bearer " + localStorage.getItem("ticket");
        API.callMethods(names, data, httpMethod)
            .then((values) => {
                //if ("IsAuthenticated" in result && !result.IsAuthenticated) signOut();
                return resolve(values);
            })
            .catch((e) => {
                return reject(e.message || e);
            });
    });
}
function downloadFile(method, data = {}, fileName = "Report", fileExtention = "xlsx") {
    data.Ticket = localStorage.getItem("ticket");
    return API.downloadFile(method, data, fileName, fileExtention)
        .then(res => {
            console.log(res);
            return res;
        })
        .catch(err => {
            return Promise.reject(err);
        })
}
var contextMenu = document.querySelector('#contextMenu');
function showMenu(event, items = []) {
    event.currentTarget.click();
    contextMenu.innerHTML = "";
    items.forEach(item => {
        var li = document.createElement('li');
        li.innerHTML = `<i class="${item.icon}"></i>${item.name}`;
        li.onclick = () => { item.callBack(); hideMenu(); }
        contextMenu.appendChild(li);
        console.warn(item.name);
    });
    contextMenu.style.left = event.pageX + 'px';
    contextMenu.style.top = event.pageY + 'px';
    contextMenu.classList.add('show-menu');
}
document.addEventListener('click', hideMenu)
function hideMenu() {
    contextMenu.innerHTML = "";
    contextMenu.classList.remove('show-menu');
}

// ---------------------------- print ----------------------------
function PrintElem(elem) {
    var container = document.createElement('div');
    container.className = "printIframeContainer";
    var IFRM = document.createElement("iframe");
    IFRM.className = "printIframe";
    IFRM.src = "about:blank";
    IFRM.onload = function () {
        resizeIFrameToFitContent(IFRM);
        var ifrmdoc = (IFRM.document || IFRM.contentDocument);
        var ifrmwin = IFRM.contentWindow;
        if (ifrmdoc) {
            ifrmdoc.write(eval('`' + elem + '`'));
            ifrmdoc.querySelector('img').onload = () => {
                ifrmwin.print();
            }
            ifrmwin.onafterprint = function () {
                container.remove();
                setTimeout(() => { hideLoader(); }, 0);
            }
        }
    }
    container.appendChild(IFRM);
    document.body.appendChild(container);
    return true;
}
//----------------------------------------------------------------
function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}
function setDigitsAllowed(txtInput) {
    txtInput.style.direction = "ltr";
    txtInput.style.textAlign = "left";
    setInputFilter(txtInput, function (value) {
        return /^\d*\.?\d*$/.test(value);
    });
}
function fillDDL(el, options, name, value) {
    options.forEach(item => {
        var opt = document.createElement('option');
        opt.value = item[value];
        opt.innerHTML = item[name];
        el.appendChild(opt);
    });
}
function showNavBar(root) {
    setTimeout(() => {
        if (partialViewNavigation.length > 0) {
            var navBar = root.querySelector("#navigationBar");
            if (navBar) {
                var i = 0;
                partialViewNavigation.forEach(partialNav => {
                    if (partialNav[0] != currentPartial[0]) {
                        var spn = `<span class="active">${partialNav[0].PageTitle}</span>`.toElements()[0];
                        spn.onclick = () => { loadPartialView(partialNav[0], partialNav[1], partialNav[3], null, true) };
                        if (i++ > 0) {
                            navBar.appendChild("<span> / </span>".toElements()[0]);
                        }
                        navBar.appendChild(spn);
                    }
                });
                if (i > 0) {
                    navBar.appendChild("<span> / </span>".toElements()[0]);
                    navBar.appendChild(`<span>${currentPartial[0].PageTitle}</span>`.toElements()[0]);
                }
            }
        }
    }, 100)
}
function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? 1 : (a[property] > b[property]) ? -1 : 0;
        return result * sortOrder;
    }
}
function deleteFile(sender, FileID, refrenceType, refrenceID) {
    var data = {
        RefrenceType: refrenceType,
        RefrenceID: refrenceID,
        FileID: FileID
    };
    callService("File/DeleteFile", data)
        .then(() => {
            sender.parentNode.remove();
        })
        .catch(err => {
            alert(err, "خطا در حذف فایل", {
                type: "error",
            });
            console.log(err);
        });
}
function renderFileItemHtml(file, refrenceType, refrenceID, edit) {
    var fileHtml = `<div class="FileManager-ImageItemContainer" value="${file.FileID}"></div>`.toElements()[0];
    var fileIcon = `<div class="FileManager-ImgParent"><a href="${file.FileUrl}" target="_blank"><img class="FileManager-Img" src="${file.FileUrl}"></a></div>`.toElements()[0]; // <p class="FileManager-ImgName">${file.FileUrl.slice(file.FileUrl.lastIndexOf("/") + 1)}</p>
    fileHtml.appendChild(fileIcon);
    if (edit) {
        var deleteButton = `<button  class="FileManager-ImgDelete formElement delete" style="position: absolute;bottom: 0;" onclick="deleteFile(this, ${file.FileID}, '${refrenceType}', ${refrenceID});">حذف</button>`.toElements()[0];
        fileHtml.appendChild(deleteButton);
    }
    return fileHtml;
}
function saveFiles(files, refrenceType, refrenceID) {
    var data = {
        RefrenceType: refrenceType,
        RefrenceID: refrenceID,
    };
    convertAllToBase64(files).then(base64Files => {
        data.Base64Files = base64Files;

        var createRequest = callService("File/SaveFile", data);
        createRequest.then(res => {
            notify("ذخیره شد", "success", 3)
            closeDialog();
            showFileManager(refrenceType, refrenceID);
        }).catch(err => {
            console.log(err);
            alert(err, "نا موفق", { type: "error" });
        });
    });
}
function showFileManager(refrenceType, refrenceID, options = { edit: true }) {

    fileManagerParent = document.createElement('div');
    fileManagerParent.classList.add("FileManagerParent");
    var dvExistingFiles = `<div id="dvExistingFiles"></div>`.toElements()[0];
    var dvActions = `<div style="border-top: 1px solid #e5e5e5;border-bottom: 1px solid #e5e5e5;"><input type="file" id="fldFileManager" class="hide" multiple />
                        <button class="formElement add" id="btnAddToFileManager">افزودن فایل جدید</button>
                        <div id="dvChoosedFileInFileManager" style="display: flex;flex-wrap: wrap;direction: ltr;"></div></div>`.toElements()[0];
    var dvFileManagerFooter = document.createElement('div');
    dvFileManagerFooter.id = "dvFileManagerFooter";
    dvFileManagerFooter.style.textAlign = "center";
    if (options.edit) {
        var fldFileManager = dvActions.querySelector('#fldFileManager');
        var btnAddToFileManager = dvActions.querySelector('#btnAddToFileManager');
        var dvChoosedFileInFileManager = dvActions.querySelector('#dvChoosedFileInFileManager');
        var btnSaveChanges = `<button class="formElement add" style="width: 80%;" id="btnSaveChanges">ذخیره فایل های انتخاب شده</button>`.toElements()[0];
        dvFileManagerFooter.appendChild(btnSaveChanges);
        btnSaveChanges.onclick = () => {
            if (fldFileManager.files.length > 0)
                saveFiles(fldFileManager.files, refrenceType, refrenceID);
            else
                alert("ابتدا یک فایل انتخاب کنید", "خطا", { type: "error" })
        };
        btnAddToFileManager.addEventListener('click', () => {
            fldFileManager.click();
        });
        fldFileManager.onchange = function () {
            var fileNames = "";
            for (var i = 0; i < this.files.length; ++i) {
                var name = this.files.item(i).name;
                fileNames += `<span style="background-color: #e5e5e5;margin: 3px; padding: 5px;border-radius: 5px;">${name}</span>`;
            }
            dvChoosedFileInFileManager.innerHTML = fileNames;
        };
    }


    callService("File/GetFiles", { RefrenceType: refrenceType, RefrenceID: refrenceID })
        .then(FilesRes => {


            if (FilesRes.Files.length > 0) {
                FilesRes.Files.forEach(x => {
                    dvExistingFiles.appendChild(renderFileItemHtml(x, refrenceType, refrenceID, options.edit));
                });
            } else {
                dvExistingFiles.innerHTML = "هیچ فایلی موجود نیست.";
            }

            fileManagerParent.appendChild(dvExistingFiles);
            if (options.edit) {
                fileManagerParent.appendChild(dvActions);
                fileManagerParent.appendChild(dvFileManagerFooter);
            }
            showDialog(fileManagerParent, "مدیریت فایل ها");
        })
        .catch(err => {
            alert(err, "خطا در دریافت فایل ها", {
                type: "error",
            });
            console.log(err);
        });
}
var AllServices = [];
function getAllServices() {
    if (AllServices.length > 0) {
        return Promise.resolve(AllServices);
    } else {
        var p = resetServices();
        showLoader();
        p.then(() => {
            hideLoader();
        });
        return p;
    }
}
function resetServices(index = 1) {
    return callService("Service/Get",
        {
            Pager: {
                PageSize: 2000,
                PageIndex: index,
            },
        }, true).then(res => {
            AllServices = AllServices.concat(res.Services);
            if (res.Services.length == 2000)
                return resetServices(index + 1);
            else {
                return AllServices;
            }
        }).catch(err => { AllServices = []; alert(err, "عملیات ناموفق", { type: "error" }) });

}
function getRandomColor(brightness) {
    // Six levels of brightness from 0 to 5, 0 being the darkest
    var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
    var mix = [brightness * 51, brightness * 51, brightness * 51]; //51 => 255/5
    var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function (x) { return Math.round(x / 2.0) })
    return "rgb(" + mixedrgb.join(",") + ")";
}
function getDebtTypePersianName(type) {
    const types = {
        LOAN: "وام",
        FOOD: "غذا",
        VACATION: "مرخصی",
        OTHER: "غیره",
    }
    return types[type] || "تعریف نشده";
}
function getCreditTypePersianName(type) {
    const types = {
        BONUS: "پاداش",
        OTHER: "غیره",
    }
    return types[type] || "تعریف نشده";
}
function getPaymentTypePersianName(type) {
    const types = {
        SALARY: "حقوق",
        OTHER: "غیره",
    }
    return types[type] || "تعریف نشده";
}