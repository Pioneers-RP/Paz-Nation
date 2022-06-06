/*

* Plus le niveau de réputation est élevé, plus le coefficient multiplicateur sera élevé (en gros plus x sera élevé). 

*/


var niveau_reputation = 40; // par exemple

if (niveau_reputation > 50) {
    function f(x) {
        return Math.round(20 * Math.log(x) + 30);
    }
}

if (niveau_reputation <= 50) {
    function g(x) { // g(x) équivaut à f(x) <= 50
        return Math.round(-20 * Math.log(x) + 70);
    }
}


// trouver x (pour f(x) > 50)

if (niveau_reputation > 50) {
    var x = niveau_reputation - 20;
    x /= 20;
    x = Math.exp(x);
    x = Math.round(x);
    console.log(x);
    console.log(niveau_reputation / (x * x))
    console.log((niveau_reputation + (niveau_reputation / (x * x))).toFixed(2))
}

// trouver x (pour f(x) <= 50)

if (niveau_reputation <= 50) {
    var x = niveau_reputation - 80;
    x /= -20;
    x = Math.exp(x);
    x = Math.round(x);
    console.log(x);
    console.log(niveau_reputation / (x * x))
    console.log((niveau_reputation + (niveau_reputation / (x * x))).toFixed(2))
}