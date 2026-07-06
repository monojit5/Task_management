import { ai } from "../config/gemani.js";
import Task from "../model/taskModel.js";

export const createTask = async(req, res) => {
try {
    const {taskName, status } = req.body;
    const responce = await ai.models.generateContent({
      model:"gemini-2.5-flash",
      contents: `Explain how to  complited this task.
      Task: ${taskName}
      Give:
    A short description.
   Write only one short and meaningful description (maximum 25 words).
 Rules:
- Do not explain.
- Do not use headings.
- Do not use bullet points.
- Return only the description.
`,
    })
    const description = responce.text.trim();
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(taskName)}`;
    const createData = await Task.create({taskName, description, photo:imageUrl, status, userId:req.user._id})
    return res.status(201).json({message:"Task created successfully", data:createData}) 
} catch (error) {
   console.log(error);
   
   return res.status(500).json({message:"internal server error", error}) 
}
};

export const showData = async(req, res) => {
try {
   const fatchData = await Task.find({userId:req.user._id}).populate("userId","name") 
   return res.status(200).json({message:"Task show successfully", data:fatchData})
} catch (error) {
return res.status(500).json({message:"internal server error", error})   
}
};

 export const filterDataShow = async(req, res) => {
try {
  const {status} = req.query;
  const filter = {
   userId:req.user._id
  }
  if (status) {
    filter.status = status
  }
  const filData = await Task.find(filter)
  return res.status(200).json({message:"Task show successfully", data:filData})
} catch (error) {
  console.log(error);
  
 return res.status(500).json({message:"internal server error", error})    
}
}

export const updateData = async(req, res) => {
try {
  const {id} = req.params;
  const {taskName, description, status} = req.body;
 const editData = await Task.findOneAndUpdate({_id:id, userId:req.user._id},{taskName, description, status},{new:true})
return res.status(200).json({message:"Task update successfully", data:editData})
} catch (error) {
 return res.status(500).json({message:"internal server error", error})      
}
};
 
export const showidData = async(req, res) => {
 try {
    const {id} = req.params;
    const idShowadata = await Task.findById({_id:id, userId:req.user._id})
    return res.status(200).json({message:"Task id show successfully", data:idShowadata})
 } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({message:"Invalid id"})  
    }
   return res.status(500).json({message:"internal server error", error})    
 }   
};

 export const removedData = async(req, res) => {
try {
 const {id} = req.params;
 const deleteData = await Task.findOneAndDelete({_id:id, userId:req.user._id}) 
 if (!deleteData) {
   return res.status(400).json({message:"Data all reeady deleted"})
 }
 return res.status(200).json({message:"Task delete successfully", data:deleteData})
} catch (error) {
   if (error.name === "CastError") {
      return res.status(400).json({message:"Invalid id"})  
    }
   return res.status(500).json({message:"internal server error", error})     
}
};

export const countData = async(req, res) => {
try {
  const totalUser = await Task.countDocuments({userId:req.user._id})
  const pandingTask = await Task.countDocuments({
   userId:req.user._id,
   status:"panding"
  })
  const complitedTask = await Task.countDocuments({
   userId:req.user._id,
   status:"complited"
  })
return res.status(200).json({message:"Task count successfully", data:totalUser, pandingTask, complitedTask})
} catch (error) {
 console.log(error);
   
 return res.status(500).json({message:"internal server error", error})        
}
}

