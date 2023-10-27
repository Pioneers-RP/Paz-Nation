import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("id_joueur", ["idJoueur"], {})
@Entity("batiments", { schema: "customer_355631_test" })
export class Batiments {
  @PrimaryGeneratedColumn({ type: "int", name: "id_pays" })
  idPays: number | null;

  @Column('varchar', {name: 'id_joueur', nullable: true, unique: true, length: 255,})
  idJoueur: string | null;

  @Column("int", { name: "deja_prod", default: () => "'1'" })
  dejaProd: number;

  @Column("int", { name: "usine_total", default: () => "'20'" })
  usineTotal: number;

  @Column("int", { name: "acierie", default: () => "'0'" })
  acierie: number;

  @Column("int", { name: "atelier_verre", default: () => "'0'" })
  atelierVerre: number;

  @Column("int", { name: "carriere_sable", default: () => "'1'" })
  carriereSable: number;

  @Column("int", { name: "centrale_biomasse", default: () => "'0'" })
  centraleBiomasse: number;

  @Column("int", { name: "centrale_charbon", default: () => "'0'" })
  centraleCharbon: number;

  @Column("int", { name: "centrale_fioul", default: () => "'1'" })
  centraleFioul: number;

  @Column("int", { name: "champ", default: () => "'6'" })
  champ: number;

  @Column("int", { name: "cimenterie", default: () => "'0'" })
  cimenterie: number;

  @Column("int", { name: "derrick", default: () => "'2'" })
  derrick: number;

  @Column("int", { name: "eolienne", default: () => "'6'" })
  eolienne: number;

  @Column("int", { name: "mine_charbon", default: () => "'1'" })
  mineCharbon: number;

  @Column("int", { name: "mine_metaux", default: () => "'1'" })
  mineMetaux: number;

  @Column("int", { name: "station_pompage", default: () => "'5'" })
  stationPompage: number;

  @Column("int", { name: "quartier", default: () => "'35'" })
  quartier: number;

  @Column("int", { name: "raffinerie", default: () => "'0'" })
  raffinerie: number;

  @Column("int", { name: "scierie", default: () => "'2'" })
  scierie: number;

  @Column("int", { name: "usine_civile", default: () => "'0'" })
  usineCivile: number;

  constructor() {
    this.idPays = null;
    this.idJoueur = null;
    this.dejaProd = 0;
    this.usineTotal = 0;
    this.acierie = 0;
    this.atelierVerre = 0;
    this.carriereSable = 0;
    this.centraleBiomasse = 0;
    this.centraleCharbon = 0;
    this.centraleFioul = 0;
    this.champ = 0;
    this.cimenterie = 0;
    this.derrick = 0;
    this.eolienne = 0;
    this.mineCharbon = 0;
    this.mineMetaux = 0;
    this.stationPompage = 0;
    this.quartier = 0;
    this.raffinerie = 0;
    this.scierie = 0;
    this.usineCivile = 0;
  }
}
