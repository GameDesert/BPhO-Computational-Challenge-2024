// Create the data array for plotly.js

function y(x, theta, ux, g, h) {
    let y = Math.tan(theta) * x - (g / (2 * Math.pow(ux, 2))) * Math.pow(x, 2) + h;

    return y;
}

function T(uy, h, g) {
    const a = -g / (2 * uy);
    const b = uy;
    const c = h;

    const discriminant = Math.pow(b, 2) - 4 * a * c;

    if (discriminant >= 0) {
        const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);

        return Math.max(t1, t2);
    } else {
        return NaN; // No real solutions, return NaN
    }
}

function apogee(ux, uy, h, g) {
    tmax = uy / g;

    apogee_calc = uy * tmax - 0.5 * g * Math.pow(tmax, 2) + h;

    const x_apogee = ux * tmax;
    return [apogee_calc, x_apogee];
}

function projectile(u = 10, theta = 45, g = 9.8, h = 10, delta_t = 0.05) {
    theta = theta * Math.PI / 180; // convert to radians
    const ux = u * Math.cos(theta);
    const uy = u * Math.sin(theta);

    console.log(uy);

    const x_values = [];
    const y_values = [];

    const R = T(uy, theta, h, g) * ux;

    console.log(R);

    for (let x = 0; x <= R; x += delta_t) {
        x_values.push(x);
        let y_coord = y(x, theta, ux, g, h);
        y_values.push(y_coord);
        console.log(x);
        if (y_coord <= 0) {
            break;
        };
    };


    return [x_values, y_values, apogee(ux, uy, h, g)];
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

    var apogee = {
        x: [vals[2][1]],
        y: [vals[2][0]],
        mode: 'markers',
        type: 'scatter',
        marker: {color: "#FF0000"}
    };

    console.log(vals);

    trace.x = vals[0];
    trace.y = vals[1];

    var data = [trace, apogee];
    // Plotly.newPlot("graph", data, layout);

    let newlayout = Object.assign({}, layout);
    clearInterval(interval); // Stop the original trace extension

    // Plotly.purge('graph'); // Clear the graph

    Plotly.react('graph', [{
        x: [0],
        y: [h],
        mode: 'lines',
        type: 'scatter',
        name: 'Trajectory',
        line: {color: "#665748"}
    },
    {
        x: [vals[2][1]],
        y: [vals[2][0]],
        mode: 'markers',
        type: 'scatter',
        name: 'Apogee',
        marker: {color: "#FF0000"}
    }], newlayout);

    var i = 0;
    
    interval = setInterval(function() {
        var newX = [trace.x[i]];
        var newY = [trace.y[i]];

        Plotly.extendTraces('graph', { x: [newX], y: [newY] }, [0]);

        i++;

        // Stop adding new points after reaching the end of the arrays
        if (i >= trace.x.length) {
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

    plot(u, theta, g, h, 0.05);
}

window.onload = function() {
    plotfrominputs();
};