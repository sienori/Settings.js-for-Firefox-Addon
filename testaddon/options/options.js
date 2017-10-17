S.initOptionsPage().then(function(){
    
    let obj={test: "added by options.js"};
    S.save(obj);
    
    document.addEventListener('click', function (e) {
        switch (e.target.id) {
            case "save":
                S.saveOptionsPage();
                break;
                           }
    });
    
});