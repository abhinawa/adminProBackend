// @@@@@@@@@@@@@@@@@@@@@@@@@@@   ALWAYS TRY TO WRITE CLEAN CODE    @@@@@@@@@@@@@@@@@@@@@@@@@@@

// ######################  ALL INSERT QUERIES WRITE HERE ------>>>>>>####################################

// INSERT INTO students TABLE name,class,admission_date
//@METHOD POST
// @PATH  /students/insert-students
export const insertAllStudents = (req, res) => {
  const { name, classValue } = req.body;
  const query = `INSERT INTO students (name, class, admission_date) VALUES (?,?, '2022-03-28');
 `;

  console.log(name, classValue);
  req.mysql.query(query, [name, classValue], (error, result) => {
    if (error) {
      res.status(500).send("Internal Server Error!");
    }
    res.status(200).send("Students Details INserted Successfully");
  });
};

// INSERT INTO students TABLE name,class,admission_date
//@METHOD POST
// @PATH  /students/insert-students
export const allStudentsDetails = (req, res) => {
  const query = `SELECT * FROM students`;
  req.mysql.query(query, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send("Internal Server Error!");
    }
    res.status(200).send(result);
  });
};

// ######################  ALL GET  QUERIES WRITE HERE ----->>>>>>> ####################################
