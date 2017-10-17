/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

//初回起動時にオプションページを表示して設定を初期化
//Display option page at initial startup and initialize settings
browser.runtime.onInstalled.addListener(function(){
    browser.runtime.openOptionsPage();
});

(function () {
    function settingsObj() {};
    //オプションページを書き換え，設定の初期化
    //Rewrite option page, initialize setting
    settingsObj.prototype.initOptionsPage = function () {
        return new Promise(function (resolve, reject) {
            labelSet();
            getSettingsByHtml();
            overRideSettingsByStorage().then(function () {
                overRideHtml();
                saveSettings();
                resolve();
            });
        })
    };
    //オプションページから設定を保存
    //Save settings from options page
    settingsObj.prototype.saveOptionsPage = function () {
        return new Promise(function (resolve, reject) {
            getSettingsByHtml();
            saveSettings().then(function () {
                resolve();
            });
        })
    };
    //設定を初期化
    //Initialize setting
    settingsObj.prototype.init = function () {
        return new Promise(function (resolve, reject) {
            getSettings().then(function () {
                resolve();
            })
        })
    }
    //設定を返す
    //return settings
    settingsObj.prototype.get = function () {
        return Settings;
    };
    //受け取ったオブジェクトを保存
    //Save the received object
    settingsObj.prototype.save = function (settings) {
        return new Promise(function (resolve, reject) {
            for (let i in settings) {
                Settings[i] = settings[i];
            }
            saveSettings().then(function () {
                resolve();
            });
        })
    };
    //設定を削除
    //Delete settings
    settingsObj.prototype.clear = function () {
        return new Promise(function (resolve, reject) {
            Settings = new settingsObj();
            saveSettings().then(function () {
                resolve();
            })
        })
    }

    let Settings = new settingsObj();
    S = new settingsObj(); //外部から呼び出し Call from outside

    //spanのid，buttonのclassに"Label"が含まれるときi18nから値を取得して書き換え
    //When "label" is included in span's id, button class Retrieve the value from i18n and rewrite it
    function labelSet() {
        let spans = document.getElementsByTagName("span");
        for (let i in spans) {
            if (spans[i].id == undefined || spans[i].id.indexOf("Label") == -1) continue;
            let label = browser.i18n.getMessage(spans[i].id);
            if (label == "") continue;
            spans[i].innerHTML = label;
        }
        
        let inputs = document.getElementsByTagName("input");
        for (let i in inputs) {
            if (inputs[i].className == undefined || inputs[i].className.indexOf("Label") == -1) continue;
            switch (inputs[i].type) {
                case "button":
                case "submit":
                    inputs[i].value = browser.i18n.getMessage(inputs[i].className);
                    break;
            }
        }
    }

    //storageからSettingsの項目を取得して存在しない物をSettingsに上書き
    //Retrieve the Settings item from storage and overwrite Settings that do not exist
    function overRideSettingsByStorage() {
        return new Promise(function (resolve, reject) {
            browser.storage.local.get("Settings", function (value) {
                
                for (let i in Settings) {
                    if (value.Settings!=undefined && value.Settings[i] != undefined) {
                        Settings[i] = value.Settings[i];
                    }
                }
                for (let i in value.Settings) {
                    if (Settings[i] == undefined) Settings[i] = value.Settings[i];
                }
                resolve();
            })
        })
    }

    //オプションページにSettingsを反映
    //Reflect Settings on option page
    function overRideHtml() {
        let inputs = document.getElementsByTagName("input");
        for (let i in inputs) {
            if (inputs[i].className != undefined && inputs[i].className.indexOf("noSetting") != -1) continue;

            switch (inputs[i].type) {
                case "text":
                case "search":
                case "tel":
                case "url":
                case "email":
                case "password":
                case "datetime":
                case "month":
                case "week":
                case "time":
                case "datetime-local":
                case "range":
                case "color":
                    inputs[i].value = Settings[inputs[i].id];
                    break;
                case "checkbox":
                    inputs[i].checked = Settings[inputs[i].id];
                    break;
                case "radio":
                    if (Settings[inputs[i].name] == inputs[i].value) {
                        inputs[i].checked = true;
                    }
                    break;
            }
        }
    }

    //オプションページから設定の値を取得
    //Get setting value from option page
    function getSettingsByHtml() {
        let inputs = document.getElementsByTagName("input");

        for (let i in inputs) {
            if (inputs[i].className != undefined && inputs[i].className.indexOf("noSetting") != -1) continue;

            switch (inputs[i].type) {
                case "text":
                case "search":
                case "tel":
                case "url":
                case "email":
                case "password":
                case "datetime":
                case "month":
                case "week":
                case "time":
                case "datetime-local":
                case "range":
                case "color":
                    Settings[inputs[i].id] = inputs[i].value;
                    break;
                case "checkbox":
                    Settings[inputs[i].id] = inputs[i].checked;
                    break;
                case "radio":
                    if (inputs[i].checked == true) {
                        Settings[inputs[i].name] = inputs[i].value;
                    }
                    break;
            }
        }
    }
    
    function getSettings() {
        return new Promise(function (resolve, reject) {
            browser.storage.local.get("Settings", function (value) {
                Settings = value.Settings;
                resolve();
            });
        })
    }

    function saveSettings() {
        return new Promise(function (resolve, reject) {
            browser.storage.local.set({
                'Settings': Settings
            }).then(function () {
                resolve();
            });
        })
    }

}());