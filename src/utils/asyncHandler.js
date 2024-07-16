// const asyncahndler = () =>{}
// const asyncahndler = (fn) =>{()=>{}}
// const asyncahndler = (fn) =>()=>{}

const asyncHandler = (reqHandler) => async (req, res, next) => {
  try {
    await reqHandler(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      massage: error.massage,
    });
  }
};

export { asyncHandler };

// promise function
// const asyncHandler = (reqHandler)=>{
//     (req,res,next)=>{
//         Promise.resolve(reqHandler(req,res,next)).catch((err)=>next(err))
//     }
// }
