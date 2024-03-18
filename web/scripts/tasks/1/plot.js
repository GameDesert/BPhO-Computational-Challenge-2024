// Create the data array for plotly.js

function projectile(u = 10, theta = 45, g = 9.8, h = 10, delta_t = 0.01) {
    theta = theta * Math.PI / 180; // convert to radians
    const ux = u * Math.cos(theta);
    const uy = u * Math.sin(theta);
    const tof = (2 * uy) / g;
    const range = (ux * tof) + h;
    const max_height = h + ((uy ** 2) / (2 * g));

    x_values = [];
    y_values = [];

    const increment = delta_t;
    let t = 0;
    while (true) {
        const x = ux * t;
        x_values.push(x);
        const y = h + ((uy * t) - (0.5 * g * (t ** 2)));
        console.log(y);


        if ((y <= 0) && (t != 0)) {
            y_values.push(y); // Change y to 0 when needed (to stop line extending through ground)
            break;
        } else {
            y_values.push(y);
        }
        t += increment;
    }

    const lastXValue = x_values[x_values.length - 1];
    return [x_values, y_values, lastXValue, max_height, tof];
}

const layout = {

    paper_bgcolor: '#fff',

    plot_bgcolor: '#fff',

    title: {
        text: 'Drag-Free Projectile Trajectory',
        font: {
            family: 'Source Serif Pro, serif',
            size: 24
        }
    },
    xaxis: {
        title: {
            text: 'Horizontal Distance (m)',
            font: {
                family: 'Source Serif Pro, serif',
                size: 16
            }
        },
    },
    yaxis: {
        title: {
            text: 'Vertical Distance (m)',
            font: {
                family: 'Source Serif Pro, serif',
                size: 16
            }
        }
    },
};

var trace = {
    x: [],
    y: [],
    mode: 'lines',
    type: 'scatter',
    line: {color: "#000000"}
};

var vals = projectile();

console.log(vals);

trace.x = vals[0];
trace.y = vals[1];

var data = [trace];

var plotting = false;

Plotly.newPlot("graph", data, layout);

var interval;

function plot(u, theta, g, h, delta_t) {
    var trace = {
        x: [],
        y: [],
        mode: 'lines',
        type: 'scatter'
    };

    var vals = projectile(u, theta, g, h, delta_t);

    console.log(vals);

    trace.x = vals[0];
    trace.y = vals[1];

    var data = [trace];
    // Plotly.newPlot("graph", data, layout);

    let newlayout = Object.assign({}, layout);

    newlayout.xaxis.range = [0, vals[2]];
    clearInterval(interval); // Stop the original trace extension

    // Plotly.purge('graph'); // Clear the graph

    newlayout.yaxis.range = [0, vals[3]+1];

    Plotly.react('graph', [{
        x: [0],
        y: [h],
        mode: 'lines',
        type: 'scatter',
        line: {color: "#665748"}
    }], newlayout);

    var i = 0;
    
    interval = setInterval(function() {
        var newX = [trace.x[i]];
        var newY = [trace.y[i]];

        Plotly.extendTraces('graph', { x: [newX], y: [newY] }, [0]);

        i++;

        

        // Stop adding new points after reaching the end of the arrays
        if(i >= trace.x.length) {
            clearInterval(interval);
        }
    }, 0.1);

    
}

document.getElementById("u").onchange = function() {
    if (document.getElementById("autoredraw").checked) {
        plotfrominputs();
    }
};

document.getElementById("theta").onchange = function() {
    if (document.getElementById("autoredraw").checked) {
        plotfrominputs();
    }
};

document.getElementById("g").onchange = function() {
    if (document.getElementById("autoredraw").checked) {
        plotfrominputs();
    }
};

document.getElementById("h").onchange = function() {
    if (document.getElementById("autoredraw").checked) {
        plotfrominputs();
    }
};

function plotfrominputs() {
    var u = parseFloat(document.getElementById("u").value);
    var theta = parseFloat(document.getElementById("theta").value);
    var g = parseFloat(document.getElementById("g").value);
    var h = parseFloat(document.getElementById("h").value);

    plot(u, theta, g, h, 0.01);
}

window.onload = function() {
    plotfrominputs();
};