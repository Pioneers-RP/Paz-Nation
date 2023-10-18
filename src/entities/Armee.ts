import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from 'typeorm';

@Entity()
export class Armee extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_pays' })
  idPays: number | null = null;

  @Column('varchar', {
    name: 'id_joueur',
    nullable: true, // Champ non obligatoire
    unique: true,
    length: 255,
  })
  idJoueur: string | null = null;

  @Column({ name: 'strategie', default: () => "'defense'" })
  strategie: string | null = null;

  @Column('int', { name: 'avion', default: () => '0', nullable: true }) // Champ non obligatoire
  avion: number | null = null;

  @Column('int', { name: 'equipement_support', default: () => '0', nullable: true }) // Champ non obligatoire
  equipementSupport: number | null = null;

  @Column('int', { name: 'materiel_infanterie', default: () => '0', nullable: true }) // Champ non obligatoire
  materielInfanterie: number | null = null;

  @Column('int', { name: 'vehicule', default: () => '0', nullable: true }) // Champ non obligatoire
  vehicule: number | null = null;

  @Column('int', { name: 'unite', default: () => '0', nullable: true }) // Champ non obligatoire
  unite: number | null = null;

  @Column('int', { name: 'aviation', default: () => '0', nullable: true }) // Champ non obligatoire
  aviation: number | null = null;

  @Column('int', { name: 'infanterie', default: () => '0', nullable: true }) // Champ non obligatoire
  infanterie: number | null = null;

  @Column('int', { name: 'mecanise', default: () => '0', nullable: true }) // Champ non obligatoire
  mecanise: number | null = null;

  @Column('int', { name: 'support', default: () => '0', nullable: true }) // Champ non obligatoire
  support: number | null = null;

  @Column('int', { name: 'victoire', default: () => '0', nullable: true }) // Champ non obligatoire
  victoire: number | null = null;

  @Column('int', { name: 'defaite', default: () => '0', nullable: true }) // Champ non obligatoire
  defaite: number | null = null;
}
