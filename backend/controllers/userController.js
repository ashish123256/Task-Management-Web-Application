import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import Task from "../models/taskmodel.js";


export const createAccount = async(req, res) => {
    const {fullName, email, password} = req.body;
  if(!fullName){
    return res.status(400).json({message: "Please enter your full name"})
  }
  if(!email)
    {
        return res.status(400).json({message: "Please enter your email"})
    }
  if(!password){
    return  res.status(400).json({message: "Please enter your password"})

  }  

  const isUser= await User.findOne({email:email})

  if(isUser){
    return res.json({
        error:true,
        message: "Email already exists"
    })
  }
  const user = new User({
    fullName,
    email,
    password
})
  await user.save();

  const accessToken = jwt.sign({user},process.env.JWT_SECRET,{
    expiresIn:"3600m"
  });
  res.json({
    error:false,
    user,
    accessToken,
    message:"Registration Succesful"
  })
}


export const login = async (req, res) =>{
    const {email, password} = req.body;

    if(!email){
        return res.status(400).json({message: "Please enter your email"})
    }

    if(!password){
        return res.status(400).json({message:'Password is required'})
    }

    const userInfo = await User.findOne({email:email});

    if(!userInfo){
        return res.status(400).json({message: "User not found"})
    }

    if(userInfo.email == email && userInfo.password == password){
        const user = {user:userInfo};
        const accessToken = jwt.sign(user,process.env.JWT_SECRET,{
            expiresIn:"3600m"       
        })

        return res.json({
            error:false,
            message:"Login Successful",
            email,
            accessToken
        })
    }else{
        return res.status(400).json({
            error:true,
            message:"Invalid Credentials"
        })
    }

    
};



export const getUser = async (req, res) =>{
  const {user} = req.user;

  const isUser = await User.findOne({_id:user._id});

  if(!isUser){
    return res.status(401)
  }

  return res.json({
    user:{fullName:isUser.fullName, email:isUser.email,"id":isUser._id, createdOn:isUser.createdAt},
    message:""
  });
}


export const addTask = async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user; // Extract userId from req.user

    if (!title) {
        return res.status(400).json({ error: true, message: "Title is required" });
    }

    if (!content) {
        return res.status(400).json({ error: true, message: "Content is required" });
    }

    try {
        const task = new Task({
            title,
            content,
            tags: tags || [], // Default empty array if tags not provided
            userId:user._id,
        });

        await task.save();

        return res.json({
            error: false,
            task,
            message: "Task added successfully"
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
};


export const editTask = async (req, res) => {
  const taskId = req.params.taskId;
  const { title, content, tags, isPinned } = req.body; // Extract isPinned from req.body
  const { user } = req.user; // Extract userId from req.user

  if (!title && !content && !tags && typeof isPinned === 'undefined') {
    return res.status(400).json({ error: true, message: "No changes provided" });
  }

  try {
    const task = await Task.findOne({ _id: taskId, userId: user._id });

    if (!task) {
      return res.status(404).json({ error: true, message: "Task not found" });
    }

    // Update only the fields that are provided
    if (title) task.title = title;
    if (content) task.content = content;
    if (tags) task.tags = tags;
    if (typeof isPinned !== 'undefined') task.isPinned = isPinned;

    await task.save();

    return res.json({
      error: false,
      task,
      message: "Task updated successfully"
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};


// get all task
export const getTasks = async (req, res) =>{
  const {user} = req.user;

  try {
    const tasks = await Task.find({userId:user._id}).sort({isPinned:-1});
     res.status(200).json({
      error:false,
      tasks,
      message:"All tasks retrieved Successfully"
    })
  } catch (error) {
    return res.status(500).json({
      error:true,
      message:"Internal Server Error"
    })
  }
}


export const getTaskById = async (req, res) => {
  const { taskId } = req.params; 
  const { user } = req.user;      

  try {
    // Find task by its id and ensure it belongs to the authenticated user
    const task = await Task.findOne({ _id: taskId, userId: user._id });

    if (!task) {
      return res.status(404).json({
        error: true,
        message: "Task not found or you're not authorized to view this task"
      });
    }

    return res.json({
      error: false,
      task,
      message: "Task retrieved successfully"
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error"
    });
  }
};


export const deleteTask = async(req, res) =>{
  const {taskId} = req.params;
  const {user} = req.user;

  try {
    const  task = await Task.findOne({ _id: taskId, userId: user._id });

    if(!task){
      return  res.status(404).json({error:true, message:"Task not found"})
    }

    await Task.deleteOne({_id:taskId, userId:user._id});

    return res.json({
      error:false,
      message: "Task deleted successfully"
    })

  } catch (error) {
    return res.status(500).json({
      error:true,
      message: "Internal Server Error"
    })
  }
}


// update isPinned Value
export const updateIsPinned = async(req, res) =>{
  const taskId = req.params.taskId;
  const {  isPinned } = req.body; // Extract isPinned from req.body
  const { user } = req.user; // Extract userId from req.user

  if ( typeof isPinned === 'undefined') {
    return res.status(400).json({ error: true, message: "No changes provided" });
  }

  try {
    const task = await Task.findOne({ _id: taskId, userId: user._id });

    if (!task) {
      return res.status(404).json({ error: true, message: "Task not found" });
    }

  
    if (typeof isPinned !== 'undefined') task.isPinned = isPinned;

    await task.save();

    return res.json({
      error: false,
      task,
      message: "Task updated successfully"
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
}

export const SearchTask = async(req, res) =>{
  const {user} = req.user;
  const {query} = req.query;

  if(!query){
    return res.status(400).json({error:true,message:"No query provided"})
  }

  try {
    const matchingTasks= await Task.find({
      userId:user._id,
      $or:[
        {title:{$regex: new RegExp(query, "i")}},
        {content:{$regex:new RegExp(query,'i')}}
      ]
    });
    return res.json({
      error:false,
      tasks:matchingTasks,
      message:"Tasks found successfully"
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    })
  }
}