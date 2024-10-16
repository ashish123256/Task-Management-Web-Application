import { useState } from "react";
import TagInput from "../components/input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../utils/axiosInstance";

const AddEditNotes = ({taskData,type,onClose,getAllTask,showToastMessage}) => {

    const [title, setTitle] = useState(taskData?.title || "");
    const [content, setContent] = useState(taskData?.content || "");
    const [tags, setTags] = useState(taskData?.tags || []);

    const [error, setError] = useState(null);

    // Add Note
     const addNewNote = async() => {
       try {
        const response = await axiosInstance.post("/api/task/add-task",{
          title,
          content,
          tags
        })
        if(response.data && response.data){
          showToastMessage("Task Added Successfully")
           getAllTask()
           onClose()
        }
       } catch (error) {
         if(error.response && error.response.data && error.response.data.message){
          setError(error.response.data.message)
         }
       }
     };

     // Edit Note
     const editNote = async () => {
      const taskId = taskData._id;
      try {
        const response = await axiosInstance.put("/api/task/edit-task/"+taskId,{
          title,
          content,
          tags
        })
        if(response.data && response.data){
          showToastMessage("Task Updated Successfully")
           getAllTask()
           onClose()
        }
       } catch (error) {
         if(error.response && error.response.data && error.response.data.message){
          setError(error.response.data.message)
         }
       }
     }



    const handleAddtask = () => {
        if(!title){
            setError("Please enter a title");
            return;
        }
        if(!content){
            setError("Please enter a content");
            return;
        }

        setError("");

        if(type === "edit"){
            editNote()
        }
        else{
            addNewNote()
        }

    }


  return (
    <div className="relative">
        <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500  " onClick={onClose}>
            <MdClose className="text-xl text-slate-400"/>
        </button>
      <div className="flex flex-col gap-2">
        <label htmlFor="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Go To Gym At 5"
          value={title}
          onChange={({target})=>setTitle(target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">Content</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded "
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({target})=> setContent(target.value)}
        />
      </div>
      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags}/>

        {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
      </div>

       <button className="btn-primary font-medium mt-5 p-3" onClick={handleAddtask}>
        {type === 'edit' ? 'UPDATE':'ADD'}
        </button>

    </div>
  );
};

export default AddEditNotes;
