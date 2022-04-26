const express = require("express");
const cors = require("cors");
const createError = require("http-errors");
const uuid = require("uuid");

require("dotenv").config();

const Jwt = require("jsonwebtoken");
const jwtKey = "mui-tabs";

require("./db/config");
const User = require("./db/User");

const { loginSchema, registerSchema } = require("./db/validation_schema");
const { signAccessToken, signRefreshToken } = require("./db/jwt_helper");
const { verifyAccessToken } = require("./db/jwt_helper");
// import userRoutes from "./routes/admin.js";

const app = express();

app.use(express.json());
app.use(cors());

// app.use("/", userRoutes);

app.get("/", verifyAccessToken, async (req, res, next) => {
  res.send("hello from express");
});

// Registration API
app.post("/register", async (req, res, next) => {
  try {
    // const { name, email, password } = req.body;

    // if (!name || !email || !password) throw createError.BadRequest();
    const result = await registerSchema.validateAsync(req.body);

    const doesExist = await User.findOne({ email: result.email });
    if (doesExist) {
      throw createError.Conflict(`${result.email} is already been registered.`);
    }
    let user = new User(result);
    // User.push({ ...user, id: uuid() });
    let savedUser = await user.save();
    // const accessToken = await signAccessToken(savedUser.id);
    // const refreshToken = await signRefreshToken(savedUser.id);

    // res.send({ savedUser, accessToken, refreshToken });
    res.send(savedUser);
  } catch (error) {
    //422 is content type error or Unprocessable Entity
    if (error.isJoi === true) {
      error.status = 422;
    }
    next(error);
  }
});

// Login API
app.post("/login", async (req, res, next) => {
  // console.log(req.body.id);
  try {
    const result = await loginSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email });
    // var admin = process.env.EMAIL.split(" ")[0];

    // try {
    //   if (user.email == admin) {
    //     console.log(admin);
    //   }
    //   res.send(user);
    // } catch (error) {}
    // if(user.email == admin)
    // {
    //   throw res.send(admin)
    // }

    if (!user) {
      throw createError.NotFound("User Not Registered.");
    }

    const isMatch = await user.isValidPassword(result.password);
    if (!isMatch) {
      throw createError.Unauthorized("Email/Password not valid");
    }
    // const accessToken = await signAccessToken(user.id);
    // const refreshToken = await signRefreshToken(user.id);
    // res.send({isMatch ,accessToken, refreshToken });

    res.send(user);
  } catch (error) {
    if (error.isJoi === true) {
      return next(createError.BadRequest("Invalid Email/Password."));
    }
    next(error);
  }
});

// Find All User or Employee in Admin Panel
app.get("/admin/users", async (req, res, next) => {
  const users = await User(req.body);
  const basicUser = await User.find({ role: users.role });

  if (!basicUser) {
    throw createError.NotFound("No User found.");
  }
  // console.log(basicUser);
  res.send(basicUser);
});

// Find User By Id
app.get("/admin/user/:id", async (req, res) => {
  // const users = await User(req.body);

  const id = req.params.id;
  const singleUser = await User.findById({ _id: id });

  if (!singleUser) {
    throw createError.NotFound("This user is not available.");
  }

  console.log(singleUser);
  res.send(singleUser);
});

app.put("/admin/edit/:id", async (req, res) => {
  const id = req.params.id;
  const updateUser = await User.findByIdAndUpdate(
    { _id: id },
    {
      active: req.body.active,
    },
    function (err, docs) {
      if (err) {
        res.json(err);
      } else {
        console.log(docs);
        res.redirect("/admin/edit/:id");
        res.send(updateUser);
      }
    }
  );
});

// const verifyToken = (req, res , next) => {}

//404 Not Found Error
app.use(async (req, res, next) => {
  // const error = new Error("Not Found")
  // error.status = 404
  // next(error)
  next(createError.NotFound());
});

//internal server error
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
``;
