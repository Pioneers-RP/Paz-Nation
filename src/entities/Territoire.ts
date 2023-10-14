import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("territoire", { schema: "customer_355631_test" })
export class Territoire {
  @PrimaryGeneratedColumn({ type: "int", name: "id_pays" })
  idPays: number;

  @Column("varchar", { name: "id_joueur", nullable: true, length: 255 })
  idJoueur: string | null;

  @Column("varchar", { name: "region", nullable: true, length: 255 })
  region: string | null;

  @Column("int", { name: "T_total", nullable: true })
  tTotal: number | null;

  @Column("int", { name: "T_libre", nullable: true })
  tLibre: number | null;

  @Column("int", { name: "T_occ", nullable: true })
  tOcc: number | null;

  @Column("decimal", {
    name: "cg",
    precision: 65,
    scale: 2,
    default: () => "'79.05'",
  })
  cg: string;

  @Column("int", { name: "T_national", default: () => "'16000'" })
  tNational: number;

  @Column("int", { name: "T_controle", default: () => "'0'" })
  tControle: number;

  @Column("int", { name: "hexagone", default: () => "'1'" })
  hexagone: number;

  @Column("int", { name: "desert", nullable: true })
  desert: number | null;

  @Column("int", { name: "foret", nullable: true })
  foret: number | null;

  @Column("int", { name: "jungle", nullable: true })
  jungle: number | null;

  @Column("int", { name: "lac", nullable: true })
  lac: number | null;

  @Column("int", { name: "mangrove", nullable: true })
  mangrove: number | null;

  @Column("int", { name: "prairie", nullable: true })
  prairie: number | null;

  @Column("int", { name: "rocheuses", nullable: true })
  rocheuses: number | null;

  @Column("int", { name: "savane", nullable: true })
  savane: number | null;

  @Column("int", { name: "steppe", nullable: true })
  steppe: number | null;

  @Column("int", { name: "taiga", nullable: true })
  taiga: number | null;

  @Column("int", { name: "toundra", nullable: true })
  toundra: number | null;

  @Column("int", { name: "ville", nullable: true })
  ville: number | null;

  @Column("int", { name: "volcan", nullable: true })
  volcan: number | null;
}
