var term,
    protocol,
    socketURL,
    socket,
    pid,
    charWidth,
    charHeight;

var terminalContainer = document.getElementById('terminal-container'),
    optionElements = {
      cursorBlink: document.querySelector('#option-cursor-blink'),
      cursorStyle: document.querySelector('#option-cursor-style'),
      scrollback: document.querySelector('#option-scrollback'),
      tabstopwidth: document.querySelector('#option-tabstopwidth')
    },
    colsElement = document.getElementById('cols'),
    rowsElement = document.getElementById('rows'),
    fontSizeElement = document.getElementById('font-size'),
    dockerDetailsElement = document.getElementById('dockerDetails'),
    colors = [];

function setTerminalSize () {
  var cols = parseInt(colsElement.value, 10),
      rows = parseInt(rowsElement.value, 10),
      width = (cols * charWidth).toString() + 'px',
      height = (rows * charHeight).toString() + 'px';

  terminalContainer.style.width = width;
  terminalContainer.style.height = height;
  term.resize(cols, rows);
}

function modHSL(bg){
    var hsl = {h:bg.h, s:bg.s+0.02, l:bg.l, a:bg.a};
    return tinycolor(hsl);
}
function updateCSSColors(){
    var color1 = getNodeColor(feature='main');
    var color2 = getNodeColor(feature='main');
    var color3 = getNodeColor(feature='main');
    var menu = getNodeColor(feature='main');
    var mainbg = tinycolor.mix(color2.shade, color1.shade, amount=25).saturate(50);
    var new_bg = mainbg;
    var site = {
        color1: {
            '--color_1_primary': color1.primary,
            '--color_1_shade': color1.shade,
            '--color_1_third': color1.third,
            '--color_1_text': color1.text[0],
            '--color_1_text-outline': color1.text[1],
            '--color_1_background': tinycolor(color1.third).analogous()
        }, color2: {
            '--color_2_primary': color2.primary,
            '--color_2_shade': color2.shade,
            '--color_2_third': color2.third,
            '--color_2_text': color2.text[0],
            '--color_2_text-outline': color2.text[1],
            '--color_2_background': tinycolor(color2.third).analogous()
        }, color3: {
            '--color_3_primary': color3.primary,
            '--color_3_shade': color3.shade,
            '--color_3_third': color3.third,
            '--color_3_text': color3.text[0],
            '--color_3_text-outline': color3.text[1],
            '--color_3_background': tinycolor(color3.third).analogous()
        }, main: {
            '--main-background': new_bg,
            '--main-terminal-background': new_bg,
            '--main-text': tinycolor.mostReadable(mainbg, [color1.primary, color2.primary, color3.primary]).setAlpha(1).toHexString(),
            '--menu-background:': new_bg,
            '--menu-icons': menu.primary,
            '--menu-popover-background': new_bg.setAlpha(0.6)
        }
    };
    for (var key in site){
        for (var setting in site[key]) {
            document.documentElement.style.setProperty(setting, site[key][setting])
        }
    }
}



function updateContainerDetails(containers){
    if (containers !== null) {
        _c = [];
        for (var key in containers['new']) {
            _c.push(containers['new'][key]);

        }
        for (var k in containers['up']) {
            _c.push(containers['up'][k]);

        }

        var source = $("#docker-details-template").html();
        var template = Handlebars.compile(source);
        dockerDetailsElement.innerHTML = template({new: _c});
    }
}



function setTerminalFontSize (){
  var _fs = "font-size:"+fontSizeElement.value+"pt;";
  terminalContainer.firstChild.setAttribute('style', _fs);
}
fontSizeElement.addEventListener('change', setTerminalFontSize);

colsElement.addEventListener('change', setTerminalSize);
rowsElement.addEventListener('change', setTerminalSize);

//terminalContainer.addEventListener('change', updateContainerDetails);

optionElements.cursorBlink.addEventListener('change', function () {
  term.setOption('cursorBlink', optionElements.cursorBlink.checked);
});
optionElements.cursorStyle.addEventListener('change', function () {
  term.setOption('cursorStyle', optionElements.cursorStyle.value);
});
optionElements.scrollback.addEventListener('change', function () {
  term.setOption('scrollback', parseInt(optionElements.scrollback.value, 10));
});
optionElements.tabstopwidth.addEventListener('change', function () {
  term.setOption('tabStopWidth', parseInt(optionElements.tabstopwidth.value, 10));
});

createTerminal();

function bumpNodes() {
    $(".randomize").trigger("click");
    setTimeout(function () {
        $(".minsep").trigger("click");
        $(".randomize").trigger("click");
    }, 1500);
    $(".minsep").trigger("click");
}


