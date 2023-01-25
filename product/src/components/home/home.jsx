import "./home.css"
import {GlobalContext} from "../../context/context"
import axios from "axios";
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import { BsSearch,BsThreeDotsVertical } from 'react-icons/bs';
import { FaUserCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';



let baseUrl = ""
if (window.location.href.split(":")[0] === "http") {
  baseUrl = "http://localhost:3000";
  
}

else{
  baseUrl = "https://breakable-tuna-moccasins.cyclic.app"
}



function Home (){
  let { state, dispatch } = useContext(GlobalContext);
  console.log("State", state)

  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(null);

  useEffect(() => {

      getUsers();

  }, [])

  const getUsers = async (e) => {
      if (e) e.preventDefault();

      try {
          const response = await axios.get(`${baseUrl}/api/v1/users?q=${searchTerm}`)
          console.log("response: ", response.data);
          setUsers(response.data)

      } catch (error) {
          console.log("error in getting all tweets", error);
          // setUsers([])
      }
  }

  const logoutHandler = () =>{
    axios.get(`${baseUrl}/api/v1/logout`,{
      withCredentials: true
    })

    .then((response) => {
      console.log(response);
      dispatch({
        type: 'USER_LOGOUT',
        payload: null
    })


    }, (error) => {
      console.log(error);
    });
  }


  return (
      <div className="main-div">
        <div className="home-subDiv">
          <div className="homeNav">
            <img src={state.user.profileImage} alt="Profile Photo" height="40" width="40" />
            <Dropdown className="drop">
              <Dropdown.Toggle className="dropToggle" id="dropdown-button-dark-example1" variant="secondary">
                <BsThreeDotsVertical className="menu"/>
              </Dropdown.Toggle>

              <Dropdown.Menu variant="dark">
                <Dropdown.Item onClick={logoutHandler}>Log Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

           



          </div>
         <div className="left-pannel">
              <form onSubmit={getUsers}>
          
                  {/* <button type="submit">Search</button> */}
                  <InputGroup size="sm" className="mb-3">
                      <Button className="search-btn" variant="outline-secondary" id="button-addon1" type="submit">
                         <BsSearch/>
                      </Button>   
                      <Form.Control
                        aria-label="Example text with button addon"
                        aria-describedby="inputGroup-sizing-sm"
                        type="search"
                        placeholder="Search or start new chat"
                        onChange={(e) => [
                          setSearchTerm(e.target.value)
                        ]}
                        required
                      />
                  </InputGroup>
              </form>

              {(users?.length) ?
                  users?.map((eachUser, index) => {
                     
                    return <div className='userListItem' key={index}>
                            <Link to={`/chat/${eachUser._id}`}>
                              <div className="user">
                                <img src={(eachUser.profileImg)?eachUser?.profileImg:<FaUserCircle/>} alt="users profile" height="45" width="45" />
                                <p>{eachUser.firstName} {eachUser.lastName}</p>
                              </div>
                          
                            </Link>
                           </div>
                  })
                  : null
              }
              {(users?.length === 0 ? "No users found" : null)}
              {(users === null ? "Loading..." : null)}
          </div>

       
         
        </div>
      </div>
  );

  
}

export default Home

