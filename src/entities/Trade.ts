import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("id_joueur", ["idJoueur"], {})
@Entity("trade", { schema: "customer_355631_test" })
export class Trade {
  @PrimaryGeneratedColumn()
  idTrade: number | null = null;

  @Column("varchar", { name: "id_joueur", nullable: true, length: 255 })
  idJoueur: string | null = null;

  @Column("varchar", { name: "id_salon", nullable: true, length: 255 })
  idSalon: string | null = null;

  @Column("varchar", { name: "ressource", nullable: true, length: 30 })
  ressource: string | null = null;

  @Column("bigint", { name: "quantite", nullable: true })
  quantite: string | null = null;

  @Column("bigint", { name: "prix", nullable: true })
  prix: string | null = null;

  @Column("float", {
    name: "prix_u",
    nullable: true,
    precision: 12,
  })
  prixU: number | null = null;
}
