import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

const { VITE_APP_HOST } = import.meta.env;

const TodoList = () => {
  const [nickname, setNickname] = useState('');
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);

  const [newTodo, setNewTodo] = useState('');

  const [unfinished, setUnfinished] = useState(0);
  const [existTodo, setExistTodo] = useState('');
  const [tab, setTab] = useState('all');

  const nevigate = useNavigate();

  /* ----- 取得Cookie ----- */
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  // console.log(cookieValue)   // 存於 cookie 內的 token


  /* ----- 預設 axios headers ----- */
  axios.defaults.headers.common['Authorization'] = cookieValue;


  /* ----- 驗證登入 ----- */
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${VITE_APP_HOST}/users/checkout`, {
          // 上面已有 axios default headers，所以這裡不用再單獨寫入headers
          /*headers: {
            Authorization: cookieValue,
          }*/
        });

        // console.log(res);
        setNickname(res.data.nickname);
        getAllTodos();

      } catch (error) {
        // console.log('err:', error);
        Swal.fire({
          title: 'Verification Failed!',
          text: 'Please try to log in again!',
          confirmButtonText: 'OK'
        })
          .then(() => { nevigate('/'); })
      }
    })()

  }, [])


  /* ----- 篩選未完成Todo ----- */
  useEffect(() => {

    const unfinishedTodo = todos.filter((item) => item.status === false);
    setUnfinished(unfinishedTodo.length);

  }, [todos])


  /* ----- Tab切換 ----- */
  useEffect(() => {

    if (tab === 'all') {
      setFilteredTodos(todos);
    } else if (tab === 'unfinished') {
      const unfinished = todos.filter((item) => item.status === false);
      setFilteredTodos(unfinished);
    } else if (tab === 'done') {
      const done = todos.filter((item) => item.status === true);
      setFilteredTodos(done);
    }

  }, [tab, todos])


  /* ----- 取得所有Todo ----- */
  const getAllTodos = () => {
    (async () => {
      try {
        const res = await axios.get(`${VITE_APP_HOST}/todos`);
        setTodos(res.data.data);

      } catch (error) {
        Swal.fire('Failed', error.response.data.message);
      }
    })()
  }


  /* ----- 新增Todo ----- */
  const addTodo = () => {
    (async () => {
      if (!newTodo) {
        Swal.fire('Failed', 'Please enter the todo list!');
        return
      }
      try {
        const res = await axios.post(`${VITE_APP_HOST}/todos`, { content: newTodo });

        setNewTodo('');

        getAllTodos();
        setTab('all');

        Swal.fire({
          title: 'Added successfully',
          showConfirmButton: false,
          timer: 800,
        });

      } catch (error) {
        Swal.fire('Failed', error.response.data.message);
      }
    })()
  }

  /* ----- Todo toogle patch 已完成 ----- */
  const finishedTodo = async (id) => {
    try {
      const res = await axios.patch(`${VITE_APP_HOST}/todos/${id}/toggle`, {});

      getAllTodos();

      Swal.fire({
        title: 'Modified successfully',
        text: 'Todo list\'s status is changed!',
        showConfirmButton: false,
        timer: 800,
      });

    } catch (error) {
      Swal.fire('Failed', error.response.data.message);
    }
  }

  /* ----- 刪除Todo ----- */
  const deleteTodo = async (id) => {
    try {
      const res = await axios.delete(`${VITE_APP_HOST}/todos/${id}`);
      // console.log(res);    // TEST
      getAllTodos();

      Swal.fire({
        title: 'Deleted successfully',
        text: 'Todo list is deleted!',
        showConfirmButton: false,
        timer: 800,
      });

    } catch (error) {
      Swal.fire('Failed', error.response.data.message);
    }
  }


  /* ----- 清除已完成 Todo ----- */
  const clearDoneTodo = () => {
    (async () => {
      Swal.fire({
        title: 'Warning!!',
        text: 'Do you want to delete all the finished todo lists?',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
      })
        .then((result) => {
          if (result.isConfirmed) {
            todos.filter((todoItem) => {
              if (todoItem.status) {
                deleteTodo(todoItem.id);
              }
              else if (result.isDenied) {
                return;
              }
            })
          }
        })
    })()
  }

  /* ----- 驗證登出 ----- */
  const signOut = (e) => {
    e.preventDefault();
    // console.log('signOut token:', cookieValue);

    Swal.fire({
      title: 'Do you want to sign out?',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
    })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Signed Out!',
            showConfirmButton: false,
            timer: 1500
          });

          nevigate('/');
          document.cookie = `token=; SameSite=None; Secure`;
          /* chatGPT
          作用是刪除名為 "token" 的 cookie，同時確保該 cookie 在跨站請求中仍被發送（SameSite 屬性設置為 "None"），
          並且僅在安全的 HTTPS 連接中使用（Secure 標誌）。通常用於登出或清除用戶身份驗證的 cookie。 */
        } else if (result.isDenied) {
          return;
        }
      })
  }


  return (<>
    <div id="todoListPage" className="bg-half">
      <nav>
        <h1><a href="#">ONLINE TODO LIST</a></h1>
        <ul>
          <li className="todo_sm">
            <a href="#" onClick={e => {
              e.preventDefault();
            }}><span>{nickname}的代辦</span></a>
          </li>
          <li>
            <a href="#loginPage" onClick={signOut}>登出</a>
          </li>
        </ul>
      </nav>

      <div className="conatiner todoListPage vhContainer">
        <div className="todoList_Content">
          <div className="inputBox">
            <input
              type="text"
              placeholder="請輸入待辦事項"
              value={newTodo}
              onChange={(e) => {
                setNewTodo(e.target.value.trim());
              }}
            />

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                addTodo();
              }}>
              <i className="fa fa-plus"></i>
            </a>
          </div>


          <div className="todoList_list">
            <ul className="todoList_tab">
              <li>
                <a
                  href="#"
                  className={tab === 'all' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    setTab('all');
                  }}
                >全部</a>
              </li>

              <li>
                <a
                  href="#"
                  className={tab === 'unfinished' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    setTab('unfinished');
                  }}
                >待完成</a>
              </li>

              <li>
                <a
                  href="#"
                  className={tab === 'done' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    setTab('done');
                  }}
                >已完成</a>
              </li>
            </ul>

            <div className="todoList_items">
              <ul className="todoList_item">
                {
                  filteredTodos.length === 0 ?
                    ( <li
                        className="todoList_label"
                        style={{ display: 'flex', justifyContent: 'center' }}
                      >目前沒有待辦事項</li> ) : ('')
                }

                {
                  filteredTodos.map((todoItem) => {
                    return (
                      <li key={todoItem.id}>
                        {/* checkbox */}
                        <label
                          className="todoList_label"
                          style={{ padding: '6px 0' }}
                        >
                          <input
                            className="todoList_input"
                            type="checkbox" /*value="true"*/
                            checked={todoItem.status}
                            onChange={() => {
                              finishedTodo(todoItem.id)
                            }} />

                          {/* todo item description */}
                          <span value={existTodo}>{todoItem.content}</span>
                        </label>

                        {/* todo item delete icon */}
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteTodo(todoItem.id);
                          }}>
                          {/* <img style={{ width: '1.9em' }} src="/React_Todolist/delete.png" alt="Delete" /> */}
                          <i className="fa fa-times"></i>
                        </a>
                      </li>
                    )
                  })
                }

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
                >清除已完成項目</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>)
}

export default TodoList
