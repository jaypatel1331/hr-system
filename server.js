const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

const oracledb = require("oracledb");
const dbConfig = {
  user: "dbs501_232v1a14",
  password: "29202799",
  connectString:
    "(DESCRIPTION = (ADDRESS = (PROTOCOL = TCP)(HOST = myoracle12c.senecacollege.ca)(PORT = 1521))(CONNECT_DATA =(SERVER = DEDICATED)(SERVICE_NAME = oracle12c)))",
};

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute ? ' class="active" ' : "") +
          '><a href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
    },
  })
);

app.set("view engine", ".hbs");

app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
  next();
});

app.get("/", function (req, res) {
  res.render("home");
});


app.get("/employees", (req, res) => {
  const connection = req.app.locals.connection;
  connection
    .execute("SELECT * FROM hr_employees")
    .then((result) => {
      res.render("employees", { employees: result.rows });
    })
    .catch((err) => {
      console.log("Error fetching employees from the database:", err);
      res.status(500).json({ error: "error from database" });
    });
});

app.get("/employees/add", function (req, res) {
  const connection = req.app.locals.connection;
  let data = {};

  data.date = new Date();
  
    connection
        .execute("SELECT * FROM hr_departments")
        .then((result1) => {
            data.departments = result1.rows;
            connection
                .execute("SELECT * FROM hr_employees where employee_id in (select manager_id from hr_employees)")
                .then((result2) => {
                    data.managers = result2.rows;
                    connection
                        .execute("SELECT * FROM hr_jobs")
                        .then((result3) => {
                            data.jobs = result3.rows;
                            res.render("addEmployee", { data: data });
                        })
                        .catch((err) => {
                          console.log("Error fetching jobs from the database:", err);
                          res.status(500).json({ error: "error from database" });
                        });
                })
                .catch((err) => {
                  console.log("Error fetching managers from the database:", err);
                  res.status(500).json({ error: "error from database" });
                }
            );
        })
        .catch((err) => {
          console.log("Error fetching departments from the database:", err);
          res.status(500).json({ error: "error from database" });
        }
    );
});


// Assuming you have already defined 'app' and set up other required middleware

app.post("/employees/add", function (req, res) {
  const connection = req.app.locals.connection;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phone;
  const hireDate = req.body.hiredate;
  const jobId = req.body.jobId;
  const salary = req.body.salary;
  const managerId = req.body.managerId;
  const departmentId = req.body.departmentId;

    const formattedHireDate = new Date(hireDate).toISOString().slice(0, 10);
  connection
    .execute(
      `BEGIN hr_employee_hire_sp(:firstName, :lastName, :email, :salary, TO_DATE(:hireDate, 'YYYY-MM-DD'), :phone, :jobId, :managerId, :departmentId); END;`,
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        salary: salary,
        hireDate: formattedHireDate,
        phone: phone,
        jobId: jobId,
        managerId: managerId,
        departmentId: departmentId,
      },
      { autoCommit: true }
    )
    .then((result) => {
      console.log("Employee added successfully.");
      res.redirect("/employees"); // Redirect to employees page
    })
    .catch((err) => {
      console.error("Error inserting into the database:", err);
      res.status(500).send("Error adding employee.");
    });
});



app.get("/employees/:empnum", (req, res) => {
  const connection = req.app.locals.connection;
  connection
    .execute("SELECT * FROM hr_employees WHERE employee_id = :empNum", [
      req.params.empnum,
    ])
    .then((result) => {
      res.render("employee", { employees: result.rows });
    })
    .catch((err) => {
      console.log("Error fetching data from the database:", err);
      res.status(500).json({ error: "error from database" });
    });
});

// post the update data to the oracledb and redirect to the employees page
app.post("/employee/update", function (req, res) {
  const connection = req.app.locals.connection;
  const empNum = req.body.employee_id;
  const salary = req.body.salary;
  const phone = req.body.phone;
  const email = req.body.email;
  connection
    .execute(
      `UPDATE hr_employees SET salary= :salary, phone_number= :phone, email= :email WHERE employee_id= :empNum`,
      {
        salary,
        phone,
        email,
        empNum
      },
      { autoCommit: true }
  )
    .then((result) => {
      res.redirect("/employees");
    })
    .catch((err) => {
      console.log("Error updating employee from the database:", err);
      res.status(500).json({ error: "error from database" });
    });
});


app.get("/jobs", (req, res) => {
  const connection = req.app.locals.connection;
  connection
    .execute("SELECT * FROM hr_jobs")
    .then((result) => {
      res.render("jobs", { jobs: result.rows });
    })
    .catch((err) => {
      console.log("Error fetching jobs from the database:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/jobs/add", function (req, res) {
  res.render("addJob");
});


app.post("/jobs/add", function (req, res) {
  const connection = req.app.locals.connection;
  const jobId = req.body.jobID;
  const jobTitle = req.body.jobTitle;
  const minSalary = req.body.min_salary;
  connection
    .execute(
      `BEGIN NEW_JOB(:jobId, :jobTitle, :minSalary); END;`,
      {
        jobId: jobId,
        jobTitle: jobTitle,
        minSalary: minSalary,
      },
      { autoCommit: true }
  )
    .then((result) => {
      res.redirect("/jobs");
    })
    .catch((err) => {
      console.log("Error inserting job to the database:", err);
      res.status(500).json({ error: "error from database" });
    });
});

// get the job id and render the job view with oracledb
app.get("/jobs/:jobId", (req, res) => {
  const connection = req.app.locals.connection;
  connection
    .execute("SELECT * FROM hr_jobs WHERE job_id = :jobId", [
      req.params.jobId,
    ])
    .then((result) => {
      res.render("job", { jobs: result.rows });
    })
    .catch((err) => {
      console.log("Error fetching job from the database:", err);
      res.status(500).json({ error: "error from database" });
    });
});


// post the update data to the oracledb and redirect to the jobs page
app.post("/job/update", function (req, res) {
  const connection = req.app.locals.connection;
  const jobId = req.body.jobId;
  const jobTitle = req.body.jobTitle;
  const minSalary = req.body.min_salary;
  const maxSalary = req.body.max_salary;
  connection
    .execute(
      `UPDATE hr_jobs SET job_title= :jobTitle, min_salary= :minSalary, max_salary= :maxSalary WHERE job_id= :jobId`,
      {
        jobTitle,
        minSalary,
        maxSalary,
        jobId,
      },
      { autoCommit: true }
  )
    .then((result) => {
      res.redirect("/jobs");
    })
    .catch((err) => {
      console.log("Error updating job from the database:", err);
      res.status(500).json({ error: "error from database" });
    });
});

app.get("/departments", function (req, res) {
  const connection = req.app.locals.connection;
  connection
      .execute("SELECT * FROM hr_departments")
      .then((result) => {
          res.render("departments", { departments: result.rows });
      })
      .catch((err) => {
          console.log("Error fetching departments from the database:", err);
          res.status(500).json({ error: "Internal Server Error" });
      });
});

app.use(function (req, res, next) {
  res.status(404).send("Page not found, Error: 404");
});

app.listen(HTTP_PORT, () => {
  oracledb
    .getConnection(dbConfig)
    .then((connection) => {
      console.log("Connected to the Oracle database!");
      app.locals.connection = connection;
    })
    .catch((err) => {
      console.log("Error connecting to the Oracle database:", err);
    });
});
