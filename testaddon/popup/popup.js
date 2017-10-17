/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

S.init().then(function () {
    
    Settings = S.get();

    for (let i in Settings) {        window.document.getElementById("setttings").insertAdjacentHTML("beforeEnd", i + ":" + Settings[i] + "<br>");
    }

})
