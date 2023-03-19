import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import "./Otherusers.css";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import { useNavigate } from "react-router-dom";
import { socket } from "../utils/Socket";

export default function OtherUsers() {
  const [
    { otherusers, activeusers, inactiveusers, totalcurrentusers },
    dispatch,
  ] = useStateProvider();
  const navigate = useNavigate();
  const [newuserId, setnewuserId] = useState();

  useEffect(() => {
    const email = localStorage.getItem("email");

    socket.on("newuserresponse", (users) => {
      console.log("total user", users.length);

      // const totalcurrentusers = users.map(({ _id, name, email, imgUrl }) => {
      //   return { _id, name, email, imgUrl };
      // });

      const activeusers = users.filter((user) => {
        return user.email !== email;
      });

      const inactiveusers = otherusers.filter(
        ({ email: id1 }) =>
          !totalcurrentusers.some(({ email: id2 }) => id2 === id1)
      );
      dispatch({ type: reducerCases.SET_INACTIVEUSERS, inactiveusers });
      console.log("inactiveusers=>", inactiveusers);

      console.log("active users", activeusers);
      dispatch({ type: reducerCases.SET_TOTALCURRENTUSERS, totalcurrentusers });
      dispatch({ type: reducerCases.SET_ACTIVEUSERS, activeusers });
    });

    console.log(
      "useeffect called from otherusers and number of  activeusers",
      activeusers
    );

    console.log(
      "useffect called from and number of inactvieusers",
      inactiveusers
    );

    socket.on("newregister", (newregister) => {
      console.log("message from useEffect =>", newregister._id);
      setnewuserId(newregister._id);
    });

    socket.on("deleteMessage", (id) => {
      console.log("message from useEffect =>", id);
      setnewuserId(id);
    });

    const getotherUsers = () => {
      const email = localStorage.getItem("email");
      axios
        .get(`http://localhost:4000/api/${email}/otherusers`)
        .then((success) => {
          console.log("data from other users =>", success.data);
          const { response } = success.data;
          console.log("success data =>", response);
          const otherusers = response.map(
            ({ _id, name, email, imgUrl, activeStatus, socketID }) => {
              return { _id, name, email, imgUrl, activeStatus, socketID };
            }
          );
          console.log("otherusers =>", otherusers);
          dispatch({ type: reducerCases.SET_OTHERUSERS, otherusers });
        })
        .catch((error) => {
          console.log("Error from other users=>", error);
        });
    };

    getotherUsers();
  }, [newuserId, activeusers, totalcurrentusers, inactiveusers]);

  const gotochatPage = (name, email, imgUrl, _id, socketID, activeStatus) => {
    const chatuser = {
      _id,
      name,
      email,
      imgUrl,
      socketID,
      activeStatus,
    };
    // localStorage.setItem("chatuser", JSON.stringify(chatuser));

    const activestatus = activeStatus ? true : null;
    dispatch({ type: reducerCases.SET_ACTIVESTATUS, activestatus });

    dispatch({ type: reducerCases.SET_CHATUSER, chatuser });
    navigate(`/chatpage/${name}`);
  };

  return (
    <div className="otherusers">
      <h1>Other users</h1>

      {/* 
      {activeusers && (
        <div className="content">
          <h1 className="activeh1">Active users</h1>
          {activeusers.map(({ name, imgUrl, email, _id, socketID }) => {
            return (
              <div
                key={_id}
                className="item active"
                onClick={() => gotochatPage(name, email, imgUrl, _id, socketID)}
              >
                <img src={imgUrl} alt="" />
                {name}
              </div>
            );
          })}
        </div>
      )}

      {inactiveusers && (
        <div className="content">
          <h1 className="inactive">Inactive users</h1>
          {inactiveusers.map(({ name, imgUrl, email, _id }) => {
            return (
              <div
                key={_id}
                className="item "
                onClick={() => gotochatPage(name, email, imgUrl, _id, null)}
              >
                <img src={imgUrl} alt="" />
                {name}
              </div>
            );
          })}
        </div>
      )}
     */}

      {otherusers && (
        <div className="content">
          {otherusers.map(
            ({ _id, name, email, imgUrl, activeStatus, socketID }) => {
              return (
                <div
                  key={_id}
                  className="item"
                  onClick={() =>
                    gotochatPage(
                      name,
                      email,
                      imgUrl,
                      _id,
                      socketID,
                      activeStatus
                    )
                  }
                >
                  <img src={imgUrl} alt="" />
                  {name}
                  {activeStatus ? (
                    <div id="active"></div>
                  ) : (
                    <div id="inactive"></div>
                  )}
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
