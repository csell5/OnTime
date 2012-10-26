(function () {

    var agenda = {
        duration: 60, 
        agendaItems: [
            {
                title: "title",
                duration: "duration"
            }
        ]
    };

    function getSample () {
        return _sampleSession;
    }

    WinJS.Namespace.define("agenda", {
        getSample: getSample
    });

})();