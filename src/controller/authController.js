import passport from "passport";
import jwt from "jsonwebtoken";
import moment from "moment";

// @PATH /login
// @METHOD  POST
//USING PASSPORT LOCAL STRATEGY FOR LOGIN
//IF VALID USER NEED TO GENERATE ACCESS(expires in 1 hour) AND REFRESH TOKEN(expires in 4 hour)
export const loginController = (req, res) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return res.status(500).json({
        message: "something went wrong",
        err: error,
      });
    }
    if (!user) {
      return res.status(400).send({
        message: info.message,
      });
    }
    req.login(user, { session: false }, async (err) => {
      if (err) res.status(500).send("Internal server error");
      console.log(user);
      try {
        user.password_hash = undefined;
        const [globalUserData] = await getSqlConnection("CentralDB")
          .promise()
          .query("SELECT * FROM User WHERE username=?", [user.username]);

        const [localUserData] = await getSqlConnection(user.dbname)
          .promise()
          .query("SELECT * FROM User Where username=?", [user.username]);

        const loginTime = moment().format("YYYY-MM-DD HH:mm:ss");
        const [lastLoginInsert] = await getSqlConnection(user.dbname)
          .promise()
          .query("UPDATE User SET last_login=? WHERE username=?", [
            loginTime,
            user.username,
          ]);

        const accessToken = jwt.sign(user, process.env.JWTSECRET, {
          expiresIn: "1h",
        });
        const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET, {
          expiresIn: "4h",
        });

        //INFO:NEED TO SEND AS A HTTPS COOKIE
        return res
          .status(200)
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 14400000,
          })
          .json({
            user: {
              ...user,
              id: localUserData[0].id,
              // profile: localUserData[0].profile,
              profile_pic: localUserData[0].profile_pic,
              permissions: permissionsData[0],
              localUserId: localUserData[0].id,
              globalUserId: globalUserData[0].id,
              globalOrgId: globalUserData[0].org_id,
              localOrgId: localUserData[0].org_id,
            },
            accessToken,
          });
      } catch (error) {
        console.log(error);
        logger.error(error);
        res.status(500).send("Internal server error");
      }
    });
  })(req, res);
};

// @PATH /refresh
// @METHOD  GET
//FOR GETTING NEW ACCESS AND REFRESH TOKEN

export const generateNewAccessToken = async (req, res) => {
  try {
    const [globalUserData] = await getSqlConnection("klglobaldatabase")
      .promise()
      .query("SELECT * FROM User WHERE username=?", [req.user.username]);
    if (!globalUserData[0].orgactive) {
      throw new Error(
        "Your Organization Accounts are De-Activated. Please Contact Admin or Kognics Support."
      );
    }
    if (!globalUserData[0].isactive) {
      throw new Error("Your account is De-Activated. Please Contact Admin");
    }
    const [localUserData] = await getSqlConnection(req.user.dbname)
      .promise()
      .query("SELECT * FROM User WHERE username=?", [req.user.username]);
    const [userPermissions] = await getSqlConnection(req.user.dbname)
      .promise()
      .query("SELECT * FROM permissions WHERE id=?", [
        localUserData[0].permission,
      ]);
    const accessToken = jwt.sign(req.user, process.env.JWTSECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(req.user, process.env.REFRESH_SECRET, {
      expiresIn: "4h",
    });
    //INFO:NEED TO SEND AS A HTTPS COOKIE

    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 14400000,
      })
      .json({
        user: {
          ...req.user,
          id: localUserData[0].id,
          profile_pic: localUserData[0].profile_pic,
          permissions: userPermissions[0],
          localUserId: localUserData[0].id,
          globalUserId: globalUserData[0].id,
          localOrgId: localUserData[0].org_id,
          globalOrgId: globalUserData[0].org_id,
        },
        accessToken,
      });
  } catch (error) {
    const errorMessage = error.message || "Internal server error";
    res.status(500).send(errorMessage);
  }
};

// @PATH /logout
// @METHOD  GET
//FOR LOGGING OUT USER
//NEED TO CLEAR COOKIE STORED IN BROWSER
export const logoutController = (_, res) => {
  return res
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .send();
};
