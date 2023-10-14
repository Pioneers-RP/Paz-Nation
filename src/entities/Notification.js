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
exports.Notification = void 0;
const typeorm_1 = require("typeorm");
let Notification = class Notification {
    idPays;
    idJoueur;
    famine;
    usine;
    trade;
    explorateur;
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "id_pays" }),
    __metadata("design:type", Number)
], Notification.prototype, "idPays", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "id_joueur", nullable: true }),
    __metadata("design:type", Number)
], Notification.prototype, "idJoueur", void 0);
__decorate([
    (0, typeorm_1.Column)("tinyint", { name: "famine", width: 1, default: () => "'1'" }),
    __metadata("design:type", Boolean)
], Notification.prototype, "famine", void 0);
__decorate([
    (0, typeorm_1.Column)("tinyint", { name: "usine", width: 1, default: () => "'1'" }),
    __metadata("design:type", Boolean)
], Notification.prototype, "usine", void 0);
__decorate([
    (0, typeorm_1.Column)("tinyint", { name: "trade", width: 1, default: () => "'1'" }),
    __metadata("design:type", Boolean)
], Notification.prototype, "trade", void 0);
__decorate([
    (0, typeorm_1.Column)("tinyint", { name: "explorateur", width: 1, default: () => "'1'" }),
    __metadata("design:type", Boolean)
], Notification.prototype, "explorateur", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Index)("id_joueur", ["idJoueur"], {}),
    (0, typeorm_1.Entity)("notification", { schema: "customer_355631_test" })
], Notification);
//# sourceMappingURL=Notification.js.map