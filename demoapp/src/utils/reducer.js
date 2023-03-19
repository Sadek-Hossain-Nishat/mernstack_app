import { reducerCases } from "./Constants";

export const initialState = {
  userToken: null,
  userInfo: null,
  start: null,
  newmessages: [],
  socket: null,
  otherusers: [],
  chatuser: null,
  activeusers: [],
  firsttimelogin: null,
  inactiveusers: [],
  currentuser: null,
  totalcurrentusers: [],
  block: null,
  blockuser: null,
  blockmessagestatus: null,
  activestatus: null,
  typerinfo: null,
  upload: null,
  download: null,
  lastmessage: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerCases.SET_TOKEN:
      return {
        ...state,
        userToken: action.userToken,
      };

    case reducerCases.SET_START:
      return {
        ...state,
        start: action.start,
      };

    case reducerCases.SET_USER:
      return {
        ...state,
        userInfo: action.userInfo,
      };

    case reducerCases.SET_MESSAGES:
      return {
        ...state,
        newmessages: action.newmessagesarray,
      };

    case reducerCases.SET_SOCKET:
      return {
        ...state,
        socket: action.socket,
      };

    case reducerCases.SET_OTHERUSERS:
      return {
        ...state,
        otherusers: action.otherusers,
      };

    case reducerCases.SET_CHATUSER:
      return {
        ...state,
        chatuser: action.chatuser,
      };

    case reducerCases.SET_ACTIVEUSERS:
      return {
        ...state,
        activeusers: action.activeusers,
      };

    case reducerCases.SET_FIRSTTIMELOGIN:
      return {
        ...state,
        firsttimelogin: action.firsttimelogin,
      };

    case reducerCases.SET_INACTIVEUSERS:
      return {
        ...state,
        inactiveusers: action.inactiveusers,
      };

    case reducerCases.SET_TOTALCURRENTUSERS:
      return {
        ...state,
        totalcurrentusers: action.totalcurrentusers,
      };

    case reducerCases.SET_CURRENTUSER:
      return {
        ...state,
        currentuser: action.currentuser,
      };

    case reducerCases.SET_BLOCK:
      return {
        ...state,
        block: action.block,
      };

    case reducerCases.SET_BLOCKUSER:
      return {
        ...state,
        blockuser: action.blockuser,
      };

    case reducerCases.SET_BLOCKMESSAGESTATUS:
      return {
        ...state,
        blockmessagestatus: action.blockmessagestatus,
      };

    case reducerCases.SET_ACTIVESTATUS:
      return {
        ...state,
        activestatus: action.activestatus,
      };

    case reducerCases.SET_TYPERINFO:
      return {
        ...state,
        typerinfo: action.typerinfo,
      };

    case reducerCases.SET_UPLOAD:
      return {
        ...state,
        upload: action.upload,
      };

    case reducerCases.SET_DOWNLOAD:
      return {
        ...state,
        download: action.download,
      };

    case reducerCases.SET_LASTMESSAGE:
      return {
        ...state,
        lastmessage: action.lastmessage,
      };

    default:
      return state;
  }
};

export default reducer;
