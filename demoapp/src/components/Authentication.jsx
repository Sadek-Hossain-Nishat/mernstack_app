import React, { useState } from "react";
import { useStateProvider } from "../utils/StateProvider";
import "./Authentication.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { reducerCases } from "../utils/Constants";
import { useEffect } from "react";
import { socket } from "../utils/Socket";

export default function Authentication() {
  const [{ start, otherusers }, dispatch] = useStateProvider();
  const navigate = useNavigate();
  const [user, setuser] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    console.log("called from authorization section");

    // const socket = localStorage.getItem("socket");

    // console.log("called from authorization section", socket);

    // dispatch({ type: reducerCases.SET_SOCKET, socket });

    const checkAuthorization = () => {
      if (start) {
        const userInfo = JSON.parse(localStorage.getItem("loggeduser"));
        if (userInfo) {
          // localStorage.setItem("socket", socket);
          // dispatch({ type: reducerCases.SET_SOCKET, socket });

          // dispatch({ type: reducerCases.SET_SOCKET, socket });

          const currentuserdata = {
            _id: userInfo._id,
            name: userInfo.name,

            email: userInfo.email,
            imgUrl: userInfo.imgUrl,
            socketID: socket.id,
          };

          socket.emit("newuser", currentuserdata);

          socket.on("newuserresponse", (users) => {
            const totalcurrentusers = users.map(
              ({ _id, name, email, imgUrl }) => {
                return { _id, name, email, imgUrl };
              }
            );
            const activeusers = users.filter((user) => {
              return user.email !== userInfo.email;
            });

            // const activeusers = otherusersexceptcurrentuser.filter(
            //   (user, index) => {
            //     return otherusersexceptcurrentuser.indexOf(user) === index;
            //   }
            // );
            dispatch({
              type: reducerCases.SET_TOTALCURRENTUSERS,
              totalcurrentusers,
            });
            console.log("activeusers", activeusers);
            dispatch({ type: reducerCases.SET_ACTIVEUSERS, activeusers });
          });
          navigate(`/account/${userInfo.id}`);

          // navigate("/account");
        } else {
        }
      } else {
        //   navigate("/", { replace: true });
      }
    };

    checkAuthorization();
  }, []);

  const handleonValueChange = (propertyName) => (e) => {
    setuser({
      ...user,
      [propertyName]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = user;
    axios
      .post(
        `http://localhost:4000/api/login?email=${email}&password=${password}`
      )
      .then(
        (response) => {
          // console.log(response.data);
          const { userToken } = response.data;
          if (userToken) {
            console.log("token = >", userToken);
            dispatch({ type: reducerCases.SET_TOKEN, userToken });
            localStorage.setItem("email", email);
            localStorage.setItem(email, userToken);
            const firsttimelogin = true;
            dispatch({ type: reducerCases.SET_FIRSTTIMELOGIN, firsttimelogin });

            navigate("/account/loginSuccess");
          } else {
            console.log("Login failed password error");
          }
        },
        (error) => {
          console.log(error);
        }
      );
  };

  return (
    <div className="auth_form">
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          Email
          <input
            required={true}
            type="email"
            name="email"
            id="email"
            value={user.email}
            onChange={handleonValueChange("email")}
          />
        </label>
        <br />

        <label htmlFor="password">
          Password
          <input
            required={true}
            type="password"
            name="password"
            id="password"
            value={user.password}
            onChange={handleonValueChange("password")}
          />
        </label>
        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
