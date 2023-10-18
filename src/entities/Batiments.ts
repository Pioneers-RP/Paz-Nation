import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Batiments extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_pays" })
  idPays: number | null = null;

  @Column('varchar', {
    name: 'id_joueur',
    nullable: true, // Champ non obligatoire
    unique: true,
    length: 255,
  })
  idJoueur: string | null = null;

  @Column("int", { name: "deja_prod", default: () => "'1'" })
  dejaProd: number | null = null;

  @Column("int", { name: "usine_total", default: () => "'20'" })
  usineTotal: number | null = null;

  @Column("int", { name: "acierie", default: () => "'0'" })
  acierie: number | null = null;

  @Column("int", { name: "atelier_verre", default: () => "'0'" })
  atelierVerre: number | null = null;

  @Column("int", { name: "carriere_sable", default: () => "'1'" })
  carriereSable: number | null = null;

  @Column("int", { name: "centrale_biomasse", default: () => "'0'" })
  centraleBiomasse: number | null = null;

  @Column("int", { name: "centrale_charbon", default: () => "'0'" })
  centraleCharbon: number | null = null;

  @Column("int", { name: "centrale_fioul", default: () => "'1'" })
  centraleFioul: number | null = null;

  @Column("int", { name: "champ", default: () => "'6'" })
  champ: number | null = null;

  @Column("int", { name: "cimenterie", default: () => "'0'" })
  cimenterie: number | null = null;

  @Column("int", { name: "derrick", default: () => "'2'" })
  derrick: number | null = null;

  @Column("int", { name: "eolienne", default: () => "'6'" })
  eolienne: number | null = null;

  @Column("int", { name: "mine_charbon", default: () => "'1'" })
  mineCharbon: number | null = null;

  @Column("int", { name: "mine_metaux", default: () => "'1'" })
  mineMetaux: number | null = null;

  @Column("int", { name: "station_pompage", default: () => "'5'" })
  stationPompage: number | null = null;

  @Column("int", { name: "quartier", default: () => "'35'" })
  quartier: number | null = null;

  @Column("int", { name: "raffinerie", default: () => "'0'" })
  raffinerie: number | null = null;

  @Column("int", { name: "scierie", default: () => "'2'" })
  scierie: number | null = null;

  @Column("int", { name: "usine_civile", default: () => "'0'" })
  usineCivile: number | null = null;
}
