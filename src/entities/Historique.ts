import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("id_joueur", ["idJoueur"], {})
@Entity("historique", { schema: "customer_355631_test" })
export class Historique {
  @PrimaryGeneratedColumn({ type: "int", name: "id_trade" })
  idTrade: number;

  @Column("varchar", { name: "id_joueur", nullable: true, length: 255 })
  idJoueur: string | null;

  @Column("varchar", { name: "id_salon", nullable: true, length: 255 })
  idSalon: string | null;

  @Column("varchar", { name: "type", nullable: true, length: 22 })
  type: string | null;

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
}
