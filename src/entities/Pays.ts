import {BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";

@Index("id_joueur", ["idJoueur"], { unique: true })
@Entity("pays", { schema: "customer_355631_test" })
export class Pays extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_pays" })
  idPays: number | null = null;

  @Column("varchar", {
    name: "id_joueur",
    nullable: true,
    unique: true,
    comment: "ID discord du joueur",
    length: 255,
  })
  idJoueur: string | null = null;

  @Column("varchar", { name: "nom", nullable: true, length: 60 })
  nom: string | null = null;

  @Column("varchar", { name: "id_salon", nullable: true, length: 255 })
  idSalon: string | null = null;

  @Column("longtext", { name: "drapeau", nullable: true })
  drapeau: string | null = null;

  @Column("varchar", { name: "avatarURL", nullable: true, length: 244 })
  avatarUrl: string | null = null;

  @Column("tinytext", {
    name: "devise",
    nullable: true,
    default: () => "'Gloire à Paz Nation !'",
  })
  devise: string | null = null;

  @Column("text", {
    name: "regime",
    nullable: true,
    default: () => "'Principauté'",
  })
  regime: string | null = null;

  @Column("text", {
    name: "ideologie",
    nullable: true,
    default: () => "'Centrisme'",
  })
  ideologie: string | null = null;

  @Column("text", { name: "rang", default: () => "'Cité'" })
  rang: string | null = null;

  @Column("bigint", { name: "cash", nullable: true })
  cash: string | null = null;

  @Column("int", {
    name: "action_diplo",
    nullable: true,
    default: () => "'100'",
  })
  actionDiplo: number | null = null;

  @Column("float", {
    name: "reputation",
    nullable: true,
    precision: 12,
    default: () => "'30'",
  })
  reputation: number | null = null;

  @Column("int", { name: "prestige", nullable: true, default: () => "'1'" })
  prestige: number | null = null;

  @Column("varchar", { name: "pweeter", nullable: true, length: 244 })
  pweeter: string | null = null;

  @Column("int", { name: "jour", default: () => "'1'" })
  jour: number | null = null;

  @Column("int", { name: "daily", default: () => "'1'" })
  daily: number | null = null;

  @Column("int", { name: "vacances", nullable: true, default: () => "'0'" })
  vacances: number | null = null;
}
