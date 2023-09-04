import {useState} from "react";
import { useNavigate } from "react-router-dom"; // hook
import axios from 'axios';

const { VITE_APP_HOST } = import.meta.env;

function Login () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const navigate = useNavigate() // 把 hook 取出來做使用
  const [isLoading, setIsLoading] = useState(false) // 狀態

  const login = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(`${VITE_APP_HOST}/users/sign_in`, {
        email: email,
        password: password,
      });

      setToken(response.data.token);
      const { token } = res.data;
      document.cookie = `token=${token};`
      setIsLoading(false);

    } catch (error) {
      setToken('登入失敗: ' + error.message);
      setIsLoading(false);
      navigate('/todo');
    }
  };

  return (<>
    <div id="loginPage" className="bg-yellow">
      <div className="container loginPage vhContainer">
        <div className="side">
          <a href="#">
            <img className="logoImg" src={"https://upload.cc/i1/2022/03/23/rhefZ3.png"} alt="" />
            <meta name="referrer" content="no-referrer" />
          </a>
          <img className="d-m-n" src={"https://upload.cc/i1/2022/03/23/tj3Bdk.png"} alt="workImg" />
        </div>

        <div>
          <form className="formControls">
            <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
            <label className="formControls_label" htmlFor="email">Email</label>
            <input
              className="formControls_input"
              type="text"
              id="email"
              name="email"
              placeholder="請輸入 email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />
            <span>此欄位不可留空</span>

            <label className="formControls_label" htmlFor="pwd">密碼</label>
            <input
              className="formControls_input"
              type="password"
              name="pwd"
              id="pwd"
              placeholder="請輸入密碼"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required />
            {/* <input className="formControls_btnSubmit" type="button" onClick="{javascript:location.href='#todoListPage'}" value="登入" /> */}
            {/* <a className="formControls_btnLink" href="#signUpPage">註冊帳號</a> */}
            <button
              type="button"
              disabled={isLoading}
              className="formControls_btnSubmit"
              onClick={login}>登入</button>
            <p>Token: {token}</p>
          </form>
        </div>
      </div>
    </div>
  </>);
}

export default Login;
