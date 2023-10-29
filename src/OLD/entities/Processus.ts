import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("id_joueur", ["idJoueur"], {})
@Entity("processus", { schema: "customer_355631_test" })
export class Processus {
  @PrimaryGeneratedColumn({ type: "int", name: "id_processus" })
  idProcessus: number | null;

  @Column("varchar", { name: "id_joueur", nullable: true, length: 255 })
  idJoueur: string | null;

  @Column("timestamp", { name: "date", nullable: true })
  date: Date | null;

  @Column("text", { name: "type", nullable: true })
  type: string | null;

  @Column("text", { name: "option1", nullable: true })
  option1: string | null;

  @Column("int", { name: "option2", nullable: true })
  option2: number | null;

  constructor() {
    this.idProcessus = null;
    this.idJoueur = null;
    this.date = null;
    this.type = null;
    this.option1 = null;
    this.option2 = null;
  }
}
