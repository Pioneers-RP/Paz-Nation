import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Index("id_joueur", ["idJoueur"], {})
@Entity("armee", { schema: "customer_355631_test" })
export class Armee {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  idPays: number | null;

  @Column('varchar', {name: 'id_joueur', nullable: true, unique: true, length: 255})
  idJoueur: string | null;

  @Column({ name: 'strategie', default: () => "'defense'" })
  strategie: string;

  @Column('int', { name: 'avion', default: () => '0' }) // Champ non obligatoire
  avion: number;

  @Column('int', { name: 'equipement_support', default: () => '0' }) // Champ non obligatoire
  equipementSupport: number;

  @Column('int', { name: 'materiel_infanterie', default: () => '0' }) // Champ non obligatoire
  materielInfanterie: number;

  @Column('int', { name: 'vehicule', default: () => '0' }) // Champ non obligatoire
  vehicule: number;

  @Column('int', { name: 'unite', default: () => '0' }) // Champ non obligatoire
  unite: number;

  @Column('int', { name: 'aviation', default: () => '0' }) // Champ non obligatoire
  aviation: number;

  @Column('int', { name: 'infanterie', default: () => '0' }) // Champ non obligatoire
  infanterie: number;

  @Column('int', { name: 'mecanise', default: () => '0' }) // Champ non obligatoire
  mecanise: number;

  @Column('int', { name: 'support', default: () => '0' }) // Champ non obligatoire
  support: number;

  @Column('int', { name: 'victoire', default: () => '0' }) // Champ non obligatoire
  victoire: number;

  @Column('int', { name: 'defaite', default: () => '0' }) // Champ non obligatoire
  defaite: number;

  constructor() {
    this.idPays = null;
    this.idJoueur = null;
    this.strategie = "defense";
    this.avion = 0;
    this.equipementSupport = 0;
    this.materielInfanterie = 0;
    this.vehicule = 0;
    this.unite = 0;
    this.aviation = 0;
    this.infanterie = 0;
    this.mecanise = 0;
    this.support = 0;
    this.victoire = 0;
    this.defaite = 0;
  }
}
