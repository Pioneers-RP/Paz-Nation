const { readFileSync } = require('fs');
const gouvernementObject = JSON.parse(readFileSync('data/gouvernement.json', 'utf-8'));
const batimentObject = JSON.parse(readFileSync('data/batiment.json', 'utf-8'));
const populationObject = JSON.parse(readFileSync('data/population.json', 'utf-8'));

const nourriture_acces = 6 * 1.7;
//console.log(nourriture_acces)

const eau_acces = 3 * 2.1;
//console.log(eau_acces)
const elec_acces = 100 * (0.8 / (6 * 8));

const bc_acces = 4 * 1.45;
//console.log(bc_acces)

var tauxbcmadein = (batimentObject.usine_civile.PROD_USINE_CIVILE * 10 * eval(`gouvernementObject.Centrisme.production`)) / (100000 * 9 * 0.5);
if (tauxbcmadein > 0.8) {
    var tauxbcmadein = 0.8;
}
var tauxbcmadein = tauxbcmadein * 29
//console.log(tauxbcmadein)

const place = (100 * 1500)
var sans_abri = (100000 - place)
if (sans_abri < 0) {
    var sans_abri = 0
}
const pourcentage_sans_abri = (sans_abri / 100000)
const sdf = (1 - pourcentage_sans_abri) * 18;
//console.log(sdf)

const modifier = parseFloat(populationObject.BONHEUR_BASE) + nourriture_acces + eau_acces + elec_acces + bc_acces + tauxbcmadein + sdf + eval(`gouvernementObject.Centrisme.bonheur`);
const bonheur = parseFloat(((-92 * Math.exp(-0.02 * modifier)) + 100).toFixed(1));
console.log(bonheur)