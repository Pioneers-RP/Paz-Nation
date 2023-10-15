import { DataSource } from 'typeorm';
import { Armee } from './entities/Armee'; // Assurez-vous que le chemin est correct
import dotenv from 'dotenv';
dotenv.config();
const dataSource = new DataSource({
    type: 'mariadb',
    host: process.env.HOST || 'localhost',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3306,
    username: process.env.USER || 'root',
    password: process.env.PASSWORD || 'password',
    database: process.env.DATABASE || 'database',
  entities: [
    __dirname + "/entity/*.ts"
  ],
  synchronize: true,
  multipleStatements: true,
});

async function main() {
  try {
    console.log(JSON.stringify(process.env));
    const connection = await dataSource.connect();
    console.log(JSON.stringify(connection));
    console.log('1');
    // Crée une nouvelle Armee et l'ajoute à la base de données
    const armeeRepository = connection.getRepository(Armee);
    console.log('2');
    // const nouvelleArmee = new Armee();      
    // console.log('3');
    // nouvelleArmee.idJoueur = "175618172743974912";
    // console.log('4');
    // nouvelleArmee.avion = 1000;
    // console.log('5');
    // await armeeRepository.save(nouvelleArmee);
    // console.log('Armee enregistrée avec succès !');

    // Recherche et affiche le contenu de la colonne 'avion'
    // const armeeEnregistree = await armeeRepository.findOne({ idJoueur: nouvelleArmee.idPays });
    // if (armeeEnregistree) {
    // console.log('Contenu de la colonne "avion":', armeeEnregistree.avion);
    // } else {
    // console.log('Armee non trouvée.');
    // }

    // Ferme la connexion à la base de données
    await connection.close();
  } catch (error) {
    console.error('Une erreur s\'est produite :', error);
  }
}

main();