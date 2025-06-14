import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("id_joueur", ["idJoueur"], {})
@Entity("batiments", { schema: "customer_355631_test" })
export class Batiments {
  @PrimaryGeneratedColumn({ type: "int", name: "id_pays" })
  idPays: number | null;

  @Column('varchar', {name: 'id_joueur', nullable: true, unique: true, length: 255,})
  idJoueur: string | null;

  @Column("int", { name: "deja_prod", default: () => "'1'" })
  deja_prod: number;

  @Column("int", { name: "usine_total", default: () => "'20'" })
  usine_total: number;

  @Column("int", { name: "acierie", default: () => "'0'" })
  acierie: number;

  @Column("int", { name: "atelier_verre", default: () => "'0'" })
  atelier_verre: number;

  @Column("int", { name: "carriere_sable", default: () => "'1'" })
  carriere_sable: number;

  @Column("int", { name: "centrale_biomasse", default: () => "'0'" })
  centrale_biomasse: number;

  @Column("int", { name: "centrale_charbon", default: () => "'0'" })
  centrale_charbon: number;

  @Column("int", { name: "centrale_fioul", default: () => "'1'" })
  centrale_fioul: number;

  @Column("int", { name: "champ", default: () => "'6'" })
  champ: number;

  @Column("int", { name: "cimenterie", default: () => "'0'" })
  cimenterie: number;

  @Column("int", { name: "derrick", default: () => "'2'" })
  derrick: number;

  @Column("int", { name: "eolienne", default: () => "'6'" })
  eolienne: number;

  @Column("int", { name: "mine_charbon", default: () => "'1'" })
  mine_charbon: number;

  @Column("int", { name: "mine_metaux", default: () => "'1'" })
  mine_metaux: number;

  @Column("int", { name: "station_pompage", default: () => "'5'" })
  station_pompage: number;

  @Column("int", { name: "quartier", default: () => "'35'" })
  quartier: number;

  @Column("int", { name: "raffinerie", default: () => "'0'" })
  raffinerie: number;

  @Column("int", { name: "scierie", default: () => "'2'" })
  scierie: number;

  @Column("int", { name: "usine_civile", default: () => "'0'" })
  usine_civile: number;

  constructor() {
    this.idPays = null;
    this.idJoueur = null;
    this.deja_prod = 0;
    this.usine_total = 0;
    this.acierie = 0;
    this.atelier_verre = 0;
    this.carriere_sable = 0;
    this.centrale_biomasse = 0;
    this.centrale_charbon = 0;
    this.centrale_fioul = 0;
    this.champ = 0;
    this.cimenterie = 0;
    this.derrick = 0;
    this.eolienne = 0;
    this.mine_charbon = 0;
    this.mine_metaux = 0;
    this.station_pompage = 0;
    this.quartier = 0;
    this.raffinerie = 0;
    this.scierie = 0;
    this.usine_civile = 0;
  }
}
