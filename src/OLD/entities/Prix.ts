import {BaseEntity, Column, Entity} from "typeorm";

@Entity("prix", { schema: "customer_355631_test" })
export class Prix extends BaseEntity {
  @Column("float", { name: "acier", nullable: true, precision: 12 })
  acier: number | null = null;

  @Column("float", { name: "beton", nullable: true, precision: 12 })
  beton: number | null = null;

  @Column("float", { name: "bc", nullable: true, precision: 12 })
  bc: number | null = null;

  @Column("float", { name: "bois", nullable: true, precision: 12 })
  bois: number | null = null;

  @Column("float", { name: "carburant", nullable: true, precision: 12 })
  carburant: number | null = null;

  @Column("float", { name: "charbon", nullable: true, precision: 12 })
  charbon: number | null = null;

  @Column("float", { name: "eau", nullable: true, precision: 12 })
  eau: number | null = null;

  @Column("float", { name: "metaux", nullable: true, precision: 12 })
  metaux: number | null = null;

  @Column("float", { name: "nourriture", nullable: true, precision: 12 })
  nourriture: number | null = null;

  @Column("float", { name: "petrole", nullable: true, precision: 12 })
  petrole: number | null = null;

  @Column("float", { name: "sable", nullable: true, precision: 12 })
  sable: number | null = null;

  @Column("float", { name: "verre", nullable: true, precision: 12 })
  verre: number | null = null;
}
