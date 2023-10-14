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
exports.Territoire = void 0;
const typeorm_1 = require("typeorm");
let Territoire = class Territoire {
    idPays;
    idJoueur;
    region;
    tTotal;
    tLibre;
    tOcc;
    cg;
    tNational;
    tControle;
    hexagone;
    desert;
    foret;
    jungle;
    lac;
    mangrove;
    prairie;
    rocheuses;
    savane;
    steppe;
    taiga;
    toundra;
    ville;
    volcan;
};
exports.Territoire = Territoire;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "id_pays" }),
    __metadata("design:type", Number)
], Territoire.prototype, "idPays", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "id_joueur", nullable: true, length: 255 }),
    __metadata("design:type", String)
], Territoire.prototype, "idJoueur", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "region", nullable: true, length: 255 }),
    __metadata("design:type", String)
], Territoire.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "T_total", nullable: true }),
    __metadata("design:type", Number)
], Territoire.prototype, "tTotal", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "T_libre", nullable: true }),
    __metadata("design:type", Number)
], Territoire.prototype, "tLibre", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "T_occ", nullable: true }),
    __metadata("design:type", Number)
], Territoire.prototype, "tOcc", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", {
        name: "cg",
        precision: 65,
        scale: 2,
        default: () => "'79.05'",
    }),
    __metadata("design:type", String)
], Territoire.prototype, "cg", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "T_national", default: () => "'16000'" }),
    __metadata("design:type", Number)
], Territoire.prototype, "tNational", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "T_controle", default: () => "'0'" }),
    __metadata("design:type", Number)
], Territoire.prototype, "tControle", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "hexagone", default: () => "'1'" }),
    __metadata("design:type", Number)
], Territoire.prototype, "hexagone", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "desert", nullable: true }),
    __metadata("design:type", Number)
], Territoire.prototype, "desert", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "foret", nullable: true }),
    __metadata("design:type", Number)
], Territoire.prototype, "foret", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "jungle", nullable: true }),
    __metadata("design:type", Number)
], Territoire.prototype, "jungle", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "lac", nullable: true }),
    __metadata("design:type", Number)
], Territoire.prototype, "lac", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "mangrove", nullable: true }),
    __metadata("design:type", Number)
], Territoire.prototype, "mangrove", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "prairie", nullable: true }),
    __metadata("design:type", Number)
], Territoire.prototype, "prairie", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "rocheuses", nullable: true }),
    __metadata("design:type", Number)
], Territoire.prototype, "rocheuses", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "savane", nullable: true }),
    __metadata("design:type", Number)
], Territoire.prototype, "savane", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "steppe", nullable: true }),
    __metadata("design:type", Number)
], Territoire.prototype, "steppe", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "taiga", nullable: true }),
    __metadata("design:type", Number)
], Territoire.prototype, "taiga", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "toundra", nullable: true }),
    __metadata("design:type", Number)
], Territoire.prototype, "toundra", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "ville", nullable: true }),
    __metadata("design:type", Number)
], Territoire.prototype, "ville", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "volcan", nullable: true }),
    __metadata("design:type", Number)
], Territoire.prototype, "volcan", void 0);
exports.Territoire = Territoire = __decorate([
    (0, typeorm_1.Entity)("territoire", { schema: "customer_355631_test" })
], Territoire);
//# sourceMappingURL=Territoire.js.map