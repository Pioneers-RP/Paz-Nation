import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("id_joueur", ["idJoueur"], {})
@Entity("population", { schema: "customer_355631_test" })
export class Population {
  @PrimaryGeneratedColumn({ type: "int", name: "id_pays" })
  idPays: number | null;

  @Column("varchar", { name: "id_joueur", nullable: true, length: 255 })
  idJoueur: string | null;

  @Column("int", { name: "habitant", nullable: true })
  habitant: number | null;

  @Column("int", { name: "enfant", default: () => "'0'" })
  enfant: number;

  @Column("int", { name: "jeune", nullable: true })
  jeune: number | null;

  @Column("int", { name: "adulte", default: () => "'0'" })
  adulte: number;

  @Column("int", { name: "vieux", default: () => "'0'" })
  vieux: number;

  @Column("float", {name: "pop_taux_demo", precision: 12, default: () => "'1.2'",})
  popTauxDemo: number;

  @Column("float", { name: "bonheur", precision: 12, default: () => "'50'" })
  bonheur: number;

  @Column("float", { name: "bc_acces", precision: 12, default: () => "'1'" })
  bcAcces: number;

  @Column("float", { name: "eau_acces", precision: 12, default: () => "'5'" })
  eauAcces: number;

  @Column("float", { name: "elec_acces", precision: 12, default: () => "'48'" })
  elecAcces: number;

  @Column("float", {name: "nourriture_acces", precision: 12, default: () => "'5'",})
  nourritureAcces: number;

  @Column("int", { name: "ancien_pop", nullable: true })
  ancienPop: number | null;

  constructor() {
    this.idPays = null;
    this.idJoueur = null;
    this.habitant = null;
    this.enfant = 0;
    this.jeune = null;
    this.adulte = 0;
    this.vieux = 0;
    this.popTauxDemo = 0;
    this.bonheur = 0;
    this.bcAcces = 0;
    this.eauAcces = 0;
    this.elecAcces = 0;
    this.nourritureAcces = 0;
    this.ancienPop = null;
  }
}
