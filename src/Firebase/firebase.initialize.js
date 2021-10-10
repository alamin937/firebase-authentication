import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.config";

const simpleAuthentication = () =>{
    initializeApp(firebaseConfig);
}

export default simpleAuthentication;