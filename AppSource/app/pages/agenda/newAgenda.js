(function () {
    "use strict";

    //todo// Not sure I need this since I am using KO and not winjs binding...
    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;

    function agendaViewModel() {
        var self = this;

        self.duration = ko.observable();
        self.agendaItems = ko.observableArray(
            [
                { title: "title", duration: "duration" }
            ]
        );

        self.addItem = function () {
            var itemTitle; 
            self.agendaItems.push();
        };
        //BUTTON HERE?
    };

    app.onready = function () {
        ko.applyBindings(new agendaViewModel());
    }

})();