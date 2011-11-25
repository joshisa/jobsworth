var INTERVAL = 60000; // runs every minute
from_dropdown = null;

// TODO what should it do?
// * it should update the "inline timer" regularly
// * in some conditions:
// * only if the task has been created already
// *
var $minutes,
    $hours;

// it should pause the timer and then hide itself to show the play button
var update_displayed_time = function() {
    var current_minutes = parseInt($minutes.text(), 10),
        current_hours   = parseInt($hours.text(), 10);

    current_minutes++;

    if (current_minutes > 59) {
        current_minutes = 0;
        current_hours++;
    }

    $minutes.text(current_minutes);
    $hours.text(current_hours);
};

jQuery(document).ready(function($) {
    // timers
    var inline = $('#timer-bar-elapsed'),
        $timer;

    // timer spans
    $minutes = $('#minutes > .timer-val');
    $hours   = $('#hours > .timer-val');

    // buttons
    var $pause_button = $('#pause-btn'),
        $play_button  = $('#play-btn'),
        $pin_button   = $('#pin-btn');

    var $save_button  = $('#save-btn'),
        $dropdown = $('#save-dropdown'),
        $li_elapsed = $('#worklog-elapsed'),
        $li_custom = $('#worklog-custom'),
        $li_none = $('#worklog-none'),
        $dialog = $('#worktime_container'),
        $form = $('#taskform');

    // init timer
    $timer = $.timer(function() {
      update_displayed_time();
    });

    // bindings
    $pause_button.bind('click', function() {
        $timer.pause();
        $(this).hide();
        $play_button.show();
    });

    // it should restart the timer and then hide itself to show the pause button
    $play_button.bind('click', function() {
        $timer.play();
        $(this).hide();
        $pause_button.show();
    });

    // initial timer values
    $minutes.text('00');
    $hours.text('00');

    // make it look like a submit button
    $save_button.addClass("ui-button ui-widget ui-state-default ui-corner-all");

    $form.submit(function(event) {
        var elapsed = $('#timer-bar-elapsed').text();
        $('#worklog-elapsed > a').text(elapsed);
        $dropdown.toggle('blind');

        // prevent submit
        if (!from_dropdown) {
            event.preventDefault();
            event.stopPropagation();
        }
        from_dropdown = false;
    });

    // set up elements

    var buttons = [
        {
            text: 'Save',
            click: function() {
                $('input', $(this)).clone().appendTo($form);
                from_dropdown = true;
                $form.submit();
                $(this).dialog('close');
            }
        },
        {
            text: 'Cancel',
            click: function() { $(this).dialog('close'); }
        }
    ];

    //set up dialog
    $dialog.dialog({
        autoOpen: false,
        buttons: buttons,
        draggable: false,
        title: 'Crete work log'
    });

    $li_elapsed.click(function() {
        var elapsed = $('#timer-bar-elapsed').text(),
            $input = $('div[role=dialog] input#work_log_duration'),
            $clone = $input.clone();

        remove_residue();
        $clone.val($.trim(elapsed));
        $clone.appendTo($form);

        from_dropdown = true;
        $form.submit();
        $dropdown.toggle('blind');
    });
    $li_custom.click(function() {
        remove_residue();
        $dialog.dialog('open');
    });
    $li_none.click(function() {
        remove_residue();
        from_dropdown = true;
        $form.submit();
        $dropdown.toggle('blind');
    });

    var remove_residue = function() {
        var $residue = $('#taskform input[name^=work_log]');
        $residue.remove();
    }

    // TODO when should it start?
    $timer.set({ time: INTERVAL, autostart: true });
});
