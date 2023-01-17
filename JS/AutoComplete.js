var AutoComplete = function (currentElement, data, options = {}) {
    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    var newParent = document.createElement('div');
    insertAfter(newParent, currentElement);
    newParent.appendChild(currentElement);
    var listContainer;
    options = options || {};
    options.suggestAfter = options.suggestAfter || 2;
    options.suggestOnFocus = options.suggestOnFocus;
    options.dataKeyValue = options.dataKeyValue || { key: "id", value: "name" };
    options.dataFieldName = options.dataFieldName || "data";
    options.forceChooseFromList = typeof options.forceChooseFromList == undefined ? true : false;
    options.multiSelect = options.multiSelect || false;
    options.searchPattern = options.searchPattern || searchPattern;
    options.maxItems = options.maxItems || 30;
    options.extraFields = options.extraFields || "";
    //options.onChoose = options.onChoose;

    this.selectedItems = [];
    this.selectedItemsobject = [];
    this.selectedItemValue = null;
    this.selectedItemObject = null;
    this.data = data;
    this.options = options;
    var _this = this;
    var hiddenInput;
    var random = Math.random().toString(36).substring(7);
    newParent.id = "parent-" + random;
    newParent.style.position = "relative";
    _this.remove = function () {
        newParent.remove();
    }

    var includesLike = function (data, text, key) {
        var similars = [];
        data.forEach(function (item) {
            if (similars.length > options.maxItems)
                return;
            if (!item || !item[key]) { }
            else if (searchPattern(text, item[key]) == true) {
                similars.push(item);
            }
        });

        return similars;
    }
    function searchPattern(searchValue, compareWith) {

        if (compareWith.toString().toLowerCase().toPersianUniCode().includes(searchValue.toLowerCase().toPersianUniCode()))
            return true;
        return false;
    }
    _this.setSelection = function (idOrIds) {
        if (idOrIds) {
            if (!options.multiSelect) {
                var item = _this.data.find(x => { return x[options.dataKeyValue.key].toString() == idOrIds.toString() });
                if (item) {
                    _this.selectedItemValue = idOrIds;
                    _this.selectedItemObject = _this.data.filter(x => idOrIds.toString() == x[options.dataKeyValue.key].toString());
                    _this.selectedItemObject = _this.selectedItemObject.length ? _this.selectedItemObject[0] : null;
                    hiddenInput.value = idOrIds;
                    currentElement.value = item[options.dataKeyValue.value];
                    if (options.onChoose)
                        options.onChoose(item);
                }
            } else {
                _this.selectedItemObject = _this.data.filter(x => idOrIds.includes(x[options.dataKeyValue.value]));
                _this.selectedItemObject = _this.selectedItemObject.length ? _this.selectedItemObject : null;
                idOrIds = idOrIds.map(x => x.toString());
                var items = (_this.data.filter(x => { return idOrIds.includes(x[options.dataKeyValue.key].toString()) }));
                if (items) {
                    _this.selectedItems = items.map(x => { return x[options.dataKeyValue.key].toString() });
                    currentElement.setAttribute('placeholder', _this.selectedItems.length > 0 ? _this.selectedItems.length + " مورد انتخاب شده" : "اینجا جستجو نمایید");
                    if (options.onChoose)
                        items.forEach(x => {
                            options.onChoose(x[options.dataKeyValue.value], true, x);
                        });
                }
            }
        }
        else {
            if (!options.multiSelect) {
                _this.selectedItemValue = null;
                _this.selectedItemObject = null;
                hiddenInput.value = null;
                currentElement.value = "";
            }
        }
    }
    //var dvSelectedItems;
    if (typeof _this.data === "string") {
        API.callMethods([_this.data], [{ Ticket: localStorage.getItem("ticket") }], false, false).then(function (values) {
            var result = values[0];
            if (result.IsAuthenticated != undefined && result.IsAuthenticated == false)
                signOut();
            else if (result.Success === true) {
                var autoCompleteData = result[options.dataFieldName];
                try {
                    autoCompleteData = JSON.parse(autoCompleteData);
                } catch (e) { }
                initializeAutoComplete(currentElement, autoCompleteData);
            }
        }).catch(error => console.error(`Error in promises ${error}`));
    }
    else {
        initializeAutoComplete(currentElement, _this.data);
    }
    function initializeAutoComplete(currentElement, data) {
        currentElement.style.marginBottom = 0;
        listContainer = document.createElement('div');
        listContainer.classList.add('autocomplete');
        if (!options.multiSelect)
            listContainer.innerHTML = `<input name="${currentElement.id}" id="${currentElement.id}-hidden" type="hidden">`;
        else {
            //dvSelectedItems = `<div id="${currentElement.id}-selectedItems" class="selectedItemsContainer"></div>`.toElements()[0];
            //insertAfter(dvSelectedItems, currentElement);
        }
        listContainer.innerHTML += '<ul class="autocomplete-list"></ul>';
        insertAfter(listContainer, currentElement);
        if (!options.multiSelect)
            hiddenInput = listContainer.querySelector(`#${currentElement.id}-hidden`);
        var changeHandler = function (e) {
            autocompleteList = listContainer.querySelector('.autocomplete-list');
            var val = e.currentTarget.value;

            if (!options.multiSelect)
                hiddenInput.value = "";
            var likes;
            if (val.length >= options.suggestAfter || options.suggestOnFocus) {

                likes = includesLike(_this.data, val, options.dataKeyValue.value);
                likesHTML = "";

                if (likes.length > 0) {
                    var i = 0;
                    likes.forEach(function (element) {
                        if (!options.multiSelect) {
                            likesHTML += `<li index="${i}" value="${element[options.dataKeyValue.key]}" class="autocomplete-item">${element[options.dataKeyValue.value]}</li>`;
                        } else {
                            if (likes.length > 3 && i == 0) {
                                likesHTML += `
                                <li><input tabindex="-1" type="checkbox" index="${i}" class="autocomplete-chooseAll autocomplete-item" id="${random}"/>
                                    <label tabindex="-1" for="${random}">انتخاب همه</label></li>`;
                                i++;
                            }
                            likesHTML += `
                                <li><input tabindex="-1" type="checkbox" index="${i}" value="${element[options.dataKeyValue.key]}" id="${random}-${i}" class="autocomplete-item" ${_this.selectedItems.includes(element[options.dataKeyValue.key].toString()) ? "checked" : ""}/>
                                    <label tabindex="-1" for="${random}-${i}">${element[options.dataKeyValue.value]}</label>${options.extraFields}
                        </li > `;
                        }
                        i++;
                    });
                } else if (options.forceChooseFromList) {
                    likesHTML += '<li><p>موردی یافت نشد</p></li>';
                } else {
                    if (options.multiSelect) {
                        likesHTML += `
                                <li><input tabindex="-1" type="checkbox" index="${i}" value="${val}" id="${random}-${i}" class="autocomplete-item" ${_this.selectedItems.includes(val) ? "checked" : ""}/>
                                    <label tabindex="-1" for="${random}-${i}">${val}</label>${options.extraFields}
                                </li > `;
                    }
                    else {
                        likesHTML += `<li index="${i}" value="${val}" class="autocomplete-item">${val}</li>`;
                    }
                }
                listContainer.classList.add("open");
                autocompleteList.innerHTML = likesHTML;
                if (options.multiSelect) {
                    var autoCompleteItem = autocompleteList.querySelectorAll("input.autocomplete-item");
                    autoCompleteItem.forEach(el => {
                        if (el.classList.contains("autocomplete-chooseAll")) { return; }
                        el.onchange = e => {
                            var input = e.currentTarget;
                            if (input.checked) {
                                if (!_this.selectedItems.includes(input.value.toString()))
                                    _this.selectedItems.push(input.value.toString());
                            } else {
                                if (_this.selectedItems.includes(input.value.toString())) {
                                    var indexInArray = _this.selectedItems.indexOf(input.value.toString());
                                    _this.selectedItems.splice(indexInArray, 1);
                                }
                            }
                            currentElement.value = "";
                            currentElement.setAttribute('placeholder', _this.selectedItems.length > 0 ? _this.selectedItems.length + " مورد انتخاب شده" : "اینجا جستجو نمایید");

                            if (options.onChoose) {
                                var item = _this.data.find(x => { return x[options.dataKeyValue.key].toString() == input.value.toString() });
                                options.onChoose(item ? item[options.dataKeyValue.value] : val, input.checked, item);
                            }
                        }
                    });
                    var chkChooseAll = autocompleteList.querySelector('.autocomplete-chooseAll');
                    if (chkChooseAll) {
                        chkChooseAll.onchange = () => {
                            autoCompleteItem.forEach(el => {
                                if (el.classList.contains("autocomplete-chooseAll")) { return; }
                                el.checked = chkChooseAll.checked;
                                var event = new Event('change');
                                el.dispatchEvent(event);
                            });
                        };
                    }
                }
            } else {
                if (!options.multiSelect) {
                    listContainer.classList.remove("open");
                }
            }
        }
        listContainer.querySelector(".autocomplete-list").addEventListener("click", (e) => {

            if (e.target && e.target.nodeName == "LI") {
                listContainer.querySelectorAll(".autocomplete-item.selected").forEach(el => {
                    el.classList.remove('selected');
                });
                if (!options.multiSelect) {
                    currentElement.value = e.target.innerHTML;
                    hiddenInput.value = e.target.value;
                    _this.selectedItemValue = hiddenInput.value;
                    _this.selectedItemObject = _this.data.filter(x => hiddenInput.value.toString() == x[options.dataKeyValue.key].toString());
                    _this.selectedItemObject = _this.selectedItemObject.length ? _this.selectedItemObject[0] : null;
                    if (options.onChoose) {
                        var item = _this.data.find(x => { return x[options.dataKeyValue.key].toString() == hiddenInput.value.toString() });
                        options.onChoose(item);
                    }
                }
                else {
                    if (!_this.selectedItems.includes(e.target.value)) {
                        //var selectedItem = `< div value = "${e.target.value}" class="selectedItem" > ${ e.target.innerHTML } </div > `.toElements()[0];
                        //var deleteSign = `< div onclick = "deleteSelected(this)" style = "padding = 5px;" >×</div > `.toElements()[0];
                        //deleteSign.onclick = e => {
                        //    var indexInArray = _this.selectedItems.indexOf(e.currentTarget.getAttribute("value"));
                        //    if (indexInArray) {
                        //        _this.selectedItems.splice(indexInArray, 1);
                        //    }
                        //    e.currentTarget.parentNode.remove();
                        //}
                        //selectedItem.appendChild(deleteSign);
                        //dvSelectedItems.appendChild(selectedItem);
                        //_this.selectedItems.push(e.target.value);
                    }
                    currentElement.value = "";
                }
                if (!options.multiSelect) {
                    listContainer.classList.remove("open")
                };
            }

        });
        currentElement.addEventListener('keyup', e => {
            var autocompleteList = listContainer.querySelector('.autocomplete-list');
            //key
            if (autocompleteList.querySelectorAll(".autocomplete-item").length > 0) {
                var keycode = e.keyCode || e.which;
                if (keycode) {
                    if (keycode == 13) { // enter
                        if (autocompleteList.querySelectorAll(".autocomplete-item").length > 0)
                            (autocompleteList.querySelector(".selected") || autocompleteList.querySelectorAll(".autocomplete-item")[0]).click();
                    }
                    else if (keycode == 38) { // arrow up
                        focusItem(-1);
                    }
                    else if (keycode == 40) {// arrow down
                        focusItem(1);
                    }
                    else if (keycode == 9) {// tab
                        return;
                    }
                    else {
                        changeHandler(e);
                    }
                }
            }
            else {
                changeHandler(e);
            }
        });
        currentElement.addEventListener('paste', changeHandler);
        currentElement.addEventListener('focus', e => {
            if (!options.multiSelect && !hiddenInput.value) {
                changeHandler(e);
            }
            if (options.multiSelect) {
                changeHandler(e);
            }
        });
        //currentElement.addEventListener('input', changeHandler);
        currentElement.addEventListener('blur', () => {
            setTimeout(() => {
                if (options.forceChooseFromList && !options.multiSelect && hiddenInput.value === "") {
                    _this.selectedItemValue = null;
                    _this.selectedItemObject = null;
                    currentElement.value = "";
                }
                if (!options.multiSelect) { listContainer.classList.remove("open"); }

            }, 200);
        });
        document.addEventListener("click", (event) => {
            var inside = event.target.closest("#" + newParent.id);
            //// fazel make this generic **********************************
            //console.log(event.target.closest("#ulDrugSelection"), event.target);
            //if (!inside)
            //    inside = event.target.closest("#ulDrugSelection");
            if (!inside) {
                if (options.forceChooseFromList && !options.multiSelect && hiddenInput.value === "") {
                    _this.selectedItemValue = null;
                    _this.selectedItemObject = null;
                    currentElement.value = "";
                }
                listContainer.classList.remove("open");
            }
        });
        function focusItem(step) {
            var currentSelected = listContainer.querySelector('.selected');
            var newSelected;
            if (currentSelected) {
                newSelected = listContainer.querySelector(`.autocomplete - item[index = '${parseInt(currentSelected.getAttribute("index")) + step}']`);
            }
            else {
                newSelected = listContainer.querySelectorAll(".autocomplete-item")[0];
            }
            if (newSelected) {
                listContainer.querySelectorAll(".autocomplete-item.selected").forEach(el => {
                    el.classList.remove('selected');
                });
                newSelected.classList.add("selected");
                newSelected.scrollIntoView();
            }
        }
    }
};