import { MdAdd } from "react-icons/md";
import TaskCard from "../components/Cards/TaskCard";
import Navbar from "../components/Navbar";
import AddEditNotes from "./AddEditNotes";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Toast from "../components/TotastMessage/Toast";
import EmptyCard from "../components/EmptyCard/EmptyCard";
import AddTaskImg from "../assets/create-task-icon.svg"


const Home = () => {
  const [openAddEditModel, setOpenAddEdit] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message:"",
    type:"add"
  })

  const [allTasks, setAllTasks] = useState([]);

  const [userInfo, setUserInfo] = useState(null);

  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();


  const handleEdit = (taskDetails) =>{
    setOpenAddEdit({isShown:true, data:taskDetails, type:"edit"})
  }


const showToastMessage = (message,type) =>{
  setShowToastMsg({isShown:true,message,type})
}

  const handleCloseToast = () =>{
    setShowToastMsg({isShown:false, message:"", type:"" })
  }

  // get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/api/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // get All Task
  const getAllTask = async () => {
    try {
      const response = await axiosInstance.get("/api/task/get-all-task");
     
      if (response?.data && response.data?.tasks) {
        setAllTasks(response.data.tasks);
      }
    } catch (error) {
      console.log("An unexpected error occured. Please try again", error);
    }
  };


  // Delete Note
  const deleteTask= async(data) =>{
    const taskId = data._id;
      try {
        const response = await axiosInstance.delete("/api/task/delete-task/"+taskId)
        if(response.data && !response.data.error){
          showToastMessage("Task Deleted Successfully",'delete')
           getAllTask()
           
        }
       } catch (error) {
         if(error.response && error.response.data && error.response.data.message){
          console.log("An unexpected error occured. Please try again", error);
         }
       }
  }


  const onSearchTask = async (query)=>{
    try {
      const response = await axiosInstance.get("/api/task/search-tasks",{
        params:{query}
      });
      if(response.data && response.data.tasks){
        setIsSearch(true);
        setAllTasks(response.data.tasks);
      }
    } catch (error) {
      console.log(error)
    }
  }


  const handleClearSearch = () =>{
    setIsSearch(false);
    getAllTask()
  }

  useEffect(() => {
    getAllTask();
    getUserInfo();
    return () => {};
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} onSearchTask={onSearchTask} handleClearSearch={handleClearSearch}  />
      <div className="container mx-auto">
      {allTasks.length > 0 ? <div className="grid grid-cols-3 gap-4 mt-8">
          {allTasks.map((item) => (
            <TaskCard
            key={item._id}
              title={item.title}
              date={item.createdOn}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={() => handleEdit(item)}
              onDelete={() => deleteTask(item)}
              onPinNote={() => {}}
            />
          ))}
        </div>:<EmptyCard imgSrc={AddTaskImg}
               message={`Start creating your first task Click the 'ADD' button to jot down your thoughts, ideas and reminders. Let's get started` }/>}
      </div>

      <button
        className="w-16 h-16 flex items-center  justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10 "
        onClick={() => {
          setOpenAddEdit({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModel.type}
          taskData={openAddEditModel.data}
          onClose={() => {
            setOpenAddEdit({ isShown: false, type: "add", data: null });
          }}
          getAllTask={getAllTask}
          showToastMessage= {showToastMessage}
        />
      </Modal>

      <Toast
      isShown = {showToastMsg.isShown}
      message = {showToastMsg.message}
      type = {showToastMsg.type}
      onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
