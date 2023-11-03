import { AppDataSource } from '../src/OLD/data-source';
import { Armee } from '../src/OLD/entities/Armee'; // Assurez-vous que le chemin est correct
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  try {
    const connection = await AppDataSource.initialize();
    const armeeRepository = connection.getRepository(Armee);

    let armee = await armeeRepository.findOneBy({ idJoueur: "175618172743974912" });

    if (!armee) {
      console.log('Création d\'une nouvelle Armee...');
      armee = new Armee();
      armee.idJoueur = "175618172743974912";
    }
    else {
      console.log('Armee trouvée, mise à jour...');
      armee.avion += 4000;
      armee.strategie = "attaque";
      armee.infanterie += 1000;
    } 

    await armeeRepository.save(armee);
    console.log('Opération réussie! Contenu de la colonne "avion":', armee.avion);
    console.log('Opération réussie! Contenu de la colonne "infanterie":', armee.infanterie);

    // Ferme la connexion à la base de données
    await connection.close();
  } catch (error) {
    console.error('Une erreur s\'est produite :', error);
  }
}

main();