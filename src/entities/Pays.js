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
exports.Pays = void 0;
const typeorm_1 = require("typeorm");
let Pays = class Pays {
    idPays;
    idJoueur;
    nom;
    idSalon;
    drapeau;
    avatarUrl;
    devise;
    regime;
    ideologie;
    rang;
    cash;
    actionDiplo;
    reputation;
    prestige;
    pweeter;
    jour;
    daily;
    vacances;
};
exports.Pays = Pays;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "id_pays" }),
    __metadata("design:type", Number)
], Pays.prototype, "idPays", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "id_joueur",
        nullable: true,
        unique: true,
        comment: "ID discord du joueur",
        length: 255,
    }),
    __metadata("design:type", String)
], Pays.prototype, "idJoueur", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "nom", nullable: true, length: 60 }),
    __metadata("design:type", String)
], Pays.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "id_salon", nullable: true, length: 255 }),
    __metadata("design:type", String)
], Pays.prototype, "idSalon", void 0);
__decorate([
    (0, typeorm_1.Column)("longtext", { name: "drapeau", nullable: true }),
    __metadata("design:type", String)
], Pays.prototype, "drapeau", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "avatarURL", nullable: true, length: 244 }),
    __metadata("design:type", String)
], Pays.prototype, "avatarUrl", void 0);
__decorate([
    (0, typeorm_1.Column)("tinytext", {
        name: "devise",
        nullable: true,
        default: () => "'Gloire à Paz Nation !'",
    }),
    __metadata("design:type", String)
], Pays.prototype, "devise", void 0);
__decorate([
    (0, typeorm_1.Column)("text", {
        name: "regime",
        nullable: true,
        default: () => "'Principauté'",
    }),
    __metadata("design:type", String)
], Pays.prototype, "regime", void 0);
__decorate([
    (0, typeorm_1.Column)("text", {
        name: "ideologie",
        nullable: true,
        default: () => "'Centrisme'",
    }),
    __metadata("design:type", String)
], Pays.prototype, "ideologie", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "rang", default: () => "'Cité'" }),
    __metadata("design:type", String)
], Pays.prototype, "rang", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { name: "cash", nullable: true }),
    __metadata("design:type", String)
], Pays.prototype, "cash", void 0);
__decorate([
    (0, typeorm_1.Column)("int", {
        name: "action_diplo",
        nullable: true,
        default: () => "'100'",
    }),
    __metadata("design:type", Number)
], Pays.prototype, "actionDiplo", void 0);
__decorate([
    (0, typeorm_1.Column)("float", {
        name: "reputation",
        nullable: true,
        precision: 12,
        default: () => "'30'",
    }),
    __metadata("design:type", Number)
], Pays.prototype, "reputation", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "prestige", nullable: true, default: () => "'1'" }),
    __metadata("design:type", Number)
], Pays.prototype, "prestige", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "pweeter", nullable: true, length: 244 }),
    __metadata("design:type", String)
], Pays.prototype, "pweeter", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "jour", default: () => "'1'" }),
    __metadata("design:type", Number)
], Pays.prototype, "jour", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "daily", default: () => "'1'" }),
    __metadata("design:type", Number)
], Pays.prototype, "daily", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "vacances", nullable: true, default: () => "'0'" }),
    __metadata("design:type", Number)
], Pays.prototype, "vacances", void 0);
exports.Pays = Pays = __decorate([
    (0, typeorm_1.Index)("id_joueur", ["idJoueur"], { unique: true }),
    (0, typeorm_1.Entity)("pays", { schema: "customer_355631_test" })
], Pays);
//# sourceMappingURL=Pays.js.map