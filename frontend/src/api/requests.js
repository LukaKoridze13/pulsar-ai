const link = "http://localhost:3824/";
import axios from "axios";
export function register({ name, user, password, refreshToken }) {
  axios.post(link + "register", { name, user, password, refreshToken }).then((res) => {
    return res;
  });
}