function goldenRatioGradient(size){
    var min = 0.000000001;
    var max = 1.000000000;
    var offset = chance.floating({min: min, max: max});

    if (rainbow !== undefined) delete  rainbow;
    var rainbow = new Rainbow();
    rainbow.setNumberRange(min, max);
    rainbow.setSpectrum(
        '#556270',
        '#4ECDC4',
                '#4ECDC4',
        '#C7F464',
        '#C7F464',
        '#C7F464',
                '#FF6B6B',
        '#C44D58',
        '#556270',
);

    var _build = [];
    for (var i = 0; i < size; i++){
        _build[i] = '#'+rainbow.colourAt(offset + (0.618033988749895 * i) % 1);
    }
    return _build;

}

function txtColor(color){
        if (tinycolor(color).isDark()) text = ['#FFF','#000']; else text = ['#000','#FFF'];
    return text;
}

function nextFloat(min=0.0001, max=0.100){
    return chance.floating({min: min, max: max})
}

function getNodeColor(feature='nodes', hue=null, brighten=0, sampleSize = 25){
    var color = tinycolor(goldenRatioGradient(sampleSize)[15]);
    var hsl = color.toHsl();
    //hsl.s = nextFloat(0.7, 0.800);

    if (feature == 'edges'){
        if(hue!==null) hsl.h = hue;
        hsl.s = nextFloat(0.8, 0.900);
    }
    else{
        hsl.a = nextFloat(0.85, 1.0);
        hsl.s = nextFloat(0.9, 0.907);
    }


    var triad = tinycolor(hsl).analogous().map(function(t) { return t.toHexString(); });

    var textCol = txtColor(tinycolor.mix(triad[1],triad[0], amount=45).toHexString());
    if (feature == 'nodes')  textCol = textCol[0];
    return {primary: triad[1],
        shade: tinycolor.mix(triad[1],triad[0], amount=45).toHexString(),
        third: tinycolor.mix(triad[1],triad[0], amount=20).toHexString(),
        text: textCol};
}

var linked_colors = getNodeColor(feature='edges');
var ports_colors = getNodeColor(feature='edges');
var volume_colors = getNodeColor(feature='edges');

console.log(linked_colors, ports_colors);

function getDockerNodes() {
    fetch('/docker', {method: 'POST'}).then(function (res) {
        res.json().then(function (dockerStatus) {
            var completed = true;

            var edges = [];
            var i = 0;

            for (var container in dockerStatus['new']) {
                var _c = dockerStatus['new'][container];
                var _score = _c['Mounts'].length+_c['Ports'].length;

                console.log(dockerStatus);
                if (_c !== undefined) {
                    var _colors = getNodeColor();
                    $(".randomize").trigger("click");
                    cy.add([{
                        group: "nodes",
                        data: {
                            group: "docker",
                            id: _c.Name,
                            name: _c.Name,
                            score: _score*0.0014,
                            color: _colors.primary,
                            textOutlineColor: _colors.shade,
                            textColor: _colors.text,
                            extraColor: _colors.third,
                            shape: 'ellipse', // ellipse
                            query: true,
                            gene: true
                        }, position: {
                            x: 10,
                            y: 10
                        },
                        removed: false,
                        selected: false,
                        selectable: true,
                        locked: false,
                        grabbed: false,
                        grabbable: true,
                        classes: ""
                    }]);

                    if (_c['Labels']['linked_to'] !== undefined) {
                        edges.push([{
                            group: "edges",
                            position: {},
                            removed: false,
                            selected: false,
                            selectable: true,
                            locked: false,
                            grabbed: false,
                            grabbable: true,
                            classes: "",
                            data: {
                                source: _c.Name,
                                target: _c['Labels']['linked_to'],
                                weight: 0.012590342,
                                group: "docker",
                                label: "Link",
                                classes: 'autorotate',
                                opacity: 1,
                                colorPrimary: linked_colors.primary,
                                colorShade: linked_colors.shade,
                                colorText: linked_colors.text[0],
                                colorTextOutline: linked_colors.text[1],
                                colorExtra: linked_colors.third,
                                lineStyle: 'dotted'
                            }
                        }]);
                    }
                    _c['Mounts'].forEach(function (vol) {
                        if (vol['Type'] == 'bind') {
                            edges.push([{
                                group: "edges",
                                position: {},
                                removed: false,
                                selected: false,
                                selectable: true,
                                locked: false,
                                grabbed: false,
                                grabbable: true,
                                classes: "",
                                data: {
                                    source: _c.Name,
                                    target: 'h',
                                    weight: 0.012590342,
                                    group: "docker",
                                    label: vol['Destination'],
                                    classes: 'autorotate',
                                    opacity: 1,
                                    colorPrimary: volume_colors.primary,
                                    colorShade: volume_colors.shade,
                                    colorText: volume_colors.text[0],
                                    colorTextOutline: volume_colors.text[1],
                                    colorExtra: volume_colors.third,
                                    lineStyle: "solid"
                                }
                            }]);
                        }
                    });

                    _c['Ports'].forEach(function (port) {
                        if (port['PublicPort'] !== undefined) {
                            var portmap = port['PublicPort'] + ':' + port['PrivatePort'];
                            edges.push([{
                                group: "edges",
                                position: {},
                                removed: false,
                                selected: false,
                                selectable: true,
                                locked: false,
                                grabbed: false,
                                grabbable: true,
                                classes: "",
                                data: {
                                    source: _c.Name,
                                    target: 'h',
                                    weight: 0.012590342,
                                    group: "docker",
                                    label: portmap,
                                    classes: 'autorotate',
                                    opacity: 1,
                                    colorPrimary: ports_colors.primary,
                                    colorShade: ports_colors.shade,
                                    colorText: ports_colors.text[0],
                                    colorTextOutline: ports_colors.text[1],
                                    colorExtra: ports_colors.third,
                                    lineStyle: "solid"
                                }
                            }]);
                        }
                    });

                    doQtip();
                    updateContainerDetails(dockerStatus);
                    bumpNodes();
                    i++;
                } else {
                    completed = false;
                }
            }
            edges.forEach(function (edge) {
                cy.add(edge);
            });
            for (var container in dockerStatus['down']) {
                cy.remove(cy.$("#" + dockerStatus['down'][container].Name));
                bumpNodes();
            }
        });
    });
}

