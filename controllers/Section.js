const Section = require('../models/Section');
const User = require('../muodels/User');

// create section 
exports.CreateSection = async(req,res)=>{
    try {
        //fetch data
        const {sectionName,courseId}=req.body
        // /validate
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:'Missing properties',
            });
        }
         // create section
         const newSection =await Section.create({sectionName});

         // update course with section object ID
         const updatedCourseDetails=await Course.findByIdAndUpdate(courseId,
            {
        
                 $push:{
                    courseContent:newSection._id,
                 }
            
            },
            {new:true},
      );
         //return response
         return res.status(200).json({
            success:true,
            message:'Section created successfully',
            updatedCourseDetails,
         })
    } catch (error ) {
        return res.status(500).json({
            success:false,
            message:"Unable to create ,please try again",
            error:error.message,
        });
    }
}

// update section
exports.updateSection=async(req,res)=>{
    try{
        // data input
        const {sectionName,sectionId}=req.body;
        //validate
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:'Missing Properties',
            });
        }
        //update data
        const section =await Section.findByIdAndUpdate(
            sectionId,
            {sectionName},
            {new :true}
        );
        //return res
        return res.status(200).json({
            success:true,
            message:"Section is updated successfully"
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to update Section, please try again",
            error:error.message,
        });
    }
};

//delete the section

exports.deleteSection =async(req,res)=>{
    try {
         //get ID - assuming that we are sending ID in params
         const {sectionId}=req.body;
        //use findByIdandDelete
        await Section. findByIdAndDelete(sectionId);
        //return response
        return res.status(200).json({
            success:true,
            message:"Section is delete successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete Section, please try again",
            error: error.message
          });
        
    }
}