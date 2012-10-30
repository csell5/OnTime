(function () {
    "use strict";

    var _save, _open, _file, _fileName;

    var _viewModel;

    function getDomElements() {
        _save = document.querySelector('#saveAgenda');
        _open = document.querySelector('#openAgenda');
        _fileName = document.querySelector('#fileName');
    }

    function loadEventHandlers() {
        _save.addEventListener("click", saveAgendaHandler, false);
        _open.addEventListener("click", openAgendaHandler, false);
    }

    function saveAgendaHandler() {
        
        if (!_file) {
            var savePicker = new Windows.Storage.Pickers.FileSavePicker();
            savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;

            var filename = _fileName.textContent;

            savePicker.defaultFileExtension = ".ot";
            savePicker.suggestedFileName = filename;

            savePicker.fileTypeChoices.insert("On Time", [".ot"]);

            savePicker.pickSaveFileAsync().done(function (filePicked) {
                if (filePicked) {
                    save(filePicked);
                    _file = filePicked;
                } else {
                    //error....
                }
            });
        } else {
            save(_file);
        }
    }

    function save(file) {

        var fileContents = ko.toJSON(_viewModel);

        Windows.Storage.FileIO.writeTextAsync(file, fileContents).done(function (e) {
            _fileName.textContent = _file.name;
        });
    }

    function openAgendaHandler() {
        var openPicker = new Windows.Storage.Pickers.FileOpenPicker();
        //openPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.list;

        openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
        openPicker.fileTypeFilter.replaceAll([".ot"]);

        openPicker.pickSingleFileAsync().then(function (filePicked) {
            if (filePicked) {
                open(filePicked);
            };
        });
    }

    function open(file) {
        _fileName.textContent = file.name;

        Windows.Storage.FileIO.readTextAsync(file).done(function (fileContent) {
            var parsedAgenda = JSON.parse(fileContent);

            //todo// not sure why I can't just overlay one..
            //manually create the agenda... 
            _viewModel.agendaItems.removeAll();

            for (var i = 0; i < parsedAgenda.agendaItems.length; i++) {
                _viewModel.agendaItems.push(new agendaItem(parsedAgenda.agendaItems[i].title, parsedAgenda.agendaItems[i].duration));
            }
        });
    }

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

            getDomElements();
            loadEventHandlers();

            _viewModel = new agendaViewModel();

            ko.applyBindings(_viewModel);
        }
    });

})();