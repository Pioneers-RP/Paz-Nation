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
exports.Armee = void 0;
const typeorm_1 = require("typeorm");
let Armee = class Armee {
    idPays;
    idJoueur;
    strategie;
    avion;
    equipementSupport;
    materielInfanterie;
    vehicule;
    unite;
    aviation;
    infanterie;
    mecanise;
    support;
    victoire;
    defaite;
};
exports.Armee = Armee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "id_pays" }),
    __metadata("design:type", Number)
], Armee.prototype, "idPays", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "id_joueur",
        nullable: true,
        unique: true,
        length: 255,
    }),
    __metadata("design:type", String)
], Armee.prototype, "idJoueur", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "strategie", default: () => "'defense'" }),
    __metadata("design:type", String)
], Armee.prototype, "strategie", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "avion", default: () => "'0'" }),
    __metadata("design:type", Number)
], Armee.prototype, "avion", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "equipement_support", default: () => "'0'" }),
    __metadata("design:type", Number)
], Armee.prototype, "equipementSupport", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "materiel_infanterie", default: () => "'0'" }),
    __metadata("design:type", Number)
], Armee.prototype, "materielInfanterie", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "vehicule", default: () => "'0'" }),
    __metadata("design:type", Number)
], Armee.prototype, "vehicule", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "unite", default: () => "'0'" }),
    __metadata("design:type", Number)
], Armee.prototype, "unite", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "aviation", default: () => "'0'" }),
    __metadata("design:type", Number)
], Armee.prototype, "aviation", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "infanterie", default: () => "'0'" }),
    __metadata("design:type", Number)
], Armee.prototype, "infanterie", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "mecanise", default: () => "'0'" }),
    __metadata("design:type", Number)
], Armee.prototype, "mecanise", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "support", default: () => "'0'" }),
    __metadata("design:type", Number)
], Armee.prototype, "support", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "victoire", default: () => "'0'" }),
    __metadata("design:type", Number)
], Armee.prototype, "victoire", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "defaite", default: () => "'0'" }),
    __metadata("design:type", Number)
], Armee.prototype, "defaite", void 0);
exports.Armee = Armee = __decorate([
    (0, typeorm_1.Index)("id_joueur", ["idJoueur"], { unique: true }),
    (0, typeorm_1.Entity)("armee", { schema: "customer_355631_test" })
], Armee);
//# sourceMappingURL=Armee.js.map