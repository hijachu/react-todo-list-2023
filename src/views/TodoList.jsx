import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const { VITE_APP_HOST } = import.meta.env;

const TodoList = () => {
  const [nickname, setNickname] = useState("");
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);

  const [newTodo, setNewTodo] = useState("");

  const [unfinished, setUnfinished] = useState(0);
  const [tab, setTab] = useState("all");

  const nevigate = useNavigate();

  /* Get browser cookie (authentication token)*/
  // console.log('document.cookie', document.cookie);
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  // console.log(cookieValue)

  /* default axios headers (used for authenticated AJAX call) */
  axios.defaults.headers.common["Authorization"] = cookieValue;

  /* Each time render this component, verify the token for authentication */
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${VITE_APP_HOST}/users/checkout`, {
          // aleady set axios default headers, no need to set headers
          /* headers: {
            Authorization: cookieValue,
          } */
        });

        // console.log(res);
        setNickname(res.data.nickname);

        getAllTodos();
      } catch (error) {
        // console.log('err:', error);
        Swal.fire({
          title: "驗證失敗",
          text: "請重新登入 !!",
          confirmButtonText: "OK",
        }).then(() => {
          // 導向登入頁
          nevigate("/auth/login");
        });
      }
    })();
  }, []);

  /* filter unfinished Todo */
  useEffect(() => {
    const unfinishedTodo = todos.filter((item) => item.status === false);
    setUnfinished(unfinishedTodo.length);
  }, [todos]);

  /* change tab */
  useEffect(() => {
    if (tab === "all") {
      setFilteredTodos(todos);
    } else if (tab === "unfinished") {
      const unfinished = todos.filter((item) => item.status === false);
      setFilteredTodos(unfinished);
    } else if (tab === "done") {
      const done = todos.filter((item) => item.status === true);
      setFilteredTodos(done);
    }
  }, [tab, todos]);

  /* Get all todo items */
  const getAllTodos = async () => {
    try {
      const res = await axios.get(`${VITE_APP_HOST}/todos`);
      setTodos(res.data.data);
    } catch (error) {
      Swal.fire({ icon: "error", text: error.response.data.message });
    }
  };

  /* Add new todo item */
  const addNewTodo = async () => {
    if (!newTodo) {
      Swal.fire({ icon: "warning", text: "請填入代辦事項" });
      return;
    }

    try {
      const res = await axios.post(`${VITE_APP_HOST}/todos`, {
        content: newTodo,
      });

      // clear the add new todo input box
      setNewTodo("");

      // After doing CRUD ajax, fetch all todos on the server again
      getAllTodos();

      // 新增 todo 後，預設都切回 全部頁籤
      setTab("all");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "新增失敗",
        text: error.response.data.message,
      });
    }
  };

  /* toggle todo item's status via PATCH method */
  const toggleTodo = async (id) => {
    try {
      const res = await axios.patch(`${VITE_APP_HOST}/todos/${id}/toggle`, {});

      // After doing CRUD ajax, fetch all todos on the server again
      getAllTodos();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "修改失敗",
        text: error.response.data.message,
      });
    }
  };

  /* delete todo item */
  const deleteTodo = async (id) => {
    try {
      const res = await axios.delete(`${VITE_APP_HOST}/todos/${id}`);
      // console.log(res);

      // After doing CRUD ajax, fetch all todos on the server again
      getAllTodos();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "刪除失敗",
        text: error.response.data.message,
      });
    }
  };

  /* delete all done todos */
  const clearDoneTodo = async () => {
    Swal.fire({
      title: "注意",
      text: "清除所有 已完成 的代辦事項 ?",
      showDenyButton: true,
      confirmButtonText: "是",
      denyButtonText: "否",
    }).then((result) => {
      if (result.isConfirmed) {
        todos.filter((todoItem) => {
          if (todoItem.status) {
            deleteTodo(todoItem.id);
          }
        });
      }
    });
  };

  /* logout */
  const logout = (e) => {
    e.preventDefault();
    // console.log('cookie token:', cookieValue);

    Swal.fire({
      title: "確認登出",
      showDenyButton: true,
      confirmButtonText: "是",
      denyButtonText: "否",
    }).then((result) => {
      if (result.isConfirmed) {
        // Swal.fire({
        //   title: "登出",
        //   showConfirmButton: false,
        //   // timer: 1500,
        // });

        // 導到登入頁
        nevigate("/auth/login");

        // 清除 cookie
        document.cookie = "token=; SameSite=None; Secure";
        /* 同時確保該 cookie 在跨站請求中仍被發送（SameSite 屬性設置為 "None"）
          並且僅在安全的 HTTPS 連接中使用（Secure 標誌） */
      } else if (result.isDenied) {
        return;
      }
    });
  };

  const handleKeyDown = (event) => {
    // console.log("User pressed: ", event.key);

    if (event.key === "Enter") {
      // prevent enter key default is so important, this event is bubble propagate to the alert pop window
      // then auto close the warning message pop alert
      event.preventDefault();
      console.log("Enter key pressed ✅");
      addNewTodo();
    }
  };

  return (
    <>
      <div id="todoListPage" className="bg-half">
        <nav>
          <h1>
            <a href="#">ONLINE TODO LIST</a>
          </h1>
          <ul>
            <li className="todo_sm">
              <a
                // href="#"  // this will make ther pointer cursor shows, so comment it
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <span>{nickname} 的代辦事項</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={logout}>
                登出
              </a>
            </li>
          </ul>
        </nav>

        <div className="container todoListPage vhContainer">
          <div className="todoList_Content">
            <div className="inputBox">
              <input
                type="text"
                placeholder="請輸入待辦事項"
                value={newTodo}
                onChange={(e) => {
                  setNewTodo(e.target.value.trim());
                }}
                onKeyDown={handleKeyDown}
              />

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  addNewTodo();
                }}
              >
                <i className="fa fa-plus"></i>
              </a>
            </div>

            <div className="todoList_list">
              <ul className="todoList_tab">
                <li>
                  <a
                    href="#"
                    className={tab === "all" ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setTab("all");
                    }}
                  >
                    全部
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className={tab === "unfinished" ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setTab("unfinished");
                    }}
                  >
                    待完成
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className={tab === "done" ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setTab("done");
                    }}
                  >
                    已完成
                  </a>
                </li>
              </ul>

              <div className="todoList_items">
                <ul className="todoList_item">
                  {/* if there is no any todo item, show some info message */}
                  {filteredTodos.length === 0 ? (
                    <li
                      className="todoList_label"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      目前沒有待辦事項
                    </li>
                  ) : (
                    ""
                  )}

                  {/* otherwise, diplay the todo list */}
                  {filteredTodos.map((todoItem) => {
                    return (
                      <li key={todoItem.id}>
                        {/* checkbox contains the todo item content*/}
                        <label
                          className="todoList_label"
                          style={{ padding: "6px 0" }}
                        >
                          <input
                            className="todoList_input"
                            type="checkbox"
                            checked={todoItem.status}
                            onChange={() => {
                              toggleTodo(todoItem.id);
                            }}
                          />

                          {/* todo item content */}
                          <span>{todoItem.content}</span>
                        </label>

                        {/* todo item delete icon */}
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();

                            // pop a confirm window to delete the target item
                            Swal.fire({
                              title: "注意",
                              text: "確定刪除代辦事項 ?",
                              showDenyButton: true,
                              confirmButtonText: "是",
                              denyButtonText: "否",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                deleteTodo(todoItem.id);
                              } else {
                                // nothing to execute
                              }
                            });
                          }}
                        >
                          {/* fa-2x make cross(times) sign bigger */}
                          {<i className="fa fa-2x fa-times"></i>}
                        </a>
                      </li>
                    );
                  })}

                  {/* <li>
                  <label className="todoList_label">
                    <input className="todoList_input" type="checkbox" value="true" />
                    <span>把冰箱發霉的檸檬拿去丟</span>
                  </label>
                  <a href="#">
                    <i className="fa fa-times"></i>
                  </a>
                </li> */}
                </ul>

                <div className="todoList_statistics">
                  <p> {unfinished} 個待完成項目</p>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      clearDoneTodo();
                    }}
                  >
                    清除已完成項目
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoList;
