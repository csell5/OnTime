(function () {

    var _sampleSession = {
        duration: 60, 
        agenda: [
            {
                title: "Min - Introduction",
                duration: "1"
            },
            { 
                title: "Lwin - Warnings",
                duration: "1"
            },
            {
                title: "Min - What are uCs?",
                duration: "1"
            },
            {
                title: "Lwin - Analog vs Digital",
                duration: "2"
            },
            {
                title: "Min - Transistors",
                duration: "2"
            },
            {
                title: "PWM Demo",
                duration: "5"
            },
            {
                title: "Lwin - Infotainment ",
                duration: "3"
            },
            {
                title: "Let's Draw",
                duration: "10"
            },
            {
                title: "Min - Warning acids",
                duration: "1"
            },
            {
                title: "Lwin - Min Things we need",
                duration: "3"
            },
            {
                title: "Expose Video",
                duration: "3"
            },
            {
                title: "Min - Introduce Chemicals",
                duration: "1"
            },
            {
                title: "Lwin - Chemical Video",
                duration: "3"
            },
            {
                title: "Min - Finishing off the board",
                duration: "2"
            },
            {
                title: "Demo Shield",
                duration: "5"
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