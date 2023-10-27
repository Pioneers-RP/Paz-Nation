import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ressources", { schema: "customer_355631_test" })
export class Ressources {
  @PrimaryGeneratedColumn({ type: "int", name: "id_pays" })
  idPays: number | null;

  @Column("varchar", { name: "id_joueur", nullable: true, length: 255 })
  idJoueur: string | null;

  @Column("int", { name: "acier", default: () => "'18000'" })
  acier: number;

  @Column("int", { name: "beton", default: () => "'4000'" })
  beton: number;

  @Column("int", { name: "bc", default: () => "'160000'" })
  bc: number;

  @Column("int", { name: "bois", default: () => "'10000'" })
  bois: number;

  @Column("int", { name: "carburant", default: () => "'3000000'" })
  carburant: number;

  @Column("int", { name: "charbon", default: () => "'60000'" })
  charbon: number;

  @Column("int", { name: "eau", default: () => "'5000000'" })
  eau: number;

  @Column("int", { name: "eolienne", default: () => "'79'" })
  eolienne: number;

  @Column("int", { name: "metaux", default: () => "'120000'" })
  metaux: number;

  @Column("int", { name: "nourriture", default: () => "'2700000'" })
  nourriture: number;

  @Column("int", { name: "petrole", default: () => "'170000'" })
  petrole: number;

  @Column("int", { name: "sable", default: () => "'60000'" })
  sable: number;

  @Column("int", { name: "verre", default: () => "'18000'" })
  verre: number;

  constructor() {
    this.idPays = null;
    this.idJoueur = null;
    this.acier = 0;
    this.beton = 0;
    this.bc = 0;
    this.bois = 0;
    this.carburant = 0;
    this.charbon = 0;
    this.eau = 0;
    this.eolienne = 0;
    this.metaux = 0;
    this.nourriture = 0;
    this.petrole = 0;
    this.sable = 0;
    this.verre = 0;
  }
}
