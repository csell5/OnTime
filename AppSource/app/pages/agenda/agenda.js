(function () {
    "use strict";

    function agendaItem(title, duration) {
        var self = this;

        self.title = ko.observable(title);
        self.duration = ko.observable(duration);
    }

    function agendaViewModel() {
        var self = this;

        self.agendaItems = ko.observableArray(
            [
                new agendaItem("introduction", 5)
            ]
        );

        self.addItem = function () {
            return self.agendaItems.push(new agendaItem("title", 5));
        };

        self.duration = ko.computed(function () {
            var total = 0;

            for (var i = 0; i < self.agendaItems().length; i++)
                total += parseInt(self.agendaItems()[i].duration(), 0) || 0;

            return total;
        }, self);

    };

    WinJS.UI.Pages.define("/pages/agenda/agenda.html", {
        ready: function (element, options) {
            ko.applyBindings(new agendaViewModel());
        }
    });

})();