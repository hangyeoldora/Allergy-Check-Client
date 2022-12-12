/* eslint-disable */
import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import Main from "./pages/Main";
import Banner from "./component/Banner";
import Post from "./pages/Post";
import Write from "./pages/Write";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Page404 from "./pages/Page404";

// 107
import { AuthContext } from "./helpers/AuthContext";

const App = () => {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("https://allergy-check-server.onrender.com/auth/checkUser", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  // 118 - 로그아웃
  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
  };

  return (
    <div className="App">
      <div className="wrap">
        <AuthContext.Provider value={{ authState, setAuthState }}>
          <Router>
            <Routes>
              <Route
                path="/"
                exact
                element={
                  <>
                    <header>
                      <div className="navbar">
                        <div id="gnb">
                          <Link to="/">
                            <img
                              className="nav_logo"
                              src={
                                process.env.PUBLIC_URL +
                                "/logo/allergy-logo.png"
                              }
                            />
                          </Link>

                          <div className="links">
                            {!authState.status ? (
                              <>
                                <Link to="/login">로그인</Link>
                                <Link to="/registration">회원가입</Link>
                              </>
                            ) : (
                              <>
                                <Link to="/">Home</Link>
                                <Link to="/write">글쓰기</Link>
                                <a className="username">{authState.username}</a>
                                {authState.status && (
                                  <a onClick={logout}>로그아웃</a>
                                )}
                              </>
                            )}
                            {/* 123 */}
                            <div className="loggedInInfo">
                              {/* 119
                      <h1>{authState.username}</h1>
                      {authState.status && <a onClick={logout}>로그아웃</a>} */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </header>
                    <Banner />
                    <Main />
                  </>
                }
              />
              <Route
                path="/post/:id"
                exact
                element={
                  <>
                    <header>
                      <div className="navbar">
                        <div id="gnb">
                          <Link to="/">
                            <img
                              className="nav_logo"
                              src={
                                process.env.PUBLIC_URL +
                                "/logo/allergy-logo.png"
                              }
                            />
                          </Link>

                          <div className="links">
                            {!authState.status ? (
                              <>
                                <Link to="/login">로그인</Link>
                                <Link to="/registration">회원가입</Link>
                              </>
                            ) : (
                              <>
                                <Link to="/">Home</Link>
                                <Link to="/write">글쓰기</Link>
                                <a className="username">{authState.username}</a>
                                {authState.status && (
                                  <a onClick={logout}>로그아웃</a>
                                )}
                              </>
                            )}
                            {/* 123 */}
                            <div className="loggedInInfo">
                              {/* 119
                        <h1>{authState.username}</h1>
                        {authState.status && <a onClick={logout}>로그아웃</a>} */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </header>
                    <Post />
                  </>
                }
              />
              <Route
                path="/write"
                exact
                element={
                  <>
                    <header>
                      <div className="navbar">
                        <div id="gnb">
                          <Link to="/">
                            <img
                              className="nav_logo"
                              src={
                                process.env.PUBLIC_URL +
                                "/logo/allergy-logo.png"
                              }
                            />
                          </Link>

                          <div className="links">
                            {!authState.status ? (
                              <>
                                <Link to="/login">로그인</Link>
                                <Link to="/registration">회원가입</Link>
                              </>
                            ) : (
                              <>
                                <Link to="/">Home</Link>
                                <Link to="/write">글쓰기</Link>
                                <a className="username">{authState.username}</a>
                                {authState.status && (
                                  <a onClick={logout}>로그아웃</a>
                                )}
                              </>
                            )}
                            {/* 123 */}
                            <div className="loggedInInfo">
                              {/* 119
                        <h1>{authState.username}</h1>
                        {authState.status && <a onClick={logout}>로그아웃</a>} */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </header>
                    <Write />
                  </>
                }
              />
              <Route path="/login" exact element={<Login />} />
              <Route path="/registration" exact element={<Registration />} />
              <Route path="*" exact element={<Page404 />} />
            </Routes>
          </Router>
        </AuthContext.Provider>
      </div>
    </div>
  );
};

export default App;
