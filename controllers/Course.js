const Course=require('../models/Course');
const Tag=require('../models/tags');
const User =require("../models/Category");
const {uploadImageToCloudinary}=require("../utils/imageUploader")




// Create course handel function
exports.createCourse= async(req,res)=>{
 try {
    const { courseName, 
        CourseDescription,
        whatYouWillLearn,
        price,
        tag }=req.body;

        // get thumbnail
        const thumbnail =req.files.thumbnailImage;
    
        // validate
        if(!courseName || !CourseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(401).json({
                success:false,
                message:'All field are required ',
            });
        }

        // check for instructor
        const userId =req.user.id;
        const instructorDetails =await User.findById(userId);
        console.log("Instructor  details :",instructorDetails);

        // Todo : verify that userid and instructordetails are same or not
           if(userId != instructorDetails){
            return res.status(401).json({
                success:false,
                message:'Instructor Details are  not equal to userid',
            });
           }

           if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:'Instructor Details not found',
            });
           }
        // check given tag is vaild 
          const tagDetails =await Tag.findById(tag);
          if(!tagDetails){
            return res.status(404).json({
                success:false,
                message:' Tags Details not found',
            });
          }
        //upload image top Cloudinary
            const thumbnailImage =await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        // cretae an entry for new course
           const newCourse=await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYoutWillLearn: whatYoutWillLearn,
            price,
            tag : tagDetails._id,
            thumbnail : thumbnailImage.secure_url,
           })
        // add the new course to the user schema of instructor
            await User.findByIdAndUpdate(
                {_id: instructorDetails._id},
                {
                    $push:{
                        courses: newCourse._id,
                    }
                },
                {new:true},
            );
        // update the tag schema 
        // todo:HW
        // it do by me
        await Tag.findByIdAndUpdate(
            {_id : tagDetails._id},
            {
                $push :{
                    tags= newTags._id,
                }
            },
            {new:true},
        );

        //return response
        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse,
        });
 } catch (error) {
    console.error(error);
    return res.status(500).json({
        success:false,
        message:'Failed to create Course',
        error: error.message,
    })
}

    
};

//getAllCourses handler function
exports.showAllCourses = async (req, res) => {
    try {
            //TODO: change the below statement incrementally
            const allCourses = await Course.find({});

            return res.status(200).json({
                success:true,
                message:'Data for all courses fetched successfully',
                data:allCourses,
            })

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot Fetch course data',
            error:error.message,
        })
    }
}

//getCourseDetails
exports.getCourseDetails = async (req, res) => {
    try {
            //get id
            const {courseId} = req.body;
            //find course details
            const courseDetails = await Course.find(
                                        {_id:courseId})
                                        .populate(
                                            {
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails",
                                                },
                                            }
                                        )
                                        .populate("category")
                                        .populate("ratingAndreviews")
                                        .populate({
                                            path:"courseContent",
                                            populate:{
                                                path:"subSection",
                                            },
                                        })
                                        .exec();

                //validation
                if(!courseDetails) {
                    return res.status(400).json({
                        success:false,
                        message:`Could not find the course with ${courseId}`,
                    });
                }
                //return response
                return res.status(200).json({
                    success:true,
                    message:"Course Details fetched successfully",
                    data:courseDetails,
                })

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}