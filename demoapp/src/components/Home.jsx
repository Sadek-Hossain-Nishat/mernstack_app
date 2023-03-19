import React from "react";
import "./Home.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";

export default function Home() {
  const [message, setMessage] = useState({
    text: "",
  });

  const [messageId, setmessageId] = useState("");

  const [{ newmessages }, dispatch] = useStateProvider();
  const [count, setcount] = useState(0);
  const [allmessages, setallmessages] = useState([]);
  const socket = io("http://localhost:4000/api/socket");

  useEffect(() => {
    socket.on("newMessage", (message) => {
      console.log("message from useEffect =>", message);
      // const newmessagesarray = [...newmessages, message];
      // dispatch({ type: reducerCases.SET_MESSAGES, newmessagesarray });
      // setmessageId(message._id);
      setallmessages([...allmessages, message]);
    });
    socket.on("deleteMessage", (id) => {
      // const newmessagesarray = newmessages.filter((message) => {
      //   return message._id !== id;
      // });
      // dispatch({ type: reducerCases.SET_MESSAGES, newmessagesarray });

      const newmessages = allmessages.filter((message) => {
        return message._id !== id;
      });
      setallmessages(newmessages);
      console.log(id);
    });
    const getResponse = async () => {
      const response2 = await axios.get(
        "http://localhost:4000/api/message/getmessages"
      );

      const { response } = response2.data;
      const newmessagesarray = response.map(({ _id, text }) => {
        return { _id, text };
      });
      dispatch({ type: reducerCases.SET_MESSAGES, newmessagesarray });
    };
    // getResponse();

    console.log("All messages =>", allmessages);
  }, [socket, allmessages]);
  // messageId, count

  const handleonValueChange = (propertyName) => (e) => {
    setMessage({
      ...message,
      [propertyName]: e.target.value,
    });
  };

  const deleteItem = async (id) => {
    const response = await axios.post(
      "http://localhost:4000/api/message/deletemessage",
      {
        messageID: id,
      }
    );
    if (response) {
      setcount((pre) => pre - 1);
    }
    // console.log("delete response=>", response.data);
    // console.log("messages from delteitem =>", newmessages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      "http://localhost:4000/api/message/addmessage",
      {
        text: message.text,
      }
    );

    if (response) {
      setcount((pre) => pre + 1);
    }
    // console.log("response data=>", response);

    // console.log("messages =>", messages);

    // if (response.data) {
    //   const response2 = await axios.get(
    //     "http://localhost:4000/api/message/getmessages"
    //   );

    // }
  };

  return (
    <div className="home">
      <form onSubmit={handleSubmit}>
        <label htmlFor="text">
          Text
          <input
            type="text"
            name="text"
            id="text"
            value={message.text}
            required
            onChange={handleonValueChange("text")}
          />
        </label>
        <br />

        <input type="submit" value="Submit" />
      </form>

      <div className="list">
        List of messages
        {/* {newmessages &&
          newmessages.map(({ _id, text }) => {
            return (
              <div key={_id} className="list_item">
                {text}
                {_id}
                <button onClick={() => deleteItem(_id)}>delete</button>
              </div>
            );
          })} */}
        {allmessages &&
          allmessages.map(({ _id, text }) => (
            <div key={_id} className="list_item">
              {text}
              {_id}
              <button onClick={() => deleteItem(_id)}>delete</button>
            </div>
          ))}
      </div>
    </div>
  );
}
