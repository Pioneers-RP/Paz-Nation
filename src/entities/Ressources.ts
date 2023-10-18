import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ressources", { schema: "customer_355631_test" })
export class Ressources {
  @PrimaryGeneratedColumn({ type: "int", name: "id_pays" })
  idPays: number | null = null;

  @Column("varchar", { name: "id_joueur", nullable: true, length: 255 })
  idJoueur: string | null = null;

  @Column("int", { name: "acier", default: () => "'18000'" })
  acier: number | null = null;

  @Column("int", { name: "beton", default: () => "'4000'" })
  beton: number | null = null;

  @Column("int", { name: "bc", default: () => "'160000'" })
  bc: number | null = null;

  @Column("int", { name: "bois", default: () => "'10000'" })
  bois: number | null = null;

  @Column("int", { name: "carburant", default: () => "'3000000'" })
  carburant: number | null = null;

  @Column("int", { name: "charbon", default: () => "'60000'" })
  charbon: number | null = null;

  @Column("int", { name: "eau", default: () => "'5000000'" })
  eau: number | null = null;

  @Column("int", { name: "eolienne", default: () => "'79'" })
  eolienne: number | null = null;

  @Column("int", { name: "metaux", default: () => "'120000'" })
  metaux: number | null = null;

  @Column("int", { name: "nourriture", default: () => "'2700000'" })
  nourriture: number | null = null;

  @Column("int", { name: "petrole", default: () => "'170000'" })
  petrole: number | null = null;

  @Column("int", { name: "sable", default: () => "'60000'" })
  sable: number | null = null;

  @Column("int", { name: "verre", default: () => "'18000'" })
  verre: number | null = null;
}
