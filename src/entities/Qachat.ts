import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("id_joueur", ["idJoueur"], {})
@Entity("qachat", { schema: "customer_355631_test" })
export class Qachat {
  @PrimaryGeneratedColumn({ type: "int", name: "id_achat" })
  idAchat: number | null;

  @Column("varchar", { name: "id_joueur", nullable: true, length: 255 })
  idJoueur: string | null;

  @Column("varchar", { name: "id_salon", nullable: true, length: 255 })
  idSalon: string | null;

  @Column("varchar", { name: "ressource", nullable: true, length: 30 })
  ressource: string | null;

  @Column("bigint", { name: "quantite", nullable: true })
  quantite: string | null;

  @Column("bigint", { name: "prix", nullable: true })
  prix: string | null;

  @Column("float", {
    name: "prix_u",
    nullable: true,
    comment: "prix à l'unité",
    precision: 12,
  })
  prixU: number | null;

  constructor() {
    this.idAchat = null;
    this.idJoueur = null;
    this.idSalon = null;
    this.ressource = null;
    this.quantite = null;
    this.prix = null;
    this.prixU = null;
  }
}
