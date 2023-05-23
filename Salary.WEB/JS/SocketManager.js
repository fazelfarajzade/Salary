function SocketManager(SocketAddress, SocketSection) {
    var _this = this;
    this.TimeOutInterval = null;
    this.onclose = function () { }
    this.onmessage = function () { }
    this.onerror = function () { }
    this.onopen = function () { }

    this.SocketAddress = SocketAddress;
    this.SocketSection = SocketSection ? (typeof SocketSection == "string" ? SocketSection : SocketSection.toString()) : "";
    this.Socket = null;
    this.ReNewSocket();
    var beforeunload = window.onbeforeunload;
    window.onbeforeunload = function (e) {
        if (_this.beforeunload)
            _this.beforeunload(e);
        _this.Close();
    }
}
SocketManager.prototype.Close = function () {
    if (this.Socket && this.Socket.readyState != WebSocket.CLOSED && this.Socket.readyState != WebSocket.CLOSING)
        this.Socket.close();
}
SocketManager.prototype.ReNewSocket = function () {
    var _this = this;
    var address = this.SocketAddress;
    if (this.SocketSection.length > 0) {
        address += (address.indexOf("?") == -1 ? "?" : "&")
            + "SocketSection=" + this.SocketSection
    }
    try {
        this.Socket = new WebSocket(address);
        this.Socket.onclose = function (e) { _this.Socket = null; if (typeof _this.onclose == "function") _this.onclose(e); }
        this.Socket.onmessage = function (e) { if (typeof _this.onmessage == "function") _this.onmessage(e); }
        this.Socket.onerror = function (e) { if (typeof _this.onerror == "function") _this.onerror(e); }
        this.Socket.onopen = function (e) { if (typeof _this.onopen == "function") _this.onopen(e); }
    }
    catch (err) {
        console.log(err.message);
    }
}
SocketManager.prototype.Send = function (MethodName, data) {
    var _this = this;
    var message = new Object();
    message.Method = MethodName;
    message.Parameters = data;

    if (this.Socket == null || this.Socket.readyState == WebSocket.CONNECTING || this.Socket.readyState == WebSocket.CLOSING || this.Socket.readyState == WebSocket.CLOSED) {
        if (this.TimeOutInterval)
            clearTimeout(this.TimeOutInterval);
        if (this.Socket == null || this.Socket.readyState == WebSocket.CLOSED)
            this.ReNewSocket();
        this.TimeOutInterval = setTimeout(function () { _this.Send(MethodName, data); }, 500);

    }
    else if (this.Socket.readyState == WebSocket.OPEN) {
        this.Socket.send(JSON.stringify(message));
    }
}

var socket = null;
function tryConnectToSocket() {
    try {
        if (!socket) {
            socket = new SocketManager(WebSocketJoinAddress);
            socket.onmessage = (e) => {
                socketMessageHandler(e.data);
            }
            socket.onerror = (e) => {
                console.log('socket EX', e);
            }
        }
    }
    catch (er) {
        console.log(er.message);
    }
}