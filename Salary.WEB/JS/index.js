var loaderTimeOut,
    manifestLoaderInterval,
    DialogData = {};

if (!window.nativeAlert) {
    window.nativeAlert = window.alert;
}
var dvContent = document.getElementById("dvContent");
var partialViewNavigation = [];
var currentPartial;
var push;
function showLoader(isImmediately = false) {
    loaderTimeOut = setTimeout(() => {
        document.getElementById('loader-container').className = "show";
        //document.getElementById('loader-container').style.display = "flex";
        //document.querySelector('#dvContent').style.filter = "blur(2px)";
        //document.querySelector('.header').style.filter = "blur(2px)";
    }, isImmediately ? 0 : 300);
}
function hideLoader() {
    document.getElementById('loader-container').className = "hide";
    //document.getElementById('loader-container').style.display = "none";
    //document.querySelector('#dvContent').style.filter = "none";
    //document.querySelector('.header').style.filter = "none";
    clearTimeout(loaderTimeOut);
}

var sideMenuState = localStorage.getItem("sideMenu");
if (!sideMenuState)
    localStorage.setItem("sideMenu", "close");
else if (sideMenuState == "open") {
    document.querySelector('.side-menu').classList.remove('close');
    document.querySelector('.side-menu').classList.add('open');
}
document.querySelector('.side-menu-trigger').addEventListener('click', () => {
    document.querySelector('.side-menu').classList.toggle('open');
    document.querySelector('.side-menu').classList.toggle('close');
    if (document.querySelector('.side-menu').classList.contains("open"))
        localStorage.setItem("sideMenu", "open")
    else
        localStorage.setItem("sideMenu", "close")
});

async function FetchResources() {
    fetch("JS/API.js" + Config.AppVersion)
        .then(resp => resp.text())
        .then(html => {
            var script = document.createElement("script");
            script.innerHTML = html;
            document.head.appendChild(script);
        })
        .then(async () => {
            var FethingFiles = [
                [API.get("CSS/Main.css" + Config.AppVersion), "css"],
                [API.get("CSS/alert.css" + Config.AppVersion), "css"],
                [API.get("CSS/Grid.css" + Config.AppVersion), "css"],
                [API.get("Resources/fontawesome-free-5.12.0-web/css/all.css"), "css"],
                [API.get("JS/Alert.js" + Config.AppVersion), "script"],
                [API.get("JS/DateTextbox.js" + Config.AppVersion), "script"],
                [API.get("JS/PartialViewLoader.js" + Config.AppVersion), "script"],
                [API.get("JS/Promise-based-indexedDB.js" + Config.AppVersion), "script"],
                [API.get("JS/Sheikhloo.js" + Config.AppVersion), "script"],
                [API.get("JS/SocketManager.js" + Config.AppVersion), "script"],
                [API.get("JS/Notification.js" + Config.AppVersion), "script"],
                [API.get("JS/Grid.js" + Config.AppVersion), "script"],
                [API.get("JS/AutoComplete.js" + Config.AppVersion), "script"],
                [API.get("JS/Scripts.js" + Config.AppVersion), "script"],
                [API.get("JS/Notify.js"), "script"],
                [API.get("JS/Chart.bundle.js"), "script"],
                [API.get("JS/Chart.utils.js"), "script"],
                [API.get("JS/prevent-pull-refresh.js"), "script"],
            ];
            for (var i = 0; i < FethingFiles.length; i++) {
                var resText = await FethingFiles[i][0];

                switch (FethingFiles[i][1]) {
                    case "script":
                        toScript(resText);
                        break;
                    case "css":
                        toCSS(resText);
                        break;
                }
                if (bar1) {
                    bar1.set((100 / FethingFiles.length) * (i + 1));
                }
            }
            var ticket = localStorage.getItem("ticket");
            loadPartialView(PartialViewTemplates.FrontPage, null, () => {
                document.querySelector("#myItem1").style.display = "none";
                clearTimeout(barTimeOut);
                //ResetAccessToken(ticket);
            });
            //if (ticket) {
            //    loadPartialView(PartialViewTemplates.FrontPage, null, () => {
            //        document.querySelector("#myItem1").style.display = "none";
            //        clearTimeout(barTimeOut);
            //        ResetAccessToken(ticket);
            //    });
            //}
            //else {
            //    loadPartialView(PartialViewTemplates.Login, null, () => {
            //        document.querySelector("#myItem1").style.display = "none";
            //        clearTimeout(barTimeOut);
            //    });
            //}
        });
}
FetchResources();
async function ResetAccessToken(ticket) {
    try {
        API.Ticket = ticket;
        var result = await callService("User/RenewAuthentication");
        localStorage.setItem("ticket", result.token);
    } catch (e) {
        //signOut();
    }

    //.catch(x => { console.log(x); setTimeout(signOut, 10000); });
}