const { error } = require('console');
const express = require('express');
const app  = express();
const mysql = require('mysql2');
const path = require('path'); 

//configuration des middleware
app.set('view engine', 'ejs') //methode pour définir le moteur de vue
app.set('views', path.join(__dirname, 'views'));

app.set("")
app.use(express.urlencoded({extended: true})); //app.use methode pour ajouter un middleware elle exucute pour chaque requete 
//analuse les donner encodée sous forme url et  les expose comme un objet java script  eccesible via req.body comme un objet java script 
app.use(express.static('public')) 

//database connexion :

const db = mysql.createConnection({
    host: 'localhost',
    port: 3308,
    user: 'root',
    password: '', // Remplace par ton mot de passe
    database: 'student_management',
});
db.connect(err => {
    if (err) {
        console.log("la connexion a la base de données et echoué");
    }
});

const port = 3001;
app.listen(port, ()=>{
    console.log("serveur et lancé avec succés su la port de 3001");
})


//affiché les donnés de base de donnés
app.get('/', (req, res) => {
    const query = 'select * from students';
    db.query(query, (err, results) => {
      //  console.log(results)
        if (err) throw err;
        res.render('index', {students: results})
    } )
})

app.get('/add', (req, res) => {
    res.render('add'); // Cela rendra le fichier 'add.ejs' dans le dossier 'views'
});


//ajouter un etudiant 
app.post('/add', (req, res) => {
const {first_name, last_name, final_exam} = req.body ;

const sql = 'INSERT INTO students (first_name, last_name, final_exam) VALUES (?, ?, ?)';
db.query(sql, [first_name, last_name, final_exam], (error, results) => {
if (error) {
    console.error("un error a été détecté au moment de l'insertion :",error);
return res.status(500).send("error au moment de l'insertion");
}
else {
    res.send("etudiant a été ajouter avec succés");
    
}
});

});


//supprimer un étudiant 
app.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM students WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression de l\'étudiant :', err);
            res.status(500).send('Une erreur est survenue lors de la suppression.');
        } else {
            res.redirect('/');
        }
    });
});

//edit student 
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM students WHERE id = ?';
    console.log('ID reçu:', id);

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error fetching student:', err);
            res.status(500).send('Error fetching student data');
        } else {
            res.render('edit', { student: result[0] });
        }
    });
});

app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, final_exam } = req.body;
    const query = 'UPDATE students SET first_name = ?, last_name = ?, final_exam = ? WHERE id = ?';
    
    db.query(query, [first_name, last_name, final_exam, id], (err, result) => {
        if (err) {
            console.error('Error updating student:', err);
            res.status(500).send('Error updating student');
        } else {
            res.redirect('/');
        }
    });
});