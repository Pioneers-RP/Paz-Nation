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
exports.Diplomatie = void 0;
const typeorm_1 = require("typeorm");
let Diplomatie = class Diplomatie {
    idPays;
    idJoueur;
    influence;
    ambassade;
};
exports.Diplomatie = Diplomatie;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "id_pays" }),
    __metadata("design:type", Number)
], Diplomatie.prototype, "idPays", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "id_joueur", nullable: true, length: 255 }),
    __metadata("design:type", String)
], Diplomatie.prototype, "idJoueur", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "influence", default: () => "'7'" }),
    __metadata("design:type", Number)
], Diplomatie.prototype, "influence", void 0);
__decorate([
    (0, typeorm_1.Column)("longtext", { name: "ambassade", default: () => "'[]'" }),
    __metadata("design:type", String)
], Diplomatie.prototype, "ambassade", void 0);
exports.Diplomatie = Diplomatie = __decorate([
    (0, typeorm_1.Index)("id_joueur", ["idJoueur"], {}),
    (0, typeorm_1.Entity)("diplomatie", { schema: "customer_355631_test" })
], Diplomatie);
//# sourceMappingURL=Diplomatie.js.map