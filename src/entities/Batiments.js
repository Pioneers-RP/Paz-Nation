"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Batiments = void 0;
const typeorm_1 = require("typeorm");
let Batiments = class Batiments {
    idPays;
    idJoueur;
    dejaProd;
    usineTotal;
    acierie;
    atelierVerre;
    carriereSable;
    centraleBiomasse;
    centraleCharbon;
    centraleFioul;
    champ;
    cimenterie;
    derrick;
    eolienne;
    mineCharbon;
    mineMetaux;
    stationPompage;
    quartier;
    raffinerie;
    scierie;
    usineCivile;
};
exports.Batiments = Batiments;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "id_pays" }),
    __metadata("design:type", Number)
], Batiments.prototype, "idPays", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "id_joueur", nullable: true, length: 255 }),
    __metadata("design:type", String)
], Batiments.prototype, "idJoueur", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "deja_prod", default: () => "'1'" }),
    __metadata("design:type", Number)
], Batiments.prototype, "dejaProd", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "usine_total", default: () => "'20'" }),
    __metadata("design:type", Number)
], Batiments.prototype, "usineTotal", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "acierie", default: () => "'0'" }),
    __metadata("design:type", Number)
], Batiments.prototype, "acierie", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "atelier_verre", default: () => "'0'" }),
    __metadata("design:type", Number)
], Batiments.prototype, "atelierVerre", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "carriere_sable", default: () => "'1'" }),
    __metadata("design:type", Number)
], Batiments.prototype, "carriereSable", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "centrale_biomasse", default: () => "'0'" }),
    __metadata("design:type", Number)
], Batiments.prototype, "centraleBiomasse", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "centrale_charbon", default: () => "'0'" }),
    __metadata("design:type", Number)
], Batiments.prototype, "centraleCharbon", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "centrale_fioul", default: () => "'1'" }),
    __metadata("design:type", Number)
], Batiments.prototype, "centraleFioul", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "champ", default: () => "'6'" }),
    __metadata("design:type", Number)
], Batiments.prototype, "champ", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "cimenterie", default: () => "'0'" }),
    __metadata("design:type", Number)
], Batiments.prototype, "cimenterie", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "derrick", default: () => "'2'" }),
    __metadata("design:type", Number)
], Batiments.prototype, "derrick", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "eolienne", default: () => "'6'" }),
    __metadata("design:type", Number)
], Batiments.prototype, "eolienne", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "mine_charbon", default: () => "'1'" }),
    __metadata("design:type", Number)
], Batiments.prototype, "mineCharbon", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "mine_metaux", default: () => "'1'" }),
    __metadata("design:type", Number)
], Batiments.prototype, "mineMetaux", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "station_pompage", default: () => "'5'" }),
    __metadata("design:type", Number)
], Batiments.prototype, "stationPompage", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "quartier", default: () => "'35'" }),
    __metadata("design:type", Number)
], Batiments.prototype, "quartier", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "raffinerie", default: () => "'0'" }),
    __metadata("design:type", Number)
], Batiments.prototype, "raffinerie", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "scierie", default: () => "'2'" }),
    __metadata("design:type", Number)
], Batiments.prototype, "scierie", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "usine_civile", default: () => "'0'" }),
    __metadata("design:type", Number)
], Batiments.prototype, "usineCivile", void 0);
exports.Batiments = Batiments = __decorate([
    (0, typeorm_1.Index)("id_joueur", ["idJoueur"], {}),
    (0, typeorm_1.Entity)("batiments", { schema: "customer_355631_test" })
], Batiments);
//# sourceMappingURL=Batiments.js.map