function createTerminal() {
    // Clean terminal
    while (terminalContainer.children.length) {
        terminalContainer.removeChild(terminalContainer.children[0]);
    }
    term = new Terminal({
        cursorBlink: optionElements.cursorBlink.checked,
        scrollback: parseInt(optionElements.scrollback.value, 10),
        tabStopWidth: parseInt(optionElements.tabstopwidth.value, 10)
    });
    term.on('resize', function (size) {
        if (!pid) {
            return;
        }
        var cols = size.cols,
            rows = size.rows,
            url = '/terminals/' + pid + '/size?cols=' + cols + '&rows=' + rows;

        fetch(url, {method: 'POST'});
    });
    protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
    socketURL = protocol + location.hostname + ((location.port) ? (':' + location.port) : '') + '/terminals/';

    term.open(terminalContainer);
    term.fit();

    var initialGeometry = term.proposeGeometry(),
        cols = initialGeometry.cols,
        rows = initialGeometry.rows;

    colsElement.value = cols;
    rowsElement.value = rows;

    updateCSSColors();

    fetch('/terminals?cols=' + cols + '&rows=' + rows, {method: 'POST'}).then(function (res) {

        charWidth = Math.ceil(term.element.offsetWidth / cols);
        charHeight = Math.ceil(term.element.offsetHeight / rows);

        res.text().then(function (pid) {
            window.pid = pid;
            socketURL += pid;
            socket = new WebSocket(socketURL);
            socket.onopen = runRealTerminal;
            socket.onclose = runFakeTerminal;
            socket.onerror = runFakeTerminal;
        });
    });

    $(function(){

            // load once after 2 seconds
            setTimeout(function(){ getDockerNodes(); }, 2000);

            // load every 2 seconds
            setInterval(function(){ getDockerNodes(); }, 2000);
        });
}

Mousetrap.bind(['command+0', 'ctrl+0'], function(e) {
    $(".site-header").toggleClass('hidden');
    term.toggleFullscreen();
    return false;
});

function runRealTerminal() {
  term.attach(socket);
  term._initialized = true;
}

function runFakeTerminal() {
  if (term._initialized) {
    return;
  }

  term._initialized = true;

  var shellprompt = '$ ';

  term.prompt = function () {
    term.write('\r\n' + shellprompt);
  };

  term.writeln('Welcome to xterm.js');
  term.writeln('This is a local terminal emulation, without a real terminal in the back-end.');
  term.writeln('Type some keys and commands to play around.');
  term.writeln('');
  term.prompt();

  term.on('key', function (key, ev) {
    var printable = (
      !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey
    );

    if (ev.keyCode == 13) {
      term.prompt();
    } else if (ev.keyCode == 8) {
     // Do not delete the prompt
      if (term.x > 2) {
        term.write('\b \b');
      }
    } else if (printable) {
      term.write(key);
    }
  });

  term.on('paste', function (data, ev) {
    term.write(data);
  });
}
