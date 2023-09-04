function pallier(sup, inf) {
    const p = (sup-inf)/inf*100;
    if (p < 10) {
        return 0;
    } else if (p < 15) {
        return 10;
    } else if (p < 20) {
        return 20;
    } else if (p < 25) {
        return 30;
    } else if (p < 30) {
        return 40;
    } else if (p < 40) {
        return 50;
    } else {
        return 60;
    }
}

console.log(pallier(100, 75));