import { useState } from "react";
import { useNavigate } from "react-router-dom"; // hook
import axios from "axios";
import Swal from "sweetalert2";

const { VITE_APP_HOST } = import.meta.env;

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate(); // 把 hook 取出來做使用

  const login = async () => {
    try {
      console.log("press login button");
      setIsLoading(true);

      const response = await axios.post(`${VITE_APP_HOST}/users/sign_in`, {
        email: formData.email,
        password: formData.password,
      });

      const { token, exp } = response.data;
      console.log("token", token);
      document.cookie = `token=${token};expires=${new Date(exp * 1000)}`;

      setIsLoading(false);

      Swal.fire({
        title: "登入成功",
        text: "稍後自動導到 TODO 清單",
        timer: 800,
        showConfirmButton: false,
      }).then(function () {
        // 自動導到 TODO 清單
        navigate("/todo");
      });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      // setLoginError(error.message); // Request failed with status code 404
      setLoginError(error.response.data.message);

      Swal.fire({
        title: "登入錯誤",
        text: loginError,
        icon: "error",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // validate input field when blur
  function validateValues(inputValues) {
    let validationErrors = {};

    // console.log('arguments', arguments)
    console.log("arguments.length", arguments.length);

    // email validation error
    if (arguments.length === 1 || arguments[1]?.target.name === "email") {
      if (inputValues.email.length === 0) {
        validationErrors.email = "Email 欄位不可留空";
      } else if (inputValues.email.length < 8) {
        validationErrors.email = "Email 長度太短 (8)";
      } else if (/\S+@\S+\.\S+/.test(validationErrors.email)) {
        validationErrors.email = "Email 格式不正確";
      } else {
        validationErrors.email = "";
      }
    }

    // password validation error
    if (arguments.length === 1 || arguments[1]?.target.name === "password") {
      if (inputValues.password.length === 0) {
        validationErrors.password = "密碼 欄位不可留空";
      } else if (inputValues.password.length < 5) {
        validationErrors.password = "密碼 長度太短 (5)";
      } else {
        validationErrors.password = "";
      }
    }

    return { ...errors, ...validationErrors };
  }

  function errorsAllValuesEmptyString(errors) {
    if (Object.keys(errors).length === 0) {
      return true;
    }

    for (const key in errors) {
      if (errors.hasOwnProperty(key) && errors[key] !== "") {
        return false;
      }
    }
    return true;
  }

  const handleBlur = (event) => {
    event.preventDefault();
    setErrors(validateValues(formData, event));
  };

  return (
    <>
      <div id="loginPage" className="bg-yellow">
        <div className="container loginPage vhContainer">
          <div className="side">
            <a href="#">
              {/* online todo list icon */}
              <img
                className="logoImg"
                src="https://upload.cc/i1/2022/03/23/rhefZ3.png"
                alt="logo"
              />
              <meta name="referrer" content="no-referrer" />
            </a>
            {/* online todo list work image */}
            <img
              className="d-m-n"
              src="https://upload.cc/i1/2022/03/23/tj3Bdk.png"
              alt="workImg"
            />
          </div>

          <div>
            <form className="formControls">
              <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
              <label className="formControls_label" htmlFor="email">
                Email
              </label>
              <input
                className="formControls_input"
                type="text"
                id="email"
                name="email"
                placeholder="請輸入 email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.email && <span>{errors.email}</span>}

              <label className="formControls_label" htmlFor="password">
                密碼
              </label>
              <input
                className="formControls_input"
                type="password"
                name="password"
                id="password"
                placeholder="請輸入密碼"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.password && <span>{errors.password}</span>}

              {/* <p><span>inputFileds: </span>{JSON.stringify(inputFields)}</p>
            <p><span>errors: </span>{JSON.stringify(errors)}</p>
            <p><span>isLoading: </span>{isLoading ? 'true': 'false'}</p> */}

              <button
                className="formControls_btnSubmit"
                type="button"
                disabled={isLoading}
                onClick={() => {
                  // validate all input field
                  console.log("formData", formData);
                  let validationErrors = validateValues(formData);
                  // console.log('validationErrors', validationErrors);
                  // setErrors({...validationErrors});
                  setErrors(validateValues(formData));
                  // console.log('errors', errors);
                  errorsAllValuesEmptyString(validationErrors) && login();
                }}
              >
                登入
              </button>
              {loginError && <span>{loginError}</span>}

              <button
                className="formControls_btnSubmit"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/auth/register");
                }}
              >
                註冊帳號
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
