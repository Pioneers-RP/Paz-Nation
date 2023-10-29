import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("id_joueur", ["idJoueur"], {})
@Entity("historique", { schema: "customer_355631_test" })
export class Historique {
  @PrimaryGeneratedColumn({ type: "int", name: "id_trade" })
  idTrade: number | null;

  @Column("varchar", { name: "id_joueur", nullable: true, length: 255 })
  idJoueur: string | null;

  @Column("varchar", { name: "id_salon", nullable: true, length: 255 })
  idSalon: string | null;

  @Column("varchar", { name: "type", length: 22 })
  type: string;

  @Column("varchar", { name: "ressource", length: 30 })
  ressource: string;

  @Column("bigint", { name: "quantite"})
  quantite: string;

  @Column("bigint", { name: "prix"})
  prix: string;

  @Column("float", {name: "prix_u", comment: "prix à l'unité", precision: 12,})
  prixU: number;

  constructor() {
    this.idTrade = null;
    this.idJoueur = null;
    this.idSalon = null;
    this.type = "";
    this.ressource = "";
    this.quantite = "";
    this.prix = "";
    this.prixU = 0;
  }
}
