import { Column, Entity } from "typeorm";

@Entity("prix", { schema: "customer_355631_test" })
export class Prix {
  @Column("float", { name: "acier", nullable: true, precision: 12 })
  acier: number | null;

  @Column("float", { name: "beton", nullable: true, precision: 12 })
  beton: number | null;

  @Column("float", { name: "bc", nullable: true, precision: 12 })
  bc: number | null;

  @Column("float", { name: "bois", nullable: true, precision: 12 })
  bois: number | null;

  @Column("float", { name: "carburant", nullable: true, precision: 12 })
  carburant: number | null;

  @Column("float", { name: "charbon", nullable: true, precision: 12 })
  charbon: number | null;

  @Column("float", { name: "eau", nullable: true, precision: 12 })
  eau: number | null;

  @Column("float", { name: "metaux", nullable: true, precision: 12 })
  metaux: number | null;

  @Column("float", { name: "nourriture", nullable: true, precision: 12 })
  nourriture: number | null;

  @Column("float", { name: "petrole", nullable: true, precision: 12 })
  petrole: number | null;

  @Column("float", { name: "sable", nullable: true, precision: 12 })
  sable: number | null;

  @Column("float", { name: "verre", nullable: true, precision: 12 })
  verre: number | null;
}
