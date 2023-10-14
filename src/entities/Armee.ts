import {Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";

@Index("id_joueur", ["idJoueur"], { unique: true })
@Entity("armee", { schema: "customer_355631_test" })
export class Armee {
  @PrimaryGeneratedColumn({ type: "int", name: "id_pays" })
  idPays: number;

  @Column("varchar", {
    name: "id_joueur",
    nullable: true,
    unique: true,
    length: 255,
  })
  idJoueur: string | null;

  @Column( { name: "strategie", default: () => "'defense'" })
  strategie: string;

  @Column("int", { name: "avion", default: () => "'0'" })
  avion: number;

  @Column("int", { name: "equipement_support", default: () => "'0'" })
  equipementSupport: number;

  @Column("int", { name: "materiel_infanterie", default: () => "'0'" })
  materielInfanterie: number;

  @Column("int", { name: "vehicule", default: () => "'0'" })
  vehicule: number;

  @Column("int", { name: "unite", default: () => "'0'" })
  unite: number;

  @Column("int", { name: "aviation", default: () => "'0'" })
  aviation: number;

  @Column("int", { name: "infanterie", default: () => "'0'" })
  infanterie: number;

  @Column("int", { name: "mecanise", default: () => "'0'" })
  mecanise: number;

  @Column("int", { name: "support", default: () => "'0'" })
  support: number;

  @Column("int", { name: "victoire", default: () => "'0'" })
  victoire: number;

  @Column("int", { name: "defaite", default: () => "'0'" })
  defaite: number;
}
