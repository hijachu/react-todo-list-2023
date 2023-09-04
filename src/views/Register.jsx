const Register = () => {
  return (<>
    <div id="signUpPage" className="bg-yellow">
      <div className="container signUpPage vhContainer">
        <div className="side">
            <a href="#">
              <img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt="" />  
            </a>
            <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg" />
        </div>
        <div>
          <form className="formControls" action="index.html">
              <h2 className="formControls_txt">註冊帳號</h2>
              <label className="formControls_label" htmlFor="email">Email</label>
              <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required />
              
              <label className="formControls_label" htmlFor="name">您的暱稱</label>
              <input className="formControls_input" type="text" name="name" id="name" placeholder="請輸入您的暱稱" />

              <label className="formControls_label" htmlFor="pwd">密碼</label>
              <input className="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼" required />

              <label className="formControls_label" htmlFor="pwd">再次輸入密碼</label>
              <input className="formControls_input" type="password" name="pwd" id="pwd" placeholder="請再次輸入密碼" required />

              <input className="formControls_btnSubmit" type="button" onClick={"javascript:location.href='#todoListPage'"} value="註冊帳號" />
              <a className="formControls_btnLink" href="#loginPage">登入</a>
          </form>
        </div>
      </div>
    </div>
  </>);
}

export default Register;