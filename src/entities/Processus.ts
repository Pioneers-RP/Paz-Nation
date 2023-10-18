import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("id_joueur", ["idJoueur"], {})
@Index("id_joueur_2", ["idJoueur"], {})
@Entity("processus", { schema: "customer_355631_test" })
export class Processus {
  @PrimaryGeneratedColumn({ type: "int", name: "id_processus" })
  idProcessus: number | null = null;

  @Column("varchar", { name: "id_joueur", nullable: true, length: 255 })
  idJoueur: string | null = null;

  @Column("timestamp", { name: "date", nullable: true })
  date: Date | null = null;

  @Column("text", { name: "type", nullable: true })
  type: string | null = null;

  @Column("text", { name: "option1", nullable: true })
  option1: string | null = null;

  @Column("int", { name: "option2", nullable: true })
  option2: number | null = null;
}
