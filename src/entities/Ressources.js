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
exports.Ressources = void 0;
const typeorm_1 = require("typeorm");
let Ressources = class Ressources {
    idPays;
    idJoueur;
    acier;
    beton;
    bc;
    bois;
    carburant;
    charbon;
    eau;
    eolienne;
    metaux;
    nourriture;
    petrole;
    sable;
    verre;
};
exports.Ressources = Ressources;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "id_pays" }),
    __metadata("design:type", Number)
], Ressources.prototype, "idPays", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "id_joueur", nullable: true, length: 255 }),
    __metadata("design:type", String)
], Ressources.prototype, "idJoueur", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "acier", default: () => "'18000'" }),
    __metadata("design:type", Number)
], Ressources.prototype, "acier", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "beton", default: () => "'4000'" }),
    __metadata("design:type", Number)
], Ressources.prototype, "beton", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "bc", default: () => "'160000'" }),
    __metadata("design:type", Number)
], Ressources.prototype, "bc", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "bois", default: () => "'10000'" }),
    __metadata("design:type", Number)
], Ressources.prototype, "bois", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "carburant", default: () => "'3000000'" }),
    __metadata("design:type", Number)
], Ressources.prototype, "carburant", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "charbon", default: () => "'60000'" }),
    __metadata("design:type", Number)
], Ressources.prototype, "charbon", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "eau", default: () => "'5000000'" }),
    __metadata("design:type", Number)
], Ressources.prototype, "eau", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "eolienne", default: () => "'79'" }),
    __metadata("design:type", Number)
], Ressources.prototype, "eolienne", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "metaux", default: () => "'120000'" }),
    __metadata("design:type", Number)
], Ressources.prototype, "metaux", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "nourriture", default: () => "'2700000'" }),
    __metadata("design:type", Number)
], Ressources.prototype, "nourriture", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "petrole", default: () => "'170000'" }),
    __metadata("design:type", Number)
], Ressources.prototype, "petrole", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "sable", default: () => "'60000'" }),
    __metadata("design:type", Number)
], Ressources.prototype, "sable", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "verre", default: () => "'18000'" }),
    __metadata("design:type", Number)
], Ressources.prototype, "verre", void 0);
exports.Ressources = Ressources = __decorate([
    (0, typeorm_1.Entity)("ressources", { schema: "customer_355631_test" })
], Ressources);
//# sourceMappingURL=Ressources.js.map