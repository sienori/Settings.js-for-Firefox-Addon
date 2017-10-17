S.init().then(function () {
    
    Settings = S.get();

    for (let i in Settings) {        window.document.getElementById("setttings").insertAdjacentHTML("beforeEnd", i + ":" + Settings[i] + "<br>");
    }

})
