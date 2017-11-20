Mousetrap.bind(['command+k', 'ctrl+k'], function(e) {
    $( ".minsep").trigger( "click");
    return false;
});

Mousetrap.bind(['command+l', 'ctrl+l'], function(e) {
    $( ".randomize").trigger( "click");
    return false;
});

Mousetrap.bind(['command+;', 'ctrl+;'], function(e) {
    $( ".control-panel-toggle").trigger( "click");
    return false;
});

Mousetrap.bind(['command+-', 'ctrl+-'], function(e) {
    $( ".control-panel-container").toggleClass('hidden');
    return false;
});

Mousetrap.bind(['command+8', 'ctrl+8'], function(e) {


    var _sv = $( "#siteview");
    if ( ! _sv.hasClass('on-view') ) {
        _sv.addClass('on-view');
        _sv.velocity("slideDown", { duration: "slow", easing: "easeInSine"});
    } else {
        _sv.velocity("reverse");
    }
    return false;
});

Mousetrap.bind(['command+9', 'ctrl+9'], function(e) {
    var _div = $("#fileview");
    if ( ! _div.hasClass('on-view') ) {
        _div.addClass('on-view');
        _div.velocity("slideDown", { duration: "slow", easing: "easeInSine"});
    } else {
        _div.velocity("reverse");
    }
    return false;
});

Mousetrap.bind(['command+7', 'ctrl+7'], function(e) {
    var _div = $("#cy");
    if ( _div.hasClass('fresh') ) {
        _div.removeClass('fresh');
        _div.velocity("slideUp", { duration: "slow", easing: "easeInSine"});
        console.log('slideUp');
    }
    else if ( ! _div.hasClass('on-view') ) {
        _div.addClass('on-view');
        _div.velocity("slideDown", { duration: "slow", easing: "easeInSine"});
    } else {
        _div.velocity("reverse");
    }
    return false;
});