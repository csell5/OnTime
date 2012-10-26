(function () {

    var _sampleSession = {
        duration: 60, 
        agenda: [
            {
                title: "Introduction",
                duration: "1"
            },
            { 
                title: "What is Windows 8",
                duration: "2"
            },
            {
                title: "Simple Demo",
                duration: "1"
            },
            {
                title: "What are Contracts",
                duration: "5"
            },
            {
                title: "Contracts Demo",
                duration: "5"
            },
            {
                title: "Implemting Search Contract",
                duration: "5"
            },
            {
                title: "Seach Dem0",
                duration: "10"
            },
            {
                title: "Marketplace Opportunity",
                duration: "5"
            },
            {
                title: "Getting Registered",
                duration: "5"
            },
            {
                title: "Close",
                duration: "5"
            },
            {
                title: "Questions",
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