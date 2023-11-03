import { Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";

@Index("id_joueur", ["idJoueur"], { unique: true })
@Entity("pays", { schema: "customer_355631_test" })
export class Pays {
  @PrimaryGeneratedColumn({ type: "int", name: "id_pays" })
  idPays: number | null;

  @Column("varchar", {name: "id_joueur", nullable: true, unique: true, comment: "ID discord du joueur", length: 255,})
  idJoueur: string | null;

  @Column("varchar", { name: "nom", nullable: true, length: 60 })
  nom: string | null;

  @Column("varchar", { name: "id_salon", nullable: true, length: 255 })
  idSalon: string | null;

  @Column("longtext", { name: "drapeau", nullable: true })
  drapeau: string | null;

  @Column("varchar", { name: "avatarURL", nullable: true, length: 244 })
  avatarUrl: string | null;

  @Column("tinytext", {name: "devise", default: () => "'Gloire à Paz Nation !'",})
  devise: string;

  @Column("text", {name: "regime", default: () => "'Principauté'",})
  regime: string;

  @Column("text", {name: "ideologie", default: () => "'Centrisme'",})
  ideologie: string;

  @Column("text", { name: "rang", default: () => "Cité" })
  rang: string;

  @Column("bigint", { name: "cash", nullable: true })
  cash: string | null;

  @Column("int", {name: "action_diplo", nullable: true, default: () => "'100'",})
  actionDiplo: number | null;

  @Column("float", {name: "reputation", nullable: true, precision: 12, default: () => "'30'",})
  reputation: number | null;

  @Column("int", { name: "prestige", nullable: true, default: () => "'1'" })
  prestige: number | null;

  @Column("varchar", { name: "pweeter", nullable: true, length: 244 })
  pweeter: string | null;

  @Column("int", { name: "jour", default: () => "'1'" })
  jour: number;

  @Column("int", { name: "daily", default: () => "'1'" })
  daily: number;

  @Column("int", { name: "vacances", default: () => "'0'" })
  vacances: number;

  constructor() {
    this.idPays = null;
    this.idJoueur = null;
    this.nom = null;
    this.idSalon = null;
    this.drapeau = null;
    this.avatarUrl = null;
    this.devise = "";
    this.regime = "";
    this.ideologie = "";
    this.rang = "";
    this.cash = null;
    this.actionDiplo = null;
    this.reputation = null;
    this.prestige = null;
    this.pweeter = null;
    this.jour = 0;
    this.daily = 0;
    this.vacances = 0;
  }
}
