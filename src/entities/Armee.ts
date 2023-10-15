import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Armee {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_pays' })
  idPays: number | null;

  @Column('varchar', {
    name: 'id_joueur',
    nullable: true, // Champ non obligatoire
    unique: true,
    length: 255,
  })
  idJoueur: string | null;

  @Column({ name: 'strategie', default: () => "'defense'" })
  strategie: string;

  @Column('int', { name: 'avion', default: () => '0', nullable: true }) // Champ non obligatoire
  avion: number | null;

  @Column('int', { name: 'equipement_support', default: () => '0', nullable: true }) // Champ non obligatoire
  equipementSupport: number | null;

  @Column('int', { name: 'materiel_infanterie', default: () => '0', nullable: true }) // Champ non obligatoire
  materielInfanterie: number | null;

  @Column('int', { name: 'vehicule', default: () => '0', nullable: true }) // Champ non obligatoire
  vehicule: number | null;

  @Column('int', { name: 'unite', default: () => '0', nullable: true }) // Champ non obligatoire
  unite: number | null;

  @Column('int', { name: 'aviation', default: () => '0', nullable: true }) // Champ non obligatoire
  aviation: number | null;

  @Column('int', { name: 'infanterie', default: () => '0', nullable: true }) // Champ non obligatoire
  infanterie: number | null;

  @Column('int', { name: 'mecanise', default: () => '0', nullable: true }) // Champ non obligatoire
  mecanise: number | null;

  @Column('int', { name: 'support', default: () => '0', nullable: true }) // Champ non obligatoire
  support: number | null;

  @Column('int', { name: 'victoire', default: () => '0', nullable: true }) // Champ non obligatoire
  victoire: number | null;

  @Column('int', { name: 'defaite', default: () => '0', nullable: true }) // Champ non obligatoire
  defaite: number | null;

  constructor() {
    this.idPays = null;
    this.idJoueur = null;
    this.strategie = "";
    this.avion = null;
    this.equipementSupport = null;
    this.materielInfanterie = null;
    this.vehicule = null;
    this.unite = null;
    this.aviation = null;
    this.infanterie = null;
    this.mecanise = null;
    this.support = null;
    this.victoire = null;
    this.defaite = null;
  }

}
