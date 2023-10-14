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
exports.Processus = void 0;
const typeorm_1 = require("typeorm");
let Processus = class Processus {
    idProcessus;
    idJoueur;
    date;
    type;
    option1;
    option2;
};
exports.Processus = Processus;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "id_processus" }),
    __metadata("design:type", Number)
], Processus.prototype, "idProcessus", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "id_joueur", nullable: true, length: 255 }),
    __metadata("design:type", String)
], Processus.prototype, "idJoueur", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp", { name: "date", nullable: true }),
    __metadata("design:type", Date)
], Processus.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "type", nullable: true }),
    __metadata("design:type", String)
], Processus.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "option1", nullable: true }),
    __metadata("design:type", String)
], Processus.prototype, "option1", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "option2", nullable: true }),
    __metadata("design:type", Number)
], Processus.prototype, "option2", void 0);
exports.Processus = Processus = __decorate([
    (0, typeorm_1.Index)("id_joueur", ["idJoueur"], {}),
    (0, typeorm_1.Index)("id_joueur_2", ["idJoueur"], {}),
    (0, typeorm_1.Entity)("processus", { schema: "customer_355631_test" })
], Processus);
//# sourceMappingURL=Processus.js.map