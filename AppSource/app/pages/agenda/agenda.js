(function () {
    "use strict";

    function agendaViewModel() {
        var self = this;

        self.duration = ko.observable();
        self.agendaItems = ko.observableArray(
            [
                { title: "title", duration: "duration" }
            ]
        );

        self.addItem = function () {
            self.agendaItems.push({ title: "title", duration: 5 });
        };
       
    };

    WinJS.UI.Pages.define("/pages/agenda/agenda.html", {
        ready: function (element, options) {
            ko.applyBindings(new agendaViewModel());
        }
    });

})();