import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthProvider";
import { useData } from "../../context/DataProvider";
import "./Login.css";

export const Login = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { setUserId, setUsername, token, loginUser, logoutUser } = useAuth();
  const { dataDispatch } = useData();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const { data, status } = await axios({
        method: "POST",
        url: "https://api-circlekart.herokuapp.com/users/login",
        headers: { email: email, password: password },
      });

      console.log(data);
      if (status === 200) {
        setUserId(data.userDetails.userId);
        setUsername(data.userDetails.firstname);
        loginUser(data.userDetails.token);
        toast.success("Login successful!!", {
          position: "bottom-center",
          autoClose: 2000,
        });
        localStorage?.setItem(
          "userInfo",
          JSON.stringify({
            username: data.userDetails.firstname,
            userId: data.userDetails.userId,
            token: data.userDetails.token,
          })
        );
        navigate(state?.from ? state.from : "/");
      }
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "bottom-center",
        autoClose: 3500,
      });
    }
  };

  const logoutHandler = () => {
    logoutUser();
    dataDispatch({ type: "RESET_APP_ON_LOGOUT" });
  };

  return (
    <div>
      {!token ? (
        <div className="login-container">
          <h1>Login</h1>
          <form onSubmit={loginHandler}>
            <input
              type="email"
              className="input-area"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="input-area"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="btn-sm btn-primary w-100">
              Login
            </button>
          </form>
          <p>
            Don't have an account ?{" "}
            <Link style={{ color: "inherit" }} to="/signup">
              Sign up Now
            </Link>
          </p>
        </div>
      ) : (
        <div className="login-container">
          <h1>Logout</h1>
          <button onClick={logoutHandler}>Logout</button>
        </div>
      )}
    </div>
  );
};
