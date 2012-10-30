(function () {

    var _sampleSession = {
        duration: 0, 
        agendaItems: [
            {
                title: "countdown until start",
                duration: "1"
            },
            { 
                title: "What is On Time",
                duration: "1"
            },
            {
                title: "A Speaker's Monitor",
                duration: "1"
            },
            {
                title: "Overall Countdown",
                duration: "1"
            },

            {
                title: "Agenda Item Countdown",
                duration: "1"
            },

            {
                title: "Visual Warnings",
                duration: "2"
            },

            {
                title: "Save your agenda",
                duration: "1"
            },

            {
                title: "Thank You for Trying",
                duration: "1"
            },

            {
                title: "Tell Your Friends",
                duration: "2"
            }
        ]
    };

    function getSample () {
        return _sampleSession;
    }

    WinJS.Namespace.define("sampleSession", {
        getSample: getSample
    });

})();