import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // hook
import Swal from "sweetalert2";

const { VITE_APP_HOST } = import.meta.env;

const Register = () => {
  // console.log(VITE_APP_HOST);

  // useState formData
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const navigate = useNavigate(); // 把 hook 取出來做使用

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  // validate input field when blur
  function validateValues (inputValues) {
    let errors = {};

    // console.log('arguments', arguments)
    // console.log('arguments.length', arguments.length)

    // email validation error
    if (arguments.length === 1 || arguments[1]?.target.name === 'email' ) {
      if (inputValues.email.length === 0) {
        errors.email = "Email 欄位不可留空";
      }
      else if (inputValues.email.length < 10) {
        errors.email = "Email 長度太短";
      }
      else if (/\S+@\S+\.\S+/.test(errors.email)) {
        errors.email = "Email 格式不正確";
      }
    }

    // nickname validation error
    if (arguments.length === 1 || arguments[1]?.target.name === 'password') {
      if (inputValues.nickname.length === 0) {
        errors.password = "暱稱 欄位不可留空";
      }
    }

    // password validation error
    if (arguments.length === 1 || arguments[1]?.target.name === 'password') {
      if (inputValues.password.length === 0) {
        errors.password = "密碼 欄位不可留空";
      }
      else if (inputValues.password.length < 5) {
        errors.password = "密碼 長度太短";
      }
    }

    return errors;
  }

  const handleBlur = (event) => {
    event.preventDefault();
    setErrors(validateValues(formData, event));
  };

  async function register() {
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${VITE_APP_HOST}/users/sign_up`,
        formData
      );
      console.log(response);
      navigate("/auth/login"); // 當註冊成功，轉址到登入頁

    } catch (error) {
      setIsLoading(false);

      console.log(error);

      setRegisterError(error.response.data.message);
      Swal.fire({
        title: "Rigister Error!!",
        text: registerError,
        icon: "error",
      });
    }
  }

  return (
    <>
      <div id="signUpPage" className="bg-yellow">
        <div className="container signUpPage vhContainer">
          <div className="side">
            <a href="#">
              <img
                className="logoImg"
                src="https://upload.cc/i1/2022/03/23/rhefZ3.png"
                alt=""
                referrerPolicy="no-referrer"
              />
              <meta name="referrer" content="no-referrer" />
            </a>
            <img
              className="d-m-n"
              src="https://upload.cc/i1/2022/03/23/tj3Bdk.png"
              alt="workImg"
            />
          </div>
          <div>
            <form className="formControls">
              <h2 className="formControls_txt">註冊帳號</h2>
              <label className="formControls_label" htmlFor="email">
                Email
              </label>
              <input
                className="formControls_input"
                type="text"
                id="email"
                name="email"
                placeholder="請輸入 email"
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />

              <label className="formControls_label" htmlFor="name">
                您的暱稱
              </label>
              <input
                className="formControls_input"
                type="text"
                name="name"
                id="name"
                placeholder="請輸入您的暱稱"
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <label className="formControls_label" htmlFor="pwd">
                密碼
              </label>
              <input
                className="formControls_input"
                type="password"
                name="pwd"
                id="pwd"
                placeholder="請輸入密碼"
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />

              <label className="formControls_label" htmlFor="pwd2">
                再次輸入密碼
              </label>
              <input
                className="formControls_input"
                type="password"
                name="pwd2"
                id="pwd2"
                placeholder="請再次輸入密碼"
                // onChange={handleChange}
                onBlur={(e) => {
                  console.log(e.target.value);

                }}
                required
              />

              <button
                className="formControls_btnSubmit"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  register();
                }}
              >
                註冊帳號
              </button>
              <button
                className="formControls_btnSubmit"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/auth/login");
                }}
              >
                登入
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
