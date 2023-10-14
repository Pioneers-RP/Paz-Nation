import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("id_joueur", ["idJoueur"], {})
@Entity("notification", { schema: "customer_355631_test" })
export class Notification {
  @PrimaryGeneratedColumn({ type: "int", name: "id_pays" })
  idPays: number;

  @Column("int", { name: "id_joueur", nullable: true })
  idJoueur: number | null;

  @Column("tinyint", { name: "famine", width: 1, default: () => "'1'" })
  famine: boolean;

  @Column("tinyint", { name: "usine", width: 1, default: () => "'1'" })
  usine: boolean;

  @Column("tinyint", { name: "trade", width: 1, default: () => "'1'" })
  trade: boolean;

  @Column("tinyint", { name: "explorateur", width: 1, default: () => "'1'" })
  explorateur: boolean;
}
