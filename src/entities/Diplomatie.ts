import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("id_joueur", ["idJoueur"], {})
@Entity("diplomatie", { schema: "customer_355631_test" })
export class Diplomatie {
  @PrimaryGeneratedColumn({ type: "int", name: "id_pays" })
  idPays: number | null = null;

  @Column("varchar", { name: "id_joueur", nullable: true, length: 255 })
  idJoueur: string | null = null;

  @Column("int", { name: "influence", default: () => "'7'" })
  influence: number | null = null;

  @Column("longtext", { name: "ambassade", default: () => "'[]'" })
  ambassade: string | null = null;
}
