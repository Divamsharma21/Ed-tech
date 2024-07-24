const SubSection =require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubSection = aysnc(req,res)=>{
    try {
        // fetch data from req body
        const { sectionId,title,description,timeDuration}=req.body;
        // get videourl
        const videoUrl=req.files.videoFile;
        // validate
        if(!videoUrl || !sectionId || !title || !description || !timeDuration){
            return res.status(400).json({
                succcess:true,
              message:"All Fields are Required"
            });
        }
        // upload  video to cloudinary
          
        const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        // create a sub section
        const subSectionDetails =await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description: description,
            videoUrl:uploadDetails.secure_url,
        })

        // update section with this section objectid 
        const updatedSection =await Section.findByIdAndUpdate({_id:sectionId},
            {
            $push:{
                subSection:sectionId,
            }
        },
        {new :true}
    );
    //HW: log updated section here, after adding populate query
            //return response
            return res.status(200).json({
                succcess:true,
                message:'Sub Section Created Successfully',
                updatedSection,
            });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message,
        })
    }
}


 // this doing by me 
//Update subSection
exports.updateSubSection=async(req,res)=>{
    try {
        // fetch data from req body
        const {title,description,timeDuration,videoUrl,sectionId}=req.body;
        // validate data
        if(!title || !description || !timeDuration || !videoUrl || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields",
                });
                }
                // update the subSection
                const updatedSubSection=await SubSection.findByIdAndUpdate({_id:req.params.id}, 
                    {
                        title:title,
                        timeDuration:timeDuration,
                        description:description,
                        videoUrl:videoUrl,
                        },
                        {new:true},
                        );

                          //return res
        return res.status(200).json({
            success:true,
            message:"SubSection is updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update  SubSection, please try again",
            error:error.message,
        });
    }
}


// delete SubSection
exports.deleteSection=async(req,res)=>{
    try {
        //get id from req body
        const subSection=await SubSection.findByIdAndDelete({_id:req.params.id}); 
       
        //return response
        return res.status(200).json({
            success:true,
            message:"SubSection is delete successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete SubSection, please try again",
            error: error.message
          });
    }
}
