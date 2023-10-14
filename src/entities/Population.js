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
exports.Population = void 0;
const typeorm_1 = require("typeorm");
let Population = class Population {
    idPays;
    idJoueur;
    habitant;
    enfant;
    jeune;
    adulte;
    vieux;
    popTauxDemo;
    bonheur;
    bcAcces;
    eauAcces;
    elecAcces;
    nourritureAcces;
    ancienPop;
};
exports.Population = Population;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "id_pays" }),
    __metadata("design:type", Number)
], Population.prototype, "idPays", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "id_joueur", nullable: true, length: 255 }),
    __metadata("design:type", String)
], Population.prototype, "idJoueur", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "habitant", nullable: true }),
    __metadata("design:type", Number)
], Population.prototype, "habitant", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "enfant", default: () => "'0'" }),
    __metadata("design:type", Number)
], Population.prototype, "enfant", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "jeune", nullable: true }),
    __metadata("design:type", Number)
], Population.prototype, "jeune", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "adulte", default: () => "'0'" }),
    __metadata("design:type", Number)
], Population.prototype, "adulte", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "vieux", default: () => "'0'" }),
    __metadata("design:type", Number)
], Population.prototype, "vieux", void 0);
__decorate([
    (0, typeorm_1.Column)("float", {
        name: "pop_taux_demo",
        nullable: true,
        precision: 12,
        default: () => "'1.2'",
    }),
    __metadata("design:type", Number)
], Population.prototype, "popTauxDemo", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { name: "bonheur", precision: 12, default: () => "'50'" }),
    __metadata("design:type", Number)
], Population.prototype, "bonheur", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { name: "bc_acces", precision: 12, default: () => "'1'" }),
    __metadata("design:type", Number)
], Population.prototype, "bcAcces", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { name: "eau_acces", precision: 12, default: () => "'5'" }),
    __metadata("design:type", Number)
], Population.prototype, "eauAcces", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { name: "elec_acces", precision: 12, default: () => "'48'" }),
    __metadata("design:type", Number)
], Population.prototype, "elecAcces", void 0);
__decorate([
    (0, typeorm_1.Column)("float", {
        name: "nourriture_acces",
        precision: 12,
        default: () => "'5'",
    }),
    __metadata("design:type", Number)
], Population.prototype, "nourritureAcces", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "ancien_pop", nullable: true }),
    __metadata("design:type", Number)
], Population.prototype, "ancienPop", void 0);
exports.Population = Population = __decorate([
    (0, typeorm_1.Index)("id_joueur", ["idJoueur"], {}),
    (0, typeorm_1.Entity)("population", { schema: "customer_355631_test" })
], Population);
//# sourceMappingURL=Population.js.map