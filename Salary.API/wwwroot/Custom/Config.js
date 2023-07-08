function ConfigManager() {
    this.ClientRootAddress = "http://localhost:50153/";
    this.RootAddress = "https://localhost:7217/";
    this.APIRootAddress = "https://localhost:7217/api/";


    this.AppVersion = "?v=1";
    this.GetString = function (params) {
        return {}
    }
}
var Config = new ConfigManager();