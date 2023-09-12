import { useState, useRef } from "react";
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
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState([]);

  const emailRef = useRef();
  const nicknameRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // when the target input is onChanged, reset the error for this input target
    setErrors({
      ...errors,
      [name]: ''
    });
  }


  // validate input field
  function validateValues (formData) {
    // console.log('formData', formData);

    let validationErrors = {};

    console.log('arguments.length', arguments.length)

    // email validation error
    if (arguments.length === 1 || arguments[1]?.target.name === 'email' ) {
      if (formData.email.length === 0) {
        validationErrors.email = "Email 欄位不可留空";
      }
      else if (formData.email.length < 10) {
        validationErrors.email = "Email 長度太短 (10)";
      }
      else if (/\S+@\S+\.\S+/.test(validationErrors.email)) {
        validationErrors.email = "Email 格式不正確";
      }
      else {
        delete validationErrors.email;
      }
    }

    // nickname validation error
    if (arguments.length === 1 || arguments[1]?.target.name === 'nickname') {
      if (formData.nickname.length === 0) {
        validationErrors.nickname = "暱稱 欄位不可留空";
      }
      else {
        delete validationErrors.nickname;
      }
    }

    // password validation error
    if (arguments.length === 1 || arguments[1]?.target.name === 'password') {
      if (formData.password.length === 0) {
        validationErrors.password = "密碼 欄位不可留空";
      }
      else if (formData.password.length < 6) {
        validationErrors.password = "密碼 長度需至少 6 碼";
      }
      else {
        delete validationErrors.password;
      }
    }

    // confirm (retype) password check
    if (arguments.length === 1 || arguments[1]?.target.name === 'passwordConfirm') {
      if (passwordConfirm.length === 0) {
        validationErrors.passwordConfirm = "再次輸入密碼 欄位不可留空"
      }
      else if (formData.password !== '' && passwordConfirm !== formData.password) {
        validationErrors.passwordConfirm = "再次輸入密碼內容 與 密碼欄位內容 不一致"
      }
      else {
        delete validationErrors.passwordConfirm;
      }
    }

    return validationErrors;
  }

  const handleBlur = (event) => {
    event.preventDefault();
    setErrors(validateValues(formData, event));
  };

  function isNoError_FocusOnErrorInput(errors) {
    // check if errors empty object
    if (Object.keys(errors).length === 0) {
      return true;
    }

    for (const key in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, key) && errors[key] !== "") {
        // set focus on input if error on it
        if (key === 'email') {
          emailRef.current.focus()
        }
        else if (key === 'nickname') {
          nicknameRef.current.focus()
        }
        else if (key === 'password') {
          passwordRef.current.focus()
        }
        else if (key === 'passwordConfirm') {
          passwordConfirmRef.current.focus()
        }

        // if there is an error, just return false, no need to check the remainder
        return false;
      }
    }

    return true;
  }

  async function register() {
    try {
      // console.log('press register button');
      setIsLoading(true);

      const response = await axios.post(
        `${VITE_APP_HOST}/users/sign_up`,
        formData
      );
      console.log(response);

      Swal.fire({
        title: "註冊成功",
        text: "稍後自動導到 登入頁面",
        timer: 1000,
        showConfirmButton: false,
      }).then(function () {
        // after register successfully, redirect to login page
        navigate("/auth/login");
      });

    } catch (error) {
      setIsLoading(false);

      console.log(error);

      setRegisterError([...error.response.data.message]);
      Swal.fire({
        title: "註冊帳號錯誤",
        text: JSON.stringify(registerError),
        icon: "error",
      });
    }
  }

  const handleKeyDown = (event) => {
    // console.log("User pressed: ", event.key);

    if (event.key === "Enter") {
      // prevent enter key default is so important, this event is bubble propagate to the alert pop window
      // then auto close the warning message pop alert
      event.preventDefault();
      console.log("Enter key pressed ✅");
      console.log('formData', formData);
      let inputErrors = validateValues(formData);
      setErrors({...inputErrors});

      isNoError_FocusOnErrorInput(inputErrors) && register();
    }
  };

  return (
    <>
      <div id="signUpPage" className="bg-yellow">
        <div className="container signUpPage vhContainer">
          <div className="side">
            <a href="#">
              <img
                className="logoImg"
                src="logo.png"
                alt="logo"
              />
              <meta name="referrer" content="no-referrer" />
            </a>
            <img
              className="d-m-n"
              src="main.png"
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
                name="email"
                id="email"
                placeholder="請輸入 email"
                autoFocus
                ref={emailRef}
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                required
              />
              {errors.email && <span>{errors.email}</span>}

              <label className="formControls_label" htmlFor="nickname">
                您的暱稱
              </label>
              <input
                className="formControls_input"
                type="text"
                name="nickname"
                id="nickname"
                placeholder="請輸入您的暱稱"
                ref={nicknameRef}
                value={formData.nickname}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
              />
              {errors.nickname && <span>{errors.nickname}</span>}

              <label className="formControls_label" htmlFor="password">
                密碼
              </label>
              <input
                className="formControls_input"
                type="password"
                name="password"
                id="password"
                placeholder="請輸入密碼"
                ref={passwordRef}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                required
              />
              {errors.password && <span>{errors.password}</span>}

              <label className="formControls_label" htmlFor="passwordConfirm">
                再次輸入密碼
              </label>
              <input
                className="formControls_input"
                type="password"
                name="passwordConfirm"
                id="passwordConfirm"
                placeholder="請再次輸入密碼"
                ref={passwordConfirmRef}
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value)
                  setErrors({
                    ...errors,
                    [e.target.name]: ''
                  })
                }}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                required
              />
              {errors.passwordConfirm && <span>{errors.passwordConfirm}</span>}

              {/* 註冊帳號 */}
              <button
                className="formControls_btnSubmit"
                type="button"
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  // validate all input field
                  let validationErrors = validateValues(formData);
                  console.log('validationErrors', validationErrors);

                  setErrors(validationErrors);
                  console.log('errors', errors);
                  isNoError_FocusOnErrorInput(validationErrors) && register();
                }}
              >
                註冊帳號
              </button>

              {/* 登入 */}
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
