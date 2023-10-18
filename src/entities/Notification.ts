import {BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";

@Index("id_joueur", ["idJoueur"], {})
@Entity("notification", { schema: "customer_355631_test" })
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_pays" })
  idPays: number | null = null;

  @Column("int", { name: "id_joueur", nullable: true })
  idJoueur: number | null = null;

  @Column("tinyint", { name: "famine", width: 1, default: () => "'1'" })
  famine: boolean | null = null;

  @Column("tinyint", { name: "usine", width: 1, default: () => "'1'" })
  usine: boolean | null = null;

  @Column("tinyint", { name: "trade", width: 1, default: () => "'1'" })
  trade: boolean | null = null;

  @Column("tinyint", { name: "explorateur", width: 1, default: () => "'1'" })
  explorateur: boolean | null = null;
}
