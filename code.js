var texte = "```\n• A l'unité : 1.20\n• Au total : 14,814```​";

var espace2 = texte.indexOf("Au");
var prix_u = texte.slice((texte.indexOf(":") + 2), (texte.indexOf("Au") - 3));

console.log(espace2 + ` | ` + prix_u + `| `)