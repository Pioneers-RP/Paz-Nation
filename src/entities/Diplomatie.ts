import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("id_joueur", ["idJoueur"], {})
@Entity("diplomatie", { schema: "customer_355631_test" })
export class Diplomatie {
  @PrimaryGeneratedColumn({ type: "int", name: "id_pays" })
  idPays: number | null;

  @Column('varchar', { name: 'id_joueur', nullable: true, unique: true, length: 255})
  idJoueur: string | null;

  @Column("int", { name: "influence", default: () => "'7'" })
  influence: number;

  @Column("longtext", { name: "ambassade", default: () => "'[]'" })
  ambassade: any[];

  constructor() {
    this.idPays = null;
    this.idJoueur = null;
    this.influence = 0;
    this.ambassade = [];
  }
}
