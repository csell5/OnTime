// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    //Windows
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var utils = WinJS.Utilities;
    var animation = WinJS.UI.Animation;

    var _sampleAgenda = sampleSession.getSample();

    //Timers
    var _duration, _min, _sec, _countdownTimer, _countUpTimer, _interval = 1000;

    //Displays
    var _dispRequest;

    //elements
    var _play, _countdownTimer;

    //view model, what else
    var viewModel = {
        countdown: ko.observable(),
        itemTitle: ko.observable(),
        itemCountdown: ko.observable()
    };

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

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

        viewModel.countdown(_getTime());
    }

    function countUp() {
        _sec++;

        if (_sec === 60) {
            _sec = 0;
            _min = _min + 1;
        }

        viewModel.countdown("-" + _getTime());

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
        _min = _sampleAgenda.duration;
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
        
        return animation.fadeOut(_play).then(function () {
            utils.addClass(_play, "hidden");
            queueAgendaItem(0);
            startTimer();
        });
    }

    function queueAgendaItem( ) {

        viewModel.itemTitle(_sampleAgenda.agenda[1].title);
        var totalCount = _sampleAgenda.agenda.length;

        for (var i = 0; i < totalCount; i++) {
            var nextTimeout = 0;

            var _itemDuration = _sampleAgenda.agenda[i].duration;
            _itemDuration = _itemDuration * (1000 * 60);

            nextTimeout = nextTimeout + _itemDuration;

            if (i < totalCount) {
                setTimeout(updateModel(i), nextTimeout);
            }
        }
        
        /*
            need a timer that we can pass in the duration in minutes..
        */

        //Now start the clock counting down
        //viewModel.itemCountdown(_sampleAgenda.agenda[nextItem].duration);
        //TODO need to set the clock here too... for the countdown.
    }

    function updateModel ( index ) {
        return function () {
            viewModel.itemTitle(_sampleAgenda.agenda[index + 1].title);

            //resetTimer with new duration
        }
    }

    app.onready = function () {
        WinJS.Utilities.startLog();

        _play = document.querySelector("#start");
        _countdownTimer = document.querySelector("#countdownTimer");

        _play.addEventListener("click", startStop, false);

        ko.applyBindings(viewModel);
    };

    app.start();
})();
