import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { reducerCases } from "../utils/Constants";
import { useStateProvider } from "../utils/StateProvider";
import "./DashBoard.css";
import { socket } from "../utils/Socket";

export default function AccountPage() {
  const [
    {
      userToken,
      start,
      userInfo,
      firsttimelogin,
      activeusers,
      totalcurrentusers,
      currentuser,
    },
    dispatch,
  ] = useStateProvider();

  const navigate = useNavigate();

  useEffect(() => {
    const start = true;

    const email = localStorage.getItem("email");

    socket.on("serversuccesscallbacktocurrentuser", (user) => {
      const currentuser = user;
      dispatch({ type: reducerCases.SET_CURRENTUSER, currentuser });
    });

    socket.on("servererrorcallbacktocurrentuser", (error) => {
      console.log("error =>", error);
    });

    socket.on("newuserresponse", (users) => {
      console.log("total user", users.length);

      const totalcurrentusers = users.map(
        ({ _id, name, email, imgUrl, activeStatus, socketID }) => {
          return { _id, name, email, imgUrl, activeStatus, socketID };
        }
      );

      const activeusers = users.filter((user) => {
        return user.email !== email;
      });

      console.log("active users", activeusers);
      dispatch({ type: reducerCases.SET_ACTIVEUSERS, activeusers });
      dispatch({ type: reducerCases.SET_TOTALCURRENTUSERS, totalcurrentusers });
    });
    dispatch({ type: reducerCases.SET_START, start });
    console.log("called from account page");

    console.log("current user=>", currentuser);

    // dispatch({ type: reducerCases.SET_USER, userInfo });
    const getuserInformation = () => {
      let token, email;

      if (userToken) {
        token = userToken;
      } else {
        email = localStorage.getItem("email");

        token = localStorage.getItem(email);
      }
      axios
        .get("http://localhost:4000/api/loggeduser", {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("token account page", token);
          console.log("response Data=>", response.data);
          const { email, imgUrl, name, _id, activeStatus, socketID } =
            response.data;
          const userInfo = {
            _id: _id,
            name: name,
            email: email,
            imgUrl: imgUrl,
            activeStatus,
            socketID,
          };

          const userInfowithactivstatus = {
            _id: _id,
            name: name,
            email: email,
            imgUrl: imgUrl,
            socketID: socket.id,
            activeStatus,
          };
          localStorage.setItem("loggeduser", JSON.stringify(userInfo));
          console.log("User =>", userInfo);
          dispatch({ type: reducerCases.SET_USER, userInfo });
          // navigate(`/account/${_id}`);
          // console.log("first time login", firsti);

          if (firsttimelogin) {
            socket.emit("newuser", userInfowithactivstatus);
            const firsttimelogin = null;

            dispatch({ type: reducerCases.SET_FIRSTTIMELOGIN, firsttimelogin });

            socket.on("newuserresponse", (users) => {
              console.log("total user", users.length);

              const activeusers = users.filter((user) => {
                return user.email !== userInfo.email;
              });

              console.log("active users", activeusers);
              dispatch({ type: reducerCases.SET_ACTIVEUSERS, activeusers });
            });
          }
        })
        .catch((e) => {
          console.log("Error=>", e);
        });
    };
    console.log("Start status", start);

    if (start) {
      const start = null;
      dispatch({ type: reducerCases.SET_START, start });

      getuserInformation();
    } else {
      // navigate(-1);
    }
  }, [start, activeusers, totalcurrentusers, currentuser]);
  //

  const homePage = () => {
    navigate(-1);
  };
  const otherUsers = () => {
    const start = true;
    dispatch({ type: reducerCases.SET_START, start });
    navigate("/otherusers");
  };

  return (
    <div>
      <nav className="navbar">
        <button onClick={homePage}>Home</button>
        <button onClick={otherUsers}>Other users</button>
        <button>History</button>
        <button>Logout</button>
      </nav>

      {userInfo && (
        <div className="body">
          <h1>Dashboard</h1>

          <div className="content">
            <img src={userInfo.imgUrl} alt="" />
            <h2>{userInfo.name}</h2>
            <h2>{userInfo.email}</h2>
          </div>
        </div>
      )}
    </div>
  );
}
