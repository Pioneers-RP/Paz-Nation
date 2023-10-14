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
exports.Qvente = void 0;
const typeorm_1 = require("typeorm");
let Qvente = class Qvente {
    idVente;
    idJoueur;
    idSalon;
    ressource;
    quantite;
    prix;
    prixU;
};
exports.Qvente = Qvente;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "id_vente" }),
    __metadata("design:type", Number)
], Qvente.prototype, "idVente", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "id_joueur", nullable: true, length: 255 }),
    __metadata("design:type", String)
], Qvente.prototype, "idJoueur", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "id_salon", nullable: true, length: 255 }),
    __metadata("design:type", String)
], Qvente.prototype, "idSalon", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "ressource", nullable: true, length: 30 }),
    __metadata("design:type", String)
], Qvente.prototype, "ressource", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { name: "quantite", nullable: true }),
    __metadata("design:type", String)
], Qvente.prototype, "quantite", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { name: "prix", nullable: true }),
    __metadata("design:type", String)
], Qvente.prototype, "prix", void 0);
__decorate([
    (0, typeorm_1.Column)("float", {
        name: "prix_u",
        nullable: true,
        comment: "prix à l'unité",
        precision: 12,
    }),
    __metadata("design:type", Number)
], Qvente.prototype, "prixU", void 0);
exports.Qvente = Qvente = __decorate([
    (0, typeorm_1.Index)("id_joueur", ["idJoueur"], {}),
    (0, typeorm_1.Entity)("qvente", { schema: "customer_355631_test" })
], Qvente);
//# sourceMappingURL=Qvente.js.map