import React, { useEffect, useState, useRef } from "react";
import { reducerCases } from "../utils/Constants";
import { socket } from "../utils/Socket";
import { useStateProvider } from "../utils/StateProvider";
import "./Chatpage.css";
import axios from "axios";
import reducer from "../utils/reducer";

function ChatPage() {
  const [
    {
      chatuser,
      currentuser,
      block,
      blockuser,
      blockmessagestatus,
      activeusers,
      activestatus,
      typerinfo,
      upload,
      download,
      lastmessage,
    },
    dispatch,
  ] = useStateProvider();
  const [messages, setmessages] = useState([]);
  const [message, setmessage] = useState("");
  const [chatemailarray, setchatemailarray] = useState([]);
  const lastMessageRef = useRef(null);
  const [typingStatus, setTypingStatus] = useState("");
  const [typing, settyping] = useState();
  const [typeremail, settyperemail] = useState("");
  const [typeremailarray, settyperemailarray] = useState([]);
  const inputRef = useRef(null);
  useEffect(() => {
    socket.on("download", (callback) => {
      if (null) {
        return;
      } else {
      }
    });
    socket.on("blockstatusresponse", (data) => {
      if (data == "yes") {
        const blockmessagestatus = true;
        dispatch({
          type: reducerCases.SET_BLOCKMESSAGESTATUS,
          blockmessagestatus,
        });
        const block = true;
        dispatch({ type: reducerCases.SET_BLOCK, block });
      } else {
        const blockmessagestatus = null;
        dispatch({
          type: reducerCases.SET_BLOCKMESSAGESTATUS,
          blockmessagestatus,
        });
        const block = null;
        dispatch({ type: reducerCases.SET_BLOCK, block });
      }
    });
    socket.on("newuserresponse", (users) => {
      console.log("total user", users.length);

      // const totalcurrentusers = users.map(({ _id, name, email, imgUrl }) => {
      //   return { _id, name, email, imgUrl };
      // });

      const email = localStorage.getItem("email");

      const activeusers = users.filter((user) => {
        return user.email !== email;
      });

      activeusers.map((activeuser) => {
        if (activeuser.email == chatuser.email) {
          const activestatus = true;

          dispatch({ type: reducerCases.SET_ACTIVESTATUS, activestatus });

          const chatuser = {
            _id: activeuser._id,
            name: activeuser.name,
            email: activeuser.email,
            imgUrl: activeuser.imgUrl,
            activeStatus: true,
            socketID: activeuser.socketID,
          };

          dispatch({ type: reducerCases.SET_CHATUSER, chatuser });
        }
      });

      console.log("active users", activeusers);

      dispatch({ type: reducerCases.SET_ACTIVEUSERS, activeusers });
    });

    console.log("current user=>", currentuser);

    console.log("block condition=>", block);

    // socket.on("callbakc", (callback) => {
    //   console.log("callbakc=>", callback);
    // });

    socket.on("typingResponse", (data) => {
      if (
        [data.typeremail, data.chatemail].includes(
          localStorage.getItem("email")
        ) &&
        [data.typeremail, data.chatemail].includes(chatuser.email)
      ) {
        settyping(true);
        setTypingStatus(data.infomessage);
        settyperemail(data.typeremail);
        settyperemailarray([data.typeremail, data.chatemail]);
        const typerinfo = {
          typerinfo: data.typeremail,
          infomessage: data.infomessage,
        };
        dispatch({ type: reducerCases.SET_TYPERINFO, typerinfo });
        console.log("typing response=>", data);
      } else {
        setTypingStatus("");
        settyping(null);
        const typerinfo = null;
        settyperemailarray([data.typeremail, data.chatemail]);
        dispatch({ type: reducerCases.SET_TYPERINFO, typerinfo });
      }
    });
    console.log("active users", activestatus);

    const getmessageblockstatus = () => {
      const email = localStorage.getItem("email");
      const chatuseremail = chatuser.email;

      axios
        .get(`http://localhost:4000/api/${chatuseremail}/${email}/isblock`)
        .then((response) => {
          if (response.data.message == "error") {
            const blockmessagestatus = null;
            dispatch({
              type: reducerCases.SET_BLOCKMESSAGESTATUS,
              blockmessagestatus,
            });
          } else {
            const blockmessagestatus = true;
            dispatch({
              type: reducerCases.SET_BLOCKMESSAGESTATUS,
              blockmessagestatus,
            });
          }
        })
        .catch((error) => {
          const blockmessagestatus = null;
          dispatch({
            type: reducerCases.SET_BLOCKMESSAGESTATUS,
            blockmessagestatus,
          });
        });
    };

    getmessageblockstatus();

    const getallblockusers = () => {
      const email = localStorage.getItem("email");
      const chatuseremail = chatuser.email;

      axios
        .get(`http://localhost:4000/api/${email}/${chatuseremail}/isblock`)
        .then((response) => {
          if (response.data.message == "error") {
            const block = null;
            dispatch({ type: reducerCases.SET_BLOCK, block });
          } else {
            const block = true;
            dispatch({ type: reducerCases.SET_BLOCK, block });
            const { _id, useremail, blockemail } = response.data.blockuser;

            const blockuser = {
              _id,
              useremail,
              blockemail,
            };
            dispatch({ type: reducerCases.SET_BLOCKUSER, blockuser });
          }

          console.log("block response callback=>", response.data.message);
        })
        .catch((error) => {
          const block = null;
          dispatch({ type: reducerCases.SET_BLOCK, block });
        });

      // socket.emit("callback", "callback");
    };

    getallblockusers();

    // socket.on("allblockusers", (blockusers) => {
    //   console.log("block users", blockusers);
    //   blockusers.forEach((blockobj) => {
    //     if (
    //       localStorage.getItem("email") == blockobj.useremail &&
    //       chatuser.email == blockobj.blockemail
    //     ) {
    //       setblock(true);
    //       setblockdoc({
    //         _id: blockobj._id,
    //         useremail: blockobj.useremail,
    //         blockemail: blockobj.blockemail,
    //       });
    //     } else {
    //       setblock(false);
    //       setblockdoc({});
    //     }
    //   });

    //   setallblockusers(blockusers);
    // });

    socket.on("messageresponse", (data) => {
      if (
        [data.receiveremail, data.senderemail].includes(
          localStorage.getItem("email")
        ) &&
        [data.receiveremail, data.senderemail].includes(chatuser.email)
      ) {
        setmessages([...messages, data]);
        setchatemailarray([data.receiveremail, data.senderemail]);
        const lastmessage = {
          ...data,
        };
        dispatch({ type: reducerCases.SET_LASTMESSAGE, lastmessage });

        // console.log("buffer=>", _buffer);
      } else {
      }
    });

    console.log("localstroage email", localStorage.getItem("email"));

    socket.on("chatuserstate", (user) => {
      console.log("chatuserstate match", chatuser.email == user.email);
      if (chatuser.email == user.email) {
        let chatuser = {
          _id: user._id,
          name: user.name,
          email: user.email,
          imgUrl: user.imgUrl,
          activeStatus: false,
          socketID: "",
        };

        dispatch({ type: reducerCases.SET_CHATUSER, chatuser });
        console.log("chatuser response =>", chatuser);

        const activestatus = null;
        dispatch({ type: reducerCases.SET_ACTIVESTATUS, activestatus });
      }
    });

    console.log("messages", messages);
    console.log("useEffect called from chatpage");
    console.log("chatuser", chatuser);
    if (chatuser == null) {
      const chatuser = JSON.parse(localStorage.getItem("chatuser"));
      dispatch({ type: reducerCases.SET_CHATUSER, chatuser });
    } else {
    }

    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [
    chatuser.activeStatus,
    chatuser.socketID,
    messages,
    block,
    blockmessagestatus,
    activeusers,
    typingStatus,
    typerinfo,
    typeremailarray.length,

    upload,
  ]);
  // ,

  // ,

  const sendMessage = (e) => {
    e.preventDefault();
    let fileObj;

    if (e.target.files && e.target.files[0]) {
      //socket.emit("upload", fileObj);
      fileObj = e.target.files && e.target.files[0];
      console.log("event files[0]", e.target.files[0]);
      shareFile(e.target.files[0]);
    }

    console.log("block condition in sendmessage=>", block);

    const messagedata = {
      senderemail: localStorage.getItem("email"),
      receiveremail: chatuser.email,
      text: fileObj
        ? `${fileObj.name} \n ${fileObj.size}\n ${fileObj.type}`
        : message,
      sendingdate: new Date().toDateString(),
      receivername: chatuser.name,
      sendername: JSON.parse(localStorage.getItem("loggeduser")).name,
      sendersocketID: currentuser.socketID,
      receiversocketID: chatuser.socketID,
      ismessageblock: blockmessagestatus ? "yes" : "no",
      filetype: fileObj ? fileObj.type : "plain/text",
      sendingtime: new Date().toLocaleTimeString(),
      messageId: `${localStorage.getItem("email")}=>${new Date()}`,
    };

    const typerinfo = {
      typeremail: "",
      infomessage: "",
    };
    // settyperemailarray([]);

    socket.emit("typing", typerinfo);

    socket.emit("message", messagedata);
    console.log("message Data=>", messagedata);

    setmessage("");

    // if (localStorage.getItem("email") == blockdoc.blockemail) {
    // } else {

    // }
  };

  const shareFile = (file) => {
    const data = new FormData();
    data.append("filepaths[]", file);

    sendUserFile(data);
  };

  const sendUserFile = (data) => {
    axios
      .post(
        `http://localhost:4000/api/${localStorage.getItem("email")}/upload/${
          chatuser.email
        }`,
        data
      )
      .then((response) => {
        console.log("response data", response.data);

        const upload = true;
        dispatch({ type: reducerCases.SET_UPLOAD, upload });

        socket.emit("uploaded", "uploaded successfully");
      })
      .catch((err) => {
        console.log("error=>", err);
      });
  };

  const handleblock = async () => {
    const userInfo = JSON.parse(localStorage.getItem("loggeduser"));

    if (block) {
      const { _id } = blockuser;
      await axios
        .post(`http://localhost:4000/api/${_id}/removeblock`)
        .then((response) => {
          const block = null;
          dispatch({ type: reducerCases.SET_BLOCK, block });
          socket.emit("blockstatus", "no");
        })
        .catch((error) => {
          console.log("error occurred", error);
        });
    } else {
      await axios
        .post("http://localhost:4000/api/addblock", {
          useremail: userInfo.email,
          blockemail: chatuser.email,
        })
        .then((response) => {
          console.log("block response=>", response);
          const block = true;
          dispatch({ type: reducerCases.SET_BLOCK, block });
          socket.emit("blockstatus", "yes");
        })
        .catch((error) => {
          console.log("error occurred", error);
        });

      // setblock(true);
    }
  };

  const handleChange = (e) => {
    setmessage(e.target.value);
    if (e.target.value) {
      console.log("input value change", e.target.value);
      settyping(true);
      console.log("typing=>", typing);
    } else {
      console.log("key is not pressed");
      settyping(null);
      // console.log("typing=>", typing);
      const typerinfo = {
        typeremail: "",
        infomessage: "",
      };
      // settyperemailarray([]);

      socket.emit("typing", typerinfo);
    }
  };

  const handleTyping = () => {
    const userInfo = JSON.parse(localStorage.getItem("loggeduser"));
    const typerinfo = {
      typeremail: userInfo.email,
      chatemail: chatuser.email,
      infomessage: `${userInfo.name} is typing`,
    };
    socket.emit("typing", typerinfo);
    console.log();
  };

  const handleUp = () => {
    // console.log("typing=>", typing);
    const typerinfo = {
      typeremail: "",
      infomessage: "",
    };
    // settyperemailarray([]);

    socket.emit("typing", typerinfo);
  };

  const handleShare = () => {
    // 👇️ open file input box on click of another element
    inputRef.current.click();
  };

  const handleFileChange = (event) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    } else {
      sendMessage(event);
    }

    console.log("fileObj is", fileObj);

    // 👇️ reset file input
    event.target.value = null;

    // 👇️ is now empty
    console.log(event.target.files);

    // 👇️ can still access file object here
    console.log(fileObj);
    console.log(fileObj.name);
  };

  return (
    <div>
      {chatuser && (
        <div className="chatcontent">
          <div className="chatheader">
            <img src={chatuser.imgUrl} alt="" />
            {chatuser.name}
            {activestatus ? <div id="active"></div> : <div id="inactive"></div>}
            <button className="call">Audio</button>
            <button className="call">Video</button>
            <button
              className={block ? "unblock" : "block"}
              onClick={handleblock}
            >
              {block ? "Unblock" : "Block"}
            </button>
          </div>

          <div className="chatbody">
            {messages.map((message) =>
              message.senderemail == localStorage.getItem("email") ? (
                <div className="message__chats" key={message.messageId}>
                  <p className="sender__name">You</p>
                  <div className="message__sender">
                    <div className="messagediv">
                      {message.text.includes("\n")
                        ? message.text
                            .split("\n")
                            .map((str, index) => <p key={index}>{str}</p>)
                        : message.text}
                    </div>
                  </div>
                </div>
              ) : (
                chatemailarray.includes(localStorage.getItem("email")) &&
                chatemailarray.includes(chatuser.email) &&
                (message.ismessageblock === "yes" ? (
                  <div></div>
                ) : (
                  <div className="message__chats" key={message.messageId}>
                    <p>{message.sendername}</p>
                    <div className="message__recipient">
                      <div className="messagediv">
                        {message.text.includes("\n")
                          ? message.text
                              .split("\n")
                              .map((str, index) => <p key={index}>{str}</p>)
                          : message.text}
                      </div>
                    </div>
                  </div>
                ))
              )
            )}

            {typeremail == localStorage.getItem("email") ? (
              <div></div>
            ) : (
              typeremailarray.includes(localStorage.getItem("email")) &&
              typeremailarray.includes(chatuser.email) && (
                <div className="message__status">
                  <p>{typingStatus}</p>
                </div>
              )
            )}

            <div ref={lastMessageRef} />
          </div>

          <div className="chatfooter">
            <input
              style={{ display: "none" }}
              ref={inputRef}
              type="file"
              onChange={handleFileChange}
            />
            <button onClick={handleShare} className="sendBtn">
              Share
            </button>
            <form className="form" onSubmit={sendMessage}>
              <input
                type="text"
                placeholder="Write message"
                className="message"
                value={message}
                // onChange={(e) => setmessage(e.target.value)}
                onChange={handleChange}
                onKeyDown={handleTyping}
                onKeyUp={handleUp}
                required
              />

              <button className="sendBtn">SEND</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
