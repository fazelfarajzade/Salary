var isBackLoad = false;
function PartialView(Content, APIMethodNames, PostData, OnResult, EnableCaching, Level, PageTitle) {
    this.Content = Content;
    this.APIMethodNames = APIMethodNames;
    this.GetPostData = PostData ? PostData : () => { return null };
    this.OnResult = OnResult ? OnResult : (result) => { };
    this.EnableCaching = EnableCaching;
    this.Level = Level;
    this.PageTitle = PageTitle;
}
var PartialViewTemplates = {
    Login: new PartialView("PartialViews/Login.html" + Config.AppVersion, null, null, null, null, 0, "ورود به سامانه"),
    FrontPage: new PartialView("PartialViews/FrontPage.html" + Config.AppVersion, null, null, null, null, 0, "صفحه اصلی"),
    Users: {
        AddUser: new PartialView("PartialViews/Users/AddUser.html" + Config.AppVersion, null, null, null, null, 2, "افزودن یا ویرایش کاربر"),
        ManageUsers: new PartialView("PartialViews/Users/ManageUsers.html" + Config.AppVersion, null, null, null, null, 1, "کاربران"),
    },
    Salaries: {
        AddSalary: new PartialView("PartialViews/Salary/AddSalary.html" + Config.AppVersion, null, null, null, null, 3, "افزودن یا ویرایش بازه حقوق"),
        ManageSalaries: new PartialView("PartialViews/Salary/ManageSalaries.html" + Config.AppVersion, null, null, null, null, 2, "مدیریت حقوق"),
    },
    Branchs: {
        AddBranch: new PartialView("PartialViews/Branchs/AddBranch.html" + Config.AppVersion, null, null, null, null, 2, "افزودن یا ویرایش شعبه"),
        ManageBranchs: new PartialView("PartialViews/Branchs/ManageBranchs.html" + Config.AppVersion, null, null, null, null, 1, "مدیریت شعب"),
    },
    AccAccount: {
        ManageAccAccount: new PartialView("PartialViews/AccAccount/ManageAccAccount.html" + Config.AppVersion, null, null, null, null, 2, "مدیریت حساب"),
    },
};

function isRefresh(PartialViewTemplate) {
    if (currentPartial) {
        if (currentPartial[0] == PartialViewTemplate) {
            return true;
        }
    }
    return false;
}

function successfullLoad(PartialViewTemplate, params, templateHTML, CallBack, Reload) {
    if (PartialViewTemplate.Level > 0
        && PartialViewTemplate.Level > currentPartial[0].Level
        && !Reload) {
        partialViewNavigation.push([currentPartial[0], currentPartial[1], currentPartial[2], currentPartial[3]]);
        //window.history.pushState({ PartialViewTemplate: JSON.stringify(PartialViewTemplate), templateHTML: templateHTML }, '');
    }
    currentPartial = [PartialViewTemplate, params, templateHTML, CallBack];

    partialViewNavigation = partialViewNavigation.filter(x => {
        return x[0].Level <= currentPartial[0].Level;
    });
    if (partialViewNavigation.length > 0 && partialViewNavigation[partialViewNavigation.length - 1][0].Level == currentPartial[0].Level) {
        partialViewNavigation[partialViewNavigation.length - 1] = currentPartial;
    }
    var tempNavigationArray = [];
    partialViewNavigation.forEach(Partial => {
        var x = tempNavigationArray.filter(temp => {
            return Partial[0] == temp[0];
        });
        if (x.length > 0) {
            return;
        } else {
            tempNavigationArray.push(Partial)
        }
    });
    partialViewNavigation = tempNavigationArray;
}

window.addEventListener('popstate', function (event) {
    //if (event.state && event.state.PartialViewTemplate) {
    //    partial = JSON.parse(event.state.PartialViewTemplate);
    //    if (partial.Level >= 0) {
    //        if (currentPartial[0].Content === partial.Content || partial.Content === "PartialViews/Login.html") {
    //            window.history.go(-1 * window.history.length);
    //        } else {
    //            loadLastPartial();
    //        }
    //    }
    //}
    alert("این امکان غیر فعال شده. لطفا از منو های داخل سامانه استفاده کنید.");
    return false;
}, true);
async function loadPartialView(PartialViewTemplate, params, CallBack, Reload, back) {
    if (!Reload && isRefresh(PartialViewTemplate)) {
        loadPartialView(currentPartial[0], currentPartial[1], currentPartial[3], true, false)
        return;
    }
    isBackLoad = back;
    disableControls();
    if (PartialViewTemplate) {
        document.params = params;
        var templateHTML = await getTemplateHTML(PartialViewTemplate);
        if (PartialViewTemplate.APIMethodNames) {
            var postData = PartialViewTemplate.GetPostData();
            if (typeof postData == "object") {
                var breaked = false;
                postData.forEach(x => {
                    if (!breaked && "Ticket" in x && x.Ticket === null) {
                        signOut();
                        breaked = true;
                        return;
                    }
                });
                if (breaked === true)
                    return;
            }

            API.callMethods(PartialViewTemplate.APIMethodNames, postData, PartialViewTemplate.EnableCaching, /*PartialViewTemplate.InsertsData*/false)
                .then(function (values) {
                    var result = values[0];
                    if ("IsAuthenticated" in result && !result.IsAuthenticated)
                        signOut();
                    else if (result.Success === true) {
                        createTemplateToContent(templateHTML);
                        successfullLoad(PartialViewTemplate, params, templateHTML, CallBack, Reload);
                        if (PartialViewTemplate.OnResult) {
                            PartialViewTemplate.OnResult(values);
                        }
                        if (CallBack) {
                            CallBack();
                        }
                    }
                    else {
                        if (result.Message && result.Message.toLowerCase() === "ticket expired")
                            ticketExpired();
                        else {
                            console.error(result);
                            alert(result.Message);
                        }
                    }
                })//.catch(err => {
            //    console.error(err);
            //    alert(err);
            //});
        }
        else {

            createTemplateToContent(templateHTML);
            if (CallBack) {
                CallBack();
                successfullLoad(PartialViewTemplate, params, templateHTML, CallBack, Reload);
            }
            if (PartialViewTemplate.OnResult) {
                PartialViewTemplate.OnResult();
                successfullLoad(PartialViewTemplate, params, templateHTML, PartialViewTemplate.OnResult, Reload);
            }
        }
    }
    else {
        alert("صفحه یافت نشد");
        enableControls();
    }
}
function loadLastPartial() {
    var last = partialViewNavigation.pop();
    FooterMenuToggle(false);
    if (last) {
        loadPartialView(last[0], last[1], last[3], null, true);
    } else {
        loadPartialView(PartialViewTemplates.FrontPage, null, null);
        partialViewNavigation = [];
    }
}
async function getTemplateHTML(PartialViewTemplate) {
    if (PartialViewTemplate)
        return await API.get(PartialViewTemplate.Content).then(content => content).catch(x => { alert(x) });
}
function createTemplateToContent(html) {

    for (var i = 0; i < dvContent.childNodes.length; i++)
        dvContent.removeChild(dvContent.childNodes[i]);
    dvContent.innerHTML = "";

    var parser = new DOMParser();
    var newHTML = parser.parseFromString(html, 'text/html');
    var newBody = newHTML.body;
    for (var h = 0; h < newHTML.head.childNodes.length; h++)
        dvContent.appendChild(newHTML.head.childNodes[h]);

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
        dvContent.appendChild(elem);
        enableControls();
    }
}