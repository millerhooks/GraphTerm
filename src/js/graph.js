var cy;

function setTerminalFontSize(_fontSize){
    $( ".terminal" ).css("font-size", _fontSize+"pt");
}


function doQtip() {
    cy.nodes().forEach(function (n) {
        var g = n.data('name');

        n.qtip({
            content: [
                {
                    name: 'Option1', url: '#'
                },
                {
                    name: 'Option2', url: '#'
                },
                {
                    name: 'Option3', url: '#'
                }
            ].map(function (link) {
                return '<a target="_blank" href="' + link.url + '">' + link.name + '</a>';
            }).join('<br />\n'),
            position: {
                my: 'top center',
                at: 'bottom center'
            },
            style: {
                classes: 'qtip-bootstrap',
                tip: {
                    width: 16,
                    height: 8
                }
            }
        });
    });
}


$(function(){ // on dom ready

    var gencolor = {
        localhost: getNodeColor(),
        www: getNodeColor()
    };
    if (gencolor.www.text == '#FFF') gencolor.www.text_outline = '#000'; else gencolor.www.text_outline = '#FFF';
  cy = cytoscape({
    container: document.getElementById('cy'),

    style:[
        {
          selector: '.autorotate',
          style: {
            'edge-text-rotation': 'autorotate'
          }
        },
      {
         "selector":"core",
         "style":{
            "selection-box-color": "#AAD8FF",
            "selection-box-border-color": "#8BB0D0",
            "selection-box-opacity": "0.5"
         }
      },
      {
         "selector":"node",
         "style":{
            "width":"mapData(score, 0, 0.006769776522008331, 40, 80)",
            "height":"mapData(score, 0, 0.006769776522008331, 40, 80)",
            "content":"data(name)",
            "font-size":"18px",
            "text-valign":"center",
            "text-halign":"center",
            "background-color":"#38fc3d", "text-outline-color":"#0e8243",
            "text-outline-width":"2px",
            "color":"#efecff",
            "overlay-padding":"6px",
            "z-index":"10",
            "shape": "data(shape)"
         }
      },
      {
         "selector":"node[?attr]",
         "style":{
            "shape":"rectangle",
            "background-color":"#12ccf9",
            "text-outline-color":"#12ccf9",
            "width":"16px",
            "height":"16px",
            "font-size":"6px",
            "z-index":"1"
         }
      },
      {
         "selector":"node[?query]",
         "style":{
            "background-clip":"none",
            "background-fit":"contain"
         }
      },
      {
         "selector":"node:selected",
         "style":{
            "border-width":"6px",
            "border-color":"#AAD8FF",
            "border-opacity":"0.5",
            "background-color":"#77828C",
            "text-outline-color":"#77828C"
         }
      },
      {
         "selector":"edge",
         "style":{
            "curve-style":"haystack",
            "haystack-radius":"0.5",
            "opacity":"0.8",
            "line-color":"#bbb",
            "width":"mapData(weight, 0, 1, 1, 8)",
            "overlay-padding":"3px"
         }
      },
      {
         "selector":"edge[group=\"exit\"]",
         "style":{
             'curve-style': 'unbundled-bezier',
             'control-point-distances': '50 -50',
             'control-point-weights': '0.25 0.75',
             "line-color": "data(colorPrimary)",
             "width": "mapData(weight, 2, 1, 1, 8)",
             "overlay-padding": "3px",
             'target-arrow-shape': 'triangle',
             'source-arrow-shape': 'circle',
             'line-style': "data(lineStyle)",
             'source-arrow-color': "data(colorShade)",
             'target-arrow-color': "data(colorShade)",
             'label': "data(label)",
             'edge-text-rotation': 'autorotate',
             'color': "data(colorText)",
             'text-opacity': '1',
             'text-outline-color': 'data(colorTextOutline)',
             'text-outline-width': '1px',
             'opacity': 'data(opacity)'
         }
      },
      {
         "selector":"node.unhighlighted",
         "style":{
            "opacity":"0.2"
         }
      },
      {
         "selector":"edge.unhighlighted",
         "style":{
            "opacity":"0.05"
         }
      },
      {
         "selector":".highlighted",
         "style":{
            "z-index":"999999"
         }
      },
      {
         "selector":"node.highlighted",
         "style":{
            "border-width":"6px",
            "border-color":"#AAD8FF",
            "border-opacity":"0.5",
            "background-color":"#394855",
            "text-outline-color":"#394855",
            "shadow-blur":"12px",
            "shadow-color":"#000",
            "shadow-opacity":"0.8",
            "shadow-offset-x":"0px",
            "shadow-offset-y":"4px"
         }
      },
        {
         "selector":"node[group=\"www\"]",
         "style":{
             "border-width":"6px",
             "border-color":"data(extraColor)",
             "border-opacity":"0.8",
             "background-color":"data(color)",
             "text-outline-color":"data(textOutlineColor)",
             "color": "data(textColor)",
             "shadow-blur":"12px",
             "shadow-color":"#000",
             "shadow-opacity":"0.8",
             "shadow-offset-x":"0px",
             "shadow-offset-y":"4px",
             "shape": "data(shape)"
         }
       },
       {
         "selector":"node[group=\"docker\"]",
         "style":{
             "border-width":"6px",
             "border-color":"data(extraColor)",
             "border-opacity":"0.8",
             "background-color":"data(color)",
             "text-outline-color":"data(textOutlineColor)",
             "color": "data(textColor)",
             "shadow-blur":"12px",
             "shadow-color":"#000",
             "shadow-opacity":"0.8",
             "shadow-offset-x":"0px",
             "shadow-offset-y":"4px",
             "shape": "data(shape)"
         }
      },
      {
         "selector":"edge.filtered",
         "style":{
            "opacity":"0"
         }
      },
      {
         "selector":"edge[group=\"docker\"]",
         "style":{
             'target-arrow-shape': 'triangle',
             'source-arrow-shape': 'circle',
             "line-color":"data(colorPrimary)",
             "curve-style":"bezier",
             'line-style': "data(lineStyle)",
             'source-arrow-color': "data(colorPrimary)",
             'target-arrow-color': "data(colorPrimary)",
             'label': "data(label)",
             'edge-text-rotation': 'autorotate',
             'color': "data(colorText)",
             'text-opacity': '1',
             'text-outline-color': 'data(colorTextOutline)',
             'text-outline-width': '1px',
             'opacity': 'data(opacity)'
         }
      }],
    
    elements: {
        nodes: [{
                    group: "nodes",
                    data: {
                        group: "www",
                        id: "www",
                        name: "WWW",
                        color: gencolor.www.primary,
                        textOutlineColor: gencolor.www.shade,
                        //extraColor: gencolor.www.third,
                        extraColor: '#FFEC11',
                        //textColor: gencolor.www.text,
                        textColor: '#FFEC11',
                        shape: 'star',
                        score: 8*2,
                        query: true,
                        gene: true
                    },
                    position: {
                        x: 0,
                        y: 0
                    },
                    removed: false,
                    selected: false,
                    selectable: true,
                    locked: false,
                    grabbed: false,
                    grabbable: true,
                    classes: ""
                }, {
                    group: "nodes",
                    data: {
                        group: 'www',
                        id: "h",
                        name: "localhost",
                        color: gencolor.localhost.primary,
                        textOutlineColor: gencolor.localhost.shade,
                        extraColor: gencolor.localhost.third,
                        textColor: gencolor.localhost.text,
                        shape: 'roundrectangle',
                        score: 245,
                        query: true,
                        gene: true

                    },
                    position: {
                        x: 60,
                        y: -10
                    },
                    removed: false,
                    selected: false,
                    selectable: true,
                    locked: false,
                    grabbed: false,
                    grabbable: true,
                    classes: ""
                }],
        edges: [{
                    group: "edges",
                    position: {

                    },
                    removed: false,
                    selected: false,
                    selectable: true,
                    locked: false,
                    grabbed: false,
                    grabbable: true,
                    classes: "",
                    data: {
                        group: "exit",
                        source: 'h',
                        target: 'www',
                        label: "public",
                        classes: 'autorotate',
                        opacity: 1,
                        colorPrimary: gencolor.www.primary,
                        colorShade: '#FFEC11',
                        colorText: gencolor.www.text,
                        colorTextOutline: gencolor.www.text_outline,
                        colorExtra: gencolor.www.third,
                        lineStyle: 'dashed'
                    }
                }],
        position: {
            x: 400,
            y: 100
        }
    }
  }
  );

  var params = {
    name: 'cola',
    nodeSpacing: 20,
    edgeLengthVal: 3,
    animate: true,
    randomize: false,
    maxSimulationTime: 15500
  };
  var layout = makeLayout();
  var running = false;

  cy.on('layoutstart', function(){
    running = true;
  }).on('layoutstop', function(){
    running = false;
  });

  layout.run();

  var $config = $('#config');
  var $btnParam = $('<div class="param"></div>');
  $config.append( $btnParam );

  var sliders = [
    {
      label: 'Edge length',
      param: 'edgeLengthVal',
      min: 3,
      max: 200
    },

    {
      label: 'Node spacing',
      param: 'nodeSpacing',
      min: 2,
      max: 20
    }
  ];

  var buttons = [
    {
      label: '<i class="fa fa-random randomize"></i>',
      layoutOpts: {
        randomize: true,
        flow: null
      }
    },

    {
      label: '<i class="fa fa-long-arrow-down minsep"></i>',
      layoutOpts: {
        flow: { axis: 'y', minSeparation: 10 }
      }
    }
  ];

  sliders.forEach( makeSlider );

  buttons.forEach( makeButton );

  function makeLayout( opts ){
    params.randomize = false;
    params.edgeLength = function(e){ return params.edgeLengthVal / e.data('weight'); };

    for( var i in opts ){
      params[i] = opts[i];
    }

    return cy.makeLayout( params );
  }

  function makeSlider( opts ){
    var $input = $('<input></input>');
    var $param = $('<div class="param"></div>');

    $param.append('<span class="label label-default">'+ opts.label +'</span>');
    $param.append( $input );

    $config.append( $param );

    var p = $input.slider({
      min: opts.min,
      max: opts.max,
      value: params[ opts.param ]
    }).on('slide', _.throttle( function(){
      params[ opts.param ] = p.getValue();

      layout.stop();
      layout = makeLayout();
      layout.run();
    }, 16 ) ).data('slider');
  }

  function makeButton( opts ){
    var $button = $('<button class="btn btn-default">'+ opts.label +'</button>');

    $btnParam.append( $button );

    $button.on('click', function(){
      layout.stop();

      if( opts.fn ){ opts.fn(); }

      layout = makeLayout( opts.layoutOpts );
      layout.run();
    });
  }
    doQtip();



}); // on dom ready

$(function() {
  FastClick.attach( document.body );
});
