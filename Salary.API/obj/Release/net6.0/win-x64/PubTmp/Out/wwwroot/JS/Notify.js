var dvNotify =
    `<div class="dvNotify">
                <div class="close"><i class="far fa-times-circle"></i></div>
                <span class="message"></span>
            </div>`.toElements()[0];
document.body.appendChild(dvNotify);
var dvNotifyMessage = dvNotify.querySelector(".message");
function hideNotify() {
    dvNotify.style.right = "110%";
    dvNotify.style.padding = "0";
}
var notifyTimeOut = null;
async function notify(message, type = "success", seconds = 3) {

    if (type != "success" && type != "error") {
        type = "success";
    }

    if (notifyTimeOut) {
        hideNotify();
        clearTimeout(notifyTimeOut);
        notifyTimeOut = null;
        await sleep(500);
    }

    message = message || "";
    dvNotify.className = "dvNotify";
    dvNotify.classList.add(type);
    dvNotifyMessage.innerHTML = message;
    dvNotify.style.right = "70%";
    dvNotify.style.padding = "10px 10px 10px 10px";

    notifyTimeOut = setTimeout(() => {
        hideNotify();
        clearTimeout(notifyTimeOut);
        notifyTimeOut = null;
    }, seconds * 1000);
}
dvNotify.querySelector(".close").onclick = hideNotify;