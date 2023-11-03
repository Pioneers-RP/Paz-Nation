import { AppDataSource } from '../src/OLD/data-source';
import dotenv from 'dotenv';
import { Batiments } from '../src/OLD/entities/Batiments';
dotenv.config();

async function main() {
  try {
    const connection = await AppDataSource.connect();
    const batimentsRepository = connection.getRepository(Batiments);

    let batiment = await batimentsRepository.findOneBy({ idJoueur: "175618172743974912" });

    if (!batiment) {
      console.log('Création d\'une nouvelle batiment...');
      batiment = new Batiments();
      batiment.idJoueur = "175618172743974912";
    }
    else {
      console.log('batiment trouvée, mise à jour...');
      batiment.acierie += 1;
    } 

    await batimentsRepository.save(batiment);
    console.log('Opération réussie! Contenu de la colonne "acierie":', batiment.acierie);

    // Ferme la connexion à la base de données
    await connection.close();
  } catch (error) {
    console.error('Une erreur s\'est produite :', error);
  }
}

main();