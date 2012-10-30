
(function () {
    "use strict";

    //Windows
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var utils = WinJS.Utilities;
    var animation = WinJS.UI.Animation;
    var nav = WinJS.Navigation;

    var _currentAgenda;

    //Timers
    var _duration, _min, _sec, _agendaSec, _agendaMin, _countdownTimer, _countUpTimer, _agendaCountdownId, _interval = 1000;
    
    //Displays
    var _dispRequest;

    //elements
    var _newAgenda, _appBar, _play, _countdownTimer;

    //view model, what else

    var _currentViewModel;

    function viewModel() {
        var self = this;

        self.countdown = ko.observable();
        self.nextItem = ko.observable();
        self.currentItem = ko.observable();
        self.itemCountdown = ko.observable();
    }
        /*
    var viewModel = {
        countdown: ko.observable(),
        nextItem: ko.observable(),
        currentItem: ko.observable(),
        itemCountdown: ko.observable()
    };
    */

    function getDomElements() {
        _play = document.querySelector("#start");
        _countdownTimer = document.querySelector("#countdownTimer");

        _appBar = document.querySelector('#appBar');
        _newAgenda = document.querySelector('#newAgenda');
    }

    function addEventHandlers() {
        _play.addEventListener("click", startStop, false);

        _newAgenda.addEventListener('click', function () {
            _appBar.winControl.hide();
            nav.navigate("/pages/agenda/agenda.html");
            resetClocks();
        }, false);
    }

    WinJS.UI.Pages.define("/pages/home/home.html", {
        ready: function (element, options) {
            getDomElements();
            addEventHandlers();
        }
    });

    function resetClocks() {
        //Make sure the timers are cleared out...
        if (_countdownTimer && _countdownTimer != 0) {
            clearInterval(_countdownTimer);
            _countdownTimer = 0;
        }

        if (_agendaCountdownId && _agendaCountdownId != 0) {
            clearInterval(_agendaCountdownId)
            _agendaCountdownId = 0;
        }

        _min = 0;
        _sec = -1;
        _agendaSec = -1;
        _agendaMin = 0;

    }

    function _getTime() {
        if (_sec <= 9 && _sec !== "00") {
            _sec = "0" + _sec;
        }
        return (_min <= 9 ? "0" + _min : _min) + ":" + _sec;
    };

    function countdownBump() {
        _sec = 59;
        _min = _min - 1;
    }

    function countdown() {
        _sec--;

        if (_sec === -1) {
            if (_min === 15 || _min === 10) {
                document.getElementById("body").classList.add("redBackground");
                countdownBump();
        
            } else if (_min === 13 || _min === 8) {
                document.getElementById("body").classList.remove("redBackground");
                countdownBump();

            } else if (_min === 0 && _sec === -1) {
                document.getElementById("body").classList.add("redBackground");

                clearInterval(_countdownTimer);
                _min = 0;
                _sec = 0;
                _countUpTimer = setInterval(countUp, _interval);

            } else {
                countdownBump();
            }
        }

        _currentViewModel.countdown(_getTime());
    }

    function agendaCountdown() {
        _agendaSec--;

        if (_agendaSec === -1) {
    
            _agendaSec = 59;
            _agendaMin = _agendaMin - 1;

            if ( _agendaMin === 1 ) {
                document.getElementById("next").classList.add("warning");

            } else if ( _agendaMin === 0) {
                document.getElementById("next").classList.remove("warning");
            }
        }

        _currentViewModel.itemCountdown(getAgendaTime());
    }

    function getAgendaTime() {
        if (_agendaSec <= 9 && _agendaSec !== "00") {
            _agendaSec = "0" + _agendaSec;
        }
        return (_agendaMin <= 9 ? "0" + _agendaMin : _agendaMin) + ":" + _agendaSec;
    }

    function countUp() {
        _sec++;

        if (_sec === 60) {
            _sec = 0;
            _min = _min + 1;
        }

        _currentViewModel.countdown("-" + _getTime());

        if (_min > 10 && _dispRequest) {
            try {
                _dispRequest.requestRelease();
                _dispRequest = undefined;

                WinJS.log && WinJS.log("Display request released.", "on time", "status");
            } catch (e) {
                WinJS.log && WinJS.log("Failed: displayRequest.requestRelease, error", "on time", "error");
            }
        }
    }

    function startTimer () {
        _min = _currentAgenda.duration;
        _sec = 0;

        if (_dispRequest === undefined) {
            try {                
                _dispRequest = new Windows.System.Display.DisplayRequest;
                _dispRequest.requestActive();

                WinJS.log && WinJS.log("Display requested.", "on time", "status");
            } catch (e) {
                WinJS.log && WinJS.log("Failed: displayRequest object creation, error.", "on time", "error");
            }
        }
        _countdownTimer = setInterval(countdown, _interval);    
    }

    function startStop() {

        if (app.sessionState.agenda) {
            _currentAgenda = app.sessionState.agenda;
        }
        else {
            _currentAgenda = sampleSession.getSample();
        }

        //todo// load sample
        _currentViewModel = new viewModel();
        ko.applyBindings(_currentViewModel);
       

        //Get the overall duration from the agenda
        var sessionDuration = 0;
        for (var i = 0; i < _currentAgenda.agendaItems.length; i++) {
            sessionDuration += parseInt(_currentAgenda.agendaItems[i].duration);
        }

        _currentAgenda.duration = sessionDuration;

        //kick it off.
        return animation.fadeOut(_play).then(function () {
            utils.addClass(_play, "hidden");
            queueAgendaItem(0);
            startTimer();
        });
    }

    function queueAgendaItem( ) {
        _currentViewModel.currentItem(_currentAgenda.agendaItems[0].title);
        _currentViewModel.nextItem(_currentAgenda.agendaItems[1].title);

        var totalCount = _currentAgenda.agendaItems.length;

        _agendaSec = 0;
        _agendaMin = _currentAgenda.agendaItems[0].duration;

        _agendaCountdownId = setInterval(agendaCountdown, _interval);
        
        var nextTimeout = 0;
        for (var i = 0; i < totalCount; i++) {
            
            var _itemDuration = convertMinutesToMillSeconds(_currentAgenda.agendaItems[i].duration);
            nextTimeout += _itemDuration;

            if (i < totalCount) {
                //Sets the agenda title......
                setTimeout(updateModel(i), nextTimeout);
            }
        }
    }

    function convertMinutesToMillSeconds( minutes ) {
        return minutes * (1000 * 60);
    }

    function updateModel ( index ) {
        return function () {

            var totalItems = _currentAgenda.agendaItems.length;
            
            if (totalItems > index + 1) {
            
                _currentViewModel.currentItem(_currentAgenda.agendaItems[index + 1].title);

                var nextAgendaItem = index + 2 >= totalItems ? "----" : _currentAgenda.agendaItems[index + 2].title;
                _currentViewModel.nextItem(nextAgendaItem);

                _agendaMin = _currentAgenda.agendaItems[index + 1].duration;
            }

            else {
                clearInterval(_agendaCountdownId);

                _currentViewModel.currentItem(" ");
                _currentViewModel.nextItem(" ");

                //Reset the clock to 0;
                _agendaMin = "0";
                _agendaSec = "0";
                _currentViewModel.itemCountdown(getAgendaTime())
            }
        }
    }

})();
