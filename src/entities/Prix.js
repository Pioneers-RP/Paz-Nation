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
exports.Prix = void 0;
const typeorm_1 = require("typeorm");
let Prix = class Prix {
    acier;
    beton;
    bc;
    bois;
    carburant;
    charbon;
    eau;
    metaux;
    nourriture;
    petrole;
    sable;
    verre;
};
exports.Prix = Prix;
__decorate([
    (0, typeorm_1.Column)("float", { name: "acier", nullable: true, precision: 12 }),
    __metadata("design:type", Number)
], Prix.prototype, "acier", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { name: "beton", nullable: true, precision: 12 }),
    __metadata("design:type", Number)
], Prix.prototype, "beton", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { name: "bc", nullable: true, precision: 12 }),
    __metadata("design:type", Number)
], Prix.prototype, "bc", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { name: "bois", nullable: true, precision: 12 }),
    __metadata("design:type", Number)
], Prix.prototype, "bois", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { name: "carburant", nullable: true, precision: 12 }),
    __metadata("design:type", Number)
], Prix.prototype, "carburant", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { name: "charbon", nullable: true, precision: 12 }),
    __metadata("design:type", Number)
], Prix.prototype, "charbon", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { name: "eau", nullable: true, precision: 12 }),
    __metadata("design:type", Number)
], Prix.prototype, "eau", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { name: "metaux", nullable: true, precision: 12 }),
    __metadata("design:type", Number)
], Prix.prototype, "metaux", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { name: "nourriture", nullable: true, precision: 12 }),
    __metadata("design:type", Number)
], Prix.prototype, "nourriture", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { name: "petrole", nullable: true, precision: 12 }),
    __metadata("design:type", Number)
], Prix.prototype, "petrole", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { name: "sable", nullable: true, precision: 12 }),
    __metadata("design:type", Number)
], Prix.prototype, "sable", void 0);
__decorate([
    (0, typeorm_1.Column)("float", { name: "verre", nullable: true, precision: 12 }),
    __metadata("design:type", Number)
], Prix.prototype, "verre", void 0);
exports.Prix = Prix = __decorate([
    (0, typeorm_1.Entity)("prix", { schema: "customer_355631_test" })
], Prix);
//# sourceMappingURL=Prix.js.map