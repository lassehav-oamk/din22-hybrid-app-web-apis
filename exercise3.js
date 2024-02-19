const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");

app.use(express.json()); // for parsing application/json

const SUPERSECRETKEYWHICHSHOULDNOTBEINTHECODE = "secretkey";
const userArray = [];

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SUPERSECRETKEYWHICHSHOULDNOTBEINTHECODE,
};

passport.use(
  new JwtStrategy(jwtOptions, function (jwt_payload, done) {
    // here I can do whatever I want with the payload
    // the token is valid at this point
    console.log(
      "Yay, token is valid, but we still can do something before passing the control to the route handler"
    );
    console.log("This is the payload: ", jwt_payload);
    // when you are ready, call the done function with the payload as argument

    // for example, find the user information from the database
    // and pass it to the route handler
    const userInformationExample = {
      email: "example@example.com",
      username: "example",
      address: "example street 123",
      id: 123,
    };
    done(null, userInformationExample);
  })
);

function httpBasicMw(req, res, next) {
  // exercise 3 step 1 read the username and password from the body

  try {
    const username = req.body.username;
    const password = req.body.password;

    console.log("username: " + username + ", password: " + password);

    // step 5 check if username matches any user in out "database" the array of users
    const user = userArray.find((user) => user.username === username);
    if (user === undefined) {
      res.status(401).send("You are not authorized to access this resource");
      return;
    }

    // step 6 check if password matches stored password hash
    bcrypt.compare(password, user.password).then((result) => {
      // if result is true, the password is correct
      if (result === true) {
        next();
      }

      // if result is false, the password is incorrect
      if (result === false) {
        res.status(401).send("You are not authorized to access this resource");
        return;
      }
    });
  } catch (error) {
    res.status(401).send();
  }
}

function validateJWT(req, res, next) {
  const authHeader = req.get("Authorization");
  console.log(authHeader);

  next();
}

/* 
  {
    "username": "testuser",
    "password": "testpassword",
    "email": "blah@example.com"
  }
*/
app.post("/register", (req, res) => {
  // read the username, password and email from the request body
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  // take the password and create a hash from it
  bcrypt.hash(password, 3).then((hash) => {
    console.log("hash for this password: ", hash);

    // store the hash into the "database", do not store the plain text password

    // create and store user in the 'database', but our database is just an array
    userArray.push({
      username: username,
      password: hash,
      email: email,
    });

    res.status(201).send("User has been created");
  });
});

app.post("/login", httpBasicMw, (req, res) => {
  // create a JWT token
  const jsonwebtoken = jwt.sign(
    {
      userId: 123,
      userAccessLevel: "admin",
    },
    SUPERSECRETKEYWHICHSHOULDNOTBEINTHECODE
  );

  // send the JWT token in the response
  res.status(200).json({
    token: jsonwebtoken,
  });
});

app.get(
  "/jwtProtectedRoute",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // at this moment we are sure that the JWT is valid because the validateJWT middleware has been executed
    // now we can send the protected resource
    console.log("Protected resource has been accessed");

    // the user information is available in req.user
    console.log("User information: ", req.user);

    res.status(200).send("Hello from jwtProtectedRoute!");
  }
);

app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // step 1 strip password hashes away from the user array
    const cleanUserArray = userArray.map((user) => {
      return {
        username: user.username,
        email: user.email,
      };
    });

    // step 2 return the modified user array
    res.status(200).json(cleanUserArray);
  }
);

app.get("/public", (req, res) => {
  res.status(200).send("Hello from public!");
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000");
});
