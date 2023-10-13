function DataGrid(data, fieldMapping, options = {}, cssObject = {}, callback) {
    var tbody;
    var _this = this;
    options.selectable = typeof options.selectable == "boolean" ? options.selectable : true;
    // options.Pager;
    // options.sortBy;
    // options.order;
    // options.identifier;
    // options.getExtendedData
    // options.onCreateTr
    _this.jsonData = {};
    _this.appendTable = function (parent, newData) {
        var newTbl;
        newTbl = newData ? _this.getTable(newData) : _this.getTable();
        var old = parent.querySelector(":scope > .gridContainer");
        if (parent) {
            if (old)
                old.replaceWith(newTbl);
            else
                parent.appendChild(newTbl);
        } else {
            dvContent.appendChild(newTbl);
        }
    }
    function getPageItems(pageCount, pageIndex, itemCallBack) {
        var dvPages = document.createElement("div");
        dvPages.classList.add("dvPages");
        var itemsToShow = 7;
        var up = pageCount - 1;
        var down = 0;


        var a = Math.floor(itemsToShow / 2);
        var getFromDown = pageIndex - a <= 0 ? (pageIndex - a) * -1 : 0;
        var getFromUp = getFromDown == 0 && pageIndex + a >= pageCount ? (pageIndex + a) - (pageCount - 1) : 0;

        down = pageIndex - a <= 0 ? 0 : (pageIndex - a);
        up = pageIndex + a >= pageCount ? pageCount - 1 : pageIndex + a;

        up = up + getFromDown >= pageCount ? pageCount - 1 : up + getFromDown;
        down = down + getFromUp <= 0 ? 0 : down + getFromDown;
        down += pageCount - pageIndex - 1 < 3 && pageCount - pageIndex - 1 >= 0 ? (pageCount - pageIndex - 1) - a : 0;
        down = down < 0 ? 0 : down;

        for (var i = up; i >= down; i--) {
            var spn = document.createElement('span');
            spn.classList.add('pageItem');
            spn.innerHTML = i + 1;
            dvPages.appendChild(spn);
            if (i == pageIndex) {
                spn.classList.add('current');
            }
            spn.setAttribute('index', i)
            if (itemCallBack) {
                spn.onclick = function () {
                    itemCallBack(this.getAttribute('index'));
                }
            }
        }
        return dvPages;
    }
    function renderPaginate(pager) {
        var pagerContainer = document.createElement("div");
        pagerContainer.classList.add("pagerContainer");

        var rightArrow = document.createElement("div");
        rightArrow.innerHTML = "<";
        rightArrow.classList.add("rightArrow");
        rightArrow.onclick = function () {
            pager.itemCallBack(pager.PageIndex - 1);
        }

        var dvPages = getPageItems(pager.PageCount, pager.PageIndex, pager.itemCallBack);

        var leftArrow = document.createElement("div");
        leftArrow.innerHTML = '>';
        leftArrow.classList.add("leftArrow");
        leftArrow.onclick = function () {
            pager.itemCallBack(pager.PageIndex + 1);
        }

        if (pager.PageIndex == 0) {
            rightArrow.classList.add('disabledBox');
        } else {
            rightArrow.classList.remove('disabledBox');
        }
        if (pager.PageIndex == (pager.PageCount - 1)) {
            leftArrow.classList.add('disabledBox');
        } else {
            leftArrow.classList.remove('disabledBox');
        }

        pagerContainer.appendChild(rightArrow);
        pagerContainer.appendChild(dvPages);
        pagerContainer.appendChild(leftArrow);

        return pagerContainer;
    }
    this.getTable = function (newData) {
        data = newData || data;
        if (typeof data == 'string' && data.isJSON())
            data = JSON.parse(data);
        // Sort
        if (options.sortBy) {
            data.sort(dynamicSort(options.sortBy));
        }
        // Create Table
        var table = document.createElement('table');
        table = setStyles(table, cssObject.grid || defaultCssObject.grid);
        // Append Thead
        table.appendChild(getThead(fieldMapping, options, cssObject));
        // Append Tbody
        table.appendChild(getTbody(data, fieldMapping, options, cssObject, callback))
        var gridContainer = document.createElement("div");
        gridContainer.classList.add("gridContainer");
        var tblContainer = document.createElement("div");
        tblContainer.style = "width: 100%;overflow: auto;border: solid 1px silver;";
        tblContainer.appendChild(table);
        gridContainer.appendChild(tblContainer);
        if (options.Pager && options.Pager.PageCount > 1) {
            gridContainer.appendChild(renderPaginate(options.Pager));
        }
        return gridContainer;
    }

    this.appendData = function (newData) {
        newData.forEach(row => {
            tbody.appendChild(getDataRow(row));
        });
    }
    defaultCssObject = {
        grid: "grid",
        gridHeader: "gridHeader",
        gridRow: "gridRow",
        gridAlternateRow: "gridAlternateRow",
        gridSelected: "gridSelected"
    }
    function setStyles(el, className) {
        el.className = className;
        return el;
    }
    function getThead() {
        var thead = document.createElement('thead');
        thead = setStyles(thead, cssObject.gridHeader || defaultCssObject.gridHeader);

        var tr = document.createElement('tr');

        if (options.getExtendedData) {
            var th = document.createElement('th');
            th.innerHTML = "&nbsp;";
            th.style.width = "1%"
            tr.appendChild(th);
        }
        if (options.order) {
            var th = document.createElement('th');
            th.innerHTML = "#";
            th.style.width = "1%"
            tr.appendChild(th);
        }

        for (var key in fieldMapping) {

            if (!fieldMapping.hasOwnProperty(key)) continue;
            var th = document.createElement('th');
            if (typeof fieldMapping[key] == "string")
                th.innerHTML = fieldMapping[key];
            else {
                th.innerHTML = fieldMapping[key].headerName;
                if (fieldMapping[key].callBacks && fieldMapping[key].callBacks.length) {
                    fieldMapping[key].callBacks.forEach(CB => {
                        th.addEventListener(CB.event, CB.callBack);
                        th.style.cursor = "pointer";
                        th.style.color = "blue";
                        th.style.textDecoration = "underline";
                    });
                }
            }
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        return thead;
    }
    function getTbody(bodyData) {
        tbody = document.createElement('tbody');
        i = 0;
        bodyData.forEach(row => {
            tbody.appendChild(getDataRow(row));
        });
        return tbody;
    }
    function isElement(element) {
        return element instanceof Element || element instanceof HTMLDocument;
    }
    function getDataRow(row) {
        var tr = document.createElement('tr');
        tr.setAttribute('jsondata', JSON.stringify(row));
        if (options.identifier) {
            tr.setAttribute('ObjectID', row[options.identifier]);
        }
        if (i % 2 == 0)
            tr = setStyles(tr, cssObject.gridRow || defaultCssObject.gridRow);
        else
            tr = setStyles(tr, cssObject.gridAlternateRow || defaultCssObject.gridAlternateRow);
        i++;
        if (options.getExtendedData) {
            var rowExtendedData = options.getExtendedData(row);
            var td = document.createElement('td');
            if (rowExtendedData) {
                td.innerHTML = '<span style="font-size: 22px;color: blue;cursor: pointer;">&#43;</span>';
                tr.appendChild(td);
                td.addEventListener("click", event => {
                    if (tr.classList.contains("open")) {
                        tr.nextSibling.remove();
                        event.currentTarget.innerHTML = '<span style="font-size: 22px;color: blue;cursor: pointer;">&#43;</span>';
                        tr.classList.remove("open");
                    } else {
                        var extendedDataHTML = rowExtendedData;
                        var trExtendedData = document.createElement("tr");
                        var colSpan = Object.keys(fieldMapping).length + 1;
                        if (options.order)
                            colSpan++;
                        var tdExtendedData = document.createElement("td");
                        trExtendedData.classList.add("extendedTr");
                        tdExtendedData.setAttribute("colSpan", colSpan);
                        tdExtendedData.appendChild(extendedDataHTML);
                        trExtendedData.appendChild(tdExtendedData);
                        insertAfter(trExtendedData, tr);
                        tdExtendedData.style.paddingRight = "20px";
                        event.currentTarget.innerHTML = '<span style="font-size: 22px;color: blue;cursor: pointer;">&#8722;</span>';
                        tr.classList.add("open");
                    }
                });
            } else {
                td.innerHTML = '';
                tr.appendChild(td);
            }
        }
        if (options.order) {
            var td = document.createElement('td');
            td.innerHTML = i;
            tr.appendChild(td);
        }
        for (var key in fieldMapping) {
            if (!fieldMapping.hasOwnProperty(key)) continue;
            var td = document.createElement('td');
            if (isElement(row[key]))
                td.appendChild(row[key]);
            else
                td.innerHTML = row[key];
            tr.appendChild(td);
        }
        tr.onclick = () => {
            if (!options.selectable)
                return false;
            tbody.querySelectorAll('.' + (cssObject.gridSelected || defaultCssObject.gridSelected)).forEach(el => {
                el.classList.remove((cssObject.gridSelected || defaultCssObject.gridSelected));
            });
            tr.classList.add((cssObject.gridSelected || defaultCssObject.gridSelected));
            _this.jsonData = tr.getAttribute("jsondata");
            if (callback) {
                callback(tr);
            }
        }
        if (options.onCreateTr) {
            tr = options.onCreateTr(tr, row);
        }
        return tr;
    }
}