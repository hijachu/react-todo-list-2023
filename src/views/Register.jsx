import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom"; // hook

const { VITE_APP_HOST } = import.meta.env;

const Register = () => {
  console.log(VITE_APP_HOST);

  // useState formData
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: ''
  })

  const navigate = useNavigate() // 把 hook 取出來做使用

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    })
  }

  async function register() {
    // post 路徑, 資料, headers
    // get 路徑, headers
    const res = await axios.post(`${VITE_APP_HOST}/users/sign_up`, formData)
    console.log(res);
    navigate('/auth/login') // 當登入成功，轉址到登入頁
  }

  return (<>
    <div id="signUpPage" className="bg-yellow">
      <div className="container signUpPage vhContainer">
        <div className="side">
          <a href="#">
            <img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt="" referrerPolicy="no-referrer"/>
            <meta name="referrer" content="no-referrer"/>
          </a>
          <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg" />

        </div>
        <div>
          <form className="formControls">
            <h2 className="formControls_txt">註冊帳號</h2>
            <label className="formControls_label" htmlFor="email">Email</label>
            <input className="formControls_input"
              type="text"
              id="email"
              name="email"
              placeholder="請輸入 email"
              onChange={handleChange}
              required />

            <label className="formControls_label" htmlFor="name">您的暱稱</label>
            <input className="formControls_input"
              type="text"
              name="name"
              id="name"
              placeholder="請輸入您的暱稱"
              onChange={handleChange}
              />

            <label className="formControls_label" htmlFor="pwd">密碼</label>
            <input className="formControls_input"
              type="password"
              name="pwd"
              id="pwd"
              placeholder="請輸入密碼"
              onChange={handleChange}
              required />

            <label className="formControls_label" htmlFor="pwd2">再次輸入密碼</label>
            <input className="formControls_input"
              type="password"
              name="pwd2"
              id="pwd2"
              placeholder="請再次輸入密碼"
              // onChange={handleChange}
              required />

            {/* <input className="formControls_btnSubmit" type="button" onClick={"javascript:location.href='#todoListPage'"} value="註冊帳號" /> */}
            <button
              className="formControls_btnSubmit"
              onClick={e => {
                register()
              }}
            >註冊帳號</button>
          </form>
        </div>
      </div>
    </div>
  </>);
}

export default Register;